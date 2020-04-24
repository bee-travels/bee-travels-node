import React, { useState, useEffect } from "react";

import queryString from "query-string";

import DestinationFragment from "./DestinationFragment/DestinationFragment";
import BookingFragment from "./BookingFragment/BookingFragment";

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
          background: "var(--ui-background)",
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
          background: "var(--ui-01)",
          overflow: "auto",
          paddingLeft: "1px",
        }}
      >
        {right}
      </div>
    </>
  );
};

const Content = ({ location }) => {
  const { city, country } = queryString.parse(location.search);

  const [destination, setDestination] = useState({
    city: "",
    lat: "",
    lng: "",
    country: "",
    population: "",
    description: "",
  });

  useEffect(() => {
    const loadDestination = async () => {
      const destinationResponse = await fetch(
        `/api/v1/destinations/${city}/${country}`
      );
      const destination = await destinationResponse.json();
      setDestination(destination);
    };

    if (city && country) {
      loadDestination();
    }
  }, [city, country]);

  return (
    <SplitPaneLayout panelWidth="464px">
      <DestinationFragment destination={destination} />
      <BookingFragment destination={destination} />
    </SplitPaneLayout>
  );
};

export default Content;
