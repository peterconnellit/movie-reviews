import React, {useState, useEffect} from 'react'
import MovieDataService from '../services/movies'
import {Link, link} from 'react-router-dom'

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Media from 'react-bootstrap/Media';

const Movie = props => {

    //movie state variable to hold the movie currently showing. Initial values set to null, empty string and array
    const [movie, setMovie] = useState({
        id: null,
        title: "",
        rated: "",
        reviews: []
    })

    //calls get() from MoviesDataService, which in turn calls the API route
    const getMovie = id =>{
        MovieDataService.get(id).then(response =>{
            setMovie(response.data)
            console.log(response.data)
        })
        .catch(e =>{
            console.log(e)
        })   
    }

    /*getMovie called by useEffect.
    useEffect called when component renders and also each time the values of props.match.params.id changes*/
    useEffect(() =>{
        getMovie(props.match.params.id)
    },[props.match.params.id])

    return (
        //two columns, one for the movie poster if it exists, and the second for movie details
        <div>
            <Container>
                <Row>
                    <Col>
                        <Image src={movie.poster+"100px250"} fluid />
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header as="h5">{movie.title}</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {movie.plot}
                                </Card.Text>
                                {props.user &&
                                //if user is logged in (props.user is true), include link to 'Add Review'
                                <Link to={"/movies/" + props.match.params.id + "/review"}>
                                    Add Review
                                </Link>}
                            </Card.Body>
                        </Card>
                        <br></br>
                        <h2>Reviews</h2>                    
                    </Col>
                </Row>
            </Container>
        </div>
    );

}

export default Movie;