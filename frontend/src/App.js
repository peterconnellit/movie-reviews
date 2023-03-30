import React from 'react'
//help to create URL rotes for different components
import { Switch, Route, Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

import AddReview from './components/add-review';
import MoviesList from './components/movies-list';
import Movie from './components/movie';
import Login from './components/login';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function App(){
  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Movie Reviews</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link>
              {/* routes to movies component */}
              <Link to={"/movies"}>Movies</Link>
            </Nav.Link>
            <Nav.Link>
              {/* Conditional rendering. Login or out depending on state using ternary statement */}
              { user ? (
                <a>Logout User</a>
              ) : (
                <Link to={"/login"}>Login</Link>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default App;