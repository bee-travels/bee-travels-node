import React, { useState, useEffect } from "react";
import ReactMapboxGl from "react-mapbox-gl";
import BeeLogo from "./BeeLogo";
import UncontrolledSearch from "./UncontrolledSearch";
import queryString from "query-string";

import destinationStyles from "./Destination.module.css";

const SplitPaneLayout = ({ children, panelWidth }) => {
  const [left, right] = children;
  return (
    <>
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: panelWidth,
          background: "var(--ui-background)"
        }}
      >
        {left}
      </div>
      <div
        style={{
          position: "fixed",
          left: panelWidth,
          top: 0,
          bottom: 0,
          right: 0,
          background: "var(--ui-01)"
        }}
      >
        {right}
      </div>
    </>
  );
};

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoibWFwcXVlc3QiLCJhIjoiY2Q2N2RlMmNhY2NiZTRkMzlmZjJmZDk0NWU0ZGJlNTMifQ.mPRiEubbajc6a5y9ISgydg"
});

const tuncateText = text => {
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
  const imageSrc = `/images/${destination.city}, ${destination.country}.jpg`;
  return (
    <>
      <div className={destinationStyles.titlebar}>
        <BeeLogo className={destinationStyles.logoImage} />
        <div className={destinationStyles.logoText}>Bee Travels</div>
        <svg
          className={destinationStyles.searchIcon}
          focusable="false"
          width="32"
          height="32"
          viewBox="0 0 32 32"
        >
          <path d="M30,28.59,22.45,21A11,11,0,1,0,21,22.45L28.59,30ZM5,14a9,9,0,1,1,9,9A9,9,0,0,1,5,14Z"></path>
        </svg>
      </div>
      <div className={destinationStyles.content}>
        <h1>{destination.city}</h1>

        {/* {destination.country} */}

        <p>{tuncateText(destination.description)}</p>

        <button>Learn more</button>

        <div className={destinationStyles.imageContainer}>
          <img
            className={destinationStyles.image}
            src={imageSrc}
            alt={destination.city + ", " + destination.country}
          />
          <img
            className={destinationStyles.image}
            src={imageSrc}
            alt={destination.city + ", " + destination.country}
          />
          <img
            className={destinationStyles.image}
            src={imageSrc}
            alt={destination.city + ", " + destination.country}
          />
        </div>
        <Map
          style="mapbox://styles/mapbox/streets-v9"
          zoom={[7]}
          containerStyle={{
            height: "237px",
            width: "100%"
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

const BookingFragment = () => {
  return <>hello world</>;
};

const Content = ({ location }) => {
  const { city, country } = queryString.parse(location.search);

  const [destination, setDestination] = useState({
    city: "",
    lat: "",
    lng: "",
    country: "",
    population: "",
    description: ""
  });

  useEffect(() => {
    const loadDestinationData = async () => {
      if (city && country) {
        const response = await fetch(`/api/v1/destinations/${city}/${country}`);
        const destination = await response.json();
        setDestination(destination);
      }
    };
    loadDestinationData();
  }, [city, country, location.search]);

  return (
    <SplitPaneLayout panelWidth="464px">
      <DestinationFragment destination={destination} />
      <BookingFragment />
    </SplitPaneLayout>
  );
};

export default Content;
