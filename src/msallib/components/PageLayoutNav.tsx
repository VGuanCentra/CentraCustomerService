/*
 * VGuan 1. Add PageLayout
 *  install react-bootstrap
 */

import React, { ReactNode, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "react-bootstrap/Navbar";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import { msalInstance } from "../msal/msal";
import CentraNavBar from "../navbar/index";
import { useAuthData } from "../../context/authContext";

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props
 */
const PageLayoutNav: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const user = msalInstance.getActiveAccount();
  //VGuan Debug 20240617
  const dispatch = useDispatch();
  const router = useRouter(); // "next/navigation"

  const { onAuthNavAction } = useAuthData();
  const [navParams, setNavParams] = useState(null);
  let appCode =
    typeof window !== "undefined" &&
    (window?.location?.href?.includes("/service") ||
      window?.location?.href?.includes("/remake"))
      ? "OM"
      : "WC";

  return (
    <>
      <CentraNavBar
        options={{
          zIndex: 999,
          onAction: onAuthNavAction,
          onRoute: async (path, params) => {
            await router.push(path);
            setNavParams(params);
            //dispatch(updateIsLoading(true));
            return true;
          },
          appCode: appCode,
        }}
        activeFeature={navParams?.featureKey}
      >
        <h2>Hello Centra bar</h2>
      </CentraNavBar>
    </>
  );

  //   return (
  //     <>
  //       <Navbar bg="primary" variant="dark" className="navbarStyle">
  //         <a className="navbar-brand" href="/">
  //           Centra Dashboard Menu
  //         </a>
  //         {isAuthenticated ? (
  //           <div className="collapse navbar-collapse justify-content-end">
  //             Welcome {user?.username} & {user?.name}
  //           </div>
  //         ) : (
  //           ""
  //         )}
  //         <div className="collapse navbar-collapse justify-content-end">
  //           {isAuthenticated ? <SignOutButton /> : <SignInButton />}
  //         </div>
  //       </Navbar>
  //       <br />
  //       <br />
  //       {children}
  //     </>
  //   );
};

export default PageLayoutNav;
