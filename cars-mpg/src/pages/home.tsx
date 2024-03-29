import { Button } from '../components';
import LinearRegression from './linear-regression';
import carsJson from '../data/cars.json';
import { Car } from '../types';
import { ChartConfiguration, ChartDataset, ScatterDataPoint } from 'chart.js';
import { Plot } from '../components';
import { useState } from 'react';

const shuffle = require('lodash.shuffle');

const splitTest = 50;

type DataRow = Array<[number, number, number]>;
type LabelRow = Array<[number]>;
const dataColumns = ['horsepower', 'weight', 'displacement'];
const labelColumns = ['mpg'];

const filterColumns = (columns: string[]) => (data: Car): string[] =>
  columns.reduce((acc, key) => acc.concat((data as any)[key]), [] as string[]);

const rawData: Car[] = shuffle((carsJson as Car[]).slice(0, -1 * splitTest));
const rawTestData: Car[] = shuffle((carsJson as Car[]).slice(-1 * splitTest));
const rawFeatures = (rawData.map(filterColumns(dataColumns)) as any) as DataRow;
const rawTestFeatures = (rawTestData.map(filterColumns(dataColumns)) as any) as DataRow;
const rawLabels = (rawData.map(filterColumns(labelColumns)) as any) as LabelRow;
const rawTestLabels = (rawTestData.map(filterColumns(labelColumns)) as any) as LabelRow;

const regression = new LinearRegression(rawFeatures, rawLabels, {
  learningRate: 0.2,
  iterations: 50,
  batchSize: 10,
});

// @ts-ignore
window.regression = regression;

const runRegression = () => {
  regression.train();
  const r2 = regression.test(rawTestFeatures, rawTestLabels);
  console.log('R2 is', r2);

  const predictMe = [[120, 2, 380]];
  console.log(
    'predict ',
    predictMe.map((s) => `${s[0]}hp ${s[1]}ton ${s[2]}in^3`).join(';'),
    ' result is :',
    regression.predict(predictMe as any).arraySync()
  );
};

const byMPG = (a: Car, b: Car) => a.mpg - b.mpg;

const carsByMpg = ((carsJson as Car[])
  .sort(byMPG)
  .map((car) => ({ ...car, x: car.mpg, weight: car.weight * 100 })) as any) as ScatterDataPoint[];

const xMpg = ((carsByMpg as any) as Car[]).map((s) => s.mpg);

const red = { borderColor: 'red', borderRadius: 1, borderWidth: 1 };
const blue = { borderColor: 'blue', borderRadius: 1, borderWidth: 1 };
const green = { borderColor: 'green', borderRadius: 1, borderWidth: 1 };

const yWeight: ChartDataset = {
  data: carsByMpg,
  label: 'Weight',
  ...red,
  parsing: {
    yAxisKey: 'weight',
  },
};

const yDisplacement: ChartDataset = {
  data: carsByMpg,
  label: 'Engine displacement',
  ...blue,
  parsing: {
    yAxisKey: 'displacement',
  },
};

const yHorsepower: ChartDataset = {
  data: carsByMpg,
  label: 'Horsepower',
  ...green,
  parsing: {
    yAxisKey: 'horsepower',
  },
};
const mpgDependencies: ChartConfiguration = {
  type: 'scatter',
  data: {
    labels: xMpg,
    datasets: [yWeight, yDisplacement, yHorsepower],
  },
  options: {
    scales: {
      x: { title: { text: 'mpg', display: true } },
    },
  },
};

const Home = () => {
  const [iterationVsMeanSqrError, setIterationVsMeanSqrError] = useState<Partial<ChartConfiguration>>();

  const start = () => {
    runRegression();
    const config: Partial<ChartConfiguration> = {
      data: {
        labels: [...regression.mseHistory.reverse().keys()],
        datasets: [
          {
            label: 'Mean Squared Error timeline',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: regression.mseHistory,
          },
        ],
      },
    };
    setIterationVsMeanSqrError(config);
  };
  return (
    <section>
      <Plot config={mpgDependencies} />
      <Button onClick={start}>start training</Button>
      <Plot config={iterationVsMeanSqrError} />
    </section>
  );
};

export default Home;
