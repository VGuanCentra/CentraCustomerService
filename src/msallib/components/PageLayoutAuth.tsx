/*
 * VGuan Add PageLayoutAuth
 */

import React, { ReactNode, useState } from "react";
import TopBar from "msallib/navbar/components/TopBar";
import router from "next/router";

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props
 */
const PageLayoutAuth: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [navParams, setNavParams] = useState<any[]>([]);
  const activeCurrentFeature = "customerService";
  let appCode = 
    typeof window !== "undefined" &&
    (window?.location?.href?.includes("/service?status=scheduled") ||
      window?.location?.href?.includes("/remake"))
      ? "OM"
      : "WC";

  return (
    <>
      <TopBar
        v=""
        options={{
          zIndex: 999,
          onRoute: async (path: string, params: any) => {
            await router.push(path);
            return true;
          },
          appCode: appCode,
        }}
        className="navbarStyle"
        activeFeature={activeCurrentFeature}
      >
      </TopBar>
      <br />
      <br />
      {children}
    </>
  );
};

export default PageLayoutAuth;
