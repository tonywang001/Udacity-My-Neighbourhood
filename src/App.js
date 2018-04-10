import React, { Component } from 'react';
import './App.css';
import GoogleMap from './GoogleMap';
import NavBar from './NavBar';
import SearchMenu from './SearchMenu';

class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <header>
          <NavBar />
        </header>
        <div className="Main-content">
          <aside>
            <SearchMenu />
          </aside>
          <main>
            <GoogleMap />
          </main>
        </div>
        <footer>
        </footer>
      </div>
    );
  }
}

export default App;
