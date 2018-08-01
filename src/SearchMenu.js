import React, { Component } from 'react';
import './SearchMenu.css';

class SearchMenu extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onClickListItem = this.onClickListItem.bind(this);
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
    this.props.onSearch(e.target.value);
  }

  onClickListItem(place) {
    this.props.onClickPlace(place);
  }

  render() {

    const { places } = this.props;

    return (
      <div className="Search-Menu-Container">
        <div className="search-Menu-Input-Wrapper">
          <input type="text" placeholder="Search by title or author"
           onChange={this.onSearch}/>
        </div>
        <div className="search-Menu-list">
          <ul>
            {places.map((place) =>
              <li key={place.id} onClick={() => this.onClickListItem(place)}>{place.name}</li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default SearchMenu;