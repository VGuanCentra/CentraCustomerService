import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./styles.module.scss";
import { objectToUrlParams, urlParamsToObject } from "../../lib/utils";
import IconDashboard from "../../assets/icons/dashboard";
import IconSearch from "../../assets/icons/search";
import LogoBlue from "../../public/blue_logo_sm.png"
import LogoWhite from "../../public/white_logo_sm.png";
import packageJson from "../../../../../package.json";
import { TramRounded } from "@material-ui/icons";
import { useIsAuthenticated } from "@azure/msal-react";
import { msalInstance } from "../../../msal/msal";
import { SignInButton } from "../../../components/SignInButton";
import { SignOutLink } from "../../../components/SignOutButton";


const TopBar = ({ options = {}, className,  ...rest }) => {
    const isAuthenticated = useIsAuthenticated();
    const user = msalInstance.getActiveAccount();
  const {
    onRoute,
    renderNav,
    zIndex = 1,
    classNameIcon,
    classNameContainer,
    align = "r",
    appCode,
    height = 16,
    width = 16,
    isLocalAppOnly = false,
    onAction = () => {},
  } = options;

    const [show, setShow] = useState(true
      // (!autoClose && localStorage.getItem(LS_NAV_TOGGLE) === "1") || false
    );
  // const { isMobile } = useDevice();
  const [isMobile, setisMobile] = useState("isDesktop");
  const getNewVersion = () => {
    const v = packageJson.version;
    if (v) {
      const vArr = v.split(".");
      const lastNum = vArr?.pop();
      vArr.push(parseInt(lastNum) + 1);

      return vArr.join(".");
    }

    return "";
  };
  
  // const isMobileV = useCallback(() => isMobile(), [])();

  let alignStyle;
  switch (align) {
    case "l":
      alignStyle = { right: 0 };
      break;
    case "r":
      alignStyle = { left: 0 };
      break;
    default:
      break;
  }

  return (
    <>
      <div className={cn(styles.root, className)} {...rest}>
        <div className={styles.header}>
          <div
            className={cn(styles.menu_icon, classNameIcon)}
            // onClick={handleDisplay}
          >
            <div style={{ height, width }}>
              <IconDashboard title={`global navigation ${getNewVersion()}`} />
            </div>
          </div>

          <span className={styles.title}>
            <span className={styles.brand_title}>
              <img className={styles.logo} src="/white_logo_sm.png" />
            </span>
          </span>

          {/* <div>{children}</div> */}
        </div>
        {/* {user && !isMobileV ? ( */}
        {/* {user ? ( */}
        <div className={styles.account}>
          welcome, {user.name}{" "}
          {isAuthenticated ? (
            <SignOutLink cssClasses={styles} text="Logout" />
          ) : (
            <SignInButton />
          )}
        </div>
        {/* ) : null} */}
      </div>

      {/* {show && (
        <div
          style={{ zIndex }}
          className={styles.overlay}
          // onClick={handleDisplay}
        ></div>
      )} */}
    </>
  );
};

export default TopBar;
