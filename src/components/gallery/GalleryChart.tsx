import data from '@D3Chart/data/sample.json';
import { AreaChart } from '../../lib/D3Chart/src';

export const AreaChartComponent = () => {
  return (
    <AreaChart
      data={data.area_group_data}
      mapper={{
        getX:(d: any) => d.id,
        keys: ['M', 'F', 'X']
      }}
    ></AreaChart>
  );
};