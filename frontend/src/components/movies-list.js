//imports useState to create a series of state variables
import React, {useState, useEffect} from 'react'
import MovieDataService from "../services/movies"
import {link} from "react-router-dom"

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container'

/*functional component which receives ad uses props.
useState hook creates movies, searchTitle, searchRating and ratings state variable.
searchTitle and searchRating track user entries in the search form field of the Movies List Page.
movies default is set to an empty array. ratings default is set to an array with the "All ratings" value.
Set this way for when the user first navigates to the Movies List search form*/
const MoviesList = props => {
    const [movies, setMovies] = useState([])
    const [searchTitle, setSearchTitle] = useState("")
    const [searchRating, setSearchRating] = useState("")
    const [ratings, setRatings] = useState(["All ratings"])

    //called when user types into the search title field. Then takes entered value and sets it to the component state
    const onChangeSearchTitle = e =>{
        const searchTitle = e.target.value
        setSearchTitle(searchTitle);
    }

    const onChangeSearchRating = e =>{
        const searchRating = e.target.value
        setSearchRating(searchRating);
    }

    //useEffect hook is called after the component renders, calling retrieveMovies() and retrieveRatings()
    useEffect(() =>{
        retrieveMovies()
        retrieveRatings()
    //the empty array prevents multiple unnecessary running of methods on every render
    },[])

    /*calls MovieDataService.gatAll().
    Returns a promise from the database which is set to movies state variable with setMovies(response.data.movies)*/
    const retrieveMovies = () =>{
        MovieDataService.getAll().then(response =>{
            console.log(response.data)
            setMovies(response.data.movies)
        })
        .catch( e =>{
            console.log(e)
        })
    }

    //calls MovieDataService.getRatings to get list of ratings. Response data is concatenated
    const retrieveRatings = () =>{
        MovieDataService.getRatings().then(response =>{
            console.log(response.data)
            //start with "All ratings" if user does not specify any ratings
            setRatings(["All Ratings"].concat(response.data))
        })
        .catch( e =>{
            console.log(e)
        })
    }

    return (
        <div className="App">
            <Container>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Control
                                type="text"
                                placeHolder="Search by title"
                                value={searchTitle}
                                onChange={onChangeSearchTitle}
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="button"
                                onClick={findByTitle}
                            >
                                Search
                            </Button>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Control
                                as = "select" onChange={onChangeSearchRating}>
                                {ratings.map(rating =>{
                                    return(
                                        <option value={rating}>{rating}</option>
                                    )
                                })}
                                </Form.Control>
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="button"
                                onClick={findByRating}
                            >
                                Search
                            </Button>             
                        </Col>
                    </Row>                    
                </Form>
            </Container>
        </div>
    );
}







export default MoviesList;