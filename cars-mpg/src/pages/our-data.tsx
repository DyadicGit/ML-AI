import { Table, TBody, TD, THC, THead, TR } from '../components';
import { Car } from '../types';
import carsJson from '../data/cars.json';

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

export default OurData;
