import { Chart as ChartJs, ChartConfiguration, registerables } from 'chart.js';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './plot.module.scss';

ChartJs.register(...registerables);

const defaultConfig: ChartConfiguration = {
  type: 'line',
  // @ts-ignore
  data: null,
  plugins: undefined,
  options: { responsive: true },
};

type PlotProps = { config?: Partial<ChartConfiguration> };

const Plot: FC<PlotProps> = ({ config }) => {
  const [chart, setChart] = useState<ChartJs>();
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let chart$: ChartJs;
    if (canvas?.current) {
      // @ts-ignore
      chart$ = new ChartJs(canvas.current, config || defaultConfig );
      setChart(chart$);
    }

    return () => chart$?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setChart]);

  useEffect(() => {
    if (chart) {
      chart.config.data = { ...defaultConfig.data, ...config?.data };
      // @ts-ignore
      chart.options = config?.options || defaultConfig.options

      chart.update();
    }
  }, [config, chart]);

  return (
    <div className={styles.chartContainer}>
      <canvas ref={canvas} />
    </div>
  );
};

export default Plot;
