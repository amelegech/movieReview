import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

import Blog from "./container/Blog";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Blog />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
