import React from "react";
import ReactMapboxGl from "react-mapbox-gl";

import BeeLogo from "components/common/BeeLogo";

import styles from "./DestinationFragment.module.css";

const truncateText = text => {
  const firstSentenceRegex = /^(.*?)\. (?=[A-Z])/;
  const lastSentenceRegex = /(.*\.)(?: .*)$/;
  let trimmedDescription = text
    .replace(firstSentenceRegex, "")
    .substring(0, 150)
    .replace(lastSentenceRegex, "$1")
    .trim();

  // If the length is still 150, a sentence wasn't trimmed off the end.
  if (trimmedDescription.length < 120 || trimmedDescription.length === 150) {
    // Ellipsify...
    trimmedDescription =
      text
        .replace(firstSentenceRegex, "")
        .substring(0, 140)
        .trim() // remove pre/trailing whitespace
        .split(" ") // split into words
        .slice(0, -1) // remove the last word (removes partial words)
        .join(" ") + "...";
  }
  return trimmedDescription;
};

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoibWFwcXVlc3QiLCJhIjoiY2Q2N2RlMmNhY2NiZTRkMzlmZjJmZDk0NWU0ZGJlNTMifQ.mPRiEubbajc6a5y9ISgydg"
});

const DestinationFragment = ({ destination }) => {
  const imageSrc = `/images/${destination.city}, ${destination.country}.jpg`;
  return (
    <>
      <div className={styles.titlebar}>
        <BeeLogo className={styles.logoImage} />
        <div className={styles.logoText}>Bee Travels</div>
        <svg
          className={styles.searchIcon}
          focusable="false"
          width="32"
          height="32"
          viewBox="0 0 32 32"
        >
          <path d="M30,28.59,22.45,21A11,11,0,1,0,21,22.45L28.59,30ZM5,14a9,9,0,1,1,9,9A9,9,0,0,1,5,14Z"></path>
        </svg>
      </div>
      <div className={styles.content}>
        <h1>{destination.city}</h1>

        <p>{truncateText(destination.description)}</p>

        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src={imageSrc}
            alt={destination.city + ", " + destination.country}
          />
          <img
            className={styles.image}
            src={imageSrc}
            alt={destination.city + ", " + destination.country}
          />
          <img
            className={styles.image}
            src={imageSrc}
            alt={destination.city + ", " + destination.country}
          />
        </div>
        <Map
          style="mapbox://styles/mapbox/streets-v9"
          zoom={[7]}
          containerStyle={{
            height: "261px",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0
          }}
          center={{
            lng: destination.lng,
            lat: destination.lat
          }}
        ></Map>
      </div>
    </>
  );
};

export default DestinationFragment;
