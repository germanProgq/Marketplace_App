import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../Layout/assets/usercontext';
import Loader from '../../assets/Loaders/loaders';
import './catalog.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'; // Correctly import Swiper modules
import 'swiper/swiper-bundle.css';
import SwiperCore from 'swiper';
import { isMobile } from "react-device-detect";
SwiperCore.use([Navigation, Pagination]); // Ensure the modules are registered

const sortIcons = {
  'default': '😒',
  'price-lowest': '🔼',
  'price-highest': '🔽',
};

const API = process.env.API || 'http://localhost:4000';

const Catalog = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default'); // Default sorting option
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const { user } = useUser();
  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {    
    const fetchCatalogItems = async () => {
      try {
        const response = await axios.get(`${API}/catalog`);
        setItems(response.data);
        // Extract categories from items
        const uniqueCategories = ['All', ...new Set(response.data.map(item => item.categoryname))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching catalog items:', error);
        setMessage(<p className="response">Error fetching catalog items</p>);
      } finally {       
        setLoading(false); // Hide loader when data is fetched
      }
    };

    fetchCatalogItems();
  }, []);

  const filterItemsByCategory = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const sortItems = (type) => {
    const sortedItems = [...items];
    if (type === 'discount') {
      // Discount implementation
    } else if (type === 'rating') {
      // Rating implementation
    } else if (type === 'price-lowest') {
      sortedItems.sort((a, b) => a.itemprice - b.itemprice);
    } else if (type === 'price-highest') {
      sortedItems.sort((a, b) => b.itemprice - a.itemprice);
    }
    setItems(sortedItems);
  };

  const renderItems = () => {
    const filteredItems = items
      .filter((item) => selectedCategory === 'All' || item.categoryname === selectedCategory)
      .sort((a, b) => {
        if (sortBy === 'price-lowest') return a.itemprice - b.itemprice;
        if (sortBy === 'price-highest') return b.itemprice - a.itemprice;
        return 0;
      });

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredItems.length);

    return filteredItems.slice(startIndex, endIndex).map((item, index) => (
      <div key={index} className="product">
        <div href={`items/${item.id}`} style={{ width: '100%' }}>
          <Swiper
            spaceBetween={100}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            loop
            style={{ height: '100%' }}
          >
            {item.itemimages.map((imageUrl, imgIndex) => (
              <SwiperSlide key={imgIndex} className="swiper-slide-centered">
                <img
                  className="centered-image"
                  src={imageUrl}
                  alt={item.itemname}
                  style={{ height: 'auto', width: '80%', borderRadius: '30px' }} // Ensure responsive images
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <h3>{item.itemname}</h3>
        <p>Price: {item.itemprice}$</p>
        <div className="product-buttons">
          <button className="add-to-cart-button" onClick={() => addToCart(item.id)}>
            Add to Cart
          </button>
          <a href={`items/${item.id}`}>Learn More</a>
        </div>
      </div>
    ));
  };

  const pageCount = Math.ceil(
    items.filter((item) => selectedCategory === 'All' || item.categoryname === selectedCategory).length / pageSize
  );

  const changePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div id="catalog">
      {loading ? (
        <Loader /> // Show loader when loading
      ) : (
        <>
          {message}
          <div style={{display: 'flex', justifyContent: 'end', alignItems: 'center', gap: '1.2vw'}}>
            <label htmlFor="category-select">Select Category:</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => filterItemsByCategory(e.target.value)}
              style={{ margin: '0 10px' }}
            >
              {categories.map((category, index) => (
                <option key={index} value={category} className='select-category'>{category}</option>
              ))}
            </select>
            <select
              className='select-sort'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '5px', borderRadius: '5px' }}
            >
              <option value='Sort by' className='category-sort'>{sortIcons['default']}Sort by</option>
              <option value="price-lowest" className='category-sort'>{sortIcons['price-lowest']} Price (Lowest)</option>
              <option value="price-highest" className='category-sort'>{sortIcons['price-highest']} Price (Highest)</option>
              </select>
            </div>
            <div id='catalog-seperate' className={`${isMobile ? "phone-catalog-seperate" : ""}`}>
              {renderItems()}
            </div>
            <div className={`pagination ${isMobile ? "phone-pagination" : " "}`}>
              {Array.from({ length: pageCount+3}, (_, index) => (
                <button
                  key={index}
                  className={`pagination-button ${currentPage === index + 1 ? 'active' : ''} ${isMobile ? 'phone-pagination-button' : ""}`}
                  onClick={() => changePage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
  );
};

export default Catalog;
