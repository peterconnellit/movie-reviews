//mongodb is used for ObjectId access, which converts id string to MongoDB Object id
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

//Similar to moviesDAO, we access the database reviews collection if not filled. MongoDB creates reviews collection if non exist
export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return;
    }
    try {
      reviews = await conn
        .db(process.env.MOVIEREVIEWS_NS)
        .collection("reviews");
    } catch (e) {
      console.error(`unable to establish connection handle in reviewDAO: ${e}`);
    }
  }

  //add a review. Converts movieId string to MongoDB object id. Can then be inserted into reviews collection using insertOne
  static async addReview(movieId, user, review, date) {
    try {
      const reviewDoc = {
        name: user.name,
        user_id: user._id,
        date: date,
        review: review,
        movie_id: new ObjectId(movieId),
      };
      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`unable to post review: ${e}`);
      return { error: e };
    }
  }

  /*update a review. {user_id: userId,_id: ObjectId(reviewId)} filters for an existing review created by userId and reviewId.
    If the review exists, we update it with the second argument containing new review text and date*/
  static async updateReview(reviewId, userId, review, date) {
    try {
      const updateResponse = await reviews.updateOne(
        //{user_id: userId,_id: ObjectId(reviewId)},
        { _id: new ObjectId(reviewId), user_id: userId },
        { $set: { review: review, date: date } }
      );
      return updateResponse;
    } catch (e) {
      console.error(`unable to update review: ${e}`);
      return { error: e };
    }
  }

  //delete review. similar to update review
  static async deleteReview(reviewId, userId) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: new ObjectId(reviewId),
        user_id: userId,
      });
      return deleteResponse;
    } catch (e) {
      console.error(`unable to delete review: ${e}`);
      return { error: e };
    }
  }
}
