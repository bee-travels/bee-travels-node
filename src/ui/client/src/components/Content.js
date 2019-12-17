import React, { useState, useEffect } from "react";
import { Container, Row, Col, Navbar, NavbarBrand } from "reactstrap";
import ReactMapboxGl from "react-mapbox-gl";
import BeeLogo from "./BeeLogo";
import UncontrolledSearch from "./UncontrolledSearch";
import queryString from "query-string";

const defaultDestination = {
  city: "",
  lat: "",
  lng: "",
  country: "",
  population: "",
  description: ""
};

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoibWFwcXVlc3QiLCJhIjoiY2Q2N2RlMmNhY2NiZTRkMzlmZjJmZDk0NWU0ZGJlNTMifQ.mPRiEubbajc6a5y9ISgydg"
});

const Content = ({ location }) => {
  const { city, country } = queryString.parse(location.search);

  const [destination, setDestination] = useState(defaultDestination);

  useEffect(() => {
    const loadDestinationData = async () => {
      if (city && country) {
        const response = await fetch(`/api/v1/destinations/${city}/${country}`);
        const destination = await response.json();
        setDestination(destination);
      }
    };
    loadDestinationData();
  }, [city, country, location.search]);

  return (
    <Container fluid={true}>
      <Row>
        <Col>
          <Navbar color="dark">
            <NavbarBrand href="/" style={{ color: "white" }}>
              <BeeLogo
                style={{
                  width: "64px",
                  height: "64px",
                  padding: "0px 10px 0px 0px"
                }}
              />
              Bee Travels
            </NavbarBrand>
            <UncontrolledSearch />
          </Navbar>
        </Col>
      </Row>
      <Row>
        <Col md={{ size: 6, offset: 4 }}>
          <Row>
            <h2>
              {destination.city}, {destination.country}
            </h2>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col md={{ size: 6, offset: 2 }}>
          <div style={{ height: "525px" }}>
            <p>{destination.description}</p>
          </div>
          <Map
            style="mapbox://styles/mapbox/streets-v9"
            zoom={[7]}
            containerStyle={{
              height: "250px",
              width: "800px"
            }}
            center={{
              lng: destination.lng,
              lat: destination.lat
            }}
          ></Map>
        </Col>
        <Col>
          <img
            src={
              "/images/" +
              destination.city +
              ", " +
              destination.country +
              ".jpg"
            }
            height="500px"
            width="500px"
            alt={destination.city + ", " + destination.country}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Content;
