import axios from "axios";
import React, { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { starsGenerator } from "@/constants/helper";
import userErrorLogout from "@/hooks/use-err-logout";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { Delete, Edit2 } from "lucide-react";
import { Colors } from "@/constants/Colors";

const ReviewsComponent = ({ productId }) => {
  const [reviewList, setReviewList] = useState([]);
  const [edting, setEdting] = useState({
    status: false,
    reviewId: null,
    review: "",
  });
  const [newReview, setNewReview] = useState({ review: "", rating: 0 });
  const [newReply, setNewReply] = useState({ review: "" });
  const [replyingTo, setReplyingTo] = useState(null);

  const handleErrorLogout = userErrorLogout();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + `/get-reviews/${productId}`
        );
        const { data } = await res.data;
        setReviewList(data);
      } catch (error) {
        handleErrorLogout(error);
      }
    };
    getReviews();
  }, [productId]);

  const addReview = async () => {
    if (!newReview.review || !newReview.rating) {
      toast({
        title: "Error while adding review",
        description: "Review and Rating can not be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/create-review",
        {
          productId,
          review: newReview.review,
          rating: newReview.rating,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { data, message } = await res.data;
      setReviewList([...reviewList, data]);
      setNewReview({ name: "", review: "", rating: 0 });
      toast({ title: message });
    } catch (error) {
      handleErrorLogout(error);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await axios.delete(
        import.meta.env.VITE_API_URL + `/delete-review/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { message } = await res.data;
      setReviewList(reviewList.filter((review) => review._id !== reviewId));
      toast({ title: message });
    } catch (error) {
      handleErrorLogout(error, "Error while deleting review");
    }
  };

  const editReview = async (reviewId) => {
    if (!confirm("Are you sure you want to edit this review?")) return;

    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + `/update-review/${reviewId}`,
        { updatedReview: edting.review },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { data, message } = await res.data;
      setReviewList(
        reviewList.map((review) =>
          review._id === reviewId ? data : review
        )
      );
      setEdting({ status: false, reviewId: null, review: "" });
      toast({ title: message });
    } catch (error) {
      handleErrorLogout(error, "Error while editing review");
    }
  };

  const addReply = async (reviewId) => {
    if (!newReply.review) {
      toast({
        title: "Error while replying to review",
        description: "Reply can not be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + `/reply-review/${reviewId}`,
        { review: newReply.review },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { data, message } = await res.data;
      setReviewList((prev) =>
        prev.map((review) => (review._id === reviewId ? data : review))
      );
      setNewReply({ review: "" });
      setReplyingTo(null);
      toast({ title: message });
    } catch (error) {
      handleErrorLogout(error, "Error while replying to review");
    }
  };

  return (
    <div className="my-10 sm:my-20 w-[93vw] lg:w-[70vw] mx-auto ">
      <h3 className="font-extrabold text-2xl text-gray-800 dark:text-white mb-8 text-center">
        Reviews
      </h3>

      {/* write review section */}
      <div className="rounded-lg">
        <h4 className="font-semibold text-lg text-gray-700 dark:text-customIsabelline mb-4">
          Write a review
        </h4>
        <Textarea
          className="mb-4"
          placeholder="Your Review"
          value={newReview.review}
          onChange={(e) =>
            setNewReview({ ...newReview, review: e.target.value })
          }
        />
        <div className="flex gap-5">
          <Input
            type="number"
            max="5"
            min="1"
            className="mb-4 w-[10rem]"
            placeholder="Rating (1-5)"
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({ ...newReview, rating: Number(e.target.value) })
            }
          />
          <Button onClick={addReview}>Submit Review</Button>
        </div>
      </div>

      {/* review list */}
      <div className="space-y-6 my-10">
        {reviewList.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No reviews found for this product.
          </p>
        ) : (
          reviewList.map((review) => (
            <div
              key={review?._id}
              className="bg-white border-gray-200 p-6 rounded-xl shadow-lg dark:bg-zinc-900 dark:border-none"
            >
              <div className="flex items-center mb-4">
                <img
                  src="https://media.istockphoto.com/id/1806223369/photo/portrait-of-a-young-investor-banker-at-the-workplace-inside-the-bank-office-a-businessman-in.jpg?s=612x612&w=0&k=20&c=9SBqYUyIqPQA2SBD6u0OhKskHZciDdrACE3GoVU5v9U="
                  alt={review?.userId?.name}
                  className="w-10 h-10 rounded-full mr-4 border border-gray-300"
                />
                <div>
                  <h4>{review?.userId?.name}</h4>
                  <div className="flex items-center mt-1">
                    {starsGenerator(review?.rating, "0", 15)}
                  </div>
                </div>
              </div>
              {user?.id === review?.userId?._id &&
              edting.status &&
              edting.reviewId === review?._id ? (
                <Input
                  value={edting.review}
                  onChange={(e) =>
                    setEdting({
                      review: e.target.value,
                      status: true,
                      reviewId: review?._id,
                    })
                  }
                />
              ) : (
                <p className="text-gray-700 text-sm dark:text-customGray">
                  {review?.review}
                </p>
              )}

              {/* replies */}
              {review?.replies?.length > 0 && (
                <div className="mt-5 bg-gray-50 p-4 rounded-lg border dark:bg-zinc-800">
                  <h5 className="font-bold text-sm text-gray-700 mb-3 dark:text-customYellow">
                    Replies ({review?.replies?.length})
                  </h5>
                  <div className="space-y-4">
                    {review?.replies?.map((reply) => (
                      <div
                        key={reply?._id}
                        className="flex items-start space-x-4 border-b pb-3 last:border-none"
                      >
                        <img
                          src="https://media.istockphoto.com/id/1437047112/photo/volunteer-friends-gardening-at-sunset-taking-a-selfie.jpg?s=612x612&w=0&k=20&c=0Qp1W9TjUH_iVgGJOoyELBDIzmrwtIbe22x8xdBwV9M="
                          alt={reply?.userId?.name}
                          className="w-8 h-8 rounded-full border border-gray-300"
                        />
                        <div>
                          <h6 className="font-medium text-gray-800 dark:text-customIsabelline capitalize">
                            {reply?.userId?.name}
                          </h6>
                          <p className="text-gray-600 text-sm dark:text-customGray">
                            {reply?.review}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* reply form */}
              {replyingTo === review?._id && (
                <div>
                  <Textarea
                    className="mt-4"
                    placeholder="Write Your reply..."
                    value={newReply?.review}
                    onChange={(e) => setNewReply({ review: e.target.value })}
                  />
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => addReply(review?._id)}
                  >
                    Reply
                  </Button>
                </div>
              )}

              {/* actions */}
              <div className="flex gap-5 justify-start items-center mt-4">
                <button
                  className="text-sm text-customYellow hover:underline"
                  onClick={() =>
                    setReplyingTo(
                      replyingTo === review?._id ? null : review?._id
                    )
                  }
                >
                  {replyingTo === review?._id ? "Cancel" : "Reply"}
                </button>
                {user?.id === review?.userId?._id && (
                  <>
                    {edting.status ? (
                      <span
                        onClick={() => editReview(review._id)}
                        className="text-sm text-customYellow cursor-pointer hover:underline"
                      >
                        Save
                      </span>
                    ) : (
                      <span
                        className="flex items-center gap-2 border-b bg-transparent hover:border-customYellow cursor-pointer text-customYellow"
                        onClick={() =>
                          setEdting({
                            status: true,
                            reviewId: review?._id,
                            review: review?.review,
                          })
                        }
                      >
                        <Edit2 size={15} color={Colors.customYellow} />
                        <span>Edit</span>
                      </span>
                    )}
                    <span
                      className="flex items-center gap-2 border-b bg-transparent hover:border-customYellow cursor-pointer text-customYellow"
                      onClick={() => deleteReview(review?._id)}
                    >
                      <Delete size={20} color={Colors.customYellow} />
                      <span>Delete</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsComponent;