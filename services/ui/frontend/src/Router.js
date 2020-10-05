import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import globalHistory from "globalHistory";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import init from "redux/init";
import reducer from "redux/reducer";

import BookingLayout from "components/BookingLayout/BookingLayout";
import HomeLayout from "components/HomeLayout/HomeLayout";
import ErrorLayout from "components/ErrorLayout/ErrorLayout";
import CheckoutLayout from "components/CheckoutLayout/CheckoutLayout";

import { GraphPage } from "components/ServiceGraph";

function ProviderWrapper({ children }) {
  const store = createStore(
    reducer,
    init(),
    composeWithDevTools({ name: "bee-travels" })()
  );

  return <Provider store={store}>{children}</Provider>;
}

const CustomRouter = () => {
  return (
    <ProviderWrapper>
      <Router history={globalHistory}>
        <Switch>
          <Route exact path="/" component={HomeLayout} />
          <Route
            path="/destinations/:country/:city"
            component={BookingLayout}
          />
          <Route path="/service-graph" component={GraphPage} />
          <Route path="/checkout" component={CheckoutLayout} />
          <Route component={ErrorLayout} />
        </Switch>
      </Router>
    </ProviderWrapper>
  );
};

export default CustomRouter;
