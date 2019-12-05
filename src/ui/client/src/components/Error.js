import React from "react";
import { Alert, Container, Row, Col } from "reactstrap";

const Error = () => (
  <Container>
    <Row>
      <Col sm={{ size: 6, offset: 3 }}>
        <Alert color="danger">Error: Page does not exist</Alert>
      </Col>
    </Row>
  </Container>
);

export default Error;
