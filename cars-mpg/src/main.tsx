import { FC } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { Button, Table, Tab, Tabs, TBody, TD, THC, THead, TR } from './components';
import carsJson from './data/cars.json';
import styles from './main.module.scss';

type Car = {
  passedemissions: string;
  mpg: number;
  cylinders: number;
  displacement: number;
  horsepower: number;
  weight: number;
  acceleration: number;
  modelyear: number;
  carname: string;
};

// @ts-ignore
type Of<T> = Parameters<T>['0'];

const NavTab: FC<Of<typeof Tab> & { to: string }> = ({ to, ...rest }) => {
  const history = useHistory();
  return (
    <Tab
      {...rest}
      onClick={() => {
        history.push(to);
      }}
      active={history.location.pathname === to}
    />
  );
};

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

const Home = () => (
  <section>
    <Button>click me</Button>
  </section>
);

const OurData = () => (
  <section>
    <Table aria-label="our diagnosis data - cars">
      <THead>
        <THC>passedemissions</THC>
        <THC className="mdc-data-table__header-cell--numeric">mpg</THC>
        <THC className="mdc-data-table__header-cell--numeric">cylinders</THC>
        <THC className="mdc-data-table__header-cell--numeric">displacement</THC>
        <THC className="mdc-data-table__header-cell--numeric">horsepower</THC>
        <THC className="mdc-data-table__header-cell--numeric">weight</THC>
        <THC className="mdc-data-table__header-cell--numeric">acceleration</THC>
        <THC className="mdc-data-table__header-cell--numeric">modelyear</THC>
        <THC>carname</THC>
      </THead>
      <TBody>
        {(carsJson as Car[]).map((car, index) => (
          <TR key={index}>
            <TD>{car.passedemissions}</TD>
            <TD className="mdc-data-table__cell--numeric">{car.mpg}</TD>
            <TD className="mdc-data-table__cell--numeric">{car.cylinders}</TD>
            <TD className="mdc-data-table__cell--numeric">{car.displacement}</TD>
            <TD className="mdc-data-table__cell--numeric">{car.horsepower}</TD>
            <TD className="mdc-data-table__cell--numeric">{car.weight}</TD>
            <TD className="mdc-data-table__cell--numeric">{car.acceleration}</TD>
            <TD className="mdc-data-table__cell--numeric">{car.modelyear}</TD>
            <TD>{car.carname}</TD>
          </TR>
        ))}
      </TBody>
    </Table>
  </section>
);

export default Main;
