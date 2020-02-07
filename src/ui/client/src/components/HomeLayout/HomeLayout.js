import React from "react";
import BeeLogo from "components/common/BeeLogo";
import UncontrolledSearch from "components/common/UncontrolledSearch";

import styles from "./HomeLayout.module.css";
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
