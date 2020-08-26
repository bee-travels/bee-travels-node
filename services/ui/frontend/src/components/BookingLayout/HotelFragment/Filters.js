import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import DoubleSlider from "components/common/DoubleSlider";
import MultiSelect from "components/common/MultiSelect";
import Select from "components/common/Select";

import useExchangeRates from "api/use-exchange-rate";
import useInfo from "api/use-info";

import styles from "./HotelFragment.module.css";
import priceConversion from "components/common/convert-currency";
import { DEFAULT_MAX } from "api/use-hotels";
import { useActions } from "redux/actions";

function Filters() {
  const { setFilters, setMinMaxFilters } = useActions();
  const hotels = useSelector((state) => state.hotelFilters);

  const { exchangeRates } = useExchangeRates();
  const { data: superchainList = [] } = useInfo(
    "/api/v1/hotels/info/superchain"
  );
  const { data: hotelList = [] } = useInfo("/api/v1/hotels/info/name");
  const { data: typeList = [] } = useInfo("/api/v1/hotels/info/type");

  const handleSuperchainChange = (values) => {
    setFilters({
      service: "hotelFilters",
      filter: "superchains",
      value: values,
    });
  };

  const handleHotelChange = (values) => {
    setFilters({
      service: "hotelFilters",
      filter: "names",
      value: values,
    });
  };

  const handleTypeChange = (values) => {
    setFilters({
      service: "hotelFilters",
      filter: "types",
      value: values,
    });
  };

  const handleCurrencyChange = (e) => {
    setFilters({
      service: "hotelFilters",
      filter: "currency",
      value: e.target.value,
    });
  };

  // We need an intermediate state for while sliding
  const [slideValues, setSlideValues] = useState([
    hotels.minPrice || 0,
    hotels.maxPrice || 700,
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
      setMinMaxFilters({
        service: "hotelFilters",
        value: roundedValues,
      });
    },
    [setMinMaxFilters]
  );

  const scaledMax = Math.round(
    priceConversion(DEFAULT_MAX, {
      from: exchangeRates.USD,
      to: exchangeRates[hotels.currency],
    })
  );

  const displayMinPrice = Math.round(
    priceConversion(slideValues[0], {
      from: exchangeRates.USD,
      to: exchangeRates[hotels.currency],
    })
  );

  const displayMaxPrice = Math.round(
    priceConversion(slideValues[1], {
      from: exchangeRates.USD,
      to: exchangeRates[hotels.currency],
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
          selected={hotels.superchains}
          onSelected={handleSuperchainChange}
        />
      </div>
      <div className={styles.filterWide}>
        <MultiSelect
          label="Hotels"
          list={hotelList}
          selected={hotels.names}
          onSelected={handleHotelChange}
        />
      </div>
      <div className={styles.filterNarrow}>
        <MultiSelect
          label="Types"
          list={typeList}
          selected={hotels.types}
          onSelected={handleTypeChange}
        />
      </div>
      <div className={styles.filterSuperNarrow}>
        <Select
          list={Object.keys(exchangeRates)}
          selected={hotels.currency}
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
}

export default Filters;
