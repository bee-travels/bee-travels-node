import React, { useState, useEffect, useCallback, useMemo } from "react";
import queryString from "query-string";
import styles from "./FlightFragment.module.css";
import DoubleSlider from "./DoubleSlider";
import MultiSelect from "./MultiSelect";
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

const ListItem = ({ airlines, cost, time, duration }) => {
  const minuteToHour = (min) => {
    const hour = Math.floor(min / 60);
    const minute = min % 60;
    return `${hour}:${minute}`;
  }

  const minuteToDuration = (min) => {
    const hour = Math.floor(min / 60);
    const minute = Math.floor(min % 60);
    return `${hour} Hour and ${minute} Minute`;
  }
  return (
    <div className={styles.listItem}>
      <div className={styles.listItemContent}>
        <div className={styles.listItemTitle}>{airlines}</div>
        <div className={styles.listItemTitle}>{minuteToHour(time)}</div>
        <div className={styles.listItemCost}>{cost}</div>
        <div className={styles.listItemSub}>{minuteToDuration(duration)}</div>
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
  }

  const handleDestinationAirportChange = (e) => {
    onDestinationAirportChange(e.target.value);
  }

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
  const [flights, setFlights] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [source, setSource] = useState(null);
  const [sourceAirport, setSourceAirport] = useState(null);
  const [destinationAirport, setDestinationAirport] = useState(null);

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
      selectedAirlines
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
      if (sourceAirport === null || destinationAirport === null) {
        return [];
      }
      const flightsResponse = await fetch(
        `${fragmentEndpoint}/direct/${sourceAirport.id}/${destinationAirport.id}`
      );
      const flightsList = await flightsResponse.json();
      console.log("FLIGHTS LIST CALLED");
      console.log(flightsList);
      setFlights([...flights, ...flightsList]);
    };
    loadFlights();
  }, [destinationAirport, sourceAirport]);

  useEffect(() => {
    const loadFlights = async () => {
      if (sourceAirport === null || destinationAirport === null) {
        return [];
      }
      const flightsResponse = await fetch(
        `${fragmentEndpoint}/onestop/${sourceAirport.id}/${destinationAirport.id}`
      );
      const flightsList = await flightsResponse.json();
      console.log("FLIGHTS LIST CALLED");
      console.log(flightsList);
      setFlights([...flights, ...flightsList]);
    };
    loadFlights();
  }, [destinationAirport, sourceAirport]);

  useEffect(() => {
    const loadFlights = async () => {
      if (sourceAirport === null || destinationAirport === null) {
        return [];
      }
      const flightsResponse = await fetch(
        `${fragmentEndpoint}/twostop/${sourceAirport.id}/${destinationAirport.id}`
      );
      const flightsList = await flightsResponse.json();
      console.log("FLIGHTS LIST CALLED");
      console.log(flightsList);
      setFlights([...flights, ...flightsList]);
    };
    loadFlights();
  }, [destinationAirport, sourceAirport]);

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
      {flights.map(({ airlines, cost, flight_duration, flight_time }) => {
        const priceString = priceConversion(cost, {
          from: exchangeRates.USD,
          to: exchangeRates[selectedCurrency],
        }).toLocaleString(undefined, {
          style: "currency",
          currency: selectedCurrency,
        });
        return (
          <ListItem
            airlines={airlines}
            time={flight_time}
            cost={priceString}
            duration={flight_duration}
          />
        );
      })}
    </>
  );
};

export default BookingFragment;
