import { FC } from "react";
import { Tab } from "./mdc";
import { useHistory } from "react-router-dom";

export { Tab, Tabs, TBody, TD, THC, THead, TR, Button, Table, TH } from './mdc'

// @ts-ignore
export type Of<T> = Parameters<T>['0'];

export const NavTab: FC<Of<typeof Tab> & { to: string }> = ({ to, ...rest }) => {
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
