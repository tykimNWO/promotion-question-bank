export type Question = {
  id: string;
  chapter: string;
  question_text: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  answer: 1 | 2 | 3 | 4;
  explanation: string;
  is_wrong: boolean;
  importance: 1 | 2 | 3 | 4 | 5;
  created_at: string;
  updated_at: string;
};

export type QuestionInput = {
  chapter: string;
  question_text: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  answer: 1 | 2 | 3 | 4;
  explanation: string;
  importance: 1 | 2 | 3 | 4 | 5;
};

export type QuestionFilters = {
  chapter?: string;
  wrongOnly?: boolean;
  importance?: 1 | 2 | 3 | 4 | 5;
  search?: string;
};

export type QuestionStats = {
  total: number;
  wrong: number;
  chapters: Array<{
    chapter: string;
    count: number;
  }>;
};

export type Database = {
  public: {
    Tables: {
      questions: {
        Row: Question;
        Insert: QuestionInput & {
          id?: string;
          is_wrong?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<QuestionInput> & {
          is_wrong?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
