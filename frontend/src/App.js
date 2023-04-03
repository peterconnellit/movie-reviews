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

  /*hook to add local state to component, useState declares state variable with null as initial user value.
  React preserves state between re-renders. useState returns array with two values: current state and a function to update,
  current state user value to user, and the function to update it to setUser */
  const [user, setUser] = React.useState(null)

  async function login(user = null) {// default user to null
    setUser(user)
  }

  async function logout(){
    setUser(null)
  }

  return (
    <div className="App">
      <Navbar bg="primary" expand="lg">
        <Navbar.Brand><h1>Movie Blog</h1></Navbar.Brand>
        <Navbar.Toggle class="navbar-toggler" bg="light" aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link>
              {/* routes to movies component */}
              <Link to={"/movies"} class="btn btn-light">Movies</Link>
            </Nav.Link>
            <Nav.Link>
              {/* Conditional rendering. Login or out depending on state using ternary statement */}
              { user ? (
                <a onClick={logout} class="btn btn-light">Logout User</a>
              ) : (
                <Link to={"/login"} class="btn btn-light">Login</Link>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* switch component switches between routes, rendering the first that matches.
      Render allows props to be passed into a component rendered by React Router.
      Here we are passing user as props to the Addreview component*/}
      <Switch>
        <Route exact path={["/", "/movies"]} component={MoviesList}>          
        </Route>
        <Route path="/movies/:id/review" render={(props)=>
          <AddReview {...props} user={user} />
        }>          
        </Route>
        {/* routes for a specific movie and login to render components */}
        <Route path="/movies/:id/" render={(props)=>
          <Movie {...props} user={user} />
        }>          
        </Route>
        <Route path="/login" render={(props)=>
        /* passes login function as a prop */
          <Login {...props} login={login} />
        }>          
        </Route>
      </Switch>
    </div>
  );
}

export default App;