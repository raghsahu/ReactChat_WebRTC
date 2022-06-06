import React, {createContext, useEffect, useState, useContext} from 'react';


export const APPContext = createContext();

export const AppProvider = props => {
  const [user, setUser] = useState(null);

  const baseURL = 'http://mydelivery.prometteur.in/backend/API/';


  return (
    <APPContext.Provider
      value={{
        baseURL,
       
      }}>
      {props.children}
    </APPContext.Provider>
  );
};
