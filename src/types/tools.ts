export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: string;
  category: 'calculators' | 'timers' | 'converters' | 'health' | 'finance';
}

export interface ToolsConfig {
  calculators: Tool[];
  timers: Tool[];
  converters: Tool[];
  health: Tool[];
  finance: Tool[];
}