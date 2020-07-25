import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import DoubleSlider from "components/common/DoubleSlider";
import MultiSelect from "components/common/MultiSelect";
import Select from "components/common/Select";

import useExchangeRates from "api/use-exchange-rate";
import useInfo from "api/use-info";

import styles from "./CarFragment.module.css";

import priceConversion from "components/common/convert-currency";
import { DEFAULT_MAX } from "api/use-cars";
import { useActions } from "redux/actions";

function Filters() {
  const { setFilters, setMinMaxFilters } = useActions();
  const cars = useSelector((state) => state.carFilters);

  const { exchangeRates } = useExchangeRates();
  const { data: rentalCompanyList = [] } = useInfo(
    "/api/v1/cars/info/rental_company"
  );
  const { data: carsList = [] } = useInfo("/api/v1/cars/info/name");
  const { data: styleList = [] } = useInfo("/api/v1/cars/info/style");
  const { data: typeList = [] } = useInfo("/api/v1/cars/info/body_type");

  const handleRentalCompanyChange = (values) => {
    setFilters({
      service: "carFilters",
      filter: "rentalCompanies",
      value: values,
    });
  };

  const handleCarChange = (values) => {
    setFilters({
      service: "carFilters",
      filter: "names",
      value: values,
    });
  };

  const handleTypeChange = (values) => {
    setFilters({
      service: "carFilters",
      filter: "types",
      value: values,
    });
  };

  const handleStyleChange = (values) => {
    setFilters({
      service: "carFilters",
      filter: "carStyles",
      value: values,
    });
  };

  const handleCurrencyChange = (e) => {
    setFilters({
      service: "carFilters",
      filter: "currency",
      value: e.target.value,
    });
  };

  // We need an intermediate state for while sliding
  const [slideValues, setSlideValues] = useState([
    cars.minPrice || 0,
    cars.maxPrice || 700,
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
        service: "carFilters",
        value: roundedValues,
      });
    },
    [setMinMaxFilters]
  );

  const scaledMax = Math.round(
    priceConversion(DEFAULT_MAX, {
      from: exchangeRates.USD,
      to: exchangeRates[cars.currency],
    })
  );

  const displayMinPrice = Math.round(
    priceConversion(slideValues[0], {
      from: exchangeRates.USD,
      to: exchangeRates[cars.currency],
    })
  );

  const displayMaxPrice = Math.round(
    priceConversion(slideValues[1], {
      from: exchangeRates.USD,
      to: exchangeRates[cars.currency],
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
          label="Rental Company"
          list={rentalCompanyList}
          selected={cars.rentalCompanies}
          onSelected={handleRentalCompanyChange}
        />
      </div>
      <div className={styles.filterNarrow}>
        <MultiSelect
          label="Cars"
          list={carsList}
          selected={cars.names}
          onSelected={handleCarChange}
        />
      </div>
      <div className={styles.filterNarrow}>
        <MultiSelect
          label="Types"
          list={typeList}
          selected={cars.types}
          onSelected={handleTypeChange}
        />
      </div>
      <div className={styles.filterNarrow}>
        <MultiSelect
          label="Style"
          list={styleList}
          selected={cars.carStyles}
          onSelected={handleStyleChange}
        />
      </div>
      <div className={styles.filterSuperNarrow}>
        <Select
          list={Object.keys(exchangeRates)}
          selected={cars.currency}
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
