import { Tensor } from '@tensorflow/tfjs';

import * as tf from "@tensorflow/tfjs";

type Options = { learningRate: number; iterations: number; batchSize: number };
type RawFeatures = Array<[number, number, number]>;
type RawLabels = Array<[number]>;

class LinearRegression {
  features: Tensor;
  labels: Tensor;
  mseHistory: number[];
  options: Options;
  weights: Tensor;
  mean?: Tensor = undefined;
  variance?: Tensor = undefined;

  constructor(rawFeatures: RawFeatures, rawLabels: RawLabels, options: Options) {
    this.features = this.processFeatures(rawFeatures);
    this.labels = tf.tensor(rawLabels);
    this.mseHistory = [];

    this.options = Object.assign({ learningRate: 0.1, iterations: 1000 }, options);

    this.weights = tf.zeros([this.features.shape[1] as number, 1]);
  }

  gradientDescent(features: Tensor, labels: Tensor) {
    const currentGuesses = features.matMul(this.weights);
    const differences = currentGuesses.sub(labels);

    const slopes = features.transpose().matMul(differences).div(features.shape[0]);

    return this.weights.sub(slopes.mul(this.options.learningRate));
  }

  train() {
    const batchQuantity = Math.floor(this.features.shape[0] / this.options.batchSize);

    for (let i = 0; i < this.options.iterations; i++) {
      for (let j = 0; j < batchQuantity; j++) {
        const startIndex = j * this.options.batchSize;
        const { batchSize } = this.options;

        const featureSlice = this.features.slice([startIndex, 0], [batchSize, -1]);
        const labelSlice = this.labels.slice([startIndex, 0], [batchSize, -1]);

        this.weights = this.gradientDescent(featureSlice, labelSlice);
      }

      this.recordMSE();
      this.updateLearningRate();
    }
  }

  predict(observations: RawFeatures) {
    return this.processFeatures(observations).matMul(this.weights);
  }

  test(rawTestFeatures: RawFeatures, rawTestLabels: RawLabels) {
    const testFeatures = this.processFeatures(rawTestFeatures);
    const testLabels = tf.tensor(rawTestLabels);

    const predictions = testFeatures.matMul(this.weights);

    const sum$ = testLabels.sub(predictions).pow(2).sum();
    const res = sum$.bufferSync().get();
    const tot = testLabels.sub(testLabels.mean()).pow(2).sum().bufferSync().get();

    return 1 - res / tot;
  }

  processFeatures(rawFeatures: RawFeatures): Tensor {
    const features = tf.tensor(rawFeatures);
    const featuresWith1 = tf.ones([features.shape[0], 1]).concat(features, 1);

    return this.standardize(featuresWith1);
  }

  standardize(features: Tensor) {
    if (!this.mean || !this.variance) {
      const { mean, variance } = tf.moments(features, 0);

      this.mean = mean;
      this.variance = variance;
    }

    return features.sub(this.mean).div(this.variance.pow(0.5));
  }

  recordMSE() {
    const mse$ = this.features.matMul(this.weights).sub(this.labels).pow(2).sum().div(this.features.shape[0])
    const mse = mse$.bufferSync().get();

    this.mseHistory.unshift(mse);
  }

  updateLearningRate() {
    if (this.mseHistory.length < 2) {
      return;
    }

    if (this.mseHistory[0] > this.mseHistory[1]) {
      this.options.learningRate /= 2;
    } else {
      this.options.learningRate *= 1.05;
    }
  }
}

export default LinearRegression;
