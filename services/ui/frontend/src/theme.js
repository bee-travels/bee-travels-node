import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

import "./fonts.css";

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0f62fe",
    },
    secondary: {
      main: "#ff0000",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    fontFamily: [
      "ibm-plex-sans",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});

export default theme;
