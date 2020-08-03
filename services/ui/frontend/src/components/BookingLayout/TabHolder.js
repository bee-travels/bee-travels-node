import React, { useState, useEffect } from "react";

import styles from "./TabHolder.module.css";
import globalHistory from "globalHistory";

const TabHolder = ({ children, onClick, location }) => {
  const [tabs, setTabs] = useState([]);
  const [tabsPath, setTabsPath] = useState([]);
  const [_0, _1, _2, _3, theTab] = location.pathname.split("/");

  let active;
  if (!theTab) {
    active = tabsPath[0];
  } else {
    active = theTab;
  }

  useEffect(() => {
    const check = async () => {
      const hotelResponse = await fetch("/check/hotels");
      const carResponse = await fetch("/check/cars");
      const flightResponse = await fetch("/check/flights");

      let possibleTabs = [];
      let possiblePaths = [];
      if (hotelResponse.status === 200) {
        possibleTabs.push("Hotels");
        possiblePaths.push("hotels");
      }
      if (carResponse.status === 200) {
        possibleTabs.push("Cars");
        possiblePaths.push("cars");
      }
      if (flightResponse.status === 200) {
        possibleTabs.push("Flights");
        possiblePaths.push("flights");
      }
      setTabs(possibleTabs);
      setTabsPath(possiblePaths);
    };
    check();
  }, []);

  console.log(location);

  return (
    <div>
      <div className={styles.tabRow}>
        {tabs.map((tab, i) => (
          <div
            key={i}
            className={
              tab.toLowerCase() === active ? styles.tabActive : styles.tab
            }
            onClick={() => {
              globalHistory.push(
                `/destinations/${_2}/${_3}/${tabsPath[i]}${location.search}`
              );
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
