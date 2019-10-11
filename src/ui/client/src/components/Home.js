import React from "react";
import {Container, Row, Col} from 'reactstrap';
import Autosuggest from 'react-autosuggest';

class Home extends React.Component {
    constructor(props){
		super(props);
    }

    render() {
        const inputProps = {
            placeholder: 'Where will you bee traveling?',
            value: this.props.state.scrollbarValue,
            onChange: this.props.onChange
          };

		return (
			<Container fluid={true}>
                <Row>
                    <Col md={{ size: 6, offset: 3 }}>
                        <div style={{fontSize: "50px", padding: "150px 0px 0px 0px"}}><img style={{padding: "0px 10px 50px 150px"}} src="ibm bee large.png"></img>Bee Travels</div>
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
};

export default Home;
