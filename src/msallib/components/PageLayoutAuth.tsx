/*
 * VGuan Add PageLayoutAuth
 */

import React, { ReactNode, useState } from "react";
import TopBar from "msallib/navbar/components/TopBar";
import router from "next/router";
import { Popover } from "antd";

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
        <div style={{ marginTop: "-3px" }}>
          {/* <Popover content={userInfoContent} trigger="hover" placement="bottom"> */}
          {/* <Popover trigger="hover" placement="bottom">
            <i className="fa-solid fa-user-gear text-xs"></i>
          </Popover> */}
          {/* {isReadOnly && (
            <Tooltip title="Ready-only mode">
              <i className="fa-solid fa-lock text-xs ml-3"></i>
            </Tooltip>
          )} */}
        </div>
      </TopBar>
      <br />
      <br />
      {children}
    </>
  );
};

export default PageLayoutAuth;
