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

const findValidItemsInList = (a, b) => a.filter((aa) => b.includes(aa));

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
  typeList,
  hotelList,
  superchainList,
  exchangeRates,
  onSuperchainSelectionChange,
  onHotelSelectionChange,
  onTypeSelectionChange,
  onMinMaxSelectionChange,
  onCurrencyChange,
  defaultMax,
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

  const [slideValues, setSlideValues] = useState([0, defaultMax]);

  // Called while sliding.
  const handleUpdate = useCallback((event, newValue) => {
    setSlideValues(newValue.map((x) => Math.round(x)));
  }, []);

  // Called while sliding is finished.
  const handleSet = useCallback(
    (event, newValue) => {
      setSlideValues(newValue.map((x) => Math.round(x)));
      onMinMaxSelectionChange(newValue.map((x) => Math.round(x)));
    },
    [onMinMaxSelectionChange]
  );

  const [min, max] = slideValues;

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
          <div className={styles.numberLeft}>{min}</div>
          <div className={styles.sliderWrap}>
            <DoubleSlider
              value={slideValues}
              onChange={handleUpdate}
              onChangeCommitted={handleSet}
              max={defaultMax}
            />
          </div>
          <div className={styles.numberRight}>
            {max === defaultMax ? `${defaultMax}+` : max}
          </div>
        </div>
      </div>
    </div>
  );
};

const priceConversion = (x, { from, to }) => (x / from) * to;

const BookingFragment = ({
  city,
  country,
  selectedSuperchains,
  selectedHotels,
  selectedTypes,
  // minHotelPrice,
  // maxHotelPrice,
  selectedCurrency,
}) => {
  const [minHotelPrice, setMinHotelPrice] = useState(0);
  const [maxHotelPrice, setMaxHotelPrice] = useState(undefined);

  const [exchangeRates, setExchangeRates] = useState({});

  const [superchainList, setSuperchainList] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [typeList, setTypeList] = useState([]);

  const [hotels, setHotels] = useState([]);

  const scaledMax =
    Math.round(
      priceConversion(DEFAULT_MAX, {
        from: exchangeRates.USD,
        to: exchangeRates[selectedCurrency],
      }) / 100
    ) * 100 || DEFAULT_MAX;

  const updateQuery = useCallback(
    (params) => {
      const query = queryString.stringify({
        [SUPERCHAINS]: selectedSuperchains,
        [HOTELS]: selectedHotels,
        [HOTEL_TYPE]: selectedTypes,
        [CURRENCY]: selectedCurrency !== "USD" ? selectedCurrency : undefined,
        ...params,
      });
      globalHistory.push(`/destinations/${country}/${city}?${query}`);
    },
    [
      city,
      country,
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
        mincost: priceConversion(minHotelPrice, {
          from: exchangeRates[selectedCurrency],
          to: exchangeRates.USD,
        }),
        maxcost: priceConversion(maxHotelPrice, {
          from: exchangeRates[selectedCurrency],
          to: exchangeRates.USD,
        }),
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
      setMinHotelPrice(minCost);
      setMaxHotelPrice(maxCost === scaledMax ? undefined : maxCost);
      // updateQuery({
      //   [MIN_HOTEL_PRICE]: minCost,
      //   [MAX_HOTEL_PRICE]: maxCost === scaledMax ? undefined : maxCost,
      // });
    },
    [scaledMax]
  );

  const handleCurrencyChange = useCallback(
    (currency) => {
      updateQuery({ [CURRENCY]: currency });
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
        typeList={typeList}
        hotelList={hotelList}
        exchangeRates={exchangeRates}
        onSuperchainSelectionChange={handleSuperchainSelectionChange}
        onHotelSelectionChange={handleHotelSelectionChange}
        onTypeSelectionChange={handleTypeSelectionChange}
        onMinMaxSelectionChange={handleMinMaxSelectionChange}
        onCurrencyChange={handleCurrencyChange}
        defaultMax={scaledMax}
      />
      {hotels.map(({ superchain, name, cost, images }) => {
        const priceString =
          priceConversion(cost, {
            from: exchangeRates.USD,
            to: exchangeRates[selectedCurrency],
          }).toFixed(2) +
          " " +
          selectedCurrency;
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
