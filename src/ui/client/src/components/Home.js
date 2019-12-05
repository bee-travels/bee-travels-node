import React from "react";
import { Container, Row, Col } from "reactstrap";
import BeeLogo from "./BeeLogo";
import UncontrolledSearch from "./UncontrolledSearch";

const Home = () => (
  <Container fluid={true}>
    <Row>
      <Col md={{ size: 6, offset: 3 }}>
        <div style={{ fontSize: "50px", padding: "150px 0px 0px 0px" }}>
          <BeeLogo
            style={{
              width: "256px",
              height: "256px",
              padding: "0px 25px 0px 0px"
            }}
          />
          Bee Travels
        </div>
        <UncontrolledSearch />
      </Col>
    </Row>
  </Container>
);

export default Home;
