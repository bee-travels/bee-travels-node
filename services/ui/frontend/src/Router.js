import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import globalHistory from "globalHistory";

import BookingLayout from "components/BookingLayout/BookingLayout";
import HomeLayout from "components/HomeLayout/HomeLayout";
import ErrorLayout from "components/ErrorLayout/ErrorLayout";

const CustomRouter = () => (
  <Router history={globalHistory}>
    <Switch>
      <Route exact path="/" component={HomeLayout} />
      <Route path="/destinations/:country/:city" component={BookingLayout} />
      <Route component={ErrorLayout} />
    </Switch>
  </Router>
);

export default CustomRouter;
