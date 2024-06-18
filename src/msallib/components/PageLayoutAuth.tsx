/*
 * VGuan Add PageLayoutAuth
 */

import React, { ReactNode } from "react";
import TopBar from "msallib/navbar/components/TopBar";

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props
 */
const PageLayoutAuth: React.FC<{ children: ReactNode }> = ({ children }) => {
  // const isAuthenticated = useIsAuthenticated();
  // const user = msalInstance.getActiveAccount();

  return (
    <>
      <TopBar className="navbarStyle">
      </TopBar>
      <br />
      <br />
      {children}
    </>
  );
};

export default PageLayoutAuth;
