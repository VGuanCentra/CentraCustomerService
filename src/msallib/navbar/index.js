import React, { useState, useEffect, useRef, useCallback } from "react";
import AuthNav from "./components/AuthNav";
// import Login from "./components/Login";
import AuthenticationApi from "./api/AuthenticationApi";
import cn from "classnames";
import IconDashboard from "./assets/icons/dashboard";
import IconSearch from "./assets/icons/search";
import {
  urlParamsToObject,
  removeUrlParameter,
  buildNestedTree,
} from "./lib/utils";
import LogoBlue from "./public/blue_logo_sm.png";
// import LogoBlue from "../public/blue_logo_sm.png";
import LogoWhite from "./public/blue_logo_sm.png";

import useDevice from "./hooks/useDevice";
import packageJson from "../../../package.json";   // get version

// import { USER_KEY } from "./api/SERVER";

// import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "./styles.module.scss";

// local storage keys
const LS_NAV_TOGGLE = "authnav_toggle";
const Q_TOKEN = "authnav_token";
const ACTION_LOADING = "LOADING";
const ACTION_LOADED = "LOADED";
const ACTION_ERROR = "ERROR";

// this is root component of package
const CentraNavBar = ({
  v,
  options = {},
  className,
  children,
  activeFeature,
  autoClose = true,
  ...rest
}) => {
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
  const { isMobile } = useDevice();
  const inputRef = useRef();
  const [show, setShow] = useState(
    (!autoClose && localStorage.getItem(LS_NAV_TOGGLE) === "1") || false
  );
  const [navList, setNavList] = useState([]);
  const [queryText, setQueryText] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingFeature, setLoadingFeature] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const isNotLogin = !user && !loading;

  useEffect(() => {
    doGetPermissions();
    return () => {
      // clear localStorage
    };
  }, []);

  useEffect(() => {
    const isShowingOverlay = isNotLogin || show;

    if (isShowingOverlay) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isNotLogin, show]);

  const isMobileV = useCallback(() => isMobile(), [])();

  useEffect(() => {
    if (show && inputRef?.current) {
      inputRef.current.focus();
    }

    !autoClose && localStorage.setItem(LS_NAV_TOGGLE, show ? "1" : "0");
  }, [show]);

  const treatData = (jsonData) => {
    // applications
    return jsonData
      ?.filter((a) => {
        if (isLocalAppOnly) {
          return a.applicationCode === appCode;
        }
        return true;
      }) // if hide other applications
      ?.sort((a, b) => (a.displaySeqNum > b.displaySeqNum ? 1 : -11))
      ?.map((o) => {
        const {
          displayName,
          applicationCode,
          applicationFeatures,
          url: appUrl,
        } = o;
        let navItems = applicationFeatures
          ?.filter((a) => a.url || a.applicationFeatureCode?.startsWith("nav")) // TODO: filter out non nav items; should change it in the future to flag
          ?.map((a) => {
            let {
              applicationFeatureCode,
              name,
              description,
              url: featureUrl,
              iconClassName,
              ...rest
            } = a;
            return {
              ...rest,
              featureKey: applicationFeatureCode,
              featureName: name,
              featureDescription: description,
              featureUrl,
              config: {
                iconClassName,
              },
            };
          })
          ?.filter((a) => a.view !== false) // if its undefined, means its public, then still show it
          ?.sort((a, b) => (a.displaySeqNum > b.displaySeqNum ? 1 : -1))
          ?.map((a) => {
            let { featureUrl } = a;
            // if its current application, ignore domain
            if (appCode === applicationCode) {
            } else {
              featureUrl = appUrl + featureUrl;
            }

            return {
              ...a,
              featureUrl,
              isLocal: appCode === applicationCode,
            };
          });

        // applicationFeatureId, parentFeatureId
        const nestedNavItems = buildNestedTree(navItems);

        return {
          appName: displayName,
          appKey: applicationCode,
          appUrl,
          navItems: nestedNavItems,
          subLength: nestedNavItems.length,
        };
      });
  };

  const handleDisplay = () => {
    setShow((prev) => {
      return !prev;
    });
  };

  /**
   * if there is only one result, nav it
   */
  const handleKeydown = (e) => {
    // work with filter
    if (e.code === "Enter") {
      // get all features
      const _filteredFeatures = [];
      navList.map(({ navItems }) => {
        const filteredItems =
          navItems?.filter((a) =>
            a?.featureName?.toLowerCase()?.includes(queryText?.toLowerCase())
          ) || [];
        filteredItems.map((a) => {
          const { isLocal, featureUrl } = a;
          _filteredFeatures.push({
            isLocal,
            featureUrl,
          });
        });
      });

      // only trigger when there is one result
      if (_filteredFeatures.length > 0) {
        const { featureUrl, isLocal } = _filteredFeatures[0] || {};
        if (typeof onRoute === "function" && isLocal) {
          handleRoute(featureUrl, _filteredFeatures[0]);
        } else {
          window.location.href = featureUrl;
        }
      }
    }
  };

  const handleRoute = async (url, feature) => {
    if (typeof onRoute === "function") {
      // note: there is another onRoute call from nav item. which requires pure routing, so we dont put "window.location.href = featureUrl" here
      setLoadingFeature(feature);
      await onRoute(url, feature);
      setLoadingFeature(null);
      // default: every time triggers routing, close nav
      if (autoClose) {
        setShow(false);
      }
    } else {
      window.location.href = url;
    }
  };

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

  const handleLoginDone = (res) => {
    if (res) {
      const { permissions, ...rest } = res;
      setToken(rest?.token);
      doGetPermissions();
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    // localStorage.removeItem(USER_KEY);
  };

  // ====== api calls
  // const doGetPermissions = async () => {
  //   setLoading(true);
  //   setError(null);
  //   const _user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
  //   let data = null,
  //     currentAppObj = null;
  //   // try to get from entry param
  //   if (_user) {
  //     onAction(ACTION_LOADING);

  //     data = await AuthenticationApi.getUserPermission();

  //     if (data) {
  //       const { permissions, ...userInfo } = data;
  //       setNavList(treatData(permissions));
  //       setUser(userInfo);
  //       setToken(_user?.token);
  //       currentAppObj = permissions?.find((a) => a.applicationCode === appCode);
  //       const _subtitle = currentAppObj;
  //       setSubTitle(_subtitle);
  //     } else {
  //       setError("Error");
  //       setUser(null);
  //       setToken(null);
  //       setNavList(null);
  //       onAction(ACTION_ERROR);
  //     }
  //   } else {
  //     const { params } = urlParamsToObject(window.location?.search);
  //     if (params[Q_TOKEN]) {
  //       localStorage.setItem(
  //         USER_KEY,
  //         JSON.stringify({ token: params[Q_TOKEN] })
  //       );

  //       // if there is localStorage, run it again
  //       doGetPermissions();
  //       return;
  //     } else {
  //       setUser(null);
  //     }
  //   }

  //   // remove param anyway
  //   removeUrlParameter(Q_TOKEN);

  //   // pass nested permission out. used for feature within pages
  //   const featurePermissions = {};
  //   currentAppObj?.applicationFeatures?.map((a) => {
  //     const {
  //       applicationFeatureCode,
  //       canEdit,
  //       canView,
  //       canAdd,
  //       canDelete,
  //       isPublic,
  //     } = a;

  //     if (applicationFeatureCode) {
  //       featurePermissions[applicationFeatureCode] = {
  //         canEdit,
  //         canView,
  //         canAdd,
  //         canDelete,
  //         isPublic,
  //       };
  //     }
  //   });

  //   onAction(ACTION_LOADED, featurePermissions, data);
  //   setLoading(false);
  // };

  const doGetPermissions = async () =>{
      data = await AuthenticationApi.getUserPermission();
      if (data) {
        const { permissions, ...userInfo } = data;
        setNavList(treatData(permissions));
        setUser(userInfo);
        setToken(_user?.token);
        currentAppObj = permissions?.find((a) => a.applicationCode === appCode);
        const _subtitle = currentAppObj;
        setSubTitle(_subtitle);
      } else {
        setError("Error");
        setUser(null);
        setToken(null);
        setNavList(null);
        onAction(ACTION_ERROR);
      }
  }
  // ====== jsx
  const jsxLoading = (
    <div className={styles.nav_items_loading}>
      <div className={styles.loader} />
    </div>
  );
  const jsxEmpty = (
    <div className={styles.nav_items_loading}>No Application</div>
  );
  const jsxError = (
    <div className={styles.nav_items_error}>Error: please refresh</div>
  );
  const jsxNav = (
    <AuthNav
      {...{
        v,
        appCode,
        navList,
        renderNav,
        onRoute: handleRoute,
        queryText,
        token,
        activeFeature,
        loadingFeature,
        isLocalAppOnly,
      }}
    />
  );

  // show jsx for: loading || error || empty || success
  const jsxNavArea = loading
    ? jsxLoading
    : error
    ? jsxError
    : !navList?.length > 0
    ? jsxEmpty
    : jsxNav;

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

  // ====== phases of jsx
  const jsxPhaseNav = (
    <>
      <div className={cn(styles.root, className)} {...rest}>
        <div className={styles.header}>
          <div
            className={cn(styles.menu_icon, classNameIcon)}
            onClick={handleDisplay}
          >
            <div style={{ height, width }}>
              <IconDashboard title={`global navigation ${getNewVersion()}`} />
            </div>
          </div>

          <span className={styles.title}>
            <span className={styles.brand_title}>
              <img className={styles.logo} src={LogoWhite} />
            </span>
            {subTitle ? (
              <a href="/" className={styles.sub_title}>
                {subTitle?.displayName}
              </a>
            ) : null}
          </span>

          <div>{children}</div>
        </div>
        {user && !isMobileV ? (
          <div className={styles.account}>
            welcome, {user.name}{" "}
            <span className={styles.logout} onClick={handleLogout}>
              logout
            </span>
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          styles.nav_container,
          classNameContainer,
          isMobile ? styles.mobile : ""
        )}
        style={{
          zIndex: zIndex + 1,
          display: show ? "block" : "none", // note: css will be loaded slower, so put it in style
          ...alignStyle,
        }}
      >
        <div className={styles.nav_header}>
          <div className={styles.title}>
            <div
              className={cn(styles.menu_icon, classNameIcon)}
              onClick={handleDisplay}
            >
              <IconDashboard
                className={styles.icon}
                style={{ height, width }}
              />
            </div>
            <span className={styles.brand_title}>
              <img className={styles.logo} src={LogoBlue} />
            </span>
          </div>
          {isMobileV && (
            <div className={styles.logout} onClick={handleLogout}>
              logout
            </div>
          )}
        </div>
        <div className={styles.search}>
          <input
            placeholder="Filter App..."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyDown={handleKeydown}
            ref={inputRef}
          />
          <IconSearch className={styles.searchicon} />
        </div>
        <div className={styles.nav_items_container}>{jsxNavArea}</div>
      </div>
      {show && (
        <div
          style={{ zIndex }}
          className={styles.overlay}
          onClick={handleDisplay}
        ></div>
      )}
    </>
  );

  // const jsxPhaseLogin = (
  //   <div className={styles.login} style={{ zIndex }}>
  //     <Login onLogin={handleLoginDone} />
  //   </div>
  // );

  // ====== renderer
  // return isNotLogin ? jsxPhaseLogin : jsxPhaseNav;
  return jsxPhaseNav;
};

export default CentraNavBar;
