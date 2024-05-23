import React from 'react';
import { Link } from 'react-router-dom';

const MobileNav = ({ user, showDrop }) => {
  return (
    <>
    <div id='mobile-header'>     
        <Link to="/" style={{outline:'none'}}>
            <div className="logo">
              <h6>G</h6>
            </div>
        </Link> 
      <div id="overflow-drop"></div>
      {user ? (
        <div id="user" onClick={showDrop}>
          <p className="username-clickable">{user.username}</p>
          <div id="phone-user-click-menu" className="user-drop-hidden">
            <Link to="/catalog" className='dropdown-a-hidden'>Catalog</Link>
            <Link className="dropdown-a-hidden" to={`/users/${user.username}`}>
              Profile
            </Link>
            <Link to="/cart" className='dropdown-a-hidden'>Cart</Link>             
            <Link className="dropdown-a-hidden" to={`/settings`}>
              Settings
            </Link>
          </div>
        </div>
      ) : (
        <Link to="/login" className='log-in-a'>Log In</Link>
      )}
      </div>
    </>
  );
};

export default MobileNav;
