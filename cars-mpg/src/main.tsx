import React from "react";
import styles from './main.module.scss';
import { Button, DataTable } from "./components";

const Main = () => (
  <main className={styles.main}>
    <h1 className="text-center text-3xl">Machine Learning for cars mpg</h1>
    <section>
        <DataTable aria-label="Dessert calories"/>
    </section>
      <Button>click me</Button>
  </main>
);

export default Main;
