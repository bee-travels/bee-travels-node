import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import ShoppingCartRoundedIcon from "@material-ui/icons/ShoppingCartRounded";
import Badge from "@material-ui/core/Badge";

import { useActions } from "redux/actions";

import DestinationFragment from "./DestinationFragment/DestinationFragment";
import HotelFragment from "./HotelFragment/HotelFragment";
import CarFragment from "./CarFragment/CarFragment";
import FlightFragment from "./FlightFragment/FlightFragment";
import TabHolder from "./TabHolder";
import globalHistory from '../../globalHistory';

// function ProviderWrapper({ location }) {
//   const store = createStore(
//     reducer,
//     init(location),
//     composeWithDevTools({ name: "bee-travels" })()
//   );

//   return (
//     <Provider store={store}>
//       <Content location={location} />
//     </Provider>
//   );
// }

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

const Content = () => {
  const location = useLocation();
  const { country, city } = useParams();
  const { setLocation } = useActions();

  const [cityName, setCityName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const carsItems = useSelector((state) => state.cars);
  const hotelsItems = useSelector((state) => state.hotels);
  const flightsItems = useSelector((state) => state.flights);

  useEffect(() => {
    setLocation(location);
  }, [location]);

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

  const handleFabClick = () => {
    globalHistory.push("/checkout");
  };

  return (
    <SplitPaneLayout panelWidth="450px" breakpoint="1250px">
      <DestinationFragment
        cityName={cityName}
        countryName={countryName}
        latitude={latitude}
        longitude={longitude}
        description={description}
        images={images}
      />
      <div>
        <TabHolder location={location}>
          <HotelFragment
            city={city}
            country={country}
            search={location.search}
          />
          <CarFragment city={city} country={country} search={location.search} />
          <FlightFragment
            city={city}
            country={country}
            search={location.search}
          />
        </TabHolder>
        <button
          style={{
            position: "fixed",
            right: "20px",
            bottom: "20px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
          }}
          onClick={handleFabClick}
        >
          <Badge
            badgeContent={carsItems.length + hotelsItems.length}
            color="primary"
          >
            <ShoppingCartRoundedIcon style={{ fontSize: 40 }} color="primary" />
          </Badge>
        </button>
      </div>
    </SplitPaneLayout>
  );
};

export default Content;
