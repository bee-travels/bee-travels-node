import React, { useState, useEffect, useCallback } from "react";
import queryString from "query-string";
import styles from "./BookingFragment.module.css";
import DoubleSlider from "./DoubleSlider";
import MultiSelect from "./MultiSelect";
import Select from "./Select";

import globalHistory from "globalHistory";

import {
  SUPERCHAINS,
  HOTEL_TYPE,
  HOTELS,
  MIN_HOTEL_PRICE,
  MAX_HOTEL_PRICE,
  CURRENCY,
} from "components/common/query-constants";

const DEFAULT_MAX = 700;

const ListItem = ({ superchain, name, cost, images }) => {
  return (
    <div className={styles.listItem}>
      <div
        className={styles.listItemImage}
        style={{
          background: `transparent url(${images[0]}) no-repeat 0 0 / cover`,
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
  selectedTypes,
  selectedHotels,
  selectedSuperchains,
  selectedExchangeRate,
  minHotelPrice,
  maxHotelPrice,
  typeList,
  hotelList,
  superchainList,
  exchangeRates,
  onSuperchainSelectionChange,
  onHotelSelectionChange,
  onTypeSelectionChange,
  onMinMaxSelectionChange,
  onCurrencyChange,
}) => {
  const handleSuperchainChange = (values) => {
    onSuperchainSelectionChange(values);
  };

  const handleHotelChange = (values) => {
    onHotelSelectionChange(values);
  };

  const handleTypeChange = (values) => {
    onTypeSelectionChange(values);
  };

  const handleCurrencyChange = (e) => {
    onCurrencyChange(e.target.value);
  };

  // We need an intermediate state for while sliding
  const [slideValues, setSlideValues] = useState([
    minHotelPrice || 0,
    maxHotelPrice || 700,
  ]);

  // Called while sliding.
  const handleUpdate = useCallback((_, newValue) => {
    const roundedValues = newValue.map((x) => Math.round(x));
    setSlideValues(roundedValues);
  }, []);

  // Called while sliding is finished.
  const handleSet = useCallback(
    (_, newValue) => {
      const roundedValues = newValue.map((x) => Math.round(x));
      setSlideValues(roundedValues);
      onMinMaxSelectionChange(roundedValues);
    },
    [onMinMaxSelectionChange]
  );

  const scaledMax = Math.round(
    priceConversion(DEFAULT_MAX, {
      from: exchangeRates.USD,
      to: exchangeRates[selectedExchangeRate],
    })
  );

  const displayMinPrice = Math.round(
    priceConversion(slideValues[0], {
      from: exchangeRates.USD,
      to: exchangeRates[selectedExchangeRate],
    })
  );

  const displayMaxPrice = Math.round(
    priceConversion(slideValues[1], {
      from: exchangeRates.USD,
      to: exchangeRates[selectedExchangeRate],
    })
  );

  const minDisplayString = displayMinPrice.toLocaleString(undefined);
  const maxDisplayString =
    displayMaxPrice === scaledMax
      ? `${scaledMax.toLocaleString(undefined)}+`
      : displayMaxPrice.toLocaleString(undefined);

  return (
    <div className={styles.filters}>
      <div className={styles.filterWide}>
        <MultiSelect
          label="Superchains"
          list={superchainList}
          selected={selectedSuperchains}
          onSelected={handleSuperchainChange}
        />
      </div>
      <div className={styles.filterWide}>
        <MultiSelect
          label="Hotels"
          list={hotelList}
          selected={selectedHotels}
          onSelected={handleHotelChange}
        />
      </div>
      <div className={styles.filterNarrow}>
        <MultiSelect
          label="Types"
          list={typeList}
          selected={selectedTypes}
          onSelected={handleTypeChange}
        />
      </div>
      <div className={styles.filterSuperNarrow}>
        <Select
          list={Object.keys(exchangeRates)}
          selected={selectedExchangeRate}
          onSelected={handleCurrencyChange}
        />
      </div>
      <div className={styles.filterWide}>
        <div className={styles.wrapWrap}>
          <div className={styles.numberLeft}>{minDisplayString}</div>
          <div className={styles.sliderWrap}>
            <DoubleSlider
              value={slideValues}
              onChange={handleUpdate}
              onChangeCommitted={handleSet}
              max={700}
            />
          </div>
          <div className={styles.numberRight}>{maxDisplayString}</div>
        </div>
      </div>
    </div>
  );
};

const priceConversion = (x, { from, to }) => (x / from) * to;

const fixCurrency = (x) => (x !== "USD" ? x : undefined);
const fixMin = (x) => (x === 0 ? undefined : x);
const fixMax = (x) => (x === DEFAULT_MAX ? undefined : x);

const BookingFragment = ({
  city,
  country,
  selectedSuperchains,
  selectedHotels,
  selectedTypes,
  minHotelPrice,
  maxHotelPrice,
  selectedCurrency,
}) => {
  const [exchangeRates, setExchangeRates] = useState({});

  const [superchainList, setSuperchainList] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [typeList, setTypeList] = useState([]);

  const [hotels, setHotels] = useState([]);

  const updateQuery = useCallback(
    (params) => {
      const query = queryString.stringify({
        [SUPERCHAINS]: selectedSuperchains,
        [HOTELS]: selectedHotels,
        [HOTEL_TYPE]: selectedTypes,
        [CURRENCY]: fixCurrency(selectedCurrency),
        [MIN_HOTEL_PRICE]: fixMin(minHotelPrice),
        [MAX_HOTEL_PRICE]: fixMax(maxHotelPrice),
        ...params,
      });
      globalHistory.push(`/destinations/${country}/${city}?${query}`);
    },
    [
      city,
      country,
      maxHotelPrice,
      minHotelPrice,
      selectedCurrency,
      selectedHotels,
      selectedSuperchains,
      selectedTypes,
    ]
  );

  // Load list of hotels.
  useEffect(() => {
    const loadHotels = async () => {
      const query = queryString.stringify({
        superchain:
          selectedSuperchains.length > 0
            ? selectedSuperchains.join(",")
            : undefined,
        hotel: selectedHotels.length > 0 ? selectedHotels.join(",") : undefined,
        type: selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
        mincost: minHotelPrice,
        maxcost: maxHotelPrice,
      });

      const hotelResponse = await fetch(
        `/api/v1/hotels/${country}/${city}?${query}`
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
    selectedCurrency,
    exchangeRates,
    minHotelPrice,
    maxHotelPrice,
  ]);

  // Load list of superchains.
  useEffect(() => {
    const loadSuperchains = async () => {
      const superchainResponse = await fetch("/api/v1/hotels/info/superchain");
      const superchainList = await superchainResponse.json();
      setSuperchainList(superchainList);
    };

    loadSuperchains();
  }, [selectedSuperchains, updateQuery]);

  // Load exchange rates.
  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const currencyResponse = await fetch("/api/v1/currency/rates");
        const exchangeRates = await currencyResponse.json();
        setExchangeRates({ ...exchangeRates.rates, EUR: 1 }); // EUR isn't part of the list.
      } catch (e) {
        setExchangeRates({ USD: 1 });
      }
    };

    loadCurrency();
  }, []);

  // Load list of hotels chains.
  useEffect(() => {
    const loadHotelChains = async () => {
      const hotelResponse = await fetch("/api/v1/hotels/info/name");
      const hotelList = await hotelResponse.json();
      setHotelList(hotelList);
    };

    loadHotelChains();
  }, []);

  // Load list of hotel types.
  useEffect(() => {
    const loadHotelTypes = async () => {
      const typeResponse = await fetch("/api/v1/hotels/info/type");
      const typeList = await typeResponse.json();
      setTypeList(typeList);
    };

    loadHotelTypes();
  }, []);

  const handleSuperchainSelectionChange = useCallback(
    (superchains) => {
      updateQuery({ [SUPERCHAINS]: superchains });
    },
    [updateQuery]
  );

  const handleHotelSelectionChange = useCallback(
    (hotels) => {
      updateQuery({ [HOTELS]: hotels });
    },
    [updateQuery]
  );

  const handleTypeSelectionChange = useCallback(
    (types) => {
      updateQuery({ [HOTEL_TYPE]: types });
    },
    [updateQuery]
  );

  const handleMinMaxSelectionChange = useCallback(
    ([minCost, maxCost]) => {
      updateQuery({
        [MIN_HOTEL_PRICE]: fixMin(minCost),
        [MAX_HOTEL_PRICE]: fixMax(maxCost),
      });
    },
    [updateQuery]
  );

  const handleCurrencyChange = useCallback(
    (currency) => {
      updateQuery({ [CURRENCY]: fixCurrency(currency) });
    },
    [updateQuery]
  );

  return (
    <>
      <Filters
        selectedTypes={selectedTypes}
        selectedHotels={selectedHotels}
        selectedSuperchains={selectedSuperchains}
        selectedExchangeRate={selectedCurrency}
        superchainList={superchainList}
        minHotelPrice={minHotelPrice}
        maxHotelPrice={maxHotelPrice}
        typeList={typeList}
        hotelList={hotelList}
        exchangeRates={exchangeRates}
        onSuperchainSelectionChange={handleSuperchainSelectionChange}
        onHotelSelectionChange={handleHotelSelectionChange}
        onTypeSelectionChange={handleTypeSelectionChange}
        onMinMaxSelectionChange={handleMinMaxSelectionChange}
        onCurrencyChange={handleCurrencyChange}
      />
      {hotels.map(({ superchain, name, cost, images }) => {
        const priceString = priceConversion(cost, {
          from: exchangeRates.USD,
          to: exchangeRates[selectedCurrency],
        }).toLocaleString(undefined, {
          style: "currency",
          currency: selectedCurrency,
        });
        return (
          <ListItem
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
