type MarginProps = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type AnimationProps = {
  duration: number;
  enabled: boolean;
};

type LegendProps = {
  title: string;
  enabled: boolean;
};

export interface ChartStyle {
  title: string;
  width: number;
  height: number;
  margin: MarginProps;
  colors: any;
  animation: AnimationProps;
  legend: LegendProps;
}
