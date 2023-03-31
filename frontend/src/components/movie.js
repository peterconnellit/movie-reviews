import React, {useState, useEffect} from 'react'
import MovieDataService from '../services/movies'
import {Link, link} from 'react-router-dom'
import moment from 'moment'

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';


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
                        <h2>Reviews</h2>
                        <br></br>
                        {/*higher order function. Renders a Media component for each review*/}  
                        {movie.reviews.map((review, index) =>{
                            return (
                                <Card key={index}>
                                    <Card.Body>
                                        <h5>{review.name + " reviewed on "} {moment(review.date).format("Do MMMM YYYY")}</h5>
                                        <p>{review.review}</p>
                                        {/*a user can only delete reviews they have posted.
                                        If props.user is true and the id is the same as the review id, do we render Edit/Delete*/} 
                                        {props.user && props.user.id === review.user_id &&
                                            <Row>
                                                <Col><Link to={{
                                                    pathname: "/movies/"+
                                                                props.match.params.id+
                                                                "/review",
                                                    state: {currentReview: review}
                                                }}>Edit</Link>                                            
                                                </Col>
                                                <Col><Button variant="link">Delete</Button></Col>
                                            </Row>
                                        }
                                    </Card.Body>
                                </Card>
                            )
                        })}                 
                    </Col>
                </Row>
            </Container>
        </div>
    );

}

export default Movie;