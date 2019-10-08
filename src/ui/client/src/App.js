import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import { createBrowserHistory as createHistory } from 'history'

import Content from "./components/Content";
import Error from "./components/Error";

class App extends React.Component {

  constructor(props) {
    super(props);

    this.history = createHistory();
  }

  render() {
    return (
        <Router history={this.history}>
          <Switch>
            <Route exact path="/" component={Content} />
            <Route component={Error} />
          </Switch>
        </Router>
      );
  }
};

export default App;
