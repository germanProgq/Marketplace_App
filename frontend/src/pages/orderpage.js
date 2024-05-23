import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './Layout/assets/usercontext';
import './styles/root.css';
import './styles/orderpage.css';
import Loader from '../assets/Loaders/loaders';

const API = process.env.API || "http://localhost:4000";

const OrderPage = () => {
  const [loading, setLoading] = useState(true); // Track loading state
  const [final, setFinal] = useState(0);
  const [total, setTotal] = useState(0);
  const [taxtotal, setTaxTotal] = useState(0);
  const [deliveryFee, setFee] = useState(0);
  const [message, setMessage] = useState('');
  const { user } = useUser(); // Use the context for user data
  const token = user?.token;

  const fetchCartAndCalculateTotal = async (email) => {
    try {
      const response = await axios.get(`${API}/cart/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const cartData = response.data;
        const { items } = cartData;
        if (Array.isArray(items)) {
          if (items.length === 0) {
            setMessage(<p className="info-message">Your cart is empty. Please add items to proceed.</p>);
            setLoading(false); // Set loading to false after fetching data
            return;
          }

          let totalprice = 0;
          let taxprice = 0;
          let fee = 0;

          for (const item of items) {
            try {
              const itemResponse = await axios.get(`${API}/items/${item.item_id}`);
              const itemDetails = itemResponse.data;
              totalprice += itemDetails.itemprice * item.item_quantity;
            } catch (itemError) {
              console.error('Error fetching item details:', itemError);
            }
          }

          taxprice = totalprice * 0.2;
          fee = taxprice * 0.05;
          setTaxTotal(taxprice.toFixed(2));
          setFee(fee.toFixed(2));
          setTotal(totalprice.toFixed(2));
          setFinal((totalprice + fee + taxprice).toFixed(2));
        } else {
          setMessage(<p className="error-message">Cart data is not in the expected format</p>);
        }
      } else {
        setMessage(<p className="error-message">{response.data}</p>);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setMessage(<p className="error-message">Error fetching cart data</p>);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartAndCalculateTotal(user.email);
    } else {
      setMessage(<p className="info-message">Please log in to view your order.</p>);
      setLoading(false); // Set loading to false when user is not logged in
    }
  }, [user]);

  return (
    <div className="order">
      {loading ? ( // Render loader if loading is true
        <Loader/>
      ) : (
        <>
          {message}
          {user && (
            <p className="total-order">
              Items' price: {total}$<br/><br/>
              Tax (20%): {taxtotal}$<br/><br/>
              Fee (5%): {deliveryFee}$<br/><br/>
              Final Price: {final}$
            </p>
          )}
          {user && (
            <div className="payment-method">
              <label className="select">
                <select id='payment-select'>
                  <option value="1">Online payment</option>
                  <option value="2">Cash</option>
                  <option value="3">Bank transfer</option>
                </select>
              </label>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderPage;
