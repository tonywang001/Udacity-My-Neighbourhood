import React, { Component } from 'react';
import './App.css';
import NavBar from './NavBar';
import SearchMenu from './SearchMenu';

class App extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.loadJs = this.loadJs.bind(this);
    this.initMap = this.initMap.bind(this);
    this.state = {
      map: null,
      markers: [],
      places: []
    };
    this.randomPlace = {lat: 40.7413549, lng: -73.99802439999996};
  }

  componentDidMount() {
    window.initMap = this.initMap;
    this.loadJs();
  }

  loadJs() {
    const ref = window.document.getElementsByTagName("script")[0];
    let script = window.document.createElement("script");
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDPbmTRn7XZzO1GTG3xI2se3My383oGZds&callback=initMap&libraries=places';
    script.async = true;
    script.defer = true;
    ref.parentNode.insertBefore(script, ref);
  }

  initMap() {
    const map = new window.google.maps.Map(this.refs.map, {
          zoom: 12,
          center: this.randomPlace 
    });
    this.setState({map});
  }

  clearAllMarkers() {
    this.state.markers.forEach(function(marker) {
      console.log('delete marker ' + marker);
      marker.setMap(null);
    });
  }

  onSearch(markerList, placeList) {
    debugger;
    this.clearAllMarkers();
    this.setState({
      markers: markerList,
      places: placeList
    },
    () => {
      console.log('state ' + this.state);
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
            {this.state.map && 
              <SearchMenu onSearch={this.onSearch} 
                          location={this.randomPlace} 
                          map={this.state.map} 
                          places={this.state.places}/>}
          </aside>
          <main>
            <div ref="map" className="Map-Container"></div>
          </main>
        </div>
        <footer>
        </footer>
      </div>
    );
  }
}

export default App;
