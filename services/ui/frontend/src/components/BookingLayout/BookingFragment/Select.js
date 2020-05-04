import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import Input from "@material-ui/core/Input";
import SvgIcon from "@material-ui/core/SvgIcon";

const CustomInput = withStyles((theme) => ({
  input: {
    backgroundColor: "#e0e0e0",
    "&:hover:not($disabled)": {
      backgroundColor: "#e5e5e5",
    },
  },
  underline: {
    "&:after": {
      border: `2px solid ${theme.palette.primary.main}`,
      left: 0,
      bottom: 0,
      top: 0,
      // Doing the other way around crash on IE 11 "''" https://github.com/cssinjs/jss/issues/242
      content: '""',
      position: "absolute",
      right: 0,
      transition: "none",
      transform: "scaleX(0)",
      pointerEvents: "none", // Transparent to the hover style.
    },
    "&:before": {
      display: `none`,
    },
  },
}))(Input);

const CustomNativeSelect = withStyles((theme) => ({
  select: {
    fontSize: 14,
    height: "40px",
    padding: "0 0 0 16px",
    "&&": {
      paddingRight: "48px",
    },
    "&:focus": {
      backgroundColor: "#e0e0e0",
    },
  },
  icon: {
    // We use a position absolute over a flexbox in order to forward the pointer events
    // to the input and to support wrapping tags..
    width: 16,
    height: 16,
    position: "absolute",
    right: 16,
    top: "calc(50% - 8px)", // Center vertically
    pointerEvents: "none", // Don't block pointer events on the select under the icon.
    color: theme.palette.action.active,
    "&$disabled": {
      color: theme.palette.action.disabled,
    },
  },
}))(NativeSelect);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(0),
  },
}));

function ArrowDropDown(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16">
      <path d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z" />
    </SvgIcon>
  );
}

export default function CustomizedSelects({ list, selected, onSelected }) {
  const classes = useStyles();
  return (
    <div>
      <FormControl className={classes.margin}>
        <CustomNativeSelect
          value={selected}
          onChange={onSelected}
          input={<CustomInput />}
          IconComponent={ArrowDropDown}
        >
          {list.map((l) => (
            <option value={l}>{l}</option>
          ))}
        </CustomNativeSelect>
      </FormControl>
    </div>
  );
}
