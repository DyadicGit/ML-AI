import * as tf from '@tensorflow/tfjs';
import { ContainedButton } from '../../components/mdc';
import { useMemo, useState } from 'react';
import { ChartConfiguration } from 'chart.js';
import { Plot } from '../../components';
import { Logs } from "@tensorflow/tfjs-layers/src/logs";
import styles from './walk-through.module.scss';

import codeGetWeights from '../../images/Linear Regression getWeights.png';
import codeLinRegWithTSModels from '../../images/Linear Regression with tensorflow model.png';

const trainX = [3.3, 4.4, 5.5, 6.71, 6.93, 4.168, 9.779, 6.182, 7.59, 2.167, 7.042, 10.791, 5.313, 7.997, 5.654, 9.27, 3.1,];
const trainY = [1.7, 2.76, 2.09, 3.19, 1.694, 1.573, 3.366, 2.596, 2.53, 1.221, 2.827, 3.465, 1.65, 2.904, 2.42, 2.94, 1.3,];

const testFeatures = trainX.slice(-6);
const testLabels = trainY.slice(-6);

const LEARNING_RATE = 0.005;
type CallbackFn = (model: tf.Sequential, epoch: number, logs?: Logs) => void;
async function linearRegression(onEpochEnd?: CallbackFn, iterationsCount: number = 100) {
  // Define a model for linear regression.
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: 1,
      inputShape: [1],
    })
  );

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({
    loss: 'meanSquaredError',
    optimizer: tf.train.sgd(LEARNING_RATE),
    metrics: [tf.metrics.meanAbsoluteError],
  });

  const xs = tf.tensor2d(trainX, [trainX.length, 1]);
  const ys = tf.tensor2d(trainY, [trainX.length, 1]);

  // Train the model using the data
  await model.fit(xs, ys, {
    epochs: iterationsCount,
    callbacks: {
      onEpochEnd: (...params) => onEpochEnd?.(model, ...params),
    },
  });
  // @ts-ignore
  model.predict(tf.tensor2d(testFeatures, [testFeatures.length, 1])).print();
  console.log('%c actual test labels', 'color: yellow;', testLabels);
  model.summary();
  return model;
}

type Data = Array<{ x: number; y: number }>;
function plotData(): Data {
  const data = [];
  for (let i = 0; i < trainY.length; i++) {
    data.push({ x: trainX[i], y: trainY[i] });
  }
  return data;
}

function getWeights(model: tf.Sequential) {
  const [M, B] = model.getWeights();
  const m = Number(M.dataSync().toString());
  const b = Number(B.dataSync().toString());

  return { m, b };
}

const WithModel = () => {
  const [epochs, setEpochs] = useState(100)
  const [weights, setWeights] = useState<{ m: number; b: number }>({ m: 0, b: 0 });
  const [mseDependency, setMseDep] = useState<Data>([])
  const populateMseDep: CallbackFn = async (model, epoch, logs) => {
    setMseDep((prevMse) => prevMse.concat({x: epoch, y: (logs as Logs).loss}))
  }

  const handleOnClick = async () => {
    const model = await linearRegression(populateMseDep, epochs);
    setWeights(getWeights(model));
  };
  const mseVsIterations: Partial<ChartConfiguration> = useMemo(
    () => ({
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'MSE',
            showLine: true,
            data: mseDependency,
            type: 'scatter',
            borderColor: 'black',
            backgroundColor: 'cyan',
            pointRadius: 3
          }
        ],
      },
      options: {
        responsive: true,
        animation: false,
        plugins: {
          legend: { labels: { font: { size: 16 } } },
        },
      },
    }),
    [mseDependency]
  );
  const config: Partial<ChartConfiguration> = useMemo(
    () => ({
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Training Data',
            showLine: false,
            data: plotData(),
            type: 'scatter',
            borderColor: 'black',
            backgroundColor: 'black',
          },
          {
            label: 'Y = ' + weights.m + 'X + ' + weights.b,
            data: [
              { x: 0, y: weights.b },
              { x: 11, y: 11 * weights.m + weights.b },
            ],
            type: 'line',
            borderColor: 'red',
            backgroundColor: 'red',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          y: { min: 0, max: 4.5 },
          x: { min: 0, max: 12 }
        },
        plugins: {
          legend: { labels: { font: { size: 16 } } },
        },
      },
    }),
    [weights]
  );

  return (
    <>
      <h2>The same but with TensorFlow.js models</h2>
      <img src={codeLinRegWithTSModels} alt="Linear regression code with using TensorFlow.js model"/>
      <p>
        There are 2 weights in total, 2 per dense layer. The equation <code>y = Ax + b</code> where <code>A</code> (the
        kernel) and <code>b</code> (the bias) are parameters of the dense layer.
      </p>
      <img src={codeGetWeights} alt="bonus code to get weights" style={{width: '50%'}}/>

      <h4>m={weights.m}</h4>
      <h4>b={weights.b}</h4>
      <ContainedButton onClick={handleOnClick}>Train</ContainedButton>
      <input className={styles.iterationsInput} type="number" onChange={(e) => {
        // @ts-ignore
        setEpochs(Number(e.target.value));
        setMseDep([]);
      }} value={epochs}/>
      <Plot config={config} />
      <h2>Mean Square Error vs. Iterations dependency graph</h2>
      <Plot config={mseVsIterations}/>
    </>
  );
};

export default WithModel;
