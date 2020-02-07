import React, { useState, useCallback, useEffect } from "react";
import Autosuggest from "react-autosuggest";
import queryString from "query-string";
import { Link } from "react-router-dom";

import BeeLogo from "components/common/BeeLogo";

import globalHistory from "globalHistory";

import styles from "./DestinationFragment.module.css";

const getSuggestionValue = ({ city, country }) => `${city}, ${country}`;

const renderSuggestion = suggestion => (
  <span>{getSuggestionValue(suggestion)}</span>
);

const filterSuggestions = (destinations, value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  if (inputLength === 0) {
    return [];
  }

  return destinations.filter(
    destination =>
      destination.city.toLowerCase().slice(0, inputLength) === inputValue ||
      destination.country.toLowerCase().slice(0, inputLength) === inputValue
  );
};

const UncontrolledSearch = ({ theme }) => {
  const [destinations, setDestinations] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [currentSuggestion, setCurrentSuggestion] = useState("");
  const [active, setActive] = useState(false);

  // Autosuggest passes back an event and the new value.
  const handleChange = useCallback((_, { newValue }) => {
    setSearchBarValue(newValue);
  }, []);

  const handleSuggestionsFetchRequested = useCallback(({ value }) => {
    setCurrentSuggestion(value);
  }, []);

  const handleSuggestionsClearRequested = useCallback(() => {
    setCurrentSuggestion("");
  }, []);

  const handleSuggestionSelected = useCallback((_, { suggestion }) => {
    globalHistory.push(`/destination?${queryString.stringify(suggestion)}`);
  }, []);

  useEffect(() => {
    const loadDestinations = async () => {
      const res = await fetch("/api/v1/destinations");
      const { cities } = await res.json();
      setDestinations(cities);
    };
    loadDestinations();
  }, []);

  const handleActivate = useCallback(() => {
    setActive(true);
    setTimeout(() => {
      document.getElementsByTagName("input")[0].focus();
    }, 300);
  }, []);

  const handleDeactivate = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <div className={styles.titlebar}>
      <Link to="/" className={active ? styles.homeLinkActive : styles.homeLink}>
        <BeeLogo className={styles.logoImage} />
        <div className={styles.logoText}>Bee Travels</div>
      </Link>
      <div
        className={
          active ? styles.searchIconWrapperActive : styles.searchIconWrapper
        }
      >
        <svg
          onClick={handleActivate}
          className={styles.searchIcon}
          focusable="false"
          width="32"
          height="32"
          viewBox="0 0 32 32"
        >
          <path d="M30,28.59,22.45,21A11,11,0,1,0,21,22.45L28.59,30ZM5,14a9,9,0,1,1,9,9A9,9,0,0,1,5,14Z"></path>
        </svg>
      </div>
      {active && (
        <Autosuggest
          suggestions={filterSuggestions(destinations, currentSuggestion)}
          onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={handleSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          theme={theme}
          inputProps={{
            placeholder: "Where will you bee traveling?",
            value: searchBarValue,
            onChange: handleChange,
            onBlur: handleDeactivate
          }}
          onSuggestionSelected={handleSuggestionSelected}
        />
      )}
    </div>
  );
};

export default UncontrolledSearch;
