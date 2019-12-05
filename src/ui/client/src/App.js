import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import globalHistory from "./globalHistory";

import Content from "./components/Content";
import Home from "./components/Home";
import Error from "./components/Error";

const App = () => (
  <Router history={globalHistory}>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/destination" component={Content} />
      <Route component={Error} />
    </Switch>
  </Router>
);

export default App;
