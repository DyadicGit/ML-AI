import * as tf from '@tensorflow/tfjs';
import { useEffect, useState } from 'react';
import { Tensor } from "@tensorflow/tfjs";

// Tiny TFJS train / predict example.
async function run() {
  // Create a simple model.
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  // Generate some synthetic data for training. (y = 2x - 1)
  const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
  const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

  // Train the model using the data.
  await model.fit(xs, ys, { epochs: 250 });

  // Use the model to do inference on a data point the model hasn't seen.
  // Should print approximately 39.
  // @ts-ignore
  return model.predict(tf.tensor2d([20], [1, 1])).dataSync();
}

const BostonHousePrising = () => {
  const [result, setResult] = useState();
  useEffect(() => {
    run().then(setResult);
  }, []);
  // @ts-ignore
  return <section>{result?.toString() || 'loading...'}</section>;
};

export default BostonHousePrising;
