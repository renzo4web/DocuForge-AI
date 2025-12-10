
export enum DataType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  ARRAY_STRING = 'ARRAY_STRING',
}

export interface SchemaField {
  id: string;
  key: string;
  type: DataType;
  description: string;
}

export interface UploadedFile {
  name: string;
  type: string;
  data: string; // Base64 or text content
  isImage: boolean;
}

export interface ExtractionRequest {
  file: UploadedFile | null;
  schema: SchemaField[];
}

export type ExtractionStatus = 'idle' | 'processing' | 'success' | 'error';
