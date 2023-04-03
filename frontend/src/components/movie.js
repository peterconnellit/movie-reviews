import React, {useState, useEffect} from 'react'
import MovieDataService from '../services/movies'
import {Link} from 'react-router-dom'
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

    /*calls deleteReview in MovieDataService, which calls the delete API endpoint (supported by apiDeleteReview in ReviewsController).
    Callback function gets the review array in the current state.
    We provide the index of the review to be deleted to the splice method and set the updated reviews array as the state*/
    const deleteReview = (reviewId, index) =>{
        MovieDataService.deleteReview(reviewId, props.user.id).then(response => {
            setMovie((prevState) =>{
                prevState.reviews.splice(index,1)
                return({
                    ...prevState
                })
            })
        })
        .catch(e =>{
            console.log(e)
        })
    }

    return (
        //two columns, one for the movie poster if it exists, and the second for movie details
        <div>
        <h2>Movie Review</h2>
            <Container>
                <Row>
                    <Col>
                        <Image src={movie.poster+"/100px250"} fluid alt="Move poster"/>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header as="h3">{movie.title}</Card.Header>
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
                        <h3>Reviews</h3>
                        <br></br>
                        {/*higher order function. Renders a Media component for each review*/}  
                        {movie.reviews.map((review, index) =>{
                            return (
                                <Card key={index}>
                                    <Card.Body>
                                        <h4>{review.name + " reviewed on "} {moment(review.date).format("Do MMMM YYYY")}</h4>
                                        <p>{review.review}</p>
                                        {/*a user can only delete reviews they have posted.
                                        If props.user is true and the id is the same as the review id, do we render Edit/Delete*/} 
                                        {props.user && props.user.id === review.user_id &&
                                            <Row>
                                                <Col><Link to={{
                                                    pathname: "/movies/" + props.match.params.id + "/review",
                                                    state: {
                                                        currentReview: review}
                                                    }}>Edit</Link>                                            
                                                </Col>
                                                {/*review id and the index from movie.reviews. function passed into deleteReview*/}
                                                <Col><Button variant="link" onClick={() => deleteReview(review._id, index)}>
                                                    Delete
                                                    </Button>
                                                </Col>
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