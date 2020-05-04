import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import HideAndSeekSearch from "components/common/HideAndSeekSearch";

import styles from "./DestinationFragment.module.css";
import searchBarStyles from "./SearchBar.module.css";

const DEFAULT_ZOOM = 7;

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwcXVlc3QiLCJhIjoiY2Q2N2RlMmNhY2NiZTRkMzlmZjJmZDk0NWU0ZGJlNTMifQ.mPRiEubbajc6a5y9ISgydg";

const imageBase = "/api/v1/destinations/images";
const normalizeDestinationName = (country, city) => {
  return `${city
    .toLowerCase()
    .replace(" ", "-")}-${country.toLowerCase().replace(" ", "-")}`;
};

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

const DestinationFragment = ({
  latitude,
  longitude,
  description,
  city,
  country,
  cityName,
  countryName,
}) => {
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
    if (mapbox !== undefined && longitude && latitude) {
      mapbox.jumpTo({
        center: [longitude, latitude],
        zoom: DEFAULT_ZOOM,
      });
    }
  }, [latitude, longitude, mapbox]);

  return (
    <>
      <HideAndSeekSearch theme={searchBarStyles} />

      <div className={styles.content}>
        <h1>{cityName}</h1>

        <p>{truncateText(description)}</p>

        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src={`${imageBase}/destination-${city}-${country}-001.jpg`}
            alt={cityName + ", " + countryName}
          />
          <img
            className={styles.image}
            src={`${imageBase}/destination-${city}-${country}-002.jpg`}
            alt={cityName + ", " + countryName}
          />
          <img
            className={styles.image}
            src={`${imageBase}/destination-${city}-${country}-003.jpg`}
            alt={cityName + ", " + countryName}
          />
        </div>
        <div className={styles.map} ref={setMapElement} />
      </div>
    </>
  );
};

export default DestinationFragment;
