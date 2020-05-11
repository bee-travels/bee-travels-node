import React from "react";

import BaseSearch from "components/common/BaseSearch";

import searchBarStyles from "./SearchBar.module.css";

const HomeSearch = () => {
  return (
    <div
      style={{
        margin: " 23px 42px",
        width: "584px",
        maxWidth: "calc(100% - 2 * 42px)",
        position: "relative",
      }}
    >
      <svg
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        aria-hidden="true"
        style={{
          color: "rgb(22, 22, 22)",
          position: "absolute",
          left: "24px",
          top: "24px",
          height: "20px",
          width: "20px",
          transform: "translate(-50%, -50%)",
        }}
        // class="bx--search-magnifier"
        // style="will-change: transform;"
      >
        <path d="M15,14.3L10.7,10c1.9-2.3,1.6-5.8-0.7-7.7S4.2,0.7,2.3,3S0.7,8.8,3,10.7c2,1.7,5,1.7,7,0l4.3,4.3L15,14.3z M2,6.5	C2,4,4,2,6.5,2S11,4,11,6.5S9,11,6.5,11S2,9,2,6.5z"></path>
      </svg>
      <BaseSearch theme={searchBarStyles} />
    </div>
  );
};

export default HomeSearch;
