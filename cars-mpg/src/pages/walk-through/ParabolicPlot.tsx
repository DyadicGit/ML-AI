import { ChartConfiguration } from 'chart.js';
import { Button, Plot } from '../../components';
import { useState } from 'react';

let x = Array(20)
  .fill(null)
  .map((_, idx) => idx + 1);
x = x.concat(x.map((x) => -1 * x));
type Data = Array<{ x: number; y: number }>;
const parabolicFunction: Data = x.map((x) => ({ x, y: x ** 2 }));

const config: Partial<ChartConfiguration> = {
  type: 'scatter',
  data: {
    datasets: [
      {
        label: 'y = x^2',
        showLine: false,
        data: parabolicFunction,
        type: 'scatter',
        borderColor: 'black',
        backgroundColor: 'black',
      },
      // @ts-ignore; // these are placeholders
      {label: ''},{label: ''},{label: ''},{label: ''}
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { labels: { font: { size: 16 } } },
    },
  },
};
const slopeNr1 = () => {
  // @ts-ignore
  config.data.datasets[1] = {
    label: 'slope nr.1',
    data: [
      { x: -19, y: 361 },
      { x: -16, y: 256 },
    ],
    type: 'line',
    borderColor: 'red',
    backgroundColor: 'red',
    borderWidth: 5,
  };
  return { ...config };
};
const angleNr1 = () => {
  // @ts-ignore
  config.data.datasets[2] = {
    label: '',
    data: [
      { x: -19, y: 361 },
      { x: -19, y: 0 },
    ],
    pointStyle: 'line',
    type: 'line',
    borderColor: 'red',
    backgroundColor: 'transparent',
    pointBorderWidth: 0,
    borderWidth: 2,
    borderDash: [6, 10]
  };
  return { ...config };
};

const slopeNr2 = () => {
  // @ts-ignore
  config.data.datasets[3] = {
    label: 'slope nr.2',
    data: [
      { x: -7, y: 49 },
      { x: -4, y: 16 },
    ],
    type: 'line',
    borderColor: 'red',
    backgroundColor: 'red',
    borderWidth: 5,
  };
  return { ...config };
};
const angleNr2 = () => {
  // @ts-ignore
  config.data.datasets[4] = {
    label: '',
    data: [
      { x: -7, y: 49 },
      { x: -7, y: 0 },
    ],
    pointStyle: 'line',
    type: 'line',
    borderColor: 'red',
    backgroundColor: 'transparent',
    pointBorderWidth: 0,
    borderWidth: 2,
    borderDash: [2, 5]
  };
  return { ...config };
};

const ParabolicPlot = () => {
  const [plotConfig, setConfig] = useState(config);
  const drawSlope1 = () => setConfig(slopeNr1());
  const drawAngle1 = () => setConfig(angleNr1());
  const drawSlope2 = () => setConfig(slopeNr2());
  const drawAngle2 = () => setConfig(angleNr2());

  return (
    <div>
      <Plot config={plotConfig} />
      <Button onClick={drawSlope1} onAuxClick={drawAngle1}>Slope nr.1</Button>
      <Button onClick={drawSlope2} onAuxClick={drawAngle2}>Slope nr.2</Button>
    </div>
  );
};

export default ParabolicPlot;
