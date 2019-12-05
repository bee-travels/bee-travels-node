import React, { useState, useCallback, useEffect } from "react";
import Autosuggest from "react-autosuggest";
import queryString from "query-string";

import globalHistory from "./../globalHistory";

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

const UncontrolledSearch = () => {
  const [destinations, setDestinations] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [currentSuggestion, setCurrentSuggestion] = useState("");

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

  return (
    <Autosuggest
      suggestions={filterSuggestions(destinations, currentSuggestion)}
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
