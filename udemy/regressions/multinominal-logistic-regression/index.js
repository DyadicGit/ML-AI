require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const loadCSV = require('../load-csv');
const MultinominalLogisticRegression = require('./multinominal-logistic-regression');
const plot = require('node-remote-plot');
const _ = require('lodash');

let {features, labels, testFeatures, testLabels} = loadCSV('../cars.csv', {
  dataColumns: ['horsepower', 'displacement', 'weight'],
  labelColumns: ['mpg'],
  shuffle: true,
  splitTest: 50,
  converters: {
    mpg: value => {     // split labels to MID LOW HIGH mpg usage labels
      const mpg = parseFloat(value);
      if (mpg < 15) return [1, 0, 0];
      else if (mpg < 30) return [0, 1, 0];
      else return [0, 0, 1];
    }
  }
});


const regression = new MultinominalLogisticRegression(features, _.flatMap(labels), {  //<-- needed to remove one array nesting because of converter
  learningRate: 0.5,
  iterations: 100,
  batchSize: 50,
  decisionBoundary: 0.6,
});

regression.train();

console.log('accuracy percentage value = ', regression.test(testFeatures, _.flatMap(testLabels)));   // <-- gives result === 0.8, means we give 80% accuracy rating of assigning LOW,MID,HIGH labels for our vehicles

regression.predict([
  [215, 440, 2.16],     // <-- gives [1, 0, 0] result
  [150, 220, 2.223]     // <-- gives [1, 1, 0] result, in other words[LOW, MID, 0] a.k.a Marginal Probability ( splits probability with percentage per label, but we need only one in our case )
                        // Conditional Probability - is when the SUM of probabilities is 1 ( 100% )  ex.: [0.34, 0.16, 0.50] === 1
                        // for Conditional Probability use SOFTMAX equation, not SIGMOID.
                        // when used with .softmax() we get the result [0, 1, 0] === which is MID mpg usage
]).print();
