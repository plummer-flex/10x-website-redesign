import React from "react";
import { Switch, Route } from "react-router-dom";
import Default from "./Default";

export default ({ location }) => (
  <Switch location={location}>
    <Route key="default" path="/" component={Default} exact />
  </Switch>
);
