import React, { Component } from "react";
import "./App.css";
import NavBar from "./NavBar";
import SearchMenu from "./SearchMenu";

class App extends Component {
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onClickPlace = this.onClickPlace.bind(this);
    this.loadJs = this.loadJs.bind(this);
    this.initMap = this.initMap.bind(this);
    this.getDefaultLocations = this.getDefaultLocations.bind(this);
    this.createMarker = this.createMarker.bind(this);
    this.state = {
      map: null,
      markers: [],
      places: [],
      placesToShow: []
    };
    this.service = null;
    this.infowindow = null;
    this.randomPlace = { lat: 43.497875, lng: -79.720438 };
    this.SIZE = 5;
  }

  componentDidMount() {
    window.initMap = this.initMap;
    this.loadJs();
  }

  loadJs() {
    const ref = window.document.getElementsByTagName("script")[0];
    let script = window.document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDPbmTRn7XZzO1GTG3xI2se3My383oGZds&callback=initMap&libraries=places";
    script.async = true;
    script.defer = true;
    ref.parentNode.insertBefore(script, ref);
  }

  initMap() {
    const map = new window.google.maps.Map(this.refs.map, {
      zoom: 12,
      center: this.randomPlace
    });
    this.setState({ map }, () => {
      this.service = new window.google.maps.places.PlacesService(map);
      this.infowindow = new window.google.maps.InfoWindow();
      this.getDefaultLocations();
    });
  }

  clearAllMarkers() {
    this.state.markers.forEach(function(marker) {
      marker.setMap(null);
    });
  }

  onSearch(value) {
    let places = [];
    this.state.places.forEach(place => {
      if (place.name.toLowerCase().includes(value.toLowerCase())) {
        places.push(place);
      }
    });
    // this.clearAllMarkers();
    this.updateList(places);
  }

  /**
   * Update place list and markers to display on map
   */
  updateList(placeList) {
    if (this.state.placesToShow.length === 0) {
      this.setState({placesToShow: this.state.places}, this.updateMarkers);
    } else {
      this.setState({placesToShow: placeList}, this.updateMarkers);
    }
  }

  /**
   * Update markers according to the place list
   */
  updateMarkers() {
    this.state.markers.forEach(marker => {
      marker.setMap(null);
      this.state.placesToShow.forEach(place => {
        if (place.name.toLowerCase() === marker.name.toLowerCase()) {
          marker.setMap(this.state.map);
        }
      });
    });
  }

  getDefaultLocations() {
    let markerList = [];
    let placeList = [];

    const request = {
      location: this.randomPlace,
      radius: "50",
      query: "daycare"
    };

    this.service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length && i < this.SIZE; i++) {
          markerList.push(this.createMarker(results[i]));
          placeList.push(results[i]);
        }
        // update list and map with markers
        this.setState({
          markers: markerList,
          places: placeList
        },
        () => {
          this.updateList(placeList);
        });
      }
    });
  }

  createMarker(place) {
    var marker = new window.google.maps.Marker({
      map: this.state.map,
      name: place.name,
      address: place.formatted_address,
      position: place.geometry.location
    });

    window.google.maps.event.addListener(marker, 'click', () => {
      this.openInfoWindow(marker);
    });

    return marker;
  }

  onClickPlace(place) {
    this.openInfoWindow(this.getMarkerForPlace(place));
  }

  getMarkerForPlace(place) {
    for(let marker of this.state.markers) {
      if (marker.name === place.name) {
        return marker;
      }
    }
    return null;
  }

  openInfoWindow(marker) {
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    setTimeout(() => {
      marker.setAnimation(null);
    }, 2000);
    let infowindow = this.infowindow;
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.name + '</div><div>' + marker.address + '</div>');
    infowindow.open(this.state.map, marker);
    infowindow.addListener('closeclick', () => {
      // infowindow.setMarker(null);
      infowindow.close();
    });

    // fire off ajax call to foursquare
    const clientId = '41TLWTZUDSOVQ3N3C1GCFFX0QFOPJEIGA04XEWJ0WMHUMQTC';
    const clientSecret = 'XZIU5S31HT1GIXRRWCE3XDWF50L5ER1SFZHO0ISSU4PRGXMT';
    const option = {
      method: 'GET'
    }
    const ll = '43.497875,-79.720438';
    const query = marker.name;
    const v = '20180718';
    const limit = 1;
    const url = `https://api.foursquare.com/v2/venues/search?ll=${ll}&query=${query}&limit=${limit}&v=${v}&client_id=${clientId}&client_secret=${clientSecret}`;

    fetch(url, option)
    .then(res => {
      return res.json();
    })
    .then(res => {
      if (res.response && res.response.venues[0] && res.response.venues[0].id) {
        const id = res.response.venues[0].id;
        const likesUrl = `https://api.foursquare.com/v2/venues/${id}/likes?v=${v}&client_id=${clientId}&client_secret=${clientSecret}`;
        fetch(likesUrl, {method: 'GET'})
        .then(res => {
          return res.json();
        })
        .then(res => {
          const currentContent = infowindow.getContent();
          let newContent = '<div>foursquare likes:' + res.response.likes.count + '</div>';
          if (res.response && res.response.likes) {
            newContent = '<div>foursquare likes:' + res.response.likes.count + '</div>';
          } else {
            newContent = '<div>No foursquare data available</div>';
          }
          infowindow.setContent(currentContent + newContent);
        });
      } else {
          const currentContent = infowindow.getContent();
          const newContent = '<div>No foursquare data available</div>';
          infowindow.setContent(currentContent + newContent);
      }
    })
    .catch(err => {
      const currentContent = infowindow.getContent();
      const newContent = '<div>foursquare API failed to load</div>';
      infowindow.setContent(currentContent + newContent);
      console.log('foursquare API error: ' + err);
    });
  }

  render() {
    return (
      <div className="App">
        <header>
          <NavBar />
        </header>
        <div className="Main-content">
          <aside>
            {this.state.map && (
              <SearchMenu
                onSearch={this.onSearch}
                location={this.randomPlace}
                map={this.state.map}
                places={this.state.placesToShow}
                onClickPlace={this.onClickPlace}
              />
            )}
          </aside>
          <main>
            <div ref="map" className="Map-Container" />
          </main>
        </div>
        <footer />
      </div>
    );
  }
}

export default App;
