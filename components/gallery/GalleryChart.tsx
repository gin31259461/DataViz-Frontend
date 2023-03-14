import data from '@D3Chart/data/sample.json';
import { D3_CHART } from '@D3Chart/chart';

export const AreaChart = (props: { width: number; height: number; enableAnimation: boolean }) => {
  return (
    <D3_CHART.AreaChart
      data={data.area_group_data}
      getX={(d: any) => d.id}
      keysOfGroups={['M', 'F', 'X']}
      width={props.width}
      height={props.height}
      marginTop={0}
      marginBottom={0}
      marginLeft={0}
      marginRight={0}
      enableXAxis={false}
      enableYAxis={false}
      enableLineNode={false}
      enableLegend={false}
      enableAnimation={props.enableAnimation}
    ></D3_CHART.AreaChart>
  );
};

export const AreaStacked = (props: { width: number; height: number; enableAnimation: boolean }) => {
  return (
    <D3_CHART.AreaStacked
      data={data.area_group_data}
      getX={(d: any) => d.id}
      keysOfGroups={['M', 'F', 'X']}
      width={props.width}
      height={props.height}
      marginTop={0}
      marginBottom={0}
      marginLeft={0}
      marginRight={0}
      enableXAxis={false}
      enableYAxis={false}
      enableLineNode={false}
      enableLegend={false}
      enableLinePath={true}
      enableAnimation={props.enableAnimation}
    ></D3_CHART.AreaStacked>
  );
};
export const BarChart = (props: { width: number; height: number; enableAnimation: boolean }) => {
  return (
    <D3_CHART.BarChart
      data={data.bar_group_data}
      getX={(d: any) => d.id}
      keysOfGroups={['salary_avghigh', 'salary_avglow', 'salary_avg']}
      width={props.width}
      height={props.height}
      marginTop={0}
      marginBottom={0}
      marginLeft={0}
      marginRight={0}
      enableXAxis={false}
      enableYAxis={false}
      enableLegend={false}
      enableBarValue={false}
      enableTooltip={false}
      enableAnimation={props.enableAnimation}
    ></D3_CHART.BarChart>
  );
};
export const BarStacked = (props: { width: number; height: number; enableAnimation: boolean }) => {
  return (
    <D3_CHART.BarStacked
      data={data.bar_group_data}
      getX={(d: any) => d.id}
      keysOfGroups={['salary_avghigh', 'salary_avglow', 'salary_avg']}
      width={props.width}
      height={props.height}
      marginTop={0}
      marginBottom={0}
      marginLeft={0}
      marginRight={0}
      enableXAxis={false}
      enableYAxis={false}
      enableLegend={false}
      enableBarValue={false}
      enableTooltip={false}
      enableAnimation={props.enableAnimation}
    ></D3_CHART.BarStacked>
  );
};

export const LineChart = (props: { width: number; height: number; enableAnimation: boolean }) => {
  return (
    <D3_CHART.LineChart
      data={data.area_group_data}
      getX={(d: any) => d.id}
      keysOfGroups={['M', 'F', 'X']}
      width={props.width}
      height={props.height}
      marginTop={0}
      marginBottom={0}
      marginLeft={0}
      marginRight={0}
      enableXAxis={false}
      enableYAxis={false}
      enableLineNode={false}
      enableLegend={false}
      enableAnimation={props.enableAnimation}
    ></D3_CHART.LineChart>
  );
};
export const Pie = (props: { width: number; height: number; enableAnimation: boolean }) => {
  return (
    <D3_CHART.Pie
      data={data.pie_data}
      getX={(d: any) => d.id}
      keysOfGroups={['count']}
      getDetail={(d: any) => d.detail}
      width={props.width}
      height={props.height}
      marginTop={0}
      marginBottom={0}
      marginLeft={0}
      marginRight={0}
      enableLegend={false}
      enablePieLabel={false}
      enableTooltip={false}
      enableAnimation={props.enableAnimation}
    ></D3_CHART.Pie>
  );
};
export const Donut = (props: { width: number; height: number; enableAnimation: boolean }) => {
  return (
    <D3_CHART.Donut
      data={data.pie_data}
      getX={(d: any) => d.id}
      keysOfGroups={['count']}
      width={props.width}
      height={props.height}
      marginTop={0}
      marginBottom={0}
      marginLeft={0}
      marginRight={0}
      enableLegend={false}
      enablePieLabel={false}
      enableTooltip={false}
      enableAnimation={props.enableAnimation}
    ></D3_CHART.Donut>
  );
};

export const BubbleChart = (props: { width: number; height: number; enableAnimation: boolean }) => {
  return (
    <D3_CHART.BubbleChart
      data={data.bubble_plot_data}
      getX={(d: any) => d.x}
      getY={(d: any) => d.y}
      getZ={(d: any) => d.z}
      getGroup={(d: any) => d.group}
      getTipText={(d: any) => d.id}
      xType={'scaleLinear'}
      width={props.width}
      height={props.height}
      marginTop={0}
      marginBottom={0}
      marginLeft={20}
      marginRight={10}
      enableLegend={false}
      enableXAxis={false}
      enableTooltip={false}
      enableAnimation={props.enableAnimation}
    ></D3_CHART.BubbleChart>
  );
};
export const ScatterChart = (props: { width: number; height: number; enableAnimation: boolean }) => {
  return (
    <D3_CHART.ScatterChart
      data={data.area_group_data}
      getX={(d: any) => d.id}
      keysOfGroups={['M', 'F', 'X']}
      width={props.width}
      height={props.height}
      marginTop={0}
      marginBottom={0}
      marginLeft={20}
      marginRight={10}
      enableXAxis={false}
      enableLegend={false}
      enableTooltip={false}
      enableAnimation={props.enableAnimation}
    ></D3_CHART.ScatterChart>
  );
};
export const WordCloud = (props: { width: number; height: number; enableAnimation: boolean }) => {
  return (
    <D3_CHART.WordCloud
      data={data.wordcloud_data}
      width={props.width}
      height={props.height}
      enableAnimation={props.enableAnimation}
    ></D3_CHART.WordCloud>
  );
};
