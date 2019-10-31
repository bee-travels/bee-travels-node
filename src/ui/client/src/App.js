import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory as createHistory } from "history";

import Content from "./components/Content";
import Home from "./components/Home";
import Error from "./components/Error";

class App extends React.Component {

  constructor(props) {
    super(props);

    this.history = createHistory();

    this.state = {
      destinationList: [],
      scrollbarValue: "",
      suggestions: [],
      suggestion: {
        state: "",
        country: ""
      }
    };

    this.onChange = this.onChange.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.loadDestination = this.loadDestination.bind(this);

    this.getDestinations();
  }

  getDestinations = async (e) => {
    if (e) e.preventDefault();

    const response = await fetch("/api/v1/destinations");

    var data = await response.json();

    this.setState({ destinationList: data["cities"] });
  }

  onChange = (event, { newValue }) => {
    this.setState({
      scrollbarValue: newValue
    });
  };

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.state.destinationList.filter(destination =>
      destination.city.toLowerCase().slice(0, inputLength) === inputValue
      || destination.country.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  getSuggestionValue(suggestion) {
    return suggestion.city + ", " + suggestion.country;
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  renderSuggestion(suggestion) {
    return (
      <span>{suggestion.city}, {suggestion.country}</span>
    );
  }

  loadDestination(e, { suggestion }) {
    this.setState({
      suggestion: suggestion
    });
    this.history.push("/destination");
  }

  render() {
    return (
      <Router history={this.history}>
        <Switch>
          <Route exact path="/"
            render={(props) => <Home {...props}
              onChange={this.onChange}
              getSuggestions={this.getSuggestions}
              getSuggestionValue={this.getSuggestionValue}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              renderSuggestion={this.renderSuggestion}
              loadDestination={this.loadDestination}
              state={this.state} />}
          />
          <Route path="/destination"
            render={(props) => <Content {...props}
              onChange={this.onChange}
              getSuggestions={this.getSuggestions}
              getSuggestionValue={this.getSuggestionValue}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              renderSuggestion={this.renderSuggestion}
              state={this.state} />}
          />
          <Route component={Error} />
        </Switch>
      </Router>
    );
  }
}

export default App;
