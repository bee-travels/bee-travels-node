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

const SplitPaneLayout = ({ children, panelWidth, breakpoint }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const reportWindowSize = (e) => {
      setWindowWidth(e.target.innerWidth);
    };
    window.addEventListener("resize", reportWindowSize);
    return () => window.removeEventListener("resize", reportWindowSize);
  }, []);

  const [left, right] = children;

  if (windowWidth < parseInt(breakpoint, 10)) {
    return (
      <>
        <div
          style={{
            width: "100%",
            background: "#ffffff",
          }}
        >
          {left}
        </div>
        <div
          style={{
            background: "#f4f4f4",
            overflow: "auto",
          }}
        >
          {right}
        </div>
      </>
    );
  }
  return (
    <>
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: panelWidth,
          background: "#ffffff",
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
          background: "#f4f4f4",
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
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadDestination = async () => {
      const destinationResponse = await fetch(
        `/api/v1/destinations/${country}/${city}`
      );
      const destination = await destinationResponse.json();
      setLatitude(destination.latitude);
      setLongitude(destination.longitude);
      setDescription(destination.description);
      setCityName(destination.city);
      setCountryName(destination.country);
      setImages(destination.images);
    };

    if (city && country) {
      loadDestination();
    }
  }, [city, country]);

  return (
    <SplitPaneLayout panelWidth="464px" breakpoint="1250px">
      <DestinationFragment
        cityName={cityName}
        countryName={countryName}
        latitude={latitude}
        longitude={longitude}
        description={description}
        images={images}
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
