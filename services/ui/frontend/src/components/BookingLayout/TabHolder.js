import React, { useState } from "react";

import styles from "./TabHolder.module.css";

import globalHistory from "globalHistory";

const TabHolder = ({ children, onClick, location }) => {
  const tabs = ["Hotels", "Cars"];
  const tabsPath = ["hotels", "cars"];
  const [_0, _1, _2, _3, theTab] = location.pathname.split("/");

  let active;
  if (!theTab) {
    active = "hotels";
  } else {
    active = theTab;
  }

  return (
    <div>
      <div className={styles.tabRow}>
        {tabs.map((tab, i) => (
          <div
            className={
              tab.toLowerCase() === active ? styles.tabActive : styles.tab
            }
            onClick={() => {
              globalHistory.push(`/destinations/${_2}/${_3}/${tabsPath[i]}`);
            }}
          >
            {tab}
          </div>
        ))}
      </div>
      {children[tabsPath.indexOf(active)]}
    </div>
  );
};

export default TabHolder;
