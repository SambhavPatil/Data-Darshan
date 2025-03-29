export interface DataPoint {
  [key: string]: string | number;
}

export interface VisualizationType {
  type: string;
  title: string;
  description: string;
  suitable: boolean;
  component: React.ComponentType<{ data: DataPoint[]; columns: string[] }>;
}

export interface DataAnalysis {
  columnTypes: { [key: string]: string };
  correlations: { [key: string]: { [key: string]: number } };
  summary: {
    [key: string]: {
      min?: number;
      max?: number;
      mean?: number;
      median?: number;
      uniqueValues?: number;
      mostCommon?: string | number;
    };
  };
}