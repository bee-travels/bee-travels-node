import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Navbar, NavbarBrand } from "reactstrap";
import PropTypes from "prop-types";
import ReactMapboxGl from "react-mapbox-gl";
import Autosuggest from "react-autosuggest";
import BeeLogo from "./BeeLogo";

var Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoibWFwcXVlc3QiLCJhIjoiY2Q2N2RlMmNhY2NiZTRkMzlmZjJmZDk0NWU0ZGJlNTMifQ.mPRiEubbajc6a5y9ISgydg"
});

const Content = ({
  state,
  onChange,
  onSuggestionsFetchRequested,
  onSuggestionsClearRequested,
  getSuggestionValue,
  renderSuggestion,
  loadDestination
}) => {
  const [city, setCity] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");

  const loadDestinationData = useCallback(async (city, country) => {
    if (city && country) {
      const response = await fetch(`/api/v1/destinations/${city}/${country}`);
      const data = await response.json();
      setCity(data.city);
      setLat(data.lat);
      setLng(data.lng);
      setCountry(data.country);
      setDescription(data.description);
    }
  }, []);

  useEffect(() => {
    const { city, country } = state.suggestion;
    loadDestinationData(city, country);
  }, [loadDestinationData, state.suggestion]);

  const inputProps = {
    placeholder: "Where will you bee traveling?",
    value: state.scrollbarValue,
    onChange: onChange
  };

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
            <Autosuggest
              suggestions={state.suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              onSuggestionSelected={loadDestination}
            />
          </Navbar>
        </Col>
      </Row>
      <Row>
        <Col md={{ size: 6, offset: 4 }}>
          <Row>
            <h2>
              {city}, {country}
            </h2>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col md={{ size: 6, offset: 2 }}>
          <div style={{ height: "525px" }}>
            <p>{description}</p>
          </div>
          <Map
            style="mapbox://styles/mapbox/streets-v9"
            zoom={[7]}
            containerStyle={{
              height: "250px",
              width: "800px"
            }}
            center={{
              lng: lng,
              lat: lat
            }}
          ></Map>
        </Col>
        <Col>
          <img
            src={"/images/" + city + ", " + country + ".jpg"}
            height="500px"
            width="500px"
            alt={city + ", " + country}
          />
        </Col>
      </Row>
    </Container>
  );
};

Content.propTypes = {
  state: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSuggestionsFetchRequested: PropTypes.func.isRequired,
  onSuggestionsClearRequested: PropTypes.func.isRequired,
  getSuggestionValue: PropTypes.func.isRequired,
  renderSuggestion: PropTypes.func.isRequired,
  loadDestination: PropTypes.func.isRequired
};

export default Content;
