import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    width: '100%',
    // maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const inputProps = {
  "aria-label": "Without label",
};

const MultiSelect = ({ label, list, selected, onSelected }) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <Select
        multiple
        displayEmpty
        value={selected}
        onChange={onSelected}
        input={<Input />}
        renderValue={(selected) => (
          <>
            <Chip label={selected.length} className={classes.chip} />
            <span>{label}</span>
          </>
        )}
        MenuProps={MenuProps}
        inputProps={inputProps}
      >
        {list.map((name) => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={selected.indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
