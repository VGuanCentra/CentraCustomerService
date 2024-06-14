/*
 * VGuan 1. Add PageLayout
 *  install react-bootstrap
 */

import React, { ReactNode } from "react";
import Navbar from "react-bootstrap/Navbar";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import { msalInstance } from "../msal/msal";

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props
 */
const PageLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
    const user = msalInstance.getActiveAccount();

  return (
    <>
      <Navbar bg="primary" variant="dark" className="navbarStyle">
        <a className="navbar-brand" href="/">
          Centra Dashboard Menu
        </a>
        {isAuthenticated ? (
          <div className="collapse navbar-collapse justify-content-end">
            Welcome {user?.username} & {user?.name}
          </div>
        ) : (
          ""
        )}
        <div className="collapse navbar-collapse justify-content-end">
          {isAuthenticated ? <SignOutButton /> : <SignInButton />}
        </div>
      </Navbar>
      <br />
      <br />
      {children}
      {/* {props.children} */}
    </>
  );
};

export default PageLayout;
