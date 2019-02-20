import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import LocationList from './model/LocationList'
import escapeRegExp from 'escape-string-regexp'

class App extends Component {

  state = {
    workingList: [],
    query: '',
    marker: [],
    searchHidden: window.innerWidth > 550 ? false : window.innerWidth < 550 ? true : null,
    venues: [],
    markerList: [],
    markerListSearch: [],
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
          venues: result.data.response.groups[0].items,
          venuesSearch: result.data.response.groups[0].items
        }, this.renderMap());
      })
      .catch(error => {
        console.log(`Error -> ${error}`)
      });
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -23.5629, lng: -46.6544 },
      zoom: 12
    });
    let listMarker = [];
    const infowindow = new window.google.maps.InfoWindow();
    this.state.venues.forEach(item => {
      const venue = item.venue;

      const marker = new window.google.maps.Marker({
        position: { lat: venue.location.lat, lng: venue.location.lng },
        map: map,
        title: venue.name,
        id: venue.id,
        selectedMarker: () => {
          infowindow.setContent(venue.name);
          infowindow.open(map, marker);
        }
      });

      marker.addListener('click', () => {
        infowindow.setContent(venue.name);
        infowindow.open(map, marker);
      });

      listMarker.push(marker);
    });
    this.setState({
      markerList: listMarker,
      markerListSearch: listMarker
    });
  }

  componentDidMount() {
    this.getVenues();
  }

  onToggleSearch = () => {
    this.setState(prevState => ({
      searchHidden: !prevState.searchHidden
    }));
  };

  onSelectedVenue = (event, item) => {
    item.selectedMarker();
  };

  onUpdateQuery = (query) => {
    let workingList = [];
    if (!query || query === '') {
      workingList = this.state.markerList;
    } else {
      const match = new RegExp(escapeRegExp(query), 'i');
      workingList = this.state.markerList.filter(shop => match.test(shop.title));
    }
    this.setState({
      markerListSearch: workingList
    });
  };

  render() {
    return (
      <main className="App" role="main" >

        <section ref="map" className="map" id="map" role="application"></section>

        <section className="right-column" >
          <header className="header" aria-label="Application Header">
            <p>Powered by Google Maps & FourSquare</p>
            <h3>Find Shops in Sao Paulo</h3>
            <button id='toggleButton'
              title='TOGGLE LIST'
              type='button'
              onClick={this.onToggleSearch}
            >{this.state.searchHidden ? 'SHOW' : 'HIDE'}</button>
          </header>
          {!this.state.searchHidden ?
            <LocationList
              onUpdateQuery={this.onUpdateQuery}
              query={this.state.query}
              venues={this.state.markerListSearch}
              onSelectedVenue={this.onSelectedVenue}
            /> : null}
        </section>
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
