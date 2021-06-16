import React from 'react';
import { Button, DataTable, Tabs, Tab, TBody, TD, TH, THC, THead, TR } from './components';
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

const Main = () => (
  <main className={styles.main}>
    <h1 className="text-center text-3xl">Machine Learning for cars mpg</h1>
    <nav>
      <Tabs>
        <Tab>label1</Tab>
        <Tab active>label2</Tab>
      </Tabs>
    </nav>
    <section>
      <DataTable aria-label="Dessert calories">
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
      </DataTable>
    </section>
    <Button>click me</Button>
  </main>
);

export default Main;