import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../Layout/assets/usercontext';
import './itemdetail.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'; // Correctly import Swiper modules
import SwiperCore from 'swiper'
import 'swiper/swiper-bundle.css';
import Loader from '../../assets/Loaders/loaders';
SwiperCore.use([Navigation, Pagination]); // Ensure the modules are registered


const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [message, setMessage] = useState('');
  const API = process.env.API || 'http://localhost:4000';
  const { user } = useUser();

  const fetchItem = async () => {
    setLoading(true);
    try {
      const [itemResponse, reviewsResponse] = await Promise.all([
        axios.get(`${API}/items/${id}`),
        axios.get(`${API}/reviews/${id}`)
      ]);
      setItem(itemResponse.data);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Error fetching item and reviews:', error);
      setMessage('An error occurred while fetching item details');
    } finally {
      setLoading(false); // Set loading to false when fetching data completes
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!item) {
    return <div className="error-item-find">Item not found</div>;
  }

  const handleAddReview = async () => {
    if (!user) {
      setMessage(<p className="response">You must log in to add a review</p>);
      return;
    }
  
    const rating = prompt('Enter rating (1-5):');
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      setTimeout(() => {
        setMessage('')        
      }, 400);
      setMessage(<p className="response">Invalid rating. Please enter a number between 1 and 5.</p>);
      return;
    }
  
    const comment = prompt('Enter your review:');
    if (!comment) {
      setTimeout(() => {
        setMessage('')        
      }, 400);
      setMessage(<p className="response">Review cannot be empty</p>);
      return;
    }
  
    try {
      const response = await axios.post(
        `${API}/reviews/${user.email}/${id}`,
        { rating: parseInt(rating), comment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessage(<p className="response">{response.data.message}</p>);
      fetchItem();
    } catch (error) {
      console.error('Error adding review:', error);
      setMessage(<p className="response">Error adding review</p>);
    }
  };
  const addToCart = async (itemName) => {
    if (!user) {
      setMessage(<p className="response">You must log in to continue</p>);
    } else {
      const email = user.email;
      try {
        const response = await axios.post(
          `${API}/cart/add/${email}/${itemName}`
        );
        setMessage(<p className="response">{response.data.message}</p>);
        setTimeout(() => {
          setMessage('');
        }, 1000);
      } catch (error) {
        console.error('Error adding item to cart:', error);
        setMessage(<p className="response">Error adding to cart</p>);
      }
    }
  };

  return (
    <div>
      {message}
      <h1 className="item-page-name">{item.itemname}</h1>
      <div className="item-page-stuff" style={{marginBottom:'100px'}}>
        <p className="item-page-desc">{item.itemdescription}</p>
        <div className="item-page-images">
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            loop
            style={{ height: '100%', width:'40vw', display:'flex'}}
          >
            {item.itemimages.map((imageUrl, imgIndex) => (
              <SwiperSlide key={imgIndex}>
                <img className="item-image image-centered" src={imageUrl} alt={`${item.itemname}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>       
      </div>
      <div className="reviews-section" style={{background:'var(--third)', borderRadius:'30px', height:'auto', minHeight:'30vh'}}>
          <h2 style={{fontSize:'34px', textAlign:'center'}}>Reviews</h2>
          {reviews.map((review, index) => (
            <div key={index} className="review">
              <p>User: {review.username}</p>
              <p>Rating: {review.rating}</p>
              <p>Comment: {review.comment}</p>
            </div>
          ))}         
         
        </div>
      {user && <button onClick={handleAddReview} style={{marginTop:'5vh'}}>Add Review</button>}
      <button className="add-to-cart-on-page" onClick={()=>addToCart(item.id)}>
        <p className="price-for-button">{item.id}$</p>
        <p className="add-to-cart-text-page">Add to Cart</p>
      </button>
    </div>
  );
};

export default ItemDetail;
