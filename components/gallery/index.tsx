import style from './style.module.scss';
import { useState, useEffect } from 'react';

export const useControlledRect = () => {
  const [chartWidth, setChartWidth] = useState<number>(0);
  const [chartHeight, setChartHeight] = useState<number>(0);
  const [hoverAnimation, setHoverAnimation] = useState<boolean[]>(Array(1).fill(false));

  useEffect(() => {
    let resizeId: NodeJS.Timeout;
    function updateRect() {
      const element = document.getElementById('_chart_sample');
      if (element === null) return;
      const newChartWidth = element.getBoundingClientRect().width - 25;
      const newChartHeight = element.getBoundingClientRect().height - 40;
      setChartWidth(() => newChartWidth);
      setChartHeight(() => newChartHeight);
    }
    updateRect();
    window.addEventListener('resize', () => {
      clearTimeout(resizeId);
      resizeId = setTimeout(updateRect, 500);
    });
  }, []);

  return { chartWidth, chartHeight, hoverAnimation };
};

export default function Gallery(props: { children: React.ReactNode }) {
  return <div className={style['gallery-container']}>{props.children}</div>;
}
