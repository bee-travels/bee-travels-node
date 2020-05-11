import React from "react";
import BeeLogo from "components/common/BeeLogo";
import HomeSearch from "./HomeSearch";

import styles from "./HomeLayout.module.css";

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

    <HomeSearch />
  </div>
);

export default Home;
