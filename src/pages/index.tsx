import Gallery from 'components/gallery';
import Card from 'components/gallery/Card';
import {
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
} from 'components/gallery/GalleryChart';
import { useControlledRect } from 'components/gallery';
import style from 'src/styles/home.module.css';

export default function Home() {
  const { chartWidth, chartHeight, hoverAnimation } = useControlledRect();

  return (
    <div className={style['container']}>
      <Gallery>
        <Card id={'_chart_sample'} title={'Area Chart'} href={'/'}>
          <AreaChart width={chartWidth} height={chartHeight} enableAnimation={hoverAnimation[0]}></AreaChart>
        </Card>
        <Card id={'_chart_sample'} title={'Area Stacked'} href={'/'}>
          <AreaStacked width={chartWidth} height={chartHeight} enableAnimation={hoverAnimation[0]}></AreaStacked>
        </Card>
        <Card title={'Bar Group'} href={'/'}>
          <BarChart width={chartWidth} height={chartHeight} enableAnimation={hoverAnimation[0]}></BarChart>
        </Card>
        <Card title={'Bar Stacked'} href={'/'}>
          <BarStacked width={chartWidth} height={chartHeight} enableAnimation={hoverAnimation[0]}></BarStacked>
        </Card>
        <Card title={'Bubble Chart'} href={'/'}>
          <BubbleChart width={chartWidth} height={chartHeight} enableAnimation={hoverAnimation[0]}></BubbleChart>
        </Card>
        <Card title={'Pie Chart'} href={'/'}>
          <Pie width={chartWidth} height={chartHeight} enableAnimation={hoverAnimation[0]}></Pie>
        </Card>
        <Card title={'Donut Chart'} href={'/'}>
          <Donut width={chartWidth} height={chartHeight} enableAnimation={hoverAnimation[0]}></Donut>
        </Card>
        <Card title={'Line Chart'} href={'/'}>
          <LineChart width={chartWidth} height={chartHeight} enableAnimation={hoverAnimation[0]}></LineChart>
        </Card>
        <Card title={'Scatter Chart'} href={'/'}>
          <ScatterChart width={chartWidth} height={chartHeight} enableAnimation={hoverAnimation[0]}></ScatterChart>
        </Card>
        <Card title={'Word Cloud'} href={'/'}>
          <WordCloud width={chartWidth} height={chartHeight} enableAnimation={hoverAnimation[0]}></WordCloud>
        </Card>
      </Gallery>
    </div>
  );
}
