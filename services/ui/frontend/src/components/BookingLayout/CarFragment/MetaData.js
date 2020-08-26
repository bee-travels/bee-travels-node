import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";

import styles from "./CarFragment.module.css";
import { useActions } from "redux/actions";
import { useSelector } from "react-redux";

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

const MetaData = () => {
  const cars = useSelector((state) => state.carFilters);
  const { setFilters } = useActions();
  const classes = useStyles();

  const handleFromDateChanged = (e) => {
    setFilters({
      service: "carFilters",
      filter: "dateFrom",
      value: e.target.value,
    });
  };

  const handleToDateChanged = (e) => {
    setFilters({
      service: "carFilters",
      filter: "dateTo",
      value: e.target.value,
    });
  };

  return (
    <div className={styles.filters}>
      <TextField
        id="fromDate"
        label="Date From"
        type="date"
        value={cars.dateFrom}
        onChange={handleFromDateChanged}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="toDate"
        label="Date To"
        type="date"
        value={cars.dateTo}
        onChange={handleToDateChanged}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
  );
};

export default MetaData;
