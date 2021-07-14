import {
  ButtonHTMLAttributes,
  FC,
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';
import { MDCDataTable } from '@material/data-table';
import { MDCRipple } from '@material/ripple';
import { MDCTabBar } from '@material/tab-bar';
import cx from 'classnames';
import './mdc.scss';

import { MutableRefObject, useCallback, useRef } from 'react';

export const useMDCInit = (Component: any) => {
  const mdc: MutableRefObject<any> = useRef();
  const ref = useCallback(
    (element) => {
      if (element) {
        element.classList.remove('mdc---nojs');
        Array.from(
          element.querySelectorAll('.mdc-notched-outline--notched, .mdc-floating-label--float-above')
        ).forEach((element: any) =>
          element.classList.remove('mdc-notched-outline--notched', 'mdc-floating-label--float-above')
        );
        mdc.current = new Component(element);
      } else {
        mdc.current.destroy();
      }
    },
    [mdc, Component]
  );

  return [mdc, ref];
};

export const THead: FC<HTMLAttributes<HTMLTableRowElement>> = ({ children, className, ...rest }) => (
  <thead>
    <tr className={cx('mdc-data-table__header-row', className)} {...rest}>
      {children}
    </tr>
  </thead>
);

export const THC: FC<ThHTMLAttributes<HTMLTableHeaderCellElement>> = ({ children, className, ...rest }) => (
  <th className={cx('mdc-data-table__header-cell', className)} role="columnheader" scope="col" {...rest}>
    {children}
  </th>
);
export const TH: FC<ThHTMLAttributes<HTMLTableHeaderCellElement>> = ({ children, className, ...rest }) => (
  <th className={cx('mdc-data-table__cell', className)} {...rest}>
    {children}
  </th>
);
export const TBody: FC<HTMLAttributes<HTMLTableSectionElement>> = ({ children, className, ...rest }) => (
  <tbody className="mdc-data-table__content" {...rest}>
    {children}
  </tbody>
);

export const TR: FC<HTMLAttributes<HTMLTableRowElement>> = ({ children, className, ...rest }) => (
  <tr className="mdc-data-table__row" {...rest}>
    {children}
  </tr>
);

export const TD: FC<TdHTMLAttributes<HTMLTableDataCellElement>> = ({ children, className, ...rest }) => (
  <td className={cx('mdc-data-table__cell', className)} {...rest}>
    {children}
  </td>
);

export const Table: FC<TableHTMLAttributes<HTMLTableElement>> = ({ children, className, ...rest }) => {
  const [, initialize] = useMDCInit(MDCDataTable);

  return (
    <div className={cx('mdc-data-table', className)} ref={initialize}>
      <div className="mdc-data-table__table-container">
        <table className="mdc-data-table__table" {...rest}>
          {children}
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

type TabsType = FC<HTMLAttributes<HTMLDivElement>>;
export const Tabs: TabsType = ({ children, className, ...rest }) => {
  const [, initialize] = useMDCInit(MDCTabBar);
  return (
    <div ref={initialize} className={cx('mdc-tab-bar', className)} role="tablist" {...rest}>
      <div className="mdc-tab-scroller">
        <div className="mdc-tab-scroller__scroll-area">
          <div className="mdc-tab-scroller__scroll-content">{children}</div>
        </div>
      </div>
    </div>
  );
};

type TabType = FC<ButtonHTMLAttributes<HTMLButtonElement> & { label?: string; active?: boolean }>;
export const Tab: TabType = ({ label, active, children, className, ...rest }) => (
  <button
    className={cx('mdc-tab', active && 'mdc-tab--active', className)}
    role="tab"
    aria-selected="true"
    tabIndex={0}
    {...rest}
  >
    <span className="mdc-tab__content">
      <span className="mdc-tab__icon material-icons" aria-hidden="true">
        {children}
      </span>
      <span className="mdc-tab__text-label">{label}</span>
    </span>
    <span className={cx('mdc-tab-indicator', active && 'mdc-tab-indicator--active')}>
      <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline" />
    </span>
    <span className="mdc-tab__ripple" />
  </button>
);
