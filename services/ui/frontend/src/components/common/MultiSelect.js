import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import SvgIcon from "@material-ui/core/SvgIcon";
import Box from "@material-ui/core/Box";

import styles from "./MultiSelect.module.css";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    width: "100%",
    // maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  smallFont: {
    fontSize: 12,
  },
}));

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  anchorReference: "",
  PaperProps: {
    elevation: 4,
    style: {
      maxHeight: ITEM_HEIGHT * 9.5 + ITEM_PADDING_TOP,
      borderRadius: 0,
      backgroundColor: "#f4f4f4",
    },
  },
  MenuListProps: {
    style: {
      padding: ITEM_PADDING_TOP,
    },
  },
};

const inputProps = {
  "aria-label": "Without label",
};

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

const CustomSelect = withStyles((theme) => ({
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
}))(Select);

const CustomMenuItem = withStyles((theme) => ({
  root: {
    height: ITEM_HEIGHT,
    // padding: 0,
    borderTop: "1px solid #e0e0e0",
    padding: "0 16px",
    "&:first-of-type": {
      borderTop: "transparent",
    },
  },
}))(MenuItem);

// const CustomBox = withStyles((theme) => ({
//   root: {
//     display: "flex",
//     borderTop: "1px solid #e0e0e0",
//     margin: "0 16px",
//     width: "auto",
//     // "&:first-of-type": {
//     //   borderTop: "transparent",
//     // },
//   },
// }))(Box);

const CustomCheckbox = withStyles((theme) => ({
  checked: {},
  root: {
    padding: 0,
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&$checked": {
      "&:hover": {
        backgroundColor: "transparent",
        "@media (hover: none)": {
          backgroundColor: "transparent",
        },
      },
    },
  },
}))(Checkbox);

const CustomChip = withStyles((theme) => ({
  root: {
    height: 24,
    backgroundColor: "#393939",
    color: "#fff",
    margin: 0,
    pointerEvents: "auto",
    marginRight: 10,
    padding: "0 2px 0 0",
    "&:hover, &:focus": {
      color: "#fff",
      backgroundColor: "#393939",
    },
    "&:active": {
      color: "#fff",
      backgroundColor: "#393939",
    },
  },
  deleteIcon: {
    color: "#fff",
    width: 20,
    height: 20,
    padding: 2,
    margin: 0,
    borderRadius: "50%",
    "&:hover, &:focus": {
      color: "#fff",
      backgroundColor: "#4c4c4c",
    },
    "&:active": {
      color: "#fff",
      boxShadow: "inset 0 0 0 2px #fff",
    },
  },
  label: {
    fontSize: 12,
    lineHeight: 12,
    paddingLeft: 8,
    paddingRight: 4,
  },
}))(Chip);

function DoneIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16">
      <path d="M12 4.7L11.3 4 8 7.3 4.7 4 4 4.7 7.3 8 4 11.3 4.7 12 8 8.7 11.3 12 12 11.3 8.7 8z"></path>
    </SvgIcon>
  );
}

function CheckedIcon(props) {
  return (
    <div
      style={{
        content: "",
        width: "16px",
        height: "16px",
        margin: "2px",
        position: "relative",
        border: "1px solid #161616",
        borderRadius: "1px",
        backgroundColor: "#161616",
      }}
    >
      <div
        style={{
          content: "",
          position: "absolute",
          left: "3px",
          top: "3px",
          width: ".5625rem",
          height: ".3125rem",
          background: "none",
          borderLeft: "2px solid #fff",
          borderBottom: "2px solid #fff",
          transform: "scale(1) rotate(-45deg)",
          transformOrigin: "bottom right",
          marginTop: " -.1875rem",
        }}
      />
    </div>
  );
}

function UncheckedIcon(props) {
  return (
    <div
      style={{
        content: "",
        width: "16px",
        height: "16px",
        margin: "2px",
        position: "relative",
        border: "1px solid #161616",
        borderRadius: "1px",
        backgroundColor: "transparent",
      }}
    />
  );
}

function ArrowDropDown(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16">
      <path d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z" />
    </SvgIcon>
  );
}

const MultiSelect = ({ label, list, selected, onSelected }) => {
  const classes = useStyles();

  const deselectAll = () => {
    onSelected([]);
  };

  const handleSelect = (e) => {
    onSelected(e.target.value);
  };

  return (
    <FormControl className={classes.formControl}>
      <div
        style={{
          zIndex: 10,
          position: "absolute",
          padding: "0 48px 0 16px",
          display: "flex",
          alignItems: "center",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {selected.length > 0 && (
          <CustomChip
            deleteIcon={<DoneIcon />}
            label={selected.length}
            className={classes.chip}
            onDelete={deselectAll}
          />
        )}
        {label}
      </div>

      <CustomSelect
        multiple
        displayEmpty
        value={selected}
        onChange={handleSelect}
        input={<CustomInput />}
        IconComponent={ArrowDropDown}
        renderValue={() => {}}
        MenuProps={MenuProps}
        inputProps={inputProps}
      >
        {list.map((name) => (
          <div key={name} value={name} className={styles.itemWrap}>
            <div key={name} value={name} className={styles.item}>
              <CustomCheckbox
                checkedIcon={<CheckedIcon />}
                icon={<UncheckedIcon />}
                checked={selected.indexOf(name) > -1}
              />
              <div className={styles.label}>{name}</div>
            </div>
          </div>
        ))}
      </CustomSelect>
    </FormControl>
  );
};

export default MultiSelect;
