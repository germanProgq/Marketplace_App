import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from './Layout/assets/usercontext';
import Loader from '../assets/Loaders/loaders';
import './styles/root.css';
import './styles/cart.css';

const Cart = () => {
  const [message, setMessage] = useState('');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const email = user?.email;
  const token = user?.token;
  const API_BASE_URL = process.env.API || 'http://localhost:4000';
  const sortByID = (a, b) => {
    return a.id - b.id;
  };

  const deleteFromCart = async (item_id) => {    
    try {
      const response = await axios.delete(`${API_BASE_URL}/cart/${email}/${item_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const updatedItems = [...items];
        const itemIndex = updatedItems.findIndex(item => item.id === item_id);

        if (itemIndex !== -1) {
          const item = updatedItems[itemIndex];
          if (item.item_q > 1) {
            // If item quantity is greater than 1, decrease the quantity by 1
            updatedItems[itemIndex].item_q -= 1;
          } else {
            // If item quantity is 1, remove the item from the cart
            updatedItems.splice(itemIndex, 1);
          }
          updatedItems.sort(sortByID);
          setItems(updatedItems);
          setTotal(prevTotal => prevTotal - item.itemprice);
        }
      }
    } catch (error) {
      console.error('Error deleting item from cart:', error);
      setMessage('Error removing item from cart');
    } 
  };

  const findCart = async (email, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const cartData = response.data;
        const itemIds = cartData.items.map(item => item.item_id);
        const itemResponses = await Promise.all(itemIds.map(itemId =>
          axios.get(`${API_BASE_URL}/items/${itemId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        ));

        const itemDetails = itemResponses.map((response, index) => {
          const itemData = response.data;
          // Set the item quantity from cart data
          itemData.item_q = cartData.items[index].item_quantity;
          return itemData;
        });

        const totalPrice = itemDetails.reduce((acc, item) => acc + Number(item.itemprice) * item.item_q, 0);

        itemDetails.sort(sortByID);
        setItems(itemDetails);
        setTotal(parseFloat(totalPrice).toFixed(2));
      } else {
        setMessage('Error fetching cart data');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setMessage('Error fetching cart items');
    } finally {
      setLoading(false); // Hide loader when done
    }
  };

  useEffect(() => {
    if (user) {
      findCart(email, token);
    } else {
      setMessage('Please log in to view or add items to the cart');
      setLoading(false);
    }
  }, [user, email, token]);

  return (
    <div className="cart">
      {loading ? (
        <Loader />
      ) : (
        items.length === 0 ? (
          <p>{message}</p>
        ) : (
          <ul className="item-list">
            {items.map((item) => (
              <li key={item.id} className="item-card">
                <Link className="item-cart-a" to={`/items/${item.id}`}>
                  <img src={item.itemimage} alt={item.itemname} width="100" height="100" />
                </Link>
                <Link className="item-cart-a" to={`/items/${item.id}`}>
                  <h2>{item.itemname}</h2>
                </Link>
                <h5>Quantity: {item.item_q}</h5>
                <p>Price: ${item.itemprice}</p>
                <button
                  style={{ padding: '1vh 1.6vw', color: 'var(--primary)', borderRadius: '30px', border: 'none', cursor: 'pointer' }}
                  id={`delete-from-cart-button-${item.id}`}
                  onClick={() => deleteFromCart(item.id)}
                >
                  Delete from cart
                </button>
              </li>
            ))}
            <div className="cart-details">
              <p className="total-price">Total: {total}$</p>
              <Link className="order-button" to={`/order`} style={{ textDecoration: 'none' }}>Order</Link>
            </div>
          </ul>
        )
      )}
    </div>
  );
};

export default Cart;
