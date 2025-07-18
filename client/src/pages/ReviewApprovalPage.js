import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewApprovalPage = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/reviews/pending');
      setReviews(res.data);
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/reviews/approve/${id}`);
      setReviews(prev => prev.filter(r => r.ID !== id));
    } catch (err) {
      console.error('Error approving review:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/reviews/reject/${id}`);
      setReviews(prev => prev.filter(r => r.ID !== id));
    } catch (err) {
      console.error('Error rejecting review:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md mt-10 rounded">
      <h2 className="text-2xl font-bold mb-4">📝 Pending User Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-600">No pending reviews.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.ID} className="border p-4 rounded shadow-sm">
              <p className="text-sm font-semibold">👤 {review.UserName}</p>
              <p className="text-sm text-gray-700 mb-2">{review.Comment}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-500">{'⭐'.repeat(review.Rating)}</span>
                <span className="text-gray-500 text-xs">({review.Rating}/5)</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(review.ID)}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => handleReject(review.ID)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  ❌ Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewApprovalPage;
