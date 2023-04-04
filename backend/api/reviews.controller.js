import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
  //for axios.post endpoint
  static async apiPostReview(req, res, next) {
    try {
      //information from the body of the request
      const movieId = req.body.movie_id;
      const review = req.body.review;
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id,
      };

      const date = new Date();

      const ReviewResponse = await ReviewsDAO.addReview(
        movieId,
        userInfo,
        review,
        date
      );
      //return post success or error
      res.json({ status: "success" });
    } catch (e) {
      res.status(500), json({ error: e.message });
    }
  }

  //for axios.put
  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const review = req.body.review;

      const date = new Date();

      //user_id is passed to check if user is the original creator
      const ReviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        req.body.user_id,
        review,
        date
      );

      let { error } = ReviewResponse;
      if (error) {
        res.status.json({ error });
      }

      /*updateReview return a document ReviewResponse which contains the property modifiedCount.
            We check modifiedCount is not zero, if it is, the review has not worked and an error is thrown*/
      if (ReviewResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update review. User may not be original poster"
        );
      }
      res.json({ status: "success" });
    } catch (e) {
      res.status(500), json({ error: e.message });
    }
  }

  //for axios.delete. userId ensures deleted user view is from the same user as created view
  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const userId = req.body.user_id;
      const ReviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500), json({ error: e.message });
    }
  }
}
