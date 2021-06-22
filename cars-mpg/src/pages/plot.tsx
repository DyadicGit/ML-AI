import { Chart as ChartJs, ChartConfiguration, registerables } from 'chart.js';
import { FC, useEffect, useRef, useState } from 'react';

ChartJs.register(...registerables);

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [0, 10, 5, 2, 20, 30, 45],
    },
  ],
};

const defaultConfig: ChartConfiguration = {
  type: 'line',
  data,
  options: {},
};

const size = () => {
  const height = window.innerHeight;
  const width = window.innerWidth;
  return { width: width * 0.9, height: height * 0.4 };
};

type PlotProps = { config?: ChartConfiguration };

const Plot: FC<PlotProps> = ({ config }) => {
  const [chart, setChart] = useState<ChartJs>();
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvas?.current) {
      setChart(new ChartJs(canvas.current, { ...defaultConfig, ...config }));
    }

    return () => chart?.destroy();
  }, []);

  useEffect(() => {
    const listener = () => {
      const { width, height } = size();
      chart?.resize(width, height);
    };
    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, [!!chart]);

  return <canvas width={size().width} height={size().height} ref={canvas} />;
};

export default Plot;
