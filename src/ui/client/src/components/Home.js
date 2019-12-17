import React from "react";
import BeeLogo from "./BeeLogo";
import UncontrolledSearch from "./UncontrolledSearch";

import styles from "./Home.module.css";

const Home = () => (
  <div
    style={{
      alignItems: "center",
      display: "flex",
      flexDirection: "column"
    }}
  >
    <div
      style={{
        margin: "156px 42px 23px 42px",
        justifyContent: "center",
        width: "584px",
        fontSize: "40px",
        fontWeight: "500",
        lineHeight: "40px",
        display: "flex"
      }}
    >
      <BeeLogo
        style={{
          position: "relative",
          top: "-11px",
          left: "-19px",
          width: "110px",
          transform: "rotate(-45deg)"
        }}
      />
      <div
        style={{
          position: "relative",
          top: "-7px",
          left: "-8px"
        }}
      >
        <div>Bee</div>
        <div>Travels</div>
        <div
          style={{
            background: "#0f62fe",
            height: "10px",
            marginTop: "5px"
          }}
        />
      </div>
    </div>
    <UncontrolledSearch theme={styles} />
  </div>
);

export default Home;
