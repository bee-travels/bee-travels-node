import React, { useState, useCallback, useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import queryString from "query-string";

import Content from "./components/Content";
import Home from "./components/Home";
import Error from "./components/Error";

const history = createBrowserHistory();

const getSuggestionValue = ({ city, country }) => `${city}, ${country}`;

const renderSuggestion = suggestion => (
  <span>{getSuggestionValue(suggestion)}</span>
);

const App = () => {
  const { city, country } = queryString.parse(history.location.search);

  const [cities, setCities] = useState([]);
  const [scrollbarValue, setScrollbarValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestedCity, setSuggestedCity] = useState(city || "");
  const [suggestedCountry, setSuggestedCountry] = useState(country || "");

  const getDestinations = useCallback(async () => {
    const response = await fetch("/api/v1/destinations");
    const data = await response.json();
    setCities(data.cities);
  }, []);

  // Autosuggest passes back an event and the new value.
  const handleChange = useCallback((_, { newValue }) => {
    setScrollbarValue(newValue);
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

  const onSuggestionsFetchRequested = useCallback(
    ({ value }) => {
      setSuggestions(getSuggestions(value));
    },
    [getSuggestions]
  );

  const onSuggestionsClearRequested = useCallback(() => {
    setSuggestions([]);
  }, []);

  const loadDestination = useCallback((_, { suggestion }) => {
    setSuggestedCity(suggestion.city);
    setSuggestedCountry(suggestion.country);
    history.push("/destination?" + queryString.stringify(suggestion));
  }, []);

  useEffect(() => {
    getDestinations();
  }, [getDestinations]);

  return (
    <Router history={history}>
      <Switch>
        <Route
          exact
          path="/"
          render={props => (
            <Home
              {...props}
              onChange={handleChange}
              getSuggestions={getSuggestions}
              getSuggestionValue={getSuggestionValue}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              renderSuggestion={renderSuggestion}
              loadDestination={loadDestination}
              scrollbarValue={scrollbarValue}
              suggestions={suggestions}
            />
          )}
        />
        <Route
          path="/destination"
          render={props => (
            <Content
              {...props}
              onChange={handleChange}
              getSuggestions={getSuggestions}
              getSuggestionValue={getSuggestionValue}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              renderSuggestion={renderSuggestion}
              loadDestination={loadDestination}
              scrollbarValue={scrollbarValue}
              suggestion={{ city: suggestedCity, country: suggestedCountry }}
              suggestions={suggestions}
            />
          )}
        />
        <Route component={Error} />
      </Switch>
    </Router>
  );
};

export default App;
