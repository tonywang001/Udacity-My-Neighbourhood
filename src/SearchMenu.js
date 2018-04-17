import React, { Component } from 'react';
import './SearchMenu.css';

class SearchMenu extends Component {

  componentDidMount() {

    // const pyrmont = new window.google.maps.LatLng(-33.8665433,151.1956316);
    const pyrmont = {lat: -33.8665433, lng: 151.1956316};

    const request = {
      location: pyrmont,
      radius: '500',
      type: ['restaurant']
    };
  
    let service = new window.google.maps.places.PlacesService(this.props.map);
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          // var place = results[i];
          // createMarker(results[i]);
          console.log(results[i]);
        }
      }
    });

  }

  render() {

    const { onSearch } = this.props;

    return (
      <div className="Search-Menu-Container">
        <div className="search-Menu-Input-Wrapper">
          <input type="text" placeholder="Search by title or author"
           onChange={(e) => onSearch(e.target.value)}/>
        </div>
      </div>
    );
  }
}

export default SearchMenu;