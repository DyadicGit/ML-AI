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

const rawData = (carsJson as Car[]).slice(0, -1 * splitTest);
const rawTestData = (carsJson as Car[]).slice(-1 * splitTest);
const rawFeatures = (shuffle(rawData.map(filterColumns(dataColumns))) as any) as DataRow;
const rawTestFeatures = (shuffle(rawTestData.map(filterColumns(dataColumns))) as any) as DataRow;
const rawLabels = (shuffle(rawData.map(filterColumns(labelColumns))) as any) as LabelRow;
const rawTestLabels = (shuffle(rawTestData.map(filterColumns(labelColumns))) as any) as LabelRow;

const regression = new LinearRegression(rawFeatures, rawLabels, {
  learningRate: 0.1,
  iterations: 50,
  batchSize: 10,
});

const runRegression = () => {
  regression.train();
  const r2 = regression.test(rawTestFeatures, rawTestLabels);
  console.log('R2 is', r2);

  regression.predict([[120, 2, 380]]).print();
};

const byMPG = (a: Car, b: Car) => a.mpg - b.mpg;
const byNumber = (a: number, b: number) => a - b;

const carsByMpg = (carsJson as Car[]).sort(byMPG).map((car) => ({ ...car, x: car.mpg, weight: car.weight * 100 })) as any as ScatterDataPoint[];

const xMpg = (carsByMpg as any as Car[]).map((s) => s.mpg);

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
  type: 'line',
  data: {
    labels: xMpg,
    datasets: [yWeight, yDisplacement, yHorsepower],
  },
};

const Home = () => {
  const [iterationVsMeanSqrError, setIterationVsMeanSqrError] = useState<Partial<ChartConfiguration>>();

  const start = () => {
    runRegression();
    const iterationVsMeanSqrError: Partial<ChartConfiguration> = {
      data: {
        labels: [...regression.mseHistory.keys()],
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
    setIterationVsMeanSqrError(iterationVsMeanSqrError);
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
