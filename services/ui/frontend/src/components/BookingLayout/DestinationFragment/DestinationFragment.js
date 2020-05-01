import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";

import BeeLogo from "components/common/BeeLogo";
import HideAndSeekSearch from "components/common/HideAndSeekSearch";

import styles from "./DestinationFragment.module.css";
import searchBarStyles from "./SearchBar.module.css";

const DEFAULT_ZOOM = 7;

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwcXVlc3QiLCJhIjoiY2Q2N2RlMmNhY2NiZTRkMzlmZjJmZDk0NWU0ZGJlNTMifQ.mPRiEubbajc6a5y9ISgydg";

const truncateText = (text) => {
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

const DestinationFragment = ({ destination }) => {
  const [mapbox, setMapbox] = useState(undefined);
  const [mapElement, setMapElement] = useState(undefined);

  useEffect(() => {
    if (mapElement !== undefined) {
      setMapbox(
        new mapboxgl.Map({
          container: mapElement,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [0, 0],
          zoom: DEFAULT_ZOOM,
        })
      );
    }
  }, [mapElement]);

  useEffect(() => {
    if (mapbox !== undefined && destination.lng && destination.lat) {
      mapbox.jumpTo({
        center: [destination.lng, destination.lat],
        zoom: DEFAULT_ZOOM,
      });
    }
  }, [destination.lat, destination.lng, mapbox]);

  const imageSrc = `api/v1/destinations/images/${destination.city}, ${destination.country}.jpg`;

  return (
    <>
      <HideAndSeekSearch theme={searchBarStyles} />
      {/* <div className={styles.titlebar}>
        <Link to="/" className={styles.homeLink}>
          <BeeLogo className={styles.logoImage} />
          <div className={styles.logoText}>Bee Travels</div>
        </Link>
       </div> */}
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
        <div className={styles.map} ref={setMapElement} />
      </div>
    </>
  );
};

export default DestinationFragment;
