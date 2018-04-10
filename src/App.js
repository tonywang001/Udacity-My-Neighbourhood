import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.initMap = this.initMap.bind(this);
    this.map = {};
  }

  componentDidMount = () => {
    console.log('compoenent did mount called');
    window.initMap = this.initMap;
    this.loadJs();
  }

  initMap() {
    var randomPlace = {lat: 40.7413549, lng: -73.99802439999996};
    // var map = new google.maps.Map(document.getElementById('map'), {
    //       zoom: 12,
    //       center: randomPlace 
    //     });
    // debugger;
    console.log('initmap called ' + this.refs.map);
    debugger;
    this.map = new window.google.maps.Map(this.refs.map, {
          zoom: 12,
          center: randomPlace 
    });
    debugger;

  }

  loadJs = () => {
    const ref = window.document.getElementsByTagName("script")[0];
    let script = window.document.createElement("script");
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDPbmTRn7XZzO1GTG3xI2se3My383oGZds&callback=initMap';
    script.async = true;
    script.defer = true;
    ref.parentNode.insertBefore(script, ref);
  }

  render = () => {
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p> */}
        <div ref="map" style={{height: '500px', width: '500px'}}></div>
      </div>
    );
  }
}

export default App;
