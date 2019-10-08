import React from "react";
import {Container, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Navbar, NavbarBrand} from 'reactstrap';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

const API_BASE_URL = "http://localhost:4000"; //process.env.API_URL;

const Map = ReactMapboxGl({
    accessToken:
      'pk.eyJ1IjoibWFnaWNtYXgzMiIsImEiOiJjanR0MGxubXcweHVzNDVwaWV2MGQ1ZWp3In0.8YiTJ8uuaq831eLcsjc03w'
  });

class Content extends React.Component {
    
    constructor(props){
		super(props);

		this.state = {
            destinationList: [],
            dropdownOpen: false,
            currentDestination: {
                "city": "New York",
                "lat": "40.6943",
                "lng": "-73.9249",
                "country": "United States",
                "population": "19354922",
                "description": "The City of New York, usually called either New York City (NYC) or simply New York (NY), is the most populous city in the United States. With an estimated 2018 population of 8,398,748 distributed over a land area of about 302.6 square miles (784 km2), New York is also the most densely populated major city in the United States. Located at the southern tip of the state of New York, the city is the center of the New York metropolitan area, the largest metropolitan area in the world by urban landmass and one of the world's most populous megacities, with an estimated 19,979,477 people in its 2018 Metropolitan Statistical Area and 22,679,948 residents in its Combined Statistical Area. A global power city, New York City has been described as the cultural, financial, and media capital of the world, and exerts a significant impact upon commerce, entertainment, research, technology, education, politics, tourism, art, fashion, and sports. The city's fast pace has inspired the term New York minute. Home to the headquarters of the United Nations, New York is an important center for international diplomacy."
            }
        }
        
        this.getDestinations();

        this.toggle = this.toggle.bind(this);
    }

    getDestinations = async (e) => {
	    if(e) e.preventDefault();

        const response = await fetch(API_BASE_URL+'/api/v1/destinations');

        var data = await response.json();

        this.setState({destinationList: data["cities"]});
    }

    getDestinationData = (city, country) => async (e) => {
        if(e) e.preventDefault();

        const response = await fetch(API_BASE_URL+'/api/v1/destinations/'+city+"/"+country);

        var data = await response.json();

        this.setState({currentDestination: data});
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

	render() {
        var dropdownList = [];

        for (var tempDestination = 0; tempDestination < this.state.destinationList.length; tempDestination++) {
            dropdownList.push(<DropdownItem key={tempDestination} onClick={this.getDestinationData(this.state.destinationList[tempDestination].city,this.state.destinationList[tempDestination].country)}>{this.state.destinationList[tempDestination].city}, {this.state.destinationList[tempDestination].country}</DropdownItem>);
        }

		return (
			<Container fluid={true}>
                <Row>
                    <Col>
                        <Navbar color="dark">
                            <NavbarBrand style={{color:"white"}}><img src="ibm bee.png"></img>Bee Travels</NavbarBrand>
                        </Navbar>
                    </Col>
                </Row>
				<Row>
					<Col md={{ size: 6, offset: 4 }}>
                        <Row>
                            <h2>{this.state.currentDestination.city}, {this.state.currentDestination.country}</h2>
                            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                <DropdownToggle caret color="white"></DropdownToggle>
                                <DropdownMenu style={{height: "200px", overflow: "auto"}}>{dropdownList}</DropdownMenu>
                            </Dropdown>
                        </Row>
					</Col>
				</Row>
                <Row>
                    <Col md={{ size: 6, offset: 2 }}>
                        <p>{this.state.currentDestination.description}</p>
                    </Col>
                    <Col>
                        <Map
                        style="mapbox://styles/mapbox/streets-v9"
                        zoom={[7]}
                        containerStyle={{
                            height: '350px',
                            width: '350px'
                        }}
                        center={{lng: this.state.currentDestination.lng, lat: this.state.currentDestination.lat}}
                        >
                        </Map>
                        <br></br>
                        <img src={"city_images/"+this.state.currentDestination.city+", "+this.state.currentDestination.country+".jpg"} height="350px" width="350px" />
                    </Col>
                </Row>
			</Container>
		);
	}
};

export default Content;