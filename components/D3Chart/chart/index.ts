import AreaChart from "./area/AreaChart";
import AreaStacked from "./area/AreaStacked";
import BarChart from "./bar/BarGroup";
import BarStacked from "./bar/BarStacked";
import BubbleChart from "./bubble/BubbleChart";
import Pie from "./circular/Pie";
import Donut from "./circular/Donut";
import LineChart from "./line/LineChart";
import ScatterChart from "./scatter/ScatterChart";
import WordCloud from "./word/WordCloud";

export type D3_CHART_PROPS =
  | "AreaSingle"
  | "AreaGroup"
  | "AreaStacked"
  | "BarSingle"
  | "BarGroup"
  | "BarStacked"
  | "BubbleChart"
  | "BubblePlot"
  | "Pie"
  | "Donut"
  | "LineSingle"
  | "LineMultiple"
  | "ScatterSingle"
  | "ScatterGroup"
  | "WordCloud";

export const ChartComponentsList = [
  "AreaSingle",
  "AreaGroup",
  "AreaStacked",
  "BarSingle",
  "BarGroup",
  "BarStacked",
  "BubbleChart",
  "BubblePlot",
  "Pie",
  "Donut",
  "LineSingle",
  "LineMultiple",
  "ScatterSingle",
  "ScatterGroup",
  "WordCloud",
];

export const D3_CHART = {
  AreaChart,
  AreaStacked,
  BarChart,
  BarStacked,
  BubbleChart,
  Pie,
  Donut,
  LineChart,
  ScatterChart,
  WordCloud,
};
