/*
 * VGuan Add PageLayoutAuth
 */

import React, { ReactNode, useState } from "react";
import TopBar from "msallib/navbar/components/TopBar";
import router from "next/router";
import { useAuthData } from "../../context/authContext";

const PageLayoutAuth: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [navParams, setNavParams] = useState<any[]>([]);
  const activeCurrentFeature = "customerService";
  let appCode =
    typeof window !== "undefined" &&
    (window?.location?.href?.includes("/service") ||
      window?.location?.href?.includes("/remake"))
      ? "OM"
      : "WC";
  const { onAuthNavAction } = useAuthData();

  return (
      <>
        <TopBar
          options={{
            zIndex: 999,
            onAction: onAuthNavAction,
            onRoute: async (path: string, params: any) => {
              await router.push(path);
              return true;
            },
            appCode: appCode,
          }}
          className="navbarStyle"
          activeFeature={activeCurrentFeature}
        >
          <></>
        </TopBar>
        <br />
        <br />
        {children}
      </>
  );
};

export default PageLayoutAuth;
