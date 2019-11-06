import React from "react";
import { Container, Row, Col, Navbar, NavbarBrand } from "reactstrap";
import PropTypes from "prop-types";
import ReactMapboxGl from "react-mapbox-gl";
import Autosuggest from "react-autosuggest";

var Map = ReactMapboxGl(
  { "accessToken": "pk.eyJ1IjoibWFwcXVlc3QiLCJhIjoiY2Q2N2RlMmNhY2NiZTRkMzlmZjJmZDk0NWU0ZGJlNTMifQ.mPRiEubbajc6a5y9ISgydg"}
);

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDestination: {
        city: "",
        lat: "",
        lng: "",
        country: "",
        population: "",
        description: ""
      }
    };
  }

  async componentDidMount() {
    this.loadDestinationData();
  }

  loadDestinationData = async e => {
    if (e) e.preventDefault();

    const response = await fetch(
      "/api/v1/destinations/" + this.props.state.suggestion.city + "/" + this.props.state.suggestion.country
    );

    var data = await response.json();

    console.log(data);

    this.setState({ currentDestination: data });
  };

  getDestinationData = async (e, { suggestion }) => {
    if (e) e.preventDefault();

    const response = await fetch(
      "/api/v1/destinations/" + suggestion.city + "/" + suggestion.country
    );

    var data = await response.json();

    console.log(data);

    this.setState({ currentDestination: data });
  };

  render() {
    const inputProps = {
      placeholder: "Where will you bee traveling?",
      value: this.props.state.scrollbarValue,
      onChange: this.props.onChange
    };

    return (
      <Container fluid={true}>
        <Row>
          <Col>
            <Navbar color="dark">
              <NavbarBrand href="/" style={{ color: "white" }}>
                <svg width="64px" height="64px" viewBox="0 0 1320 930" style={{ padding: "0px 10px 0px 0px" }}>
                  {/* Body */}
                  <path
                    transform="translate(450 200)"
                    fillRule="evenodd"
                    fill="rgb(238, 181, 13)"
                    d="M0.000,420.000 L420.000,420.000 L420.000,520.000 L0.000,520.000 L0.000,420.000 ZM0.000,220.000 L420.000,220.000 L420.000,310.000 L0.000,310.000 L0.000,220.000 ZM210.000,0.000 C289.776,0.000 359.161,44.484 394.706,110.000 L25.294,110.000 C60.839,44.484 130.224,0.000 210.000,0.000 ZM388.906,630.000 C351.938,689.998 285.645,730.000 210.000,730.000 C134.355,730.000 68.062,689.998 31.094,630.000 L388.906,630.000 Z"
                  />

                  {/* Left Wing */}
                  <path
                    transform="translate(0 280)"
                    fillRule="evenodd"
                    fill="rgb(38, 146, 60)"
                    d="M460.000,-0.000 L331.000,386.000 L330.532,386.045 C307.370,452.394 244.249,500.000 170.000,500.000 C76.112,500.000 0.000,423.888 0.000,330.000 C0.000,262.255 39.629,203.772 96.967,176.451 L97.000,176.000 L460.000,-0.000 Z"
                  />

                  {/* Left Wing */}
                  <path
                    transform="translate(860 280)"
                    fillRule="evenodd"
                    fill="rgb(38, 146, 60)"
                    d="M460.000,330.000 C460.000,423.888 383.888,500.000 290.000,500.000 C215.751,500.000 152.630,452.394 129.468,386.045 L129.000,386.000 L0.000,-0.000 L363.000,176.000 L363.033,176.451 C420.371,203.772 460.000,262.255 460.000,330.000 Z"
                  />

                  {/* Left Eye */}
                  <path
                    transform="translate(460 0)"
                    fillRule="evenodd"
                    fill="rgb(247, 175, 187)"
                    d="M95.000,0.000 C147.467,0.000 190.000,42.533 190.000,95.000 C190.000,147.467 147.467,190.000 95.000,190.000 C42.533,190.000 0.000,147.467 0.000,95.000 C0.000,42.533 42.533,0.000 95.000,0.000 Z"
                  />

                  <path
                    transform="translate(670 0)"
                    fillRule="evenodd"
                    fill="rgb(247, 175, 187)"
                    d="M95.000,0.000 C147.467,0.000 190.000,42.533 190.000,95.000 C190.000,147.467 147.467,190.000 95.000,190.000 C42.533,190.000 0.000,147.467 0.000,95.000 C0.000,42.533 42.533,0.000 95.000,0.000 Z"
                  />
                </svg>
                Bee Travels
              </NavbarBrand>
              <Autosuggest
                suggestions={this.props.state.suggestions}
                onSuggestionsFetchRequested={
                  this.props.onSuggestionsFetchRequested
                }
                onSuggestionsClearRequested={
                  this.props.onSuggestionsClearRequested
                }
                getSuggestionValue={this.props.getSuggestionValue}
                renderSuggestion={this.props.renderSuggestion}
                inputProps={inputProps}
                onSuggestionSelected={this.getDestinationData}
              />
            </Navbar>
          </Col>
        </Row>
        <Row>
          <Col md={{ size: 6, offset: 4 }}>
            <Row>
              <h2>
                {this.state.currentDestination.city},{" "}
                {this.state.currentDestination.country}
              </h2>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={{ size: 6, offset: 2 }}>
            <div style={{ height: "525px" }}>
              <p>{this.state.currentDestination.description}</p>
            </div>
            <Map
              style="mapbox://styles/mapbox/streets-v9"
              zoom={[7]}
              containerStyle={{
                height: "250px",
                width: "800px"
              }}
              center={{
                lng: this.state.currentDestination.lng,
                lat: this.state.currentDestination.lat
              }}
            ></Map>
          </Col>
          <Col>
            <img
              src={
                "/images/" + this.state.currentDestination.city +
                ", " + this.state.currentDestination.country + ".jpg"
              }
              height="500px"
              width="500px"
              alt={
                this.state.currentDestination.city +
                ", " +
                this.state.currentDestination.country
              }
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

Content.propTypes = {
  state: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSuggestionsFetchRequested: PropTypes.func.isRequired,
  onSuggestionsClearRequested: PropTypes.func.isRequired,
  getSuggestionValue: PropTypes.func.isRequired,
  renderSuggestion: PropTypes.func.isRequired
};

export default Content;
