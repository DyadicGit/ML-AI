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
import derivativeIsSlope from '../../images/derivative_is_a_slope.png';
import gdImperative from '../../images/gradient-descent fun imperative.png';
import gdImperativeCurrentGuess from '../../images/gradient-descent fun imperative-current_guesses.png';
import gdImperativeDiff from '../../images/gradient-descent fun imperative-differences.png';
import gdImperativeSlope from '../../images/gradient-descent fun imperative-slopes.png';
import gdVectorized from '../../images/gradient-descent fun vectorized.png';
import mseExpandedCurrentGuess from '../../images/LinR - MSE with respect to X & C-current gueses.png';
import mseExpandedDiff from '../../images/LinR - MSE with respect to X & C-differences.png';
import mseExpandedSlope from '../../images/LinR - MSE with respect to X & C-slopes.png';
import { useState } from 'react';
import WithModel from "./with-model";

// const multSymbol = '&#215;'

// weights is a tensor/matrix of shape [1,1] with zeros
/*let weights = // | 0 |
              // | 0 |
function gradientDescent(features: Tensor, labels: Tensor) {
  const currentGuesses = features.matMul(weights);
  const differences = currentGuesses.sub(labels);

  const slopes = features.transpose().matMul(differences).div(features.shape[0]);

  return weights.sub(slopes.mul(LEARINING_RATE));
}

let LEARINING_RATE: number = 0.01;
let m: number = 0;
let b: number = 0;

type Features = Array<{ quadrature: number; age: number }>;
type Labels = Array<{ price: number }>;

function gradientDescent(features: Features, labels: Labels) {
  const currentGuessesForFeatureHousePrice = features.map((row) => {
    return m * row.quadrature + b;
  })
  const bSlope = (_.sum(currentGuessesForFeatureHousePrice.map((guess, i) => {
    return guess - labels[i].price;
  })) * 2) / features.length
  const mSlope = (_.sum(currentGuessesForFeatureHousePrice.map((guess, i) => {
    return features[i].quadrature * (guess - labels[i].price);
  })) * 2) / features.length

  // updating coefficients
  b = b - bSlope * LEARINING_RATE
  m = m - mSlope * LEARINING_RATE
}*/

const color = {
  currentGuesses: '#fb3b02',
  differences: '#ff00fe',
  slopes: '#1e74fd',
};

type ImageData = {
  description: { text: string; color: string };
  mse: { src: string; alt: string };
  code: { src: string; alt: string };
};
const ImageMSE = () => {
  const init: ImageData = {
    description: { text: '', color: 'black' },
    mse: { src: mseExpanded, alt: 'mse formula with respect to X & C' },
    code: { src: gdImperative, alt: 'imperative version of gradient descent' },
  };
  const [counter, setCounter] = useState(1);
  const [data, setData] = useState<ImageData>(init);
  const onClick = () => {
    switch (counter) {
      case 0:
        setData(init);
        setCounter(1);
        break;
      case 1:
        setData({
          description: { text: 'calculate the Guess (Predicted value)', color: color.currentGuesses },
          mse: { src: mseExpandedCurrentGuess, alt: 'mse formula with respect to X & C - marked current guesses' },
          code: { src: gdImperativeCurrentGuess, alt: 'imperative version of gradient descent' },
        });
        setCounter(2);
        break;
      case 2:
        setData({
          description: { text: 'calculate the difference', color: color.differences },
          mse: { src: mseExpandedDiff, alt: 'mse formula with respect to X & C - marked differences' },
          code: { src: gdImperativeDiff, alt: 'imperative version of gradient descent - marked differences' },
        });
        setCounter(3);
        break;
      case 3:
        setData({
          description: { text: 'calculate the slope', color: color.slopes },
          mse: { src: mseExpandedSlope, alt: 'mse formula with respect to X & C - marked slopes' },
          code: { src: gdImperativeSlope, alt: 'imperative version of gradient descent - marked slopes' },
        });
        setCounter(0);
        break;
    }
  };

  return (
    <>
      <h2>updating coefficients m & b</h2>
      <h3 style={{ color: data.description.color }}>{data.description.text}</h3>
      <img src={data.mse.src} alt={data.mse.alt} onClick={onClick} />
      <h2>Gradient Descent in code with vanilla JS</h2>
      <h3 style={{ color: data.description.color }}>{data.description.text}</h3>
      <img src={data.code.src} alt={data.code.alt} onClick={onClick} />
    </>
  );
};

const LinearFormula = <p className={cx(styles.formula, styles.accentFormula)}>Y = mX + b</p>;
const WalkThrough = () => {
  return (
    <section className={styles.walkThroughPage}>
      {LinearFormula}
      <SteppedLearning />
      <img src={derivativeIsSlope} alt="derivative of a parabolic equation" />
      <ParabolicPlot />
      <img src={mseFormula} alt="mse formula" />
      <ImageMSE />
      <h2>Vectorized version of calculating coefficients m & b</h2>
      <img src={slope} alt="slope formula in matrix style" />
      <h2>Vectorized version of code with TensorFlow.js</h2>
      <img src={gdVectorized} alt="vectorized version of gradient descent in code" />
      <h2>Why matrices?</h2>
      <h3>
        remember the <span style={{ color: color.currentGuesses }}>Current Guess mx+b</span> formula
      </h3>
      <img src={linRegMatrixMult} alt="calculate the predicted value" />
      <h2>how matrix multiplication works</h2>
      <img src={matrixMultExplanation} alt="how matrix multiplication works" />
      <aside>
        <h3>capabilities of TensorFlow</h3>
        <ul>
          <li><a href="https://codepen.io/topic/tensorflow/picks">CODEPEN: Tensorflow examples</a></li>
        </ul>
      </aside>
      <WithModel/>
    </section>
  );
};

export default WalkThrough;
