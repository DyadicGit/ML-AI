import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavTab, Tabs } from './components';
import Home from './pages/home';
import OurData from './pages/our-data';
import WalkThrough from './pages/walk-through';
import BostonHousePrising from './pages/boston-house-prising';
import styles from './app.module.scss';

const App = () => (
  <Router>
    <main className={styles.main}>
      <h1 className="text-center text-3xl">Machine Learning for cars mpg</h1>

      <nav>
        <Tabs>
          <NavTab to="/">Home</NavTab>
          <NavTab to="/data">Data</NavTab>
          <NavTab to="/walk-through">Walk through</NavTab>
          <NavTab to="/boston-house-prising">Boston house prising</NavTab>
        </Tabs>
      </nav>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/data">
          <OurData />
        </Route>
        <Route path="/walk-through">
          <WalkThrough />
        </Route>
        <Route path="/boston-house-prising">
          <BostonHousePrising />
        </Route>
      </Switch>
    </main>
  </Router>
);

export default App;
