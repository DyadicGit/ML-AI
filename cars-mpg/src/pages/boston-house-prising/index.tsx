// @ts-nocheck

import { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
// import * as tfvis from '@tensorflow/tfjs-vis';
import { BostonHousingDataset, featureDescriptions } from './data';
import * as normalization from './normalization';
import * as ui from './ui';
import './boston-house-prising.css';
// Some hyperparameters for model training.
const NUM_EPOCHS = 200;
const BATCH_SIZE = 40;
const LEARNING_RATE = 0.01;
const bostonData = new BostonHousingDataset();
const tensors = {};
// Convert loaded data into tensors and creates normalized versions of the
// features.
export function arraysToTensors() {
  tensors.rawTrainFeatures = tf.tensor2d(bostonData.trainFeatures);
  tensors.trainTarget = tf.tensor2d(bostonData.trainTarget);
  tensors.rawTestFeatures = tf.tensor2d(bostonData.testFeatures);
  tensors.testTarget = tf.tensor2d(bostonData.testTarget);
  // Normalize mean and standard deviation of data.
  let { dataMean, dataStd } = normalization.determineMeanAndStddev(tensors.rawTrainFeatures);
  tensors.trainFeatures = normalization.normalizeTensor(tensors.rawTrainFeatures, dataMean, dataStd);
  tensors.testFeatures = normalization.normalizeTensor(tensors.rawTestFeatures, dataMean, dataStd);
}
/**
 * Builds and returns Linear Regression Model.
 *
 * @returns {tf.Sequential} The linear regression model.
 */
export function linearRegressionModel() {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [bostonData.numFeatures],
      units: 1,
    })
  );
  model.summary();
  return model;
}
/**
 * Builds and returns Multi Layer Perceptron Regression Model
 * with 1 hidden layers, each with 10 units activated by sigmoid.
 *
 * @returns {tf.Sequential} The multi layer perceptron regression model.
 */
export function multiLayerPerceptronRegressionModel1Hidden() {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [bostonData.numFeatures],
      units: 50,
      activation: 'sigmoid',
      kernelInitializer: 'leCunNormal',
    })
  );
  model.add(
    tf.layers.dense({
      units: 1,
    })
  );
  model.summary();
  return model;
}
/**
 * Builds and returns Multi Layer Perceptron Regression Model
 * with 2 hidden layers, each with 10 units activated by sigmoid.
 *
 * @returns {tf.Sequential} The multi layer perceptron regression mode  l.
 */
export function multiLayerPerceptronRegressionModel2Hidden() {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [bostonData.numFeatures],
      units: 50,
      activation: 'sigmoid',
      kernelInitializer: 'leCunNormal',
    })
  );
  model.add(
    tf.layers.dense({
      units: 50,
      activation: 'sigmoid',
      kernelInitializer: 'leCunNormal',
    })
  );
  model.add(
    tf.layers.dense({
      units: 1,
    })
  );
  model.summary();
  return model;
}
/**
 * Describe the current linear weights for a human to read.
 *
 * @param {Array} kernel Array of floats of length 12.  One value per feature.
 * @returns {List} List of objects, each with a string feature name, and value
 *     feature weight.
 */
export function describeKernelElements(kernel) {
  tf.util.assert(kernel.length == 12, () => `kernel must be a array of length 12, got ${kernel.length}`);
  const outList = [];
  for (let idx = 0; idx < kernel.length; idx++) {
    outList.push({
      description: featureDescriptions[idx],
      value: kernel[idx],
    });
  }
  return outList;
}
/**
 * Compiles `model` and trains it using the train data and runs model against
 * test data. Issues a callback to update the UI after each epcoh.
 *
 * @param {tf.Sequential} model Model to be trained.
 * @param {boolean} weightsIllustration Whether to print info about the learned
 *  weights.
 */
export async function run(model, modelName, weightsIllustration) {
  model.compile({
    optimizer: tf.train.sgd(LEARNING_RATE),
    loss: 'meanSquaredError',
  });
  let trainLogs = [];
  const container = document.querySelector(`#${modelName} .chart`);
  ui.updateStatus('Starting training process...');
  await model.fit(tensors.trainFeatures, tensors.trainTarget, {
    batchSize: BATCH_SIZE,
    epochs: NUM_EPOCHS,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        await ui.updateModelStatus(`Epoch ${epoch + 1} of ${NUM_EPOCHS} completed.`, modelName);
        trainLogs.push(logs);
        // tfvis.show.history(container, trainLogs, ['loss', 'val_loss']);
        if (weightsIllustration) {
          model.layers[0]
            .getWeights()[0]
            .data()
            .then((kernelAsArr) => {
              const weightsList = describeKernelElements(kernelAsArr);
              ui.updateWeightDescription(weightsList);
            });
        }
      },
    },
  });
  ui.updateStatus('Running on test data...');
  const result = model.evaluate(tensors.testFeatures, tensors.testTarget, {
    batchSize: BATCH_SIZE,
  });
  const testLoss = result.dataSync()[0];
  const trainLoss = trainLogs[trainLogs.length - 1].loss;
  const valLoss = trainLogs[trainLogs.length - 1].val_loss;
  await ui.updateModelStatus(
    `Final train-set loss: ${trainLoss.toFixed(4)}\n` +
      `Final validation-set loss: ${valLoss.toFixed(4)}\n` +
      `Test-set loss: ${testLoss.toFixed(4)}`,
    modelName
  );
}
export function computeBaseline() {
  const avgPrice = tensors.trainTarget.mean();
  console.log(`Average price: ${avgPrice.dataSync()}`);
  const baseline = tensors.testTarget.sub(avgPrice).square().mean();
  console.log(`Baseline loss: ${baseline.dataSync()}`);
  const baselineMsg = `Baseline loss (meanSquaredError) is ${baseline.dataSync()[0].toFixed(2)}`;
  ui.updateBaselineStatus(baselineMsg);
}

async function DOMContentLoaded() {
  await bostonData.loadData();
  ui.updateStatus('Data loaded, converting to tensors');
  arraysToTensors();
  ui.updateStatus('Data is now available as tensors.\n' + 'Click a train button to begin.');
  // TODO Explain what baseline loss is. How it is being computed in this
  // Instance
  ui.updateBaselineStatus('Estimating baseline loss');
  computeBaseline();
  await ui.setup();
}

const BostonHousePrising = () => {
  useEffect(() => {
    DOMContentLoaded();
  }, []);
  return (
    <div className="tfjs-example-container centered-container">
      <section className="title-area">
        <h1>Multivariate Regression</h1>
        <p className="subtitle">Compare different models for housing price prediction.</p>
      </section>

      <section>
        <p className="section-head">Description</p>
        <p>
          This example shows you how to perform regression with more than one input feature using the
          <a href="https://www.cs.toronto.edu/~delve/data/boston/bostonDetail.html">Boston Housing Dataset</a>, which is
          a famous dataset derived from information collected by the U.S. Census Service concerning housing in the area
          of Boston Massachusetts.
        </p>
        <p>
          It allows you to compare the performance of 3 different models for predicting the house prices. When training
          the linear model, it will also display the largest 5 weights (by absolute value) of the model and the feature
          associated with each of those weights.
        </p>
      </section>

      <section>
        <p className="section-head">Status</p>
        <p id="status">Loading data...</p>
        <p id="baselineStatus">Baseline not computed...</p>
      </section>

      <section>
        <p className="section-head">Training Progress</p>
        <div className="with-cols">
          <div id="linear">
            <div className="chart"></div>
            <div className="status"></div>
            <div id="modelInspectionOutput">
              <p id="inspectionHeadline"></p>
              <table id="myTable"></table>
            </div>
          </div>
          <div id="oneHidden">
            <div className="chart"></div>
            <div className="status"></div>
          </div>
          <div id="twoHidden">
            <div className="chart"></div>
            <div className="status"></div>
          </div>
        </div>

        <div id="buttons">
          <div className="with-cols">
            <button id="simple-mlr">Train Linear Regressor</button>
            <button id="nn-mlr-1hidden">Train Neural Network Regressor (1 hidden layer)</button>
            <button id="nn-mlr-2hidden">Train Neural Network Regressor (2 hidden layers)</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BostonHousePrising;
