import React, { useState, useEffect, useCallback } from "react";

import { MultiSelect } from "carbon-components-react";

import styles from "./BookingFragment.module.css";

const ListItem = ({ destination, superchain, name, cost, images }) => {
  console.log(images);
  return (
    <div className={styles.listItem}>
      <div
        className={styles.listItemImage}
        style={{
          background: `transparent url(${images[0]}) no-repeat 0 0 / cover`
        }}
      />
      <div className={styles.listItemContent}>
        <div className={styles.listItemTitle}>{name}</div>
        <div className={styles.listItemSub}>{superchain}</div>
        <div className={styles.listItemCost}>{cost}</div>
      </div>
    </div>
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
  const handleSuperchainChange = useCallback(
    e => {
      onSuperchainSelectionChange(e.target.value);
    },
    [onSuperchainSelectionChange]
  );

  const handleHotelChange = useCallback(
    e => {
      onHotelSelectionChange(e.target.value);
    },
    [onHotelSelectionChange]
  );

  const handleTypeChange = useCallback(
    e => {
      onTypeSelectionChange(e.target.value);
    },
    [onTypeSelectionChange]
  );

  const handleMinChange = useCallback(
    e => {
      onMinSelectionChange(e.target.value);
    },
    [onMinSelectionChange]
  );

  const handleMaxChange = useCallback(
    e => {
      onMaxSelectionChange(e.target.value);
    },
    [onMaxSelectionChange]
  );

  return (
    <div className={styles.filters}>
      <MultiSelect
        useTitleInItem={false}
        label="Superchains"
        invalid={false}
        invalidText="Invalid Selection"
        // onChange={onChange}
        items={superchainList}
        itemToString={item => item}
        initialSelectedItems={
          [
            // { id: "item-1", text: "Item 1" },
            // { id: "item-2", text: "Item 2" }
          ]
        }
        // translateWithId={translateWithId}
      />
      <MultiSelect
        useTitleInItem={false}
        label="Hotels"
        invalid={false}
        invalidText="Invalid Selection"
        items={hotelList}
        itemToString={item => item}
        initialSelectedItems={[]}
      />
      <MultiSelect
        useTitleInItem={false}
        label="Types"
        invalid={false}
        invalidText="Invalid Selection"
        items={typeList}
        itemToString={item => item}
        initialSelectedItems={[]}
      />
      {/* <select onChange={handleSuperchainChange}>
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
      </select> */}
      {/* <input
        type="number"
        min="0"
        placeholder="Min"
        onChange={handleMinChange}
      />
      <input
        type="number"
        min="0"
        placeholder="Max"
        onChange={handleMaxChange}
      /> */}
    </div>
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
          ""}&mincost=${(selectedMin / exchangeRates[selectedCurrency]) *
          exchangeRates.USD}
          &maxcost=${(selectedMax / exchangeRates[selectedCurrency]) *
            exchangeRates.USD}`
      );
      const hotelList = await hotelResponse.json();
      setHotels(hotelList);
    };

    if (city && country) {
      loadHotels();
    }
  }, [
    city,
    country,
    selectedSuperchain,
    selectedHotel,
    selectedType,
    selectedMin,
    selectedMax,
    selectedCurrency,
    exchangeRates
  ]);

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
      {hotels.map(({ superchain, name, cost, images }) => {
        const priceString =
          (
            (cost / exchangeRates.USD) *
            exchangeRates[selectedCurrency]
          ).toFixed(2) +
          " " +
          selectedCurrency;
        return (
          <ListItem
            destination={destination}
            superchain={superchain}
            name={name}
            cost={priceString}
            images={images}
          />
        );
      })}
    </>
  );
};

export default BookingFragment;
