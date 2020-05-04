import React, { useState, useEffect, useCallback } from "react";
import queryString from "query-string";
import styles from "./BookingFragment.module.css";
import DoubleSlider from "./DoubleSlider";
import MultiSelect from "./MultiSelect";
import Select from "./Select";

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
  const handleUpdate = useCallback((values) => {
    setSlideValues(values.map((x) => Math.round(x)));
  }, []);

  // Called while sliding is finished.
  const handleSet = useCallback(
    (values) => {
      setSlideValues(values.map((x) => Math.round(x)));
      onMinMaxSelectionChange(values.map((x) => Math.round(x)));
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
            <DoubleSlider />
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

const BookingFragment = ({ city, country }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const [exchangeRates, setExchangeRates] = useState({});

  const [selectedSuperchains, setSelectedSuperchains] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const [selectedMinMax, setSelectedMinMax] = useState([undefined, undefined]);

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

  useEffect(() => {
    const loadHotels = async () => {
      console.log("loading hotels");
      const [minCost, maxCost] = selectedMinMax;
      const params = {
        superchain: selectedSuperchains.join(","),
        hotel: selectedHotels.join(","),
        type: selectedTypes.join(","),
        mincost: priceConversion(minCost, {
          from: exchangeRates[selectedCurrency],
          to: exchangeRates.USD,
        }),
        maxcost: priceConversion(maxCost, {
          from: exchangeRates[selectedCurrency],
          to: exchangeRates.USD,
        }),
      };

      console.log("loading hotels");
      const hotelResponse = await fetch(
        `/api/v1/hotels/${country}/${city}?${queryString.stringify({})}`
      );
      console.log("done");
      const hotelList = await hotelResponse.json();
      console.log(hotelList);
      setHotels(hotelList);
    };

    if (city && country) {
      console.log("loading hotels");
      loadHotels();
    }
    console.log("hotel", country, city);
  }, [
    city,
    country,
    selectedSuperchains,
    selectedHotels,
    selectedTypes,
    selectedCurrency,
    exchangeRates,
    selectedMinMax,
  ]);

  useEffect(() => {
    const loadFilters = async () => {
      const superchainResponse = await fetch("/api/v1/hotels/info/superchain");
      const superchainList = await superchainResponse.json();
      setSuperchainList(superchainList);
    };

    loadFilters();
  }, []);

  useEffect(() => {
    const loadCurrency = async () => {
      const currencyResponse = await fetch("/api/v1/currency/rates");
      const exchangeRates = await currencyResponse.json();
      setExchangeRates({ ...exchangeRates.rates, EUR: 1 });
    };

    loadCurrency();
  }, []);

  useEffect(() => {
    const loadFilters = async () => {
      const hotelResponse = await fetch("/api/v1/hotels/info/name");
      const hotelList = await hotelResponse.json();
      setHotelList(hotelList);
    };

    loadFilters();
  }, []);

  useEffect(() => {
    const loadFilters = async () => {
      const typeResponse = await fetch("/api/v1/hotels/info/type");
      const typeList = await typeResponse.json();
      setTypeList(typeList);
    };

    loadFilters();
  }, []);

  const handleSuperchainSelectionChange = useCallback((superchains) => {
    setSelectedSuperchains(superchains);
  }, []);

  const handleHotelSelectionChange = useCallback((hotels) => {
    setSelectedHotels(hotels);
  }, []);

  const handleTypeSelectionChange = useCallback((types) => {
    setSelectedTypes(types);
  }, []);

  const handleMinMaxSelectionChange = useCallback(
    ([minCost, maxCost]) => {
      setSelectedMinMax([minCost, maxCost === scaledMax ? undefined : maxCost]);
    },
    [scaledMax]
  );

  const handleCurrencyChange = useCallback((currency) => {
    setSelectedCurrency(currency);
  }, []);

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
