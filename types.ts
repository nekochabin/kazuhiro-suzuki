export interface TitleSlide {
  type: 'title';
  title: string;
  date: string;
  notes?: string;
}

export interface SectionSlide {
  type: 'section';
  title: string;
  sectionNo?: number;
  notes?: string;
}

export interface ClosingSlide {
  type: 'closing';
  notes?: string;
}

export interface ContentSlide {
  type: 'content';
  title: string;
  subhead?: string;
  points?: string[];
  twoColumn?: boolean;
  columns?: [string[], string[]];
  images?: (string | { url: string, caption?: string })[];
  notes?: string;
}

export interface CompareSlide {
  type: 'compare';
  title: string;
  subhead?: string;
  leftTitle: string;
  rightTitle: string;
  leftItems: string[];
  rightItems: string[];
  images?: string[];
  notes?: string;
}

export interface ProcessSlide {
  type: 'process';
  title: string;
  subhead?: string;
  steps: string[];
  images?: string[];
  notes?: string;
}

export interface TimelineSlide {
  type: 'timeline';
  title: string;
  subhead?: string;
  milestones: { label: string; date: string; state?: 'done' | 'next' | 'todo' }[];
  images?: string[];
  notes?: string;
}

export interface DiagramSlide {
  type: 'diagram';
  title: string;
  subhead?: string;
  lanes: { title: string; items: string[] }[];
  images?: string[];
  notes?: string;
}

export interface CardsSlide {
  type: 'cards';
  title: string;
  subhead?: string;
  columns?: 2 | 3;
  items: (string | { title: string; desc?: string })[];
  images?: string[];
  notes?: string;
}

export interface TableSlide {
  type: 'table';
  title: string;
  subhead?: string;
  headers: string[];
  rows: string[][];
  notes?: string;
}

export interface ProgressSlide {
  type: 'progress';
  title: string;
  subhead?: string;
  items: { label: string; percent: number }[];
  notes?: string;
}

export interface BarChartSlide {
  type: 'barchart';
  title: string;
  subhead?: string;
  data: { label: string; value: number }[];
  notes?: string;
}

export interface LineChartSlide {
  type: 'linechart';
  title: string;
  subhead?: string;
  data: {
    datasets: {
      label: string;
      values: number[];
    }[];
    labels: string[];
  };
  notes?: string;
}

export interface PieChartSlide {
  type: 'piechart';
  title: string;
  subhead?: string;
  data: { label: string; value: number }[];
  notes?: string;
}

export type SlideData =
  | TitleSlide
  | SectionSlide
  | ClosingSlide
  | ContentSlide
  | CompareSlide
  | ProcessSlide
  | TimelineSlide
  | DiagramSlide
  | CardsSlide
  | TableSlide
  | ProgressSlide
  | BarChartSlide
  | LineChartSlide
  | PieChartSlide;
  
export interface Config {
  FONTS: {
    family: string;
    fontSizeMultiplier: number;
    sizes: {
      [key: string]: number;
    };
  };
  COLORS: {
    [key: string]: string;
    readable_text_on_white?: string;
    readable_text_on_gray?: string;
  };
  LOGOS: {
    header: string;
    closing: string;
  };
  FOOTER_TEXT: string;
}
