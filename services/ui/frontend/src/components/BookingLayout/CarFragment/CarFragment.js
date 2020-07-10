import React, { useState, useEffect, useCallback, useMemo } from "react";
import queryString from "query-string";
import styles from "./CarFragment.module.css";
import DoubleSlider from "./DoubleSlider";
import MultiSelect from "./MultiSelect";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {useSelector} from 'react-redux';
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
import { useActions } from "redux/actions";

const fragmentEndpoint = "/api/v1/cars";

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

const ListItem = ({ id, superchain, name, cost, image }) => {
  const {addToCart} = useActions();
  const cars = useSelector(state => state.cars);
  const numberInCart = cars.filter(carId => carId === id).length;
  const handleAddToCart = () => {
    addToCart(id);
  }
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
      <button style={{marginLeft: 'auto'}} onClick={handleAddToCart}>Add to Cart</button>
      {numberInCart > 0 && <button>Remove </button>} 
      {numberInCart}
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
        onChange={handleFromDateChanged}
        value={fromDate}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="toDate"
        label="Date To"
        type="date"
        onChange={handleToDateChanged}
        value={toDate}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <div className={styles.filterNarrow}>
        <Select 
          onSelected={handleCountChange}
          value={count}
          list={["Passanger Count",1,2,3]}
        />
      </div>
    </div>
  );
};

const Filters = ({
  selectedStyles,
  selectedTypes,
  selectedCars,
  selectedSuperchains,
  selectedExchangeRate,
  minCarPrice,
  maxCarPrice,
  styleList,
  typeList,
  carList,
  superchainList,
  exchangeRates,
  onSuperchainSelectionChange,
  onCarSelectionChange,
  onTypeSelectionChange,
  onMinMaxSelectionChange,
  onCurrencyChange,
  onStyleSelectionChange,
}) => {
  const handleSuperchainChange = (values) => {
    onSuperchainSelectionChange(values);
  };

  const handleCarChange = (values) => {
    onCarSelectionChange(values);
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
    minCarPrice || 0,
    maxCarPrice || 700,
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
          list={carList}
          selected={selectedCars}
          onSelected={handleCarChange}
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

const BookingFragment = ({ city, country, search }) => {
  const queryObject = useMemo(() => queryString.parse(search), [search]);
  const selectedSuperchains = useMemo(
    () => arrayify(queryObject[RENTAL_COMPANY]),
    [queryObject]
  );
  const selectedCars = useMemo(() => arrayify(queryObject[NAME]), [
    queryObject,
  ]);
  const selectedCarStyle = useMemo(() => arrayify(queryObject[CAR_STYLE]), [
    queryObject,
  ]);
  const selectedTypes = useMemo(() => arrayify(queryObject[TYPE]), [
    queryObject,
  ]);
  const minCarPrice = useMemo(
    () => parseInt(queryObject[MIN_PRICE], 10) || 0,
    [queryObject]
  );
  const maxCarPrice = useMemo(
    () => parseInt(queryObject[MAX_PRICE], 10) || undefined,
    [queryObject]
  );
  const selectedCurrency = useMemo(
    () => (queryObject[CURRENCY] || "usd").toUpperCase(),
    [queryObject]
  );

  const [exchangeRates, setExchangeRates] = useState({});

  const [superchainList, setSuperchainList] = useState([]);
  const [carList, setCarList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [styleList, setStyleList] = useState([]);
  const [cars, setCars] = useState([]);
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [count, setCount] = React.useState(0);

  const updateQuery = useCallback(
    (params) => {
      const query = queryString.stringify({
        [RENTAL_COMPANY]: selectedSuperchains,
        [CAR_STYLE]: selectedCarStyle,
        [NAME]: selectedCars,
        [TYPE]: selectedTypes,
        [CURRENCY]: fixCurrency(selectedCurrency),
        [MIN_PRICE]: fixMin(minCarPrice),
        [MAX_PRICE]: fixMax(maxCarPrice),
        ...params,
      });
      globalHistory.push(`/destinations/${country}/${city}/cars?${query}`);
    },
    [
      city,
      country,
      maxCarPrice,
      minCarPrice,
      selectedCarStyle,
      selectedCurrency,
      selectedCars,
      selectedSuperchains,
      selectedTypes,
    ]
  );

  // Load list of cars.
  useEffect(() => {
    const loadCars = async () => {
      if (!dateValid(dateFrom, dateTo)) {
        return [];
      }
      const query = queryString.stringify({
        company:
          selectedSuperchains.length > 0
            ? selectedSuperchains.join(",")
            : undefined,
        car: selectedCars.length > 0 ? selectedCars.join(",") : undefined,
        type: selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
        style:
          selectedCarStyle.length > 0 ? selectedCarStyle.join(",") : undefined,
        mincost: minCarPrice,
        maxcost: maxCarPrice,
        dateFrom: dateFrom,
        dateTo: dateTo,
      });

      const carResponse = await fetch(
        `${fragmentEndpoint}/${country}/${city}?${query}`
      );
      const carList = await carResponse.json();

      setCars(carList);
    };

    if (city && country) {
      loadCars();
    }
  }, [
    city,
    country,
    maxCarPrice,
    minCarPrice,
    selectedCarStyle,
    selectedCars,
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

  // Load list of cars chains.
  useEffect(() => {
    const loadCarBrands = async () => {
      const carResponse = await fetch(`${fragmentEndpoint}/info/name`);
      const carList = await carResponse.json();
      setCarList(carList);
    };

    loadCarBrands();
  }, []);

  // Load list of car types.
  useEffect(() => {
    const loadCarTypes = async () => {
      const typeResponse = await fetch(`${fragmentEndpoint}/info/body_type`);
      const typeList = await typeResponse.json();
      setTypeList(typeList);
    };

    loadCarTypes();
  }, []);

  useEffect(() => {
    const loadCarStyle = async () => {
      const typeResponse = await fetch(`${fragmentEndpoint}/info/style`);
      const typeList = await typeResponse.json();
      console.log(typeList);
      setStyleList(typeList);
    };

    loadCarStyle();
  }, []);

  const handleSuperchainSelectionChange = useCallback(
    (superchains) => {
      updateQuery({ [RENTAL_COMPANY]: superchains });
    },
    [updateQuery]
  );

  const handleCarSelectionChange = useCallback(
    (cars) => {
      updateQuery({ [NAME]: cars });
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
        selectedStyles={selectedCarStyle}
        selectedCars={selectedCars}
        selectedSuperchains={selectedSuperchains}
        selectedExchangeRate={selectedCurrency}
        superchainList={superchainList}
        minCarPrice={minCarPrice}
        maxCarPrice={maxCarPrice}
        typeList={typeList}
        styleList={styleList}
        carList={carList}
        exchangeRates={exchangeRates}
        onSuperchainSelectionChange={handleSuperchainSelectionChange}
        onCarSelectionChange={handleCarSelectionChange}
        onTypeSelectionChange={handleTypeSelectionChange}
        onStyleSelectionChange={handleStyleSelectionChange}
        onMinMaxSelectionChange={handleMinMaxSelectionChange}
        onCurrencyChange={handleCurrencyChange}
      />
      {cars.map(({ id, rental_company, name, cost, image }) => {
        const priceString = priceConversion(cost, {
          from: exchangeRates.USD,
          to: exchangeRates[selectedCurrency],
        }).toLocaleString(undefined, {
          style: "currency",
          currency: selectedCurrency,
        });
        return (
          <ListItem
            key={id}
            id={id}
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
