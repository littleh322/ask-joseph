export interface AskRequest {
  question: string;
}

export interface Source {
  filename: string;
  distance: number;
}

export interface AskResponse {
  answer: string;
  sources: Source[];
}

export interface Document {
  filename: string;
  type: 'text' | 'pdf';
  content: string | null;
}
