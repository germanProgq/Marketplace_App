import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Layout/assets/usercontext";
import Cookies from 'js-cookie'

import "./usersettings.css";

const UserSettings = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const logout = () => {
    updateUser(null);
    navigate("/");
  };

  if (!user) {
    return (
      <div className="settings-div">
        <h3 className="settings-title">User Settings</h3>
        <p>You must be logged in to view user settings.</p>
      </div>
    );
  }

  const commonSettings = (
    <ul className="what-can-be-changed-row">
      <h5 className="settings-name">Change</h5>
      <li className="what-can-be-changed-options">
        
          <Link to={`/change/email`}>E-mail</Link>
        
      </li>
      <li className="what-can-be-changed-options">        
          <Link to={`/change/username`}>Username</Link>        
      </li>
      <li className="what-can-be-changed-options">        
          <Link to={`/change/password`}>Password</Link>        
      </li>
    </ul>
  );

  const userSpecificSettings = (
    <ul className="what-can-be-changed-row">
      <h5 className="settings-name">Update</h5>
      <li className="what-can-be-changed-options">        
          <Link to={`/update/name`}>Name</Link>       
      </li>
      <li className="what-can-be-changed-options">        
          <Link to={`/update/surname`}>Surname</Link>        
      </li>
      <li className="what-can-be-changed-options">        
          <Link to={`/update/payment`}>Payment</Link>        
      </li>
    </ul>
  );

  const sellerSpecificSettings = (
    <ul className="what-can-be-changed-row">
      <h5 className="settings-name">Seller Options</h5>
      <li className="what-can-be-changed-options" style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>        
          <Link to={`/catalog/add`}>Sell</Link>        
      </li>
    </ul>
  );

  const adminSpecificSettings = (
    <ul className="what-can-be-changed-row">
      <h5 className="settings-name">Admin Options</h5>
      <li className="what-can-be-changed-options" style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>        
          <Link to={`/catalog/edit`}>Offers</Link>
          <Link to={`/users/edit`}>Users</Link>
          <Link to={`/admin/impersonate`}>Impersonate</Link>
          <Link to={`/admin/tickets`}>Tickets</Link>
          <Link to={`/change-priority`}>Change Priority</Link>
      </li>
    </ul>
  );

  const ownerSpecificSettings = (
    <ul className="what-can-be-changed-row">
      <h5 className="settings-name">Owner Options</h5>
      <li className="what-can-be-changed-options" style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>        
          <Link to={`/owner/grant-admin`}>Give Admin</Link>                
          <Link to={`/owner/revoke-admin`}>Take Admin</Link>        
        {/* 
          <Link to={`/owner/log-user`}>Log As</Link>
         */}        
          <Link to={`/owner/see-full-data`}>Info</Link>        
      </li>
    </ul>
  );

  const displayOwnerOptions = user.role === "owner";
  const displayCommonOptions = user.role === "user" || displayOwnerOptions;
  const displayAdminOptions = user.role === "admin" || displayOwnerOptions;
  const displaySellerOptions = user.role === "seller";

  return (
    <div className="settings-div">
      <h3 className="settings-title">User Settings</h3>
      <div className="what-can-be-changed">
        {displayCommonOptions && commonSettings}
        {/* {displayCommonOptions && userSpecificSettings} */}
        {displaySellerOptions && sellerSpecificSettings}
        {displayAdminOptions && adminSpecificSettings}
        {displayOwnerOptions && ownerSpecificSettings}
        <ul className="what-can-be-changed-row">
          <h5 className="settings-name">Log Out</h5>
          <li className="what-can-be-changed-options">
            <button onClick={logout} style={{padding:'2vh 5vw', marginBottom:'30px'}}>Log Out</button>
          </li>
          <Link to={`/user/delete`} style={{color:'#f5f5f5', textDecoration:'none', background:'red'}} className="delete-account">Delete Account</Link>
        </ul>
      </div>
    </div>
  );
};

export default UserSettings;
