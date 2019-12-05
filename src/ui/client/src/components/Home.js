import React from "react";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import BeeLogo from "./BeeLogo";

const Home = ({
  state,
  onChange,
  onSuggestionsFetchRequested,
  onSuggestionsClearRequested,
  getSuggestionValue,
  renderSuggestion,
  loadDestination
}) => {
  const inputProps = {
    placeholder: "Where will you bee traveling?",
    value: state.scrollbarValue,
    onChange: onChange
  };

  return (
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
          <Autosuggest
            suggestions={state.suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            onSuggestionSelected={loadDestination}
          />
        </Col>
      </Row>
    </Container>
  );
};

Home.propTypes = {
  state: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSuggestionsFetchRequested: PropTypes.func.isRequired,
  onSuggestionsClearRequested: PropTypes.func.isRequired,
  getSuggestionValue: PropTypes.func.isRequired,
  renderSuggestion: PropTypes.func.isRequired,
  loadDestination: PropTypes.func.isRequired
};

export default Home;
