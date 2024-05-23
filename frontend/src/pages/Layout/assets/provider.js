import React, { createContext, useState } from 'react';

const UserContext = createContext({
  constemail: '', 
  constusername: '',
  setconstEmail: () => {}, 
  setconstUsername: () => {}, 
});
const UserProvider = ({ children }) => {
  const [constemail, setconstEmail] = useState(''); 
  const [constusername, setconstUsername] = useState('');

  return (   
    <UserContext.Provider value={{ constemail, constusername, setconstEmail, setconstUsername }}>
      {children} {/* Allow nested components to access the context */}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
