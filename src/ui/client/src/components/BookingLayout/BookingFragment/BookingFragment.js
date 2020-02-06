import React, { useState, useEffect, useCallback } from "react";
import queryString from "query-string";

import { MultiSelect, Select, SelectItem } from "carbon-components-react";

import styles from "./BookingFragment.module.css";

const ListItem = ({ superchain, name, cost, images }) => {
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
  exchangeRates,
  onSuperchainSelectionChange,
  onHotelSelectionChange,
  onTypeSelectionChange,
  onMinSelectionChange,
  onMaxSelectionChange,
  onCurrencyChange
}) => {
  const handleSuperchainChange = useCallback(
    ({ selectedItems }) => {
      onSuperchainSelectionChange(selectedItems);
    },
    [onSuperchainSelectionChange]
  );

  const handleHotelChange = useCallback(
    ({ selectedItems }) => {
      onHotelSelectionChange(selectedItems);
    },
    [onHotelSelectionChange]
  );

  const handleTypeChange = useCallback(
    ({ selectedItems }) => {
      onTypeSelectionChange(selectedItems);
    },
    [onTypeSelectionChange]
  );

  // const handleMinChange = useCallback(
  //   e => {
  //     onMinSelectionChange(e.target.value);
  //   },
  //   [onMinSelectionChange]
  // );

  // const handleMaxChange = useCallback(
  //   e => {
  //     onMaxSelectionChange(e.target.value);
  //   },
  //   [onMaxSelectionChange]
  // );

  const handleCurrencyChange = useCallback(
    e => {
      onCurrencyChange(e.target.value);
    },
    [onCurrencyChange]
  );

  return (
    <div className={styles.filters}>
      <div className={styles.filterWide}>
        <MultiSelect
          label="Superchains"
          onChange={handleSuperchainChange}
          items={superchainList}
          itemToString={item => item}
        />
      </div>
      <div className={styles.filterNarrow}>
        <MultiSelect
          label="Hotels"
          onChange={handleHotelChange}
          items={hotelList}
          itemToString={item => item}
        />
      </div>
      <div className={styles.filterNarrow}>
        <MultiSelect
          label="Types"
          onChange={handleTypeChange}
          items={typeList}
          itemToString={item => item}
        />
      </div>
      <div className={styles.filterNarrow}>
        <Select hideLabel onChange={handleCurrencyChange}>
          {Object.keys(exchangeRates).map(currencyCode => (
            <SelectItem
              text={currencyCode}
              value={currencyCode}
              selected={currencyCode === "USD"}
            />
          ))}
        </Select>
      </div>
    </div>
  );
};

const priceConversion = (x, { from, to }) => (x / from) * to;

const BookingFragment = ({ destination }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const [exchangeRates, setExchangeRates] = useState({});

  const [selectedSuperchains, setSelectedSuperchains] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedMin, setSelectedMin] = useState(0);
  const [selectedMax, setSelectedMax] = useState(Number.MAX_SAFE_INTEGER);

  const [superchainList, setSuperchainList] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [typeList, setTypeList] = useState([]);

  const [hotels, setHotels] = useState([]);

  const { city, country } = destination;

  useEffect(() => {
    const loadHotels = async () => {
      const params = {
        superchain: selectedSuperchains.join(","),
        hotel: selectedHotels.join(","),
        type: selectedTypes.join(","),
        mincost: priceConversion(selectedMin, {
          from: exchangeRates[selectedCurrency],
          to: exchangeRates.USD
        }),
        maxcost: priceConversion(selectedMax, {
          from: exchangeRates[selectedCurrency],
          to: exchangeRates.USD
        })
      };

      const hotelResponse = await fetch(
        `/api/v1/hotels/${city}/${country}?${queryString.stringify(params)}`
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
    selectedSuperchains,
    selectedHotels,
    selectedTypes,
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

  const handleSuperchainSelectionChange = useCallback(superchains => {
    setSelectedSuperchains(superchains);
  }, []);

  const handleHotelSelectionChange = useCallback(hotels => {
    setSelectedHotels(hotels);
  }, []);

  const handleTypeSelectionChange = useCallback(types => {
    setSelectedTypes(types);
  }, []);

  const handleMinSelectionChange = useCallback(min => {
    if (min) {
      setSelectedMin(min);
    } else {
      setSelectedMin(0);
    }
  }, []);

  const handleMaxSelectionChange = useCallback(max => {
    if (max) {
      setSelectedMax(max);
    } else {
      setSelectedMax(Number.MAX_SAFE_INTEGER);
    }
  }, []);

  const handleCurrencyChange = useCallback(currency => {
    setSelectedCurrency(currency);
  }, []);

  return (
    <>
      <Filters
        superchainList={superchainList}
        typeList={typeList}
        hotelList={hotelList}
        exchangeRates={exchangeRates}
        onSuperchainSelectionChange={handleSuperchainSelectionChange}
        onHotelSelectionChange={handleHotelSelectionChange}
        onTypeSelectionChange={handleTypeSelectionChange}
        onMinSelectionChange={handleMinSelectionChange}
        onMaxSelectionChange={handleMaxSelectionChange}
        onCurrencyChange={handleCurrencyChange}
      />
      {hotels.map(({ superchain, name, cost, images }) => {
        const priceString =
          priceConversion(cost, {
            from: exchangeRates.USD,
            to: exchangeRates[selectedCurrency]
          }).toFixed(2) +
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
