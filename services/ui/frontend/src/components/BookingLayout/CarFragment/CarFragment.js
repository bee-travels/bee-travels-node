import React, { useState, useEffect, useCallback, useMemo } from "react";
import queryString from "query-string";
import styles from "./CarFragment.module.css";
import DoubleSlider from "./DoubleSlider";
import MultiSelect from "./MultiSelect";
import Select from "./Select";

import globalHistory from "globalHistory";

import {
  TYPE,
  NAME,
  MIN_PRICE,
  MAX_PRICE,
  CURRENCY,
  CAR_STYLE,
  RENTAL_COMPANY,
} from "components/common/query-constants";

const fragmentEndpoint = "/api/v1/cars";

const DEFAULT_MAX = 700;

const ListItem = ({ superchain, name, cost, image }) => {
  return (
    <div className={styles.listItem}>
      <div
        className={styles.listItemImage}
        style={{
          background: `transparent url(${image}) no-repeat 0 0 / cover`,
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
  selectedStyles,
  selectedTypes,
  selectedHotels,
  selectedSuperchains,
  selectedExchangeRate,
  minHotelPrice,
  maxHotelPrice,
  styleList,
  typeList,
  hotelList,
  superchainList,
  exchangeRates,
  onSuperchainSelectionChange,
  onHotelSelectionChange,
  onTypeSelectionChange,
  onMinMaxSelectionChange,
  onCurrencyChange,
  onStyleSelectionChange,
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

  const handleStyleChange = (values) => {
    onStyleSelectionChange(values);
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
          label="Rental Companies"
          list={superchainList}
          selected={selectedSuperchains}
          onSelected={handleSuperchainChange}
        />
      </div>
      <div className={styles.filterWide}>
        <MultiSelect
          label="Cars"
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
      <div className={styles.filterNarrow}>
        <MultiSelect
          label="Style"
          list={styleList}
          selected={selectedStyles}
          onSelected={handleStyleChange}
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

const arrayify = (maybeArray) => {
  const _maybeArray = maybeArray || [];
  if (Array.isArray(_maybeArray)) {
    return _maybeArray;
  }
  return [_maybeArray];
};

const BookingFragment = ({ city, country, search, dateFrom, dateTo }) => {
  const queryObject = useMemo(() => queryString.parse(search), [search]);
  const selectedSuperchains = useMemo(
    () => arrayify(queryObject[RENTAL_COMPANY]),
    [queryObject]
  );
  const selectedHotels = useMemo(() => arrayify(queryObject[NAME]), [
    queryObject,
  ]);
  const selectedCarStyle = useMemo(() => arrayify(queryObject[CAR_STYLE]), [
    queryObject,
  ]);
  const selectedTypes = useMemo(() => arrayify(queryObject[TYPE]), [
    queryObject,
  ]);
  const minHotelPrice = useMemo(
    () => parseInt(queryObject[MIN_PRICE], 10) || 0,
    [queryObject]
  );
  const maxHotelPrice = useMemo(
    () => parseInt(queryObject[MAX_PRICE], 10) || undefined,
    [queryObject]
  );
  const selectedCurrency = useMemo(
    () => (queryObject[CURRENCY] || "usd").toUpperCase(),
    [queryObject]
  );

  const [exchangeRates, setExchangeRates] = useState({});

  const [superchainList, setSuperchainList] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [styleList, setStyleList] = useState([]);
  const [hotels, setHotels] = useState([]);

  const updateQuery = useCallback(
    (params) => {
      const query = queryString.stringify({
        [RENTAL_COMPANY]: selectedSuperchains,
        [CAR_STYLE]: selectedCarStyle,
        [NAME]: selectedHotels,
        [TYPE]: selectedTypes,
        [CURRENCY]: fixCurrency(selectedCurrency),
        [MIN_PRICE]: fixMin(minHotelPrice),
        [MAX_PRICE]: fixMax(maxHotelPrice),
        ...params,
      });
      globalHistory.push(`/destinations/${country}/${city}/cars?${query}`);
    },
    [
      city,
      country,
      maxHotelPrice,
      minHotelPrice,
      selectedCarStyle,
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
        company:
          selectedSuperchains.length > 0
            ? selectedSuperchains.join(",")
            : undefined,
        car: selectedHotels.length > 0 ? selectedHotels.join(",") : undefined,
        type: selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
        style:
          selectedCarStyle.length > 0 ? selectedCarStyle.join(",") : undefined,
        mincost: minHotelPrice,
        maxcost: maxHotelPrice,
        dateFrom: dateFrom,
        dateTo: dateTo,
      });

      const hotelResponse = await fetch(
        `${fragmentEndpoint}/${country}/${city}?${query}`
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
    maxHotelPrice,
    minHotelPrice,
    selectedCarStyle,
    selectedHotels,
    selectedSuperchains,
    selectedTypes,
    dateFrom, 
    dateTo,
  ]);

  // Load list of superchains.
  useEffect(() => {
    const loadSuperchains = async () => {
      const superchainResponse = await fetch(
        `${fragmentEndpoint}/info/rental_company`
      );
      const superchainList = await superchainResponse.json();
      setSuperchainList(superchainList);
    };

    loadSuperchains();
  }, []);

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
      const hotelResponse = await fetch(`${fragmentEndpoint}/info/name`);
      const hotelList = await hotelResponse.json();
      setHotelList(hotelList);
    };

    loadHotelChains();
  }, []);

  // Load list of hotel types.
  useEffect(() => {
    const loadHotelTypes = async () => {
      const typeResponse = await fetch(`${fragmentEndpoint}/info/body_type`);
      const typeList = await typeResponse.json();
      setTypeList(typeList);
    };

    loadHotelTypes();
  }, []);

  useEffect(() => {
    const loadHotelTypes = async () => {
      const typeResponse = await fetch(`${fragmentEndpoint}/info/style`);
      const typeList = await typeResponse.json();
      console.log(typeList);
      setStyleList(typeList);
    };

    loadHotelTypes();
  }, []);

  const handleSuperchainSelectionChange = useCallback(
    (superchains) => {
      updateQuery({ [RENTAL_COMPANY]: superchains });
    },
    [updateQuery]
  );

  const handleHotelSelectionChange = useCallback(
    (hotels) => {
      updateQuery({ [NAME]: hotels });
    },
    [updateQuery]
  );

  const handleTypeSelectionChange = useCallback(
    (types) => {
      updateQuery({ [TYPE]: types });
    },
    [updateQuery]
  );

  const handleStyleSelectionChange = useCallback(
    (styles) => {
      updateQuery({ [CAR_STYLE]: styles });
    },
    [updateQuery]
  );

  const handleMinMaxSelectionChange = useCallback(
    ([minCost, maxCost]) => {
      updateQuery({
        [MIN_PRICE]: fixMin(minCost),
        [MAX_PRICE]: fixMax(maxCost),
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
        selectedStyles={selectedCarStyle}
        selectedHotels={selectedHotels}
        selectedSuperchains={selectedSuperchains}
        selectedExchangeRate={selectedCurrency}
        superchainList={superchainList}
        minHotelPrice={minHotelPrice}
        maxHotelPrice={maxHotelPrice}
        typeList={typeList}
        styleList={styleList}
        hotelList={hotelList}
        exchangeRates={exchangeRates}
        onSuperchainSelectionChange={handleSuperchainSelectionChange}
        onHotelSelectionChange={handleHotelSelectionChange}
        onTypeSelectionChange={handleTypeSelectionChange}
        onStyleSelectionChange={handleStyleSelectionChange}
        onMinMaxSelectionChange={handleMinMaxSelectionChange}
        onCurrencyChange={handleCurrencyChange}
      />
      {hotels.map(({ rental_company, name, cost, image }) => {
        const priceString = priceConversion(cost, {
          from: exchangeRates.USD,
          to: exchangeRates[selectedCurrency],
        }).toLocaleString(undefined, {
          style: "currency",
          currency: selectedCurrency,
        });
        return (
          <ListItem
            superchain={rental_company}
            name={name}
            cost={priceString}
            image={image}
          />
        );
      })}
    </>
  );
};

export default BookingFragment;
