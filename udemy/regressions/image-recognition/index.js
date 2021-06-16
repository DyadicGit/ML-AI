require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const LogisticRegression = require('../multinominal-logistic-regression/multinominal-logistic-regression');
const plot = require('node-remote-plot');
const _ = require('lodash');
const mnist = require('mnist-data');

function encodeLabels(label) {  // description in "image recognition - labelling values.png"
  const row = new Array(10).fill(0);
  row[label] = 1;
  return row;
}

function loadData() { // load data in a function to remove the reference from mnistData, a.k.a Garbage Collection manipulation
  const mnistData = mnist.training(0, 60000); // <-- give us an example image with handwritten number
  const features = mnistData.images.values.map(image => _.flatMap(image)); // <-- need a long continues array, not a 2D Array
  const labels = mnistData.labels.values;
  const encodedLabels = labels.map(encodeLabels)

  return { features, labels: encodedLabels }
}

const { features, labels } = loadData();

const regression = new LogisticRegression(features, labels, {
  learningRate: 1,
  iterations: 80,
  batchSize: 500
});

const correctedStandardize = (features) => {
  const { mean, variance } = tf.moments(features, 0);
  const filler
    = variance.cast('bool').logicalNot().cast('float32'); //replace ZERO with ONE

  this.mean = mean;
  this.variance = filler;

  return features.sub(mean).div(this.variance.pow(0.5));
}
LogisticRegression.prototype.standardize = correctedStandardize;

const correctedRecordCost = () => {
  const cost = tf.tidy(() => {
    const guesses = this.features.matMul(this.weights).softmax();
    const termOne = this.labels.transpose().matMul(guesses.add(1e-7).log()); // log(zero) manipulation here also
    const termTwo = this.labels
      .mul(-1)
      .add(1)
      .transpose()
      .matMul(
        guesses
          .mul(-1)
          .add(1)
          .add(1e-7)  // log of a negative value is illegal, or log(0) === -Infinity
          .log()      // that's why we need to add "1e-7" (1 x 10^-7 === 0.0000001), a very small number which doesn't effect our result
      );

    return termOne
      .add(termTwo)
      .div(this.features.shape[0])
      .mul(-1)
      .get(0, 0);
  })

  this.costHistory.unshift(cost);
}
LogisticRegression.prototype.recordCost = correctedRecordCost;

regression.train();

const testMnistData = mnist.testing(0, 10000);
const testFeatures = testMnistData.images.values.map(image => _.flatMap(image));
const testEncodedLabels = testMnistData.labels.values.map(encodeLabels)

const accuracy = regression.test(testFeatures, testEncodedLabels);
console.log('Accuracy is', accuracy)

plot({
x: regression.costHistory.reverse(),
})
