import * as tf from '@tensorflow/tfjs';
import { Scalar, Tensor } from '@tensorflow/tfjs';
import { Plot } from '../components';
import { useState } from 'react';
import { ChartConfiguration } from 'chart.js';
import { ContainedButton } from "../components/mdc";


const trainX = [3.3, 4.4, 5.5, 6.71, 6.93, 4.168, 9.779, 6.182, 7.59, 2.167, 7.042, 10.791, 5.313, 7.997, 5.654, 9.27, 3.1,];
const trainY = [1.7, 2.76, 2.09, 3.19, 1.694, 1.573, 3.366, 2.596, 2.53, 1.221, 2.827, 3.465, 1.65, 2.904, 2.42, 2.94, 1.3,];

const m = tf.variable(tf.scalar(0));
const b = tf.variable(tf.scalar(0));

function predict(x: Tensor) {
  return tf.tidy(function () {
    return m.mul(x).add(b);
  });
}

function loss(prediction: Tensor, labels: Tensor) {
  //subtracts the two arrays & squares each element of the tensor then finds the mean squared error.
  const error = prediction.sub(labels).square().mean();
  return error;
}

function train() {
  const learningRate = 0.005;
  const optimizer = tf.train.sgd(learningRate);

  optimizer.minimize(() => {
    const predsYs = predict(tf.tensor1d(trainX));
    console.log(predsYs);
    const stepLoss = loss(predsYs, tf.tensor1d(trainY));
    console.log(stepLoss.dataSync()[0]);
    return stepLoss as Scalar;
  });
}
type Data = Array<{ x: number; y: number }>;
function plotData(): Data {
  const data = [];
  for (let i = 0; i < trainY.length; i++) {
    data.push({ x: trainX[i], y: trainY[i] });
  }
  return data;
}

const config: Partial<ChartConfiguration> = {
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
        label: 'Y = ' + m.dataSync()[0] + 'X + ' + b.dataSync()[0],
        data: [
          { x: 0, y: b.dataSync()[0] },
          { x: 11, y: 11 * m.dataSync()[0] + b.dataSync()[0] },
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
      y: {min: 0, max: 4.5}
    },
    plugins: {
      legend: { labels: { font: { size: 16 } } },
    },
  },
};

const WalkThrough = () => {
  const [plotConfig, setConfig] = useState(config);
  console.log({ config, plotConfig });

  const updateConfig = () => {
    train();
    // @ts-ignore
    config.data.datasets[1].data = [
      { x: 0, y: b.dataSync()[0] },
      { x: 11, y: 11 * m.dataSync()[0] + b.dataSync()[0] },
    ];
    // @ts-ignore
    config.data.datasets[1].label = 'Y = ' + m.dataSync()[0] + 'X + ' + b.dataSync()[0];
    setConfig({ ...config });
  };

  return (
    <section>
      <Plot config={plotConfig} />
      <ContainedButton onClick={updateConfig} className="mdc-button--raised">Train the model by 1 step</ContainedButton>
    </section>
  );
};

export default WalkThrough;
