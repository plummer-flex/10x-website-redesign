import React from "react";
import logo from "./logo.svg";
import { Grid, Row, Col } from "components/Grid";
import PageList from "features/PageList";

const Default = () => {
  return (
    <Grid>
      <Row>
        <Col size={12} className="text-center padding-y-6">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </header>
        </Col>
      </Row>
      <Row>
        <Col size={12}>
          <PageList />
        </Col>
      </Row>
    </Grid>
  );
};

export default Default;
