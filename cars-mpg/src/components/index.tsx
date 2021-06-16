import { useMDCInit } from '../utils';
import { MDCDataTable } from '@material/data-table';
import { MDCRipple } from '@material/ripple';
import cx from 'classnames';
import './components.scss';
import {
  ButtonHTMLAttributes,
  FC,
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

const THead: FC<HTMLAttributes<HTMLTableRowElement>> = ({ children, className, ...rest }) => (
  <thead>
    <tr className={cx('mdc-data-table__header-row', className)} {...rest}>
      {children}
    </tr>
  </thead>
);

const THC: FC<ThHTMLAttributes<HTMLTableHeaderCellElement>> = ({ children, className, ...rest }) => (
  <th className={cx('mdc-data-table__header-cell', className)} role="columnheader" scope="col" {...rest}>
    {children}
  </th>
);
const TH: FC<ThHTMLAttributes<HTMLTableHeaderCellElement>> = ({ children, className, ...rest }) => (
  <th className={cx('mdc-data-table__cell', className)} {...rest}>
    {children}
  </th>
);
const TBody: FC<HTMLAttributes<HTMLTableSectionElement>> = ({ children, className, ...rest }) => (
  <tbody className="mdc-data-table__content" {...rest}>
    {children}
  </tbody>
);

const TR: FC<HTMLAttributes<HTMLTableRowElement>> = ({ children, className, ...rest }) => (
  <tr className="mdc-data-table__row" {...rest}>
    {children}
  </tr>
);

const TD: FC<TdHTMLAttributes<HTMLTableDataCellElement>> = ({ children, className, ...rest }) => (
  <td className={cx('mdc-data-table__cell', className)} {...rest}>
    {children}
  </td>
);

export const DataTable: FC<TableHTMLAttributes<HTMLTableElement>> = ({ children, className, ...rest }) => {
  const [, initialize] = useMDCInit(MDCDataTable);

  return (
    <div className={cx('mdc-data-table', className)} ref={initialize}>
      <div className="mdc-data-table__table-container">
        <table className="mdc-data-table__table" {...rest}>
          <THead>
            <THC>Dessert</THC>
            <THC className="mdc-data-table__header-cell--numeric">Carbs (g)</THC>
            <THC className="mdc-data-table__header-cell--numeric">Protein (g)</THC>
            <THC>Comments</THC>
          </THead>
          <TBody>
            <TR>
              <TH scope="row">Frozen yogurt</TH>
              <TD className="mdc-data-table__cell--numeric">24</TD>
              <TD className="mdc-data-table__cell--numeric">4.0</TD>
              <TD>Super tasty</TD>
            </TR>
          </TBody>
        </table>
      </div>
    </div>
  );
};

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...rest }) => {
  const [, initialize] = useMDCInit(MDCRipple);

  return (
    <div ref={initialize} className={cx('mdc-touch-target-wrapper', className)}>
      <button className="mdc-button mdc-button--touch" {...rest}>
        <span className="mdc-button__ripple" />
        <span className="mdc-button__label">{children}</span>
        <span className="mdc-button__touch" />
      </button>
    </div>
  );
};
