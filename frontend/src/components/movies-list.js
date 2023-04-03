//imports useState to create a series of state variables
import React, {useState, useEffect} from 'react'
import MovieDataService from "../services/movies"
import {Link} from "react-router-dom"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

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

    //State variables to track which page is displayed, populated in retrieveMovies()
    const [currentPage, setCurrentPage] = useState(0)
    const [entriesPerPage, setEntriesPerPage] = useState(0)
    const [currentSearchMode, setCurrentSearchMode] = useState("")

    //triggered each time currentPage changes in value, which calls retrieveMovies() with the updated currentPage value
    useEffect(() =>{
        setCurrentPage(0)
    },[currentSearchMode])

    useEffect(() =>{
        retrieveNextPage()
    },[currentPage])

    useEffect(() => {
        retrieveRatings();
      }, []);

    const retrieveNextPage = () =>{
        if (currentSearchMode === "findByTitle")
        findByTitle()
        else if (currentSearchMode === "findByRating")
        findByRating()
        else
        retrieveMovies()
    }

    /*calls MovieDataService.gatAll().
    Returns a promise from the database which is set to movies state variable with setMovies(response.data.movies)*/
    const retrieveMovies = () =>{
        setCurrentSearchMode("")
        //JSON data includes page and entries per page
        MovieDataService.getAll(currentPage).then(response =>{
            console.log(response.data)
            setMovies(response.data.movies)
            setCurrentPage(response.data.page)
            setEntriesPerPage(response.data.entries_per_page)
        })
        .catch( e =>{
            console.log(e)
        })
    }
    
    //called when user types into the search title field. Then takes entered value and sets it to the component state
    const onChangeSearchTitle = e =>{
        const searchTitle = e.target.value
        setSearchTitle(searchTitle);
    }

    const onChangeSearchRating = e =>{
        const searchRating = e.target.value
        setSearchRating(searchRating);
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

    //provides the search query value entered by the user to MovieDataService.find, find() calls the backend API
    const find = (query, by) =>{
        MovieDataService.find(query, by, currentPage).then(response =>{
            console.log(response.data)
            setMovies(response.data.movies)
        })
        .catch(e =>{
            console.log(e)
        })
    }

    //called by "Search by title's button. provide the title value to be searched to find() and tells it to search by "title"
    const findByTitle = () =>{
        setCurrentSearchMode("findByTitle")
        find(searchTitle, "title")
    }

    //called by the "Search by rating's button. If user does not specify rating, the default "All ratings" will retrieve all movies
    const findByRating = () =>{
        setCurrentSearchMode("findByRating")
        if(searchRating === "All Ratings"){
            retrieveMovies()
        }
        else{
            find(searchRating, "rated")
        }
    }

    //React form with a search by title and search by ratings dropdown
    return (
        <div className="App">
            <Container>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group>                            
                                <Form.Control
                                type="text"                              
                                aria-label='search by title'                           
                                placeholder="Search by title"                                
                                //set to searchTitle state variable
                                value={searchTitle}
                                //updates searchTitle
                                onChange={onChangeSearchTitle}
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="button"
                                //calls findByTitle method
                                onClick={findByTitle}
                            >
                                Search
                            </Button>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Control
                                /*dropdown field to select a movie rating where we use the map function.
                                Higher order function (.map) takes a callback function as an argument and returns a new array
                                with transformed values based on the returned value from the callback function.*/
                                aria-label='search by rating' 
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
                                //calls findByRating method
                                onClick={findByRating}
                            >
                                Search
                            </Button>             
                        </Col>
                    </Row>                    
                </Form>

                {/*higher-order function, .map takes a function as an argument and returns a new array based on the output of that function.
                For each movie in movies, we return a Card component from bootstrap*/}
                <Row>
                <h2>Movies</h2>
                    {movies.map((movie) =>{
                        return(
                            <Col>
                                <Card style={{ width: '18rem'}}>
                                    <Card.Img src={movie.poster+"/100px180"} alt=""/>
                                    <Card.Body>
                                        <Card.Title><h3>{movie.title}</h3></Card.Title>
                                        <Card.Text>
                                            Rating: {movie.rated}
                                        </Card.Text>
                                        <Card.Text>{movie.plot}</Card.Text>
                                        <Link to={"/movies/"+movie._id} >View reviews</Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
                <br />
                {/*link buttons which increment and decrement currentPage state variable, triggering useEffect()*/}
                showing page: {currentPage}.
                <Button variant='link' onClick={() => {setCurrentPage(currentPage - 1)}}>
                    Get last {entriesPerPage} results
                </Button>
                <Button variant='link' onClick={() => {setCurrentPage(currentPage + 1)}}>
                    Get next {entriesPerPage} results
                </Button>
            </Container>
        </div>
    );
}

export default MoviesList;