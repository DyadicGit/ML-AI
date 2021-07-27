import SteppedLearning from './stepped-learning';
import ParabolicPlot from './ParabolicPlot';
import cx from 'classnames';
import styles from './walk-through.module.scss';
import linRegMatrixMult from '../../images/LinR - matrix multiplication.png';
import linRegMatrixMultMulti from '../../images/LinR - matrix multiplication multivariate.png';
import mseFormula from '../../images/LinR - MSE formula.png';
import mseExpanded from '../../images/LinR - MSE with respect to X & C.png';
import slope from '../../images/LinR -slope of MSE using matrixes.png';
import matrixMultExplanation from '../../images/matrix multiplication explanation.png';
import { Tensor } from '@tensorflow/tfjs';

// const multSymbol = '&#215;'

// function gradientDescent(features: Tensor, labels: Tensor) {
//   const currentGuesses = features.matMul(this.weights);
//   const differences = currentGuesses.sub(labels);
//
//   const slopes = features.transpose().matMul(differences).div(features.shape[0]);
//
//   return this.weights.sub(slopes.mul(this.options.learningRate));
// }


const currentGuesses = '#fb3b02';
const differences = '#ff00fe';
const slopes = '#1e74fd';

const useImageCounter = () => {
  // ToDo: count clicks on image & change pictures accordingly
};

const LinearFormula = <p className={cx(styles.formula, styles.accentFormula)}>Y = mX + b</p>;
const WalkThrough = () => {
  return (
    <section className={styles.walkThroughPage}>
      {LinearFormula}
      <SteppedLearning />
      <ParabolicPlot />
      <img src={mseFormula} alt="mse formula" />
      <img src={mseExpanded} alt="mse formula with respect to X & C" />
      <img src={slope} alt="slope formula in matrix style" />
      <h2>calculate the Guess (Predicted value)</h2>
      <img src={linRegMatrixMult} alt="calculate the predicted value" />
      <h2>how matrix multiplication works</h2>
      <img src={matrixMultExplanation} alt="how matrix multiplication works" />
    </section>
  );
};

export default WalkThrough;
