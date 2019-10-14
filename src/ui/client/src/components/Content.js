import React from "react";
import { Container, Row, Col, Navbar, NavbarBrand } from "reactstrap";
import PropTypes from "prop-types";
import ReactMapboxGl from "react-mapbox-gl";
import Autosuggest from "react-autosuggest";

const API_BASE_URL = "http://localhost:4000"; //process.env.API_URL;

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoibWFnaWNtYXgzMiIsImEiOiJjanR0MGxubXcweHVzNDVwaWV2MGQ1ZWp3In0.8YiTJ8uuaq831eLcsjc03w" //process.env.Mapbox_Access_Token;
});

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

  async componentDidMount(){
    this.loadDestinationData();
  }

  loadDestinationData = async e => {
    if (e) e.preventDefault();

    const response = await fetch(
      API_BASE_URL +
        "/api/v1/destinations/" +
        this.props.state.suggestion.city +
        "/" +
        this.props.state.suggestion.country
    );

    var data = await response.json();

    this.setState({ currentDestination: data });
  };

  getDestinationData = async (e, { suggestion }) => {
    if (e) e.preventDefault();

    const response = await fetch(
      API_BASE_URL +
        "/api/v1/destinations/" +
        suggestion.city +
        "/" +
        suggestion.country
    );

    var data = await response.json();

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
                <img
                  style={{ padding: "0px 10px 0px 0px" }}
                  src="ibm bee.png"
                  alt="ibm bee logo"
                ></img>
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
                "http://localhost:4000/images/" +
                this.state.currentDestination.city +
                ", " +
                this.state.currentDestination.country +
                ".jpg"
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
