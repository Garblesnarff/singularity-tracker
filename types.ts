export interface Entities {
  companies: string[];
  people: string[];
  products: string[];
  institutions: string[];
}

export interface Claim {
  raw_text: string;
  summary: string;
  category: 'AI' | 'Energy' | 'Biotech' | 'Robotics' | 'Economics' | 'Space' | 'Policy' | 'Culture' | string;
  subcategory: string;
  claim_type: 'factual' | 'prediction' | 'analysis' | 'speculation';
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  significance: number;
  entities: Entities;
  is_prediction: boolean;
  prediction_timeframe: string | null;
  search_queries: string[];
}

export type ParsingStatus = 'idle' | 'loading' | 'success' | 'error';
