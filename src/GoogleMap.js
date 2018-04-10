import React, { Component } from 'react';
import './GoogleMap.css';

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.initMap = this.initMap.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.loadJs = this.loadJs.bind(this);
    this.map = {};
  }

  componentDidMount() {
    console.log('compoenent did mount called');
    window.initMap = this.initMap;
    this.loadJs();
  }

  initMap() {
    var randomPlace = {lat: 40.7413549, lng: -73.99802439999996};
    console.log('initmap called ' + this.refs.map);
    this.map = new window.google.maps.Map(this.refs.map, {
          zoom: 12,
          center: randomPlace 
    });
  }

  loadJs() {
    const ref = window.document.getElementsByTagName("script")[0];
    let script = window.document.createElement("script");
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDPbmTRn7XZzO1GTG3xI2se3My383oGZds&callback=initMap';
    script.async = true;
    script.defer = true;
    ref.parentNode.insertBefore(script, ref);
  }

  render() {
    return (
      // <div ref="map" className="Map-Container" style={{height: '100%', width: '100%'}}></div>
      <div ref="map" className="Map-Container"></div>
    );
  }
}

export default GoogleMap;