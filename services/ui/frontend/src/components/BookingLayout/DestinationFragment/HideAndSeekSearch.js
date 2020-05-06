import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import BaseSearch from "components/common/BaseSearch";

import BeeLogo from "components/common/BeeLogo";

import styles from "./DestinationFragment.module.css";
import searchBarStyles from "./SearchBar.module.css";

const UncontrolledSearch = () => {
  const [active, setActive] = useState(false);

  const handleActivate = useCallback(() => {
    setActive(true);
    setTimeout(() => {
      document.getElementsByTagName("input")[0].focus();
    }, 300);
  }, []);

  const handleDeactivate = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <div className={styles.titlebar}>
      <Link to="/" className={active ? styles.homeLinkActive : styles.homeLink}>
        <BeeLogo className={styles.logoImage} />
        <div className={styles.logoText}>Bee Travels</div>
      </Link>
      <div
        className={
          active ? styles.searchIconWrapperActive : styles.searchIconWrapper
        }
      >
        <svg
          onClick={handleActivate}
          className={styles.searchIcon}
          focusable="false"
          width="32"
          height="32"
          viewBox="0 0 32 32"
        >
          <path d="M30,28.59,22.45,21A11,11,0,1,0,21,22.45L28.59,30ZM5,14a9,9,0,1,1,9,9A9,9,0,0,1,5,14Z"></path>
        </svg>
      </div>
      {active && (
        <BaseSearch theme={searchBarStyles} onBlur={handleDeactivate} />
      )}
    </div>
  );
};

export default UncontrolledSearch;
