import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/profile/${username}`);
        setUserProfile(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.response?.data?.error || error.message);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  if (isLoading) {
    return <div className='loader'></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 style={{fontSize:'30px', textAlign:'center'}}>{userProfile.user.username}'s Profile</h2>
      <div>Username: {userProfile.user.username}</div>
      <div>Email: {userProfile.user.email}</div>
      <div>Role: {userProfile.user.role}</div>
      <div>Number of Orders: {userProfile.numOfOrders}</div>
      <div>Total Order Amount: ${userProfile.totalOrderAmount}</div>
      {/* Render additional user profile information as needed */}
    </div>
  );
};

export default ProfilePage;
