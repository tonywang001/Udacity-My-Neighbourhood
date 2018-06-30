import React, { Component } from "react";
import "./App.css";
import NavBar from "./NavBar";
import SearchMenu from "./SearchMenu";

class App extends Component {
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.loadJs = this.loadJs.bind(this);
    this.initMap = this.initMap.bind(this);
    this.getDefaultLocations = this.getDefaultLocations.bind(this);
    this.createMarker = this.createMarker.bind(this);
    this.state = {
      map: null,
      markers: [],
      places: []
    };
    this.service = null;
    this.infowindow = null;
    this.randomPlace = { lat: 43.497875, lng: -79.720438 };
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
      console.log("delete marker " + marker);
      marker.setMap(null);
    });
  }

  onSearch(markerList, placeList) {
    this.clearAllMarkers();
    this.setState(
      {
        markers: markerList,
        places: placeList
      },
      () => {
        console.log("state " + this.state);
      }
    );
  }

  getDefaultLocations() {
    let markerList = [];
    let placeList = [];
    // console.log(e.target.value);

    const request = {
      location: this.randomPlace,
      radius: "50",
      query: "daycare"
    };

    this.service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          // var place = results[i];
          markerList.push(this.createMarker(results[i]));
          placeList.push(results[i]);
          // console.log(results[i]);
        }
        // update list and map with markers
        // this.props.onSearch(markerList, placeList);
        this.setState({
          markers: markerList,
          places: placeList
        },
        () => {
          console.log("state " + this.state);
        });
      }
    });
  }

  createMarker(place) {
    console.log('place ' + JSON.stringify(place));
    console.log('map in createMarker' + this.map);
    var marker = new window.google.maps.Marker({
      map: this.state.map,
      name: place.name,
      address: place.formatted_address,
      position: place.geometry.location
    });

    const infowindow = this.infowindow;
    const map = this.state.map;

    window.google.maps.event.addListener(marker, 'click', () => {
      // infowindow.setContent(place.name);
      // infowindow.open(map, this);
      console.log('marker clicked');
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.name + '</div><div>' + marker.address + '</div>');
      infowindow.open(map, marker);
      infowindow.addListener('closeclick', () => {
        infowindow.setMarker(null);
      });

      // fire off ajax call to yelp here
      // key : Bearer R_kn8U2P7celBXQZT-qQE1lp2tO5LF9fbrWiXYoYYtHh-0d5EC0wBF90NhbMoEo6304GYh1wHp-FRvDd8DCuZN-aJVvzyEh5K-G88xuQm6PB1DUVLjTQUXJ3d4TwWnYx
    //   const option = {
    //     method: 'GET',
    //     headers: {
    //       Authorization: 'Bearer R_kn8U2P7celBXQZT-qQE1lp2tO5LF9fbrWiXYoYYtHh-0d5EC0wBF90NhbMoEo6304GYh1wHp-FRvDd8DCuZN-aJVvzyEh5K-G88xuQm6PB1DUVLjTQUXJ3d4TwWnYx'
    //     }
    //   };
    //   const location = 'toronto';
    //   const term = 'shawarma';
    //   const url = `https://api.yelp.com/v3/businesses/search?location=${location}&term=${term}`;
    //   fetch(url,option)
    //   .then(res => {
    //     if (res.status !== 200) {
    //       //TODO: error case
    //       return;
    //     }
    //     return res.json();
    //   })
    //   .then(res => {
    //     debugger;
    //     console.log(res);
    //   })
    });

    return marker;
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
                places={this.state.places}
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
