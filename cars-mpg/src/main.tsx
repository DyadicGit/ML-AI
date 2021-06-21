import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavTab, Tabs } from './components';
import Home from './pages/home';
import OurData from './pages/our-data';
import styles from './main.module.scss';

const Main = () => (
  <Router>
    <main className={styles.main}>
      <h1 className="text-center text-3xl">Machine Learning for cars mpg</h1>

      <nav>
        <Tabs>
          <NavTab to="/">Home</NavTab>
          <NavTab to="/data">Data</NavTab>
        </Tabs>
      </nav>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/data">
          <OurData />
        </Route>
      </Switch>
    </main>
  </Router>
);

export default Main;
