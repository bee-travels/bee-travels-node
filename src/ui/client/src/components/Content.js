import React, { useState, useEffect, useCallback } from "react";
import ReactMapboxGl from "react-mapbox-gl";
import BeeLogo from "./BeeLogo";
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
          background: "var(--ui-01)",
          overflow: "auto"
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

        <p>{truncateText(destination.description)}</p>

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
            // height: "237px",
            height: "261px",
            // width: "100%",
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

const BookingFragment = ({ destination }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const [exchangeRates, setExchangeRates] = useState({});

  const [selectedSuperchain, setSelectedSuperchain] = useState(undefined);
  const [selectedHotel, setSelectedHotel] = useState(undefined);
  const [selectedType, setSelectedType] = useState(undefined);
  const [selectedMin, setSelectedMin] = useState(0);
  const [selectedMax, setSelectedMax] = useState(Number.MAX_SAFE_INTEGER);

  const [superchainList, setSuperchainList] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [typeList, setTypeList] = useState([]);

  const [hotels, setHotels] = useState([]);

  const { city, country } = destination;

  useEffect(() => {
    const loadHotels = async () => {
      const hotelResponse = await fetch(
        `/api/v1/hotels/${city}/${country}?superchain=${selectedSuperchain ||
          ""}&hotel=${selectedHotel || ""}&type=${selectedType ||
          ""}&mincost=${(selectedMin / exchangeRates[selectedCurrency]) * exchangeRates.USD}
          &maxcost=${(selectedMax / exchangeRates[selectedCurrency]) * exchangeRates.USD}`
      );
      const hotelList = await hotelResponse.json();
      setHotels(hotelList);
    };

    if (city && country) {
      loadHotels();
    }
  }, [city, country, selectedSuperchain, selectedHotel, selectedType, selectedMin, selectedMax, selectedCurrency]);

  useEffect(() => {
    const loadFilters = async () => {
      const superchainResponse = await fetch("/api/v1/hotels/info/superchains");
      const superchainList = await superchainResponse.json();
      setSuperchainList(superchainList);
    };

    loadFilters();
  }, []);

  useEffect(() => {
    const loadCurrency = async () => {
      const currencyResponse = await fetch("/api/v1/currency");
      const exchangeRates = await currencyResponse.json();
      setExchangeRates({ ...exchangeRates.rates, EUR: 1 });
    };

    loadCurrency();
  }, []);

  useEffect(() => {
    const loadFilters = async () => {
      const hotelResponse = await fetch("/api/v1/hotels/info/hotels");
      const hotelList = await hotelResponse.json();
      setHotelList(hotelList);
    };

    loadFilters();
  }, []);

  useEffect(() => {
    const loadFilters = async () => {
      const typeResponse = await fetch("/api/v1/hotels/info/hotel-type");
      const typeList = await typeResponse.json();
      setTypeList(typeList);
    };

    loadFilters();
  }, []);

  const handleOnSuperchainSelectionChange = useCallback(superchain => {
    if (superchain === "All Superchains") {
      setSelectedSuperchain(undefined);
    } else {
      setSelectedSuperchain(superchain);
    }
  }, []);

  const handleOnHotelSelectionChange = useCallback(hotel => {
    if (hotel === "All Hotels") {
      setSelectedHotel(undefined);
    } else {
      setSelectedHotel(hotel);
    }
  }, []);

  const handleOnTypeSelectionChange = useCallback(type => {
    if (type === "All Types") {
      setSelectedType(undefined);
    } else {
      setSelectedType(type);
    }
  }, []);

  const handleOnMinSelectionChange = useCallback(min => {
    if (min) {
      setSelectedMin(min);
    } else {
      setSelectedMin(0);
    }
  }, []);

  const handleOnMaxSelectionChange = useCallback(max => {
    if (max) {
      setSelectedMax(max);
    } else {
      setSelectedMax(Number.MAX_SAFE_INTEGER);
    }
  }, []);

  const handleCurrencyChange = useCallback(e => {
    setSelectedCurrency(e.target.value);
  }, []);

  return (
    <>
      <Filters
        superchainList={superchainList}
        typeList={typeList}
        hotelList={hotelList}
        onSuperchainSelectionChange={handleOnSuperchainSelectionChange}
        onHotelSelectionChange={handleOnHotelSelectionChange}
        onTypeSelectionChange={handleOnTypeSelectionChange}
        onMinSelectionChange={handleOnMinSelectionChange}
        onMaxSelectionChange={handleOnMaxSelectionChange}
      />
      <select onChange={handleCurrencyChange}>
        {Object.keys(exchangeRates).map(currencyCode => (
          <option value={currencyCode} selected={currencyCode === "USD"}>
            {currencyCode}
          </option>
        ))}
      </select>
      {hotels.map(({ superchain, name, type, cost, images }) => (
        <div>
          <img
            height="100"
            width="100"
            src={images[0]}
            alt={destination.city + ", " + destination.country}
          />
          <div>
            {superchain +
              " " +
              name +
              ": " +
              (
                (cost / exchangeRates.USD) *
                exchangeRates[selectedCurrency]
              ).toFixed(2) +
              " " +
              selectedCurrency}
          </div>
        </div>
      ))}
    </>
  );
};

const Filters = ({
  typeList,
  hotelList,
  superchainList,
  onSuperchainSelectionChange,
  onHotelSelectionChange,
  onTypeSelectionChange,
  onMinSelectionChange,
  onMaxSelectionChange
}) => {
  const handleSuperchainChange = useCallback(e => {
    onSuperchainSelectionChange(e.target.value);
  }, []);

  const handleHotelChange = useCallback(e => {
    onHotelSelectionChange(e.target.value);
  }, []);

  const handleTypeChange = useCallback(e => {
    onTypeSelectionChange(e.target.value);
  }, []);

  const handleMinChange = useCallback(e => {
    onMinSelectionChange(e.target.value);
  }, []);

  const handleMaxChange = useCallback(e => {
    onMaxSelectionChange(e.target.value);
  }, []);

  return (
    <>
      <select onChange={handleSuperchainChange}>
        <option selected>All Superchains</option>
        {superchainList.map(superchain => (
          <option value={superchain}>{superchain}</option>
        ))}
      </select>
      <select onChange={handleHotelChange}>
        <option selected>All Hotels</option>
        {hotelList.map(hotel => (
          <option value={hotel}>{hotel}</option>
        ))}
      </select>
      <select onChange={handleTypeChange}>
        <option selected>All Types</option>
        {typeList.map(type => (
          <option value={type}>{type}</option>
        ))}
      </select>
      <input type="number" min="0" placeholder="Min" onChange={handleMinChange} />
      <input type="number" min="0" placeholder="Max" onChange={handleMaxChange} />
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
    description: ""
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
