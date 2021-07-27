import SteppedLearning from './stepped-learning';
import ParabolicPlot from './ParabolicPlot';
import styles from './walk-through.module.scss';

const WalkThrough = () => {
  return (
    <section className={styles.walkThroughPage}>
      <SteppedLearning />
      <ParabolicPlot />
    </section>
  );
};

export default WalkThrough;
