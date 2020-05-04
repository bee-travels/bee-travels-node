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

const UncontrolledSearch = ({ theme }) => {
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
    const {country, city} = suggestion
    globalHistory.push(`/destinations/${pillify(country)}/${pillify(city)}`);
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
    <div
      style={{
        margin: " 23px 42px",
        width: "584px",
        position: "relative",
      }}
    >
      <svg
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        aria-hidden="true"
        style={{
          color: "rgb(22, 22, 22)",
          position: "absolute",
          left: "24px",
          top: "24px",
          height: "20px",
          width: "20px",
          transform: "translate(-50%, -50%)",
        }}
        // class="bx--search-magnifier"
        // style="will-change: transform;"
      >
        <path d="M15,14.3L10.7,10c1.9-2.3,1.6-5.8-0.7-7.7S4.2,0.7,2.3,3S0.7,8.8,3,10.7c2,1.7,5,1.7,7,0l4.3,4.3L15,14.3z M2,6.5	C2,4,4,2,6.5,2S11,4,11,6.5S9,11,6.5,11S2,9,2,6.5z"></path>
      </svg>
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
        }}
        onSuggestionSelected={handleSuggestionSelected}
      />
    </div>
  );
};

export default UncontrolledSearch;
