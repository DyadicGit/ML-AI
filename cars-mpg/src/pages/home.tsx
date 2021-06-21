import { Button } from '../components';
import LinearRegression from './linear-regression';
import carsJson from '../data/cars.json';
import { Car } from '../types';

const shuffle = require('lodash.shuffle');

type ToUnion<T extends any[]> = T[number];
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
  iterations: 3,
  batchSize: 10,
});

regression.train();
const r2 = regression.test(rawTestFeatures, rawTestLabels);
//
// plot({
//   x: regression.mseHistory.reverse(),
//   xLabel: 'Iteration #',
//   yLabel: 'Mean Squared Error',
// });

console.log('R2 is', r2);

regression.predict([[120, 2, 380]]).print();

const Home = () => (
  <section>
    <Button>click me</Button>
  </section>
);

export default Home;
