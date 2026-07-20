import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { X, FileSpreadsheet, ShieldAlert } from 'lucide-react';

interface AnalyseModalProps {
  file: File;
  onCancel: () => void;
  onSubmitAnalysis: (chatInputText: string, displayQuestion: string) => void;
}

export function AnalyseModal({ file, onCancel, onSubmitAnalysis }: AnalyseModalProps) {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAnalyse = () => {
    if (!question.trim()) {
      setError("Please enter a question about the file.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          throw new Error("Could not parse file result.");
        }
        const arrayBuffer = e.target.result as ArrayBuffer;
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // rows will be an array of arrays
        const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

        if (rows.length === 0) {
          setError("The Excel file appears to be empty.");
          setIsProcessing(false);
          return;
        }

        const maxRows = 100;
        // Grab headers from first row
        const headers = rows[0].join(", ");
        
        // Grab values from remaining rows up to maxRows
        const dataRows = rows.slice(1, maxRows + 1)
          .filter(row => Array.isArray(row) && row.some(cell => cell !== undefined && cell !== ""))
          .map(row => row.join(", "))
          .join("\n");

        const suffix = rows.length > maxRows + 1
          ? `\n[Showing first ${maxRows} rows of ${rows.length - 1} total rows]`
          : "";

        const finalExcelText = `Headers: ${headers}\n${dataRows}${suffix}`;
        
        // Construct standard prompt format requested:
        const constructedChatInput = `Analyse this data and tell me: ${question.trim()}\n\nEXCEL DATA:\n${finalExcelText}`;
        const displayQuestion = `${question.trim()} [Excel: ${file.name}]`;

        onSubmitAnalysis(constructedChatInput, displayQuestion);
      } catch (err) {
        setError("Could not read the Excel file. Make sure it is a valid .xlsx or .xls file.");
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read spreadsheet file from disk.");
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 flex flex-col text-slate-800 animate-[scale_0.2s_ease-out]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2.5">
            <span className="text-blue-600">📊</span> Analyse Excel File
          </h2>
          <button 
            onClick={onCancel}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected File Box */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold border border-emerald-100">
            <FileSpreadsheet size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
            <p className="text-xs font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
              ✓ Ready for analysis
            </p>
          </div>
        </div>

        {/* Info label */}
        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-5">
          Ask a question about this file. The AI will analyze it without saving to your database.
        </p>

        {/* Error Feedback */}
        {error && (
          <div className="p-3.5 mb-5 rounded-lg bg-red-50 border border-red-100 text-red-600 flex items-start gap-2.5 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
            <div>{error}</div>
          </div>
        )}

        {/* Textarea */}
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Your Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isProcessing}
            rows={3}
            placeholder="e.g. Which product had the highest sales volume?"
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-3 px-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400 max-h-[140px]"
          />
        </div>

        {/* Footer actions */}
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
            onClick={handleAnalyse}
            disabled={isProcessing}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {isProcessing ? (
              <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Analyse →"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
