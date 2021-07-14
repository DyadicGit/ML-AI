require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const loadCSV = require('../load-csv');
const LogisticRegression = require('./logistic-regression');
const plot = require('node-remote-plot');

let { features, labels, testFeatures, testLabels } = loadCSV('../cars.csv', {
  dataColumns: ['horsepower', 'displacement', 'weight'],
  labelColumns: ['passedemissions'],
  shuffle: true,
  splitTest: 50,
  converters: {
    passedemissions: value => {
      return value === 'TRUE' ? 1 : 0;
    }
  }
});

const regression = new LogisticRegression(features, labels, {
  learningRate: 0.5,
  iterations: 100,
  batchSize: 50,
  decisionBoundary: 0.6,
});

regression.train();
const probability = regression.test(testFeatures, testLabels);

plot({
  x: regression.costHistory.reverse(),
  xLabel: 'Iteration #',
  yLabel: 'Mean Squared Error'
});

console.log('probability is', probability);

console.log('costHistory = ', regression.costHistory);

regression.predict([[130, 307, 1.75]]).print();
