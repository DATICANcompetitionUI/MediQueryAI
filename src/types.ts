export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ImportItem {
  tableName: string;
  rowsInserted: number;
  timestamp: Date;
}
