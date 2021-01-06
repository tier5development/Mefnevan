import React, { lazy, Suspense } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import log from "../components/common/logger";
import { Container } from "reactstrap";
import classNames from "classnames";



const Login = lazy(() => import("../components/modules/Auth/Login"));
const ForgotPassword = lazy(() => import("../components/modules/Auth/ForgotPassword"));
const NotFound = lazy(() => import("../components/modules/Auth/NotFound"));

const AppRoute = ({ sidebarIsOpen, toggleSidebar }) => {
  log.info("**** AppRoute ****");

  return (
    <Suspense fallback={<div />}>
      <Container
        fluid
        className={classNames("content", { "is-open": sidebarIsOpen })}
      >
        {/* <Topbar toggleSidebar={toggleSidebar} /> */}
        <Switch>
        <Route path="/" component={Login} />
          
          
          
        </Switch>
      </Container>
    </Suspense>
  );
};
export default withRouter(AppRoute);
