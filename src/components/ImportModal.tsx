import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { X, FileSpreadsheet, ShieldAlert, Info } from 'lucide-react';

interface ImportModalProps {
  file: File;
  sessionId: string;
  onCancel: () => void;
  onImportSuccess: (result: { tableName: string; rowsInserted: number }) => void;
}

export function ImportModal({ file, sessionId, onCancel, onImportSuccess }: ImportModalProps) {
  const [tableName, setTableName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);

  // File metadata loaded on mount
  const [fileStats, setFileStats] = useState<{ rows: number; cols: number } | null>(null);
  const [parsedData, setParsedData] = useState<{ headers: string[]; rows: any[][] } | null>(null);

  useEffect(() => {
    // Initial parse to verify dimensions and row counts
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (!e.target?.result) return;
        const arrayBuffer = e.target.result as ArrayBuffer;
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

        if (rows.length < 2) {
          setError("The Excel file is empty or has no data rows (header + content required).");
          return;
        }

        const headers = rows[0].map(h => String(h || "").trim()).filter(h => h !== "");
        const dataRows = rows.slice(1)
          .filter(row => Array.isArray(row) && row.some(cell => cell !== undefined && cell !== ""))
          .map(row => headers.map((_, idx) => row[idx] !== undefined ? String(row[idx]) : ""));

        if (dataRows.length === 0) {
          setError("No data rows found in the Excel file.");
          return;
        }

        setFileStats({
          rows: dataRows.length,
          cols: headers.length
        });

        setParsedData({
          headers,
          rows: dataRows
        });

        // Set a smart default table name based on file name (alphanumeric only)
        const defaultName = file.name
          .replace(/\.[^/.]+$/, "") // strip extension
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '_')
          .replace(/^[^a-z]+/g, ''); // start with letter
        
        setTableName(defaultName || "imported_table");
      } catch (err) {
        setError("Could not read the Excel file. Make sure it is a valid .xlsx or .xls file.");
      }
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  const handleTableNameChange = (val: string) => {
    // lowercase and replace spaces or chars with underscores
    const cleaned = val
      .toLowerCase()
      .replace(/[\s-]+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
    setTableName(cleaned);
  };

  const handleImport = async () => {
    setError(null);

    // Validate table name
    const validTableNameRegex = /^[a-z][a-z0-9_]*$/;
    if (!tableName.trim()) {
      setError("Table name cannot be empty.");
      return;
    }
    if (!validTableNameRegex.test(tableName)) {
      setError("Table name must start with a letter and contain only lowercase letters, numbers, and underscores.");
      return;
    }

    if (!parsedData || parsedData.rows.length === 0) {
      setError("File spreadsheet data has not been parsed properly.");
      return;
    }

    setIsProcessing(true);
    
    // Limit to 5000 rows as per specification
    const limitedRows = parsedData.rows.slice(0, 5000);
    setProgressMessage(`Importing ${limitedRows.length} rows...`);

    try {
      const response = await fetch("https://n8n-production-b41a.up.railway.app/webhook/excel-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          tableName: tableName.trim(),
          headers: parsedData.headers,
          rows: limitedRows
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || "Database import failed. Please verify your schema or table name fits rules.");
        setIsProcessing(false);
        setProgressMessage(null);
        return;
      }

      // Success
      onImportSuccess({
        tableName: result.tableName || tableName.trim(),
        rowsInserted: result.rowsInserted || limitedRows.length
      });
    } catch (err) {
      setError("Connection failed. Check your internet connection.");
      setIsProcessing(false);
      setProgressMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 flex flex-col text-slate-800 animate-[scale_0.2s_ease-out]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2.5">
            <span className="text-blue-600">💾</span> Import Excel
          </h2>
          <button 
            onClick={onCancel}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected File Card */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-5">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 font-bold border border-indigo-100">
            <FileSpreadsheet size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
            {fileStats ? (
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                📋 {fileStats.rows} rows and {fileStats.cols} columns detected
              </p>
            ) : (
              <p className="text-xs font-medium text-slate-400 mt-0.5 animate-pulse">
                Parsing spreadsheet metrics...
              </p>
            )}
          </div>
        </div>

        {/* Informative Blue Info Box */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100/50 text-blue-700 text-[13px] font-medium leading-relaxed mb-5 flex gap-2.5">
          <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            This will create a permanent table in <strong>YOUR</strong> database. The table is fully queried with standard SQL using your AI.
          </div>
        </div>

        {/* Row count limit alert */}
        {fileStats && fileStats.rows > 5000 && (
          <div className="p-3 mb-5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            ⚠️ The file is larger than 5,000 rows. Only the first 5,000 rows will be imported.
          </div>
        )}

        {/* Error Feedback */}
        {error && (
          <div className="p-3.5 mb-5 rounded-lg bg-red-50 border border-red-100 text-red-600 flex items-start gap-2.5 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
            <div>{error}</div>
          </div>
        )}

        {/* Table Name input */}
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Table Name (Database Identifer)</label>
          <input
            type="text"
            value={tableName}
            onChange={(e) => handleTableNameChange(e.target.value)}
            disabled={isProcessing}
            placeholder="e.g. sales_2026"
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-3 px-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400"
          />
          <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
            Letters, numbers and underscores only. Must start with a letter.
          </span>
        </div>

        {/* Progress Display */}
        {isProcessing && progressMessage && (
          <div className="mb-6 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>{progressMessage}</span>
              <span className="text-blue-600 animate-pulse">Running...</span>
            </div>
            {/* Animated blue status bar */}
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-[progress_1.5s_infinite_linear] rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
        )}

        {/* Actions footer */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 py-3 px-4 border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-600 font-bold text-sm rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={isProcessing || !parsedData}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Import to DB →"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
