import React from "react";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";

class Home extends React.Component {
  render() {
    const inputProps = {
      placeholder: "Where will you bee traveling?",
      value: this.props.state.scrollbarValue,
      onChange: this.props.onChange
    };

    return (
      <Container fluid={true}>
        <Row>
          <Col md={{ size: 6, offset: 3 }}>
            <div style={{ fontSize: "50px", padding: "150px 0px 0px 0px" }}>
              <svg width="256px" height="256px" viewBox="0 0 1320 930" style={{ padding: "0px 25px 0px 0px" }}>
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
              </svg>Bee Travels</div>
            <Autosuggest
              suggestions={this.props.state.suggestions}
              onSuggestionsFetchRequested={this.props.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.props.onSuggestionsClearRequested}
              getSuggestionValue={this.props.getSuggestionValue}
              renderSuggestion={this.props.renderSuggestion}
              inputProps={inputProps}
              onSuggestionSelected={this.props.loadDestination}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

Home.propTypes = {
  state: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSuggestionsFetchRequested: PropTypes.func.isRequired,
  onSuggestionsClearRequested: PropTypes.func.isRequired,
  getSuggestionValue: PropTypes.func.isRequired,
  renderSuggestion: PropTypes.func.isRequired,
  loadDestination: PropTypes.func.isRequired,
};

export default Home;
