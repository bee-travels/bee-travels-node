import React, { useState, useEffect, useCallback, useMemo } from "react";
import queryString from "query-string";
import styles from "./FlightFragment.module.css";
import DoubleSlider from "./DoubleSlider";
import MultiSelect from "./MultiSelect";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Select, { CustomSelectObject } from "./Select";

import globalHistory from "globalHistory";

import {
  TYPE,
  MIN_PRICE,
  MAX_PRICE,
  CURRENCY,
  SOURCE,
  SOURCE_AIRPORT,
  DESTINATION_AIRPORT,
  AIRLINES,
  AIRPORTS,
} from "components/common/query-constants";

const fragmentEndpoint = "/api/v1/flights";

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

const ListItem = ({ flight, cost }) => {
  const minuteToHour = (min) => {
    const _hour = Math.floor(min / 60);
    const _minute = Math.floor(min % 60);
    const hour = ("0" + _hour).slice(-2);
    const minute = ("0" + _minute).slice(-2);
    return `${hour}:${minute}`;
  };

  const minuteToDuration = (min) => {
    const _hour = Math.floor(min / 60);
    const _minute = Math.floor(min % 60);
    const hour = ("0" + _hour).slice(-2);
    const minute = ("0" + _minute).slice(-2);
    return `${hour} Hour and ${minute} Minute`;
  };

  if (!flight.flight_three_time && !flight.flight_two_time) {
    // not a one or two stop flight
    // has to be direct flight
    return (
      <div className={styles.listItem}>
        <div className={styles.listItemContent}>
          <div className={styles.listItemSub}>Nonstop</div>
          <div className={styles.listItemTitle}>{flight.airlines}</div>
          <div className={styles.listItemCost}>{cost}</div>
          <div className={styles.listItemSub}>
            {minuteToDuration(flight.time)}
          </div>
        </div>
      </div>
    );
  } else if (!flight.flight_three_time) {
    // not a two stop flight
    // has to be a one stop flight
    return (
      <div className={styles.listItem}>
        <div className={styles.listItemContent}>
          <div className={styles.listItemSub}>1 Stop</div>
          <div className={styles.listItemTitle}>{flight.airlines}</div>
          <div className={styles.listItemCost}>{cost}</div>
          <div className={styles.listItemSub}>
            {minuteToDuration(flight.time)}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.listItem}>
        <div className={styles.listItemContent}>
          <div className={styles.listItemSub}>2 Stop</div>
          <div className={styles.listItemTitle}>{flight.airlines}</div>
          <div className={styles.listItemCost}>{cost}</div>
          <div className={styles.listItemSub}>
            {minuteToDuration(flight.time)}
          </div>
        </div>
      </div>
    );
  }
};

const MetaData = ({
  fromDate,
  onFromDateChanged,
  toDate,
  onToDateChanged,
  count,
  onCountChanged,
}) => {
  const classes = useStyles();

  const handleFromDateChanged = (e) => {
    onFromDateChanged(e.target.value);
  };

  const handleToDateChanged = (e) => {
    onToDateChanged(e.target.value);
  };

  const handleCountChange = (e) => {
    onCountChanged(e.target.value);
  };

  return (
    <div className={styles.filters}>
      <TextField
        id="fromDate"
        label="Date From"
        type="date"
        className={classes.textField}
        onChange={handleFromDateChanged}
        value={fromDate}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="toDate"
        label="Date To"
        type="date"
        className={classes.textField}
        onChange={handleToDateChanged}
        value={toDate}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <div className={styles.filterWide}>
        <Select
          onSelected={handleCountChange}
          value={count}
          list={["Tickets", 1, 2, 3, 4, 5, 6, 7, 8]}
        />
      </div>
    </div>
  );
};

const Filters = ({
  selectedTypes,
  selectedAirlines,
  selectedSource,
  selectedSourceAirport,
  selectedDestinationAirport,
  selectedExchangeRate,
  minHotelPrice,
  maxHotelPrice,
  sourcesList,
  sourceAirportList,
  destinationAirportList,
  airlinesList,
  typeList,
  exchangeRates,
  onTypeSelectionChange,
  onSourceSelectedChange,
  onSourceAirportChange,
  onDestinationAirportChange,
  onAirlineSelectionChange,
  onMinMaxSelectionChange,
  onCurrencyChange,
}) => {
  const handleAirlinesChange = (values) => {
    onAirlineSelectionChange(values);
  };

  const handleTypeChange = (values) => {
    onTypeSelectionChange(values);
  };

  const handleSourceChange = (e) => {
    onSourceSelectedChange(e.target.value);
  };

  const handleSourceAirportChange = (e) => {
    onSourceAirportChange(e.target.value);
  };

  const handleDestinationAirportChange = (e) => {
    onDestinationAirportChange(e.target.value);
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
        <CustomSelectObject
          render={(item) => `${item.city}, ${item.country}`}
          label="Source"
          list={sourcesList}
          onSelected={handleSourceChange}
        />
      </div>
      <div className={styles.filterWide}>
        <CustomSelectObject
          render={(item) => `${item.name}, ${item.iata_code}`}
          label="Source Airport"
          list={sourceAirportList}
          onSelected={handleSourceAirportChange}
        />
      </div>

      <div className={styles.filterWide}>
        <CustomSelectObject
          render={(item) => `${item.name}, ${item.iata_code}`}
          label="Destination Airport"
          list={destinationAirportList}
          onSelected={handleDestinationAirportChange}
        />
      </div>

      <div className={styles.filterWide}>
        <MultiSelect
          label="Airlines"
          list={airlinesList}
          selected={selectedAirlines}
          onSelected={handleAirlinesChange}
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

const kebabCase = (val) => {
  return val.toLowerCase().split(" ").join("-");
};

const BookingFragment = ({ city, country, search }) => {
  const queryObject = useMemo(() => queryString.parse(search), [search]);
  const selectedAirlines = useMemo(() => arrayify(queryObject[AIRLINES]), [
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

  const selectedAirport = useMemo(() => arrayify(queryObject[AIRPORTS]), [
    queryObject,
  ]);

  const [exchangeRates, setExchangeRates] = useState({});

  const [airlinesList, setAirlinesList] = useState([]);
  const [sourceAirportList, setSourceAirportList] = useState([]);
  const [destinationAirportList, setDestinationAirportList] = useState([]);
  const [nonStopFlights, setNonStopFlights] = useState([]);
  const [oneStopFlights, setOneStopFlights] = useState([]);
  const [twoStopFlights, setTwoStopFlights] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [source, setSource] = useState(null);
  const [sourceAirport, setSourceAirport] = useState(null);
  const [destinationAirport, setDestinationAirport] = useState(null);
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [count, setCount] = React.useState(0);

  const updateQuery = useCallback(
    (params) => {
      const query = queryString.stringify({
        [AIRLINES]: selectedAirlines,
        [TYPE]: selectedTypes,
        [CURRENCY]: fixCurrency(selectedCurrency),
        [MIN_PRICE]: fixMin(minHotelPrice),
        [MAX_PRICE]: fixMax(maxHotelPrice),
        ...params,
      });
      globalHistory.push(`/destinations/${country}/${city}/flights?${query}`);
    },
    [
      city,
      country,
      maxHotelPrice,
      minHotelPrice,
      selectedCurrency,
      selectedTypes,
      selectedAirlines,
    ]
  );

  useEffect(() => {
    const loadDestinationAirports = async () => {
      const airportsResponse = await fetch(
        `${fragmentEndpoint}/airports?country=${country}&city=${city}`
      );
      const airports = await airportsResponse.json();
      setDestinationAirportList(airports);
    };
    loadDestinationAirports();
  }, [city, country]);

  useEffect(() => {
    const loadFlights = async () => {
      if (
        sourceAirport === null ||
        destinationAirport === null ||
        !dateValid(dateFrom, dateTo)
      ) {
        return [];
      }
      const flightsResponse = await fetch(
        `${fragmentEndpoint}/direct/${sourceAirport.id}/${destinationAirport.id}?dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
      const flightsList = await flightsResponse.json();
      console.log("DIRECT FLIGHTS LIST CALLED");
      console.log(flightsList);

      setNonStopFlights(flightsList);
    };
    loadFlights();
  }, [dateFrom, dateTo, destinationAirport, sourceAirport]);

  useEffect(() => {
    const loadFlights = async () => {
      if (
        sourceAirport === null ||
        destinationAirport === null ||
        !dateValid(dateFrom, dateTo)
      ) {
        return [];
      }
      const flightsResponse = await fetch(
        `${fragmentEndpoint}/onestop/${sourceAirport.id}/${destinationAirport.id}?dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
      const flightsList = await flightsResponse.json();
      console.log("ONESTOP FLIGHTS LIST CALLED");
      console.log(flightsList);
      setOneStopFlights(flightsList);
    };
    loadFlights();
  }, [dateFrom, dateTo, destinationAirport, sourceAirport]);

  useEffect(() => {
    const loadFlights = async () => {
      if (
        sourceAirport === null ||
        destinationAirport === null ||
        !dateValid(dateFrom, dateTo)
      ) {
        return [];
      }
      const flightsResponse = await fetch(
        `${fragmentEndpoint}/twostop/${sourceAirport.id}/${destinationAirport.id}?dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
      const flightsList = await flightsResponse.json();
      console.log("TWOSTOP FLIGHTS LIST CALLED");
      console.log(flightsList);
      setTwoStopFlights(flightsList);
    };
    loadFlights();
  }, [dateFrom, dateTo, destinationAirport, sourceAirport]);

  // Load list of superchains.
  useEffect(() => {
    const loadAirlines = async () => {
      const airlinesResponse = await fetch(`${fragmentEndpoint}/info/airlines`);
      const airlines = await airlinesResponse.json();
      setAirlinesList(airlines);
    };

    loadAirlines();
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

  // Load list of hotel types.
  useEffect(() => {
    const loadFlightTypes = async () => {
      const typeResponse = await fetch(`${fragmentEndpoint}/info/type`);
      const types = await typeResponse.json();
      setTypeList(types);
    };

    loadFlightTypes();
  }, []);

  useEffect(() => {
    const loadSources = async () => {
      const sourceResponse = await fetch(`${fragmentEndpoint}/airports/all`);
      const source = await sourceResponse.json();
      source.sort((a, b) =>
        a.city === b.city
          ? a.country > b.country
            ? 1
            : -1
          : a.city > b.city
          ? 1
          : -1
      );
      setSourceList(source);
    };

    loadSources();
  }, []);

  useEffect(() => {
    const loadSourceAirports = async () => {
      if (source === null) {
        return [];
      }
      const city = kebabCase(source.city);
      const country = kebabCase(source.country);
      console.log(
        `${fragmentEndpoint}/airports?country=${country}&city=${city}`
      );
      const airportsResponse = await fetch(
        `${fragmentEndpoint}/airports?country=${country}&city=${city}`
      );
      const airports = await airportsResponse.json();
      setSourceAirportList(airports);
    };
    loadSourceAirports();
  }, [source]);

  const handleSourceChange = useCallback(
    (source) => {
      setSource(JSON.parse(source));
      updateQuery({ [SOURCE]: source });
    },
    [updateQuery]
  );

  const hanldeSourceAirportChange = useCallback(
    (source) => {
      setSourceAirport(JSON.parse(source));
      updateQuery({ [SOURCE_AIRPORT]: source });
    },
    [updateQuery]
  );

  const handleDestinationAirportChange = useCallback(
    (source) => {
      setDestinationAirport(JSON.parse(source));
      updateQuery({ [DESTINATION_AIRPORT]: source });
    },
    [updateQuery]
  );

  const handleAirlinesSelectionChange = useCallback(
    (airlines) => {
      updateQuery({ [AIRLINES]: airlines });
    },
    [updateQuery]
  );

  const handleAirportSelectionChange = useCallback(
    (airport) => {
      updateQuery({ [AIRPORTS]: airport });
    },
    [updateQuery]
  );

  const handleTypeSelectionChange = useCallback(
    (types) => {
      updateQuery({ [TYPE]: types });
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
        selectedAirlines={selectedAirlines}
        selectedExchangeRate={selectedCurrency}
        selectedAirport={selectedAirport}
        minHotelPrice={minHotelPrice}
        maxHotelPrice={maxHotelPrice}
        typeList={typeList}
        sourcesList={sourceList}
        sourceAirportList={sourceAirportList}
        destinationAirportList={destinationAirportList}
        selectedSourceAirport={sourceAirport}
        selectedDestinationAirport={destinationAirport}
        airlinesList={airlinesList}
        exchangeRates={exchangeRates}
        onSourceSelectedChange={handleSourceChange}
        onAirlineSelectionChange={handleAirlinesSelectionChange}
        onTypeSelectionChange={handleTypeSelectionChange}
        onAirportSelectionChange={handleAirportSelectionChange}
        onSourceAirportChange={hanldeSourceAirportChange}
        onDestinationAirportChange={handleDestinationAirportChange}
        onMinMaxSelectionChange={handleMinMaxSelectionChange}
        onCurrencyChange={handleCurrencyChange}
      />
      {[...oneStopFlights, ...twoStopFlights, ...nonStopFlights]
        .sort((a, b) => a.time - b.time)
        .map((flight) => {
          const priceString = priceConversion(flight.cost, {
            from: exchangeRates.USD,
            to: exchangeRates[selectedCurrency],
          }).toLocaleString(undefined, {
            style: "currency",
            currency: selectedCurrency,
          });
          return <ListItem flight={flight} cost={priceString} />;
        })}
    </>
  );
};

export default BookingFragment;
