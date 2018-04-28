import React, { Component } from 'react';
import './SearchMenu.css';

class SearchMenu extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.serivce = null;
    this.pyrmont = {lat: -33.8665433, lng: 151.1956316};
    this.delayTimer = null;
  }

  componentDidMount() {
    this.service = new window.google.maps.places.PlacesService(this.props.map);
  }

  onSearch(e) {
    let markerList = [];
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
              console.log(results[i]);
            }
          }
        });
      }, 500);
    }

    this.props.onSearch(markerList);
  }

  createMarker(place) {
    var marker = new window.google.maps.Marker({
      map: this.props.map,
      position: place.geometry.location
    });

    return marker;

    // google.maps.event.addListener(marker, 'click', function() {
    //   infowindow.setContent(place.name);
    //   infowindow.open(map, this);
    // });
  }

  render() {

    // const { onSearch } = this.props;

    return (
      <div className="Search-Menu-Container">
        <div className="search-Menu-Input-Wrapper">
          <input type="text" placeholder="Search by title or author"
           onChange={this.onSearch}/>
        </div>
      </div>
    );
  }
}

export default SearchMenu;