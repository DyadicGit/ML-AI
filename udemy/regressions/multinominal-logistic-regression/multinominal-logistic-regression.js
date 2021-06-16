const tf = require('@tensorflow/tfjs');
const _ = require('lodash');

class MultinominalLogisticRegression {
  constructor(features, labels, options) {
    this.features = this.processFeatures(features);
    this.labels = tf.tensor(labels);
    this.costHistory = [];  //<-- Cross Entropy history (that big formula)

    this.options = Object.assign(
      {learningRate: 0.1, iterations: 1000, decisionBoundary: 0.5},
      options
    );

    this.weights = tf.zeros([this.features.shape[1], this.labels.shape[1]]);  // <-- use number of label columns as weights column amount
  }

  gradientDescent(features, labels) {
    const currentGuesses = features.matMul(this.weights).sigmoid();   // <-- chain sigmoid() method
    const differences = currentGuesses.sub(labels);

    const slopes = features
      .transpose()
      .matMul(differences)
      .div(features.shape[0]);

    return this.weights.sub(slopes.mul(this.options.learningRate));
  }

  train() {
    const batchQuantity = Math.floor(
      this.features.shape[0] / this.options.batchSize
    );

    for (let i = 0; i < this.options.iterations; i++) {
      for (let j = 0; j < batchQuantity; j++) {
        const startIndex = j * this.options.batchSize;
        const {batchSize} = this.options;

        this.weights = tf.tidy(() => {
          const featureSlice = this.features.slice(
            [startIndex, 0],
            [batchSize, -1]
          );
          const labelSlice = this.labels.slice([startIndex, 0], [batchSize, -1]);

          return this.gradientDescent(featureSlice, labelSlice);
        })
      }

      this.recordCost();
      this.updateLearningRate();
    }
  }

  predict(observations) {
    return this.processFeatures(observations)
      .matMul(this.weights)
      .softmax()   // <-- chain softmax() method, that's it for Multinominal Logistic Regression !
      .argMax(1) // we removed decision boundary, replaced with argMax(x-axis) for accuracy gauge implementation
  }

  test(testFeatures, testLabels) {
    const predictions = this.predict(testFeatures);
    testLabels = tf.tensor(testLabels).argMax(1); // MultiNominal Logistic Reg. -- label values here also

    const incorrect = predictions
      .notEqual(testLabels) // do the notEqual as per explanation diagram
      .sum()
      .get();

    return (predictions.shape[0] - incorrect) / predictions.shape[0];
  }

  processFeatures(features) {
    features = tf.tensor(features);
    features = tf.ones([features.shape[0], 1]).concat(features, 1);

    if (this.mean && this.variance) {
      features = features.sub(this.mean).div(this.variance.pow(0.5));
    } else {
      features = this.standardize(features);
    }

    return features;
  }

  standardize(features) {
    const {mean, variance} = tf.moments(features, 0);

    this.mean = mean;
    this.variance = variance;

    return features.sub(mean).div(variance.pow(0.5));
  }

  recordCost() {
    const cost = tf.tidy(() => {
      const guesses = this.features.matMul(this.weights).softmax();
      const termOne = this.labels.transpose().matMul(guesses.log()); //<-- first (Actual^T * log(Guesses));
      const termTwo = this.labels
        .mul(-1)
        .add(1)
        .transpose()
        .matMul(
          guesses.mul(-1).add(1).log()
        );

      return termOne
        .add(termTwo)
        .div(this.features.shape[0])
        .mul(-1)
        .get(0, 0);
    })

    this.costHistory.unshift(cost);
  }

  updateLearningRate() {
    if (this.costHistory.length < 2) {
      return;
    }

    if (this.costHistory[0] > this.costHistory[1]) {
      this.options.learningRate /= 2;
    } else {
      this.options.learningRate *= 1.05;
    }
  }
}

module.exports = MultinominalLogisticRegression;
