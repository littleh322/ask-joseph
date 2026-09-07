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

export interface ResumeData {
  name: string;
  title: string;
  contact: string[];
  sections: ResumeSection[];
}

export interface ResumeSection {
  heading: string;
  content: string;
}
