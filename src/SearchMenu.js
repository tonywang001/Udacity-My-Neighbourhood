import React, { Component } from 'react';
import './SearchMenu.css';

class SearchMenu extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.serivce = null;
    this.pyrmont = {lat: -33.8665433, lng: 151.1956316};
    this.delayTimer = null;
    this.infowindow = null;
  }

  componentDidMount() {
    this.service = new window.google.maps.places.PlacesService(this.props.map);
    this.infowindow = new window.google.maps.InfoWindow();
  }

  onSearch(e) {
    let markerList = [];
    let placeList = [];
    console.log(e.target.value);

    const request = {
      location: this.props.location,
      radius: '50',
      query: e.target.value
    };

    clearTimeout(this.delayTimer);
    if (e.target.value) {
      // delay 0.5 second before sending the text search request
      this.delayTimer = setTimeout(() => {
        this.service.textSearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              // var place = results[i];
              markerList.push(this.createMarker(results[i]));
              placeList.push(results[i]);
              // console.log(results[i]);
            }
            // update list and map with markers
            this.props.onSearch(markerList, placeList);
          }
        });
      }, 500);
    }

  }

  createMarker(place) {
    console.log('place ' + JSON.stringify(place));
    var marker = new window.google.maps.Marker({
      map: this.props.map,
      name: place.name,
      address: place.formatted_address,
      position: place.geometry.location
    });

    const infowindow = this.infowindow;
    const map = this.props.map;

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
      const option = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer R_kn8U2P7celBXQZT-qQE1lp2tO5LF9fbrWiXYoYYtHh-0d5EC0wBF90NhbMoEo6304GYh1wHp-FRvDd8DCuZN-aJVvzyEh5K-G88xuQm6PB1DUVLjTQUXJ3d4TwWnYx'
        }
      };
      const location = 'toronto';
      const term = 'shawarma';
      const url = `https://api.yelp.com/v3/businesses/search?location=${location}&term=${term}`;
      fetch(url,option)
      .then(res => {
        if (res.status !== 200) {
          //TODO: error case
          return;
        }
        return res.json();
      })
      .then(res => {
        debugger;
        console.log(res);
      })
    });

    return marker;
  }

  render() {

    // const { onSearch } = this.props;
    const { places } = this.props;
    console.log('props: ' + this.props);
    console.log('places from props' + places);

    return (
      <div className="Search-Menu-Container">
        <div className="search-Menu-Input-Wrapper">
          <input type="text" placeholder="Search by title or author"
           onChange={this.onSearch}/>
        </div>
        <div className="search-Menu-list">
          <ul>
            {console.log('places in render' + places)}
            {places.map((place) =>
              <li>{place.name}</li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default SearchMenu;