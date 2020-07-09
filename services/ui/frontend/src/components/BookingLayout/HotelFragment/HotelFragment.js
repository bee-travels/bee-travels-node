import React, { useState, useEffect, useCallback, useMemo } from "react";
import queryString from "query-string";
import styles from "./HotelFragment.module.css";
import DoubleSlider from "./DoubleSlider";
import MultiSelect from "./MultiSelect";
import Select from "./Select";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import globalHistory from "globalHistory";

import {
  SUPERCHAINS,
  TYPE,
  NAME,
  MIN_PRICE,
  MAX_PRICE,
  CURRENCY,
} from "components/common/query-constants";

const DEFAULT_MAX = 700;

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const parseDate = (date) => Date.parse(date);
const dateValid = (from, to) => {
  if (from === "" || to === "") {
    return false;
  }

  const _from = parseDate(from);
  const _to = parseDate(to);

  if (_from > _to) {
    return false;
  }

  return true;
};

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

const MetaData = ({
  fromDate,
  onFromDateChanged,
  toDate,
  onToDateChanged,
  count,
  onCountChanged
}) => {
  const classes = useStyles();

  const handleFromDateChanged = (e) => {
    onFromDateChanged(e.target.value);
  }

  const handleToDateChanged = (e) => {
    onToDateChanged(e.target.value);
  }

  const handleCountChange = (e) => {
    onCountChanged(e.target.value);
  };

  return (
    <div className={styles.filters}>
      <TextField
        id="fromDate"
        label="Date From"
        type="date"
        value={fromDate}
        onChange={handleFromDateChanged}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="toDate"
        label="Date To"
        type="date"
        value={toDate}
        onChange={handleToDateChanged}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <div className={styles.filterNarrow}>
        <Select 
          value={count}
          onSelected={handleCountChange}
          list={["Hotel Rooms",1,2,3,4,5,6,7,8]}
        />
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

const arrayify = (maybeArray) => {
  const _maybeArray = maybeArray || [];
  if (Array.isArray(_maybeArray)) {
    return _maybeArray;
  }
  return [_maybeArray];
};

const BookingFragment = ({ country, city, search }) => {
  const queryObject = useMemo(() => queryString.parse(search), [search]);

  const selectedSuperchains = useMemo(
    () => arrayify(queryObject[SUPERCHAINS]),
    [queryObject]
  );
  const selectedHotels = useMemo(() => arrayify(queryObject[NAME]), [
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

  const [hotels, setHotels] = useState([]);
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [count, setCount] = React.useState(0);

  const updateQuery = useCallback(
    (params) => {
      const query = queryString.stringify({
        [SUPERCHAINS]: selectedSuperchains,
        [NAME]: selectedHotels,
        [TYPE]: selectedTypes,
        [CURRENCY]: fixCurrency(selectedCurrency),
        [MIN_PRICE]: fixMin(minHotelPrice),
        [MAX_PRICE]: fixMax(maxHotelPrice),
        ...params,
      });
      globalHistory.push(`/destinations/${country}/${city}/hotels?${query}`);
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
    console.log("load hotel");

    const loadHotels = async () => {
      if (!dateValid(dateFrom, dateTo)) {
        console.log("Date Invalid");
        return [];
      }

      console.log("will run query");
      const query = queryString.stringify({
        superchain:
          selectedSuperchains.length > 0
            ? selectedSuperchains.join(",")
            : undefined,
        hotel: selectedHotels.length > 0 ? selectedHotels.join(",") : undefined,
        type: selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
        mincost: fixMin(minHotelPrice),
        maxcost: fixMax(maxHotelPrice),
        dateFrom: dateFrom,
        dateTo: dateTo,
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
    maxHotelPrice,
    minHotelPrice,
    selectedHotels,
    selectedSuperchains,
    selectedTypes,
    dateFrom,
    dateTo,
  ]);

  // Load list of superchains.
  useEffect(() => {
    const loadSuperchains = async () => {
      const superchainResponse = await fetch("/api/v1/hotels/info/superchain");
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
      console.log("sc");
      updateQuery({ [SUPERCHAINS]: superchains });
    },
    [updateQuery]
  );

  const handleHotelSelectionChange = useCallback(
    (hotels) => {
      console.log("n");
      updateQuery({ [NAME]: hotels });
    },
    [updateQuery]
  );

  const handleTypeSelectionChange = useCallback(
    (types) => {
      console.log("t");
      updateQuery({ [TYPE]: types });
    },
    [updateQuery]
  );

  const handleMinMaxSelectionChange = useCallback(
    ([minCost, maxCost]) => {
      console.log("p");
      updateQuery({
        [MIN_PRICE]: fixMin(minCost),
        [MAX_PRICE]: fixMax(maxCost),
      });
    },
    [updateQuery]
  );

  const handleCurrencyChange = useCallback(
    (currency) => {
      console.log("c");
      updateQuery({ [CURRENCY]: fixCurrency(currency) });
    },
    [updateQuery]
  );

  return (
    <>
      <MetaData 
        fromDate={dateFrom}
        onFromDateChanged={setDateFrom}
        toDate={dateTo}
        onToDateChanged={setDateTo}
        count={count}
        onCountChanged={setCount}
      />
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
