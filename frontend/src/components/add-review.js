import React, { useState } from 'react'
import MovieDataService from "../services/movies"
import {Link} from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddReview = props =>{

    //boolean set to true if component is in "Editing mode", false for adding a review
    let editing = false
    let initialReviewState = ""

    /*checks if a state is passed to AddReview, which checks currentReview property.
    If so, sets editing to true and initialReviewState to currentReviews*/
    if(props.location.state && props.location.state.currentReview){
        editing = true
        initialReviewState = props.location.state.currentReview.review
    }

    //in edit mode, initialReviewState will be set to existing review text
    const [review, setReview] = useState(initialReviewState)
    //tracks if a review has been submitted
    const [submitted, setSubmitted] = useState(false)

    //keeps track of the user entered review value in the field
    const onChangeReview = e =>{
        const review = e.target.value
        setReview(review);
    }

    //called by submit button onClick={saveReview}. Creates data object with the reviews properties
    const saveReview = () =>{
        let data = {
            review: review,
            //passed into AddReview component in App.js
            name: props.user.name,
            user_id: props.user.id,
            //movie_id direct from the url in movie.js
            movie_id: props.match.params.id //get movie id direct from url
        }

        //if editing is true, we get existing review id and call updateReview in MovieDataService
        if(editing){
            //get existing review id
            data.review_id = props.location.state.currentReview._id
            MovieDataService.updateReview(data).then(response =>{
                setSubmitted(true);
                console.log(response.data)
            })
            .catch(e =>{
                console.log(e);
            })
        }
        else{
            /*calls MovieDataService.createReview(data) in movie.js.
            Routes ReviewsController and calls apiPostReview, which then extracts data from the request's body parameter*/
            MovieDataService.createReview(data).then(Response => {
                setSubmitted(true)
            })
            .catch(e => {
                console.log(e)
            })
        }
    }

    return (
        <div className='vh-100'>
            {submitted ? (
                <div className='login shadow-sm p-3 mb-5 bg-white rounded'>
                    <h2>Review submitted successfully</h2>
                    <Link to={"/movies/"+props.match.params.id} class="btn btn-success btn-lg">
                        Back to Movie
                    </Link>
                </div>
            ):(
                <Form className='login shadow-sm p-3 mb-5 bg-white rounded'>
                    <Form.Group>
                        <h2>{editing ? "Edit Review" : "Create Review"}</h2>
                        <Form.Control
                            aria-label='Review' 
                            type='text'
                            required
                            value={review}
                            onChange={onChangeReview}
                        />
                    </Form.Group>
                    <Button variant="btn btn-primary btn-lg" onClick={saveReview}>
                        Submit
                    </Button>      
                </Form>
            )}
        </div>
    )
}

export default AddReview;