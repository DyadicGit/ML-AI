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
// @ts-ignore
  data: null,
  options: { responsive: true },
};

type PlotProps = { config?: Partial<ChartConfiguration> };

const Plot: FC<PlotProps> = ({ config }) => {
  const [chart, setChart] = useState<ChartJs>();
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let chart$: ChartJs;
    if (canvas?.current) {
      chart$ = new ChartJs(canvas.current, { ...defaultConfig });
      setChart(chart$);
    }

    return () => chart$?.destroy();
  }, [setChart]);

  useEffect(() => {
    if (chart) {
      chart.config.data = { ...defaultConfig.data, ...config?.data };
      chart.update();
    }
  }, [config, chart]);

  return (
    <div className="chart-container" style={{ position: 'relative', height: '40vh', width: '90vw' }}>
      <canvas ref={canvas} />
    </div>
  );
};

export default Plot;
