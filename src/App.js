import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
class App extends Component {

  state = {
    venues: []
  }

  renderMap = () => {
    loadExternalJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyDcJFOS-5CLs7AwrpfrSz4weYLg47aSLeY&v=3&callback=initMap');
    window.initMap = this.initMap;
  }

  getVenues = () => {
    // const endPoint = 'https://api.foursquare.com/v2/venues/VENUE_ID';
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
    const parameter = {
      client_id: 'W5UBLERN3GAMDBVEMPQU153Z04FXCTKKRFEKV3SC0HXH51GK',
      client_secret: 'QC4IRTW1KCJ2NJ1JSFC2LIJRP52LXFYWCL2NCALV5MSPS31Y',
      query: 'shops',
      near: 'Sao Paulo, SP',
      v: '20190217'
    }
    const urlSearch = new URLSearchParams(parameter);

    axios.get(endPoint + urlSearch)
      .then(result => {
        this.setState({
          venues: result.data.response.groups[0].items
        }, this.renderMap());
        console.log(result);
      })
      .catch(error => {
        console.log(`Error -> ${error}`)
      });
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -23.5629, lng: -46.6544 },
      zoom: 8
    });

    const infowindow = new window.google.maps.InfoWindow();

    this.state.venues.map(item => {
      const venue = item.venue;

      const marker = new window.google.maps.Marker({
        position: { lat: venue.location.lat, lng: venue.location.lng },
        map: map,
        title: venue.name
      });

      marker.addListener('click', () => {
        infowindow.setContent(venue.name);
        infowindow.open(map, marker);
      });
    });

  }

  componentDidMount() {
    this.getVenues();

  }


  render() {
    return (
      <main>
        <div id="map"></div>
      </main>
    );
  }
}

function loadExternalJS(url) {
  const index = window.document.getElementsByTagName("script")[0];
  const script = window.document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = url;
  index.parentNode.insertBefore(script, index);

}

export default App;
