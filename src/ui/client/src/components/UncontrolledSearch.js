import React, { useState, useCallback, useEffect } from "react";
import Autosuggest from "react-autosuggest";
import queryString from "query-string";

import globalHistory from "./../globalHistory";

const getSuggestionValue = ({ city, country }) => `${city}, ${country}`;

const renderSuggestion = suggestion => (
  <span>{getSuggestionValue(suggestion)}</span>
);

const UncontrolledSearch = ({ city, country }) => {
  const [cities, setCities] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const getDestinations = useCallback(async () => {
    const response = await fetch("/api/v1/destinations");
    const data = await response.json();
    setCities(data.cities);
  }, []);

  // Autosuggest passes back an event and the new value.
  const handleChange = useCallback((_, { newValue }) => {
    setSearchBarValue(newValue);
  }, []);

  const getSuggestions = useCallback(
    value => {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;

      return inputLength === 0
        ? []
        : cities.filter(
            destination =>
              destination.city.toLowerCase().slice(0, inputLength) ===
                inputValue ||
              destination.country.toLowerCase().slice(0, inputLength) ===
                inputValue
          );
    },
    [cities]
  );

  const handleSuggestionsFetchRequested = useCallback(
    ({ value }) => {
      setSuggestions(getSuggestions(value));
    },
    [getSuggestions]
  );

  const handleSuggestionsClearRequested = useCallback(() => {
    setSuggestions([]);
  }, []);

  const handleSuggestionSelected = useCallback((_, { suggestion }) => {
    globalHistory.push(`/destination?${queryString.stringify(suggestion)}`);
  }, []);

  useEffect(() => {
    getDestinations();
  }, [getDestinations]);

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
      onSuggestionsClearRequested={handleSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={{
        placeholder: "Where will you bee traveling?",
        value: searchBarValue,
        onChange: handleChange
      }}
      onSuggestionSelected={handleSuggestionSelected}
    />
  );
};

export default UncontrolledSearch;
