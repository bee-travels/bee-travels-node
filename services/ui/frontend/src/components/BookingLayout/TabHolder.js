import React, { useState } from "react";

import styles from "./TabHolder.module.css";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import globalHistory from "globalHistory";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const TabHolder = ({ children, onClick, location, dateTo, dateFrom, setDateTo, setDateFrom }) => {
  const tabs = ["Hotels", "Cars", "Flights"];
  const tabsPath = ["hotels", "cars", "flights"];
  const [_0, _1, _2, _3, theTab] = location.pathname.split("/");

  let active;
  if (!theTab) {
    active = "hotels";
  } else {
    active = theTab;
  }

  const handleFromDateChange = (e) => {
    setDateFrom(e.target.value);
  };

  const handleToDateChange = (e) => {
    setDateTo(e.target.value);
  };

  const classes = useStyles();

  return (
    <div>
      <form className={classes.container} noValidate>
        <TextField
          id="fromDate"
          label="Date From"
          type="date"
          value={dateFrom}
          className={classes.textField}
          onChange={handleFromDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="toDate"
          label="Date To"
          type="date"
          value={dateTo}
          className={classes.textField}
          onChange={handleToDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
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
