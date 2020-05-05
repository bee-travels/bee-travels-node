import React, { useState, useCallback, useEffect } from "react";
import Autosuggest from "react-autosuggest";
import globalHistory from "globalHistory";

const getSuggestionValue = ({ city, country }) => `${city}, ${country}`;

const pillify = (s) => s.toLowerCase().replace(" ", "-");

const renderSuggestion = (suggestion) => (
  <span>{getSuggestionValue(suggestion)}</span>
);

const filterSuggestions = (destinations, value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  if (inputLength === 0) {
    return [];
  }

  return destinations.filter(
    (destination) =>
      destination.city.toLowerCase().slice(0, inputLength) === inputValue ||
      destination.country.toLowerCase().slice(0, inputLength) === inputValue
  );
};

const BaseSearch = ({ theme, onBlur }) => {
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
    const { country, city } = suggestion;
    globalHistory.push(
      `/destinations/${pillify(country)}/${pillify(city)}${
        globalHistory.location.search
      }`
    );
  }, []);

  useEffect(() => {
    const loadDestinations = async () => {
      const res = await fetch("/api/v1/destinations");
      const data = await res.json();
      setDestinations(data);
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
      theme={theme}
      inputProps={{
        placeholder: "Where will you bee traveling?",
        value: searchBarValue,
        onChange: handleChange,
        onBlur: onBlur,
      }}
      onSuggestionSelected={handleSuggestionSelected}
    />
  );
};

export default BaseSearch;
