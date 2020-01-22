import React from "react";
import BeeLogo from "./BeeLogo";
import UncontrolledSearch from "./UncontrolledSearch";

import styles from "./Home.module.css";
import searchBarStyles from "./SearchBar.module.css";

const Home = () => (
  <div className={styles.wrapper}>
    <div className={styles.logo}>
      <BeeLogo className={styles.logoImage} />
      <div className={styles.logoText}>
        <div>Bee</div>
        <div>Travels</div>
        <div className={styles.logoUnderline} />
      </div>
    </div>
    <UncontrolledSearch theme={searchBarStyles} />
  </div>
);

export default Home;
