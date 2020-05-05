import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import queryString from "query-string";

import DestinationFragment from "./DestinationFragment/DestinationFragment";
import BookingFragment from "./BookingFragment/BookingFragment";
import {
  SUPERCHAINS,
  HOTELS,
  HOTEL_TYPE,
  MIN_HOTEL_PRICE,
  MAX_HOTEL_PRICE,
  CURRENCY,
} from "components/common/query-constants";

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

const arrayify = (maybeArray) => {
  const _maybeArray = maybeArray || [];
  if (Array.isArray(_maybeArray)) {
    return _maybeArray;
  }
  return [_maybeArray];
};

const Content = ({ location }) => {
  const { country, city } = useParams();

  const queryObject = queryString.parse(location.search);
  const superchains = arrayify(queryObject[SUPERCHAINS]);
  const hotels = arrayify(queryObject[HOTELS]);
  const hotelType = arrayify(queryObject[HOTEL_TYPE]);
  const minHotelPrice = parseInt(queryObject[MIN_HOTEL_PRICE], 10) || 0;
  const maxHotelPrice = parseInt(queryObject[MAX_HOTEL_PRICE], 10) || undefined;
  const currency = (queryObject[CURRENCY] || "usd").toUpperCase();

  const [cityName, setCityName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const loadDestination = async () => {
      const destinationResponse = await fetch(
        `/api/v1/destinations/${country}/${city}`
      );
      const destination = await destinationResponse.json();
      setLatitude(destination.lat);
      setLongitude(destination.lng);
      setDescription(destination.description);
      setCityName(destination.city);
      setCountryName(destination.country);
    };

    if (city && country) {
      loadDestination();
    }
  }, [city, country]);

  return (
    <SplitPaneLayout panelWidth="464px">
      <DestinationFragment
        city={city}
        country={country}
        cityName={cityName}
        countryName={countryName}
        latitude={latitude}
        longitude={longitude}
        description={description}
      />
      <BookingFragment
        city={city}
        country={country}
        selectedSuperchains={superchains}
        selectedHotels={hotels}
        selectedTypes={hotelType}
        minHotelPrice={minHotelPrice}
        maxHotelPrice={maxHotelPrice}
        selectedCurrency={currency}
      />
    </SplitPaneLayout>
  );
};

export default Content;
