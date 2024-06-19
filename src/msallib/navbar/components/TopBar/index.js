import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import cn from "classnames";
import styles from "./styles.module.scss";
import {
  urlParamsToObject,
  removeUrlParameter,
  buildNestedTree,
} from "../../lib/utils";
import IconDashboard from "../../assets/icons/dashboard";
import IconSearch from "../../assets/icons/search";
import LogoBlue from "../../public/blue_logo_sm.png";
import LogoWhite from "../../public/white_logo_sm.png";
import packageJson from "../../../../../package.json";
import PopupMenu from "../PopupMenu";
import { useIsAuthenticated } from "@azure/msal-react";
import { msalInstance } from "../../../msal/msal";
import AuthenticationApi from "../../api/AuthenticationApi";
import { SignInButton } from "../../../components/SignInButton";
import { SignOutLink } from "../../../components/SignOutButton";
import { Popover } from "antd";
import usePermissions from "app/hooks/usePermissions";
import Tooltip from "app/components/atoms/tooltip/tooltip";

// local storage keys
const LS_NAV_TOGGLE = "authnav_toggle";
const Q_TOKEN = "authnav_token";
const ACTION_LOADING = "LOADING";
const ACTION_LOADED = "LOADED";
const ACTION_ERROR = "ERROR";

const TopBar = ({
  options = {},
  className,
  activeFeature,
  children,
  autoClose = true,
  ...rest
}) => {
  const isAuthenticated = useIsAuthenticated();
  const user = msalInstance.getActiveAccount();
  const { getUserDepartmentPermissions } = usePermissions();
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
  const inputRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [centraUserInfo, setCentraUserInfo] = useState(null); // State for centraUserInfo
  const [loadingFeature, setLoadingFeature] = useState(false);
  const [navList, setNavList] = useState([]);
  const [subTitle, setSubTitle] = useState("");
  const [queryText, setQueryText] = useState("");
  const [show, setShow] = useState(
    (!autoClose && localStorage.getItem(LS_NAV_TOGGLE) === "1") || false
  );
  // const [token, setToken] = useState(null);   // NOT Need pass 
  // const { isMobile } = useDevice();
  const [isMobile, setisMobile] = useState("isDesktop");
  // const isMobileV = useCallback(() => isMobile(), [])();

  useEffect(() => {
    doGetPermissions();
    return () => {
      // clear localStorage
    };
  }, []);

  useEffect(() => {
    if (show && inputRef?.current) {
      inputRef.current.focus();
    }
    !autoClose && localStorage.setItem(LS_NAV_TOGGLE, show ? "1" : "0");
  }, [show]);

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

  // ====== api calls
  const doGetPermissions = async () => {
    setLoading(true);
    setError(null);
    let data = null,
      currentAppObj = null;
    // try to get from entry param
    if (isAuthenticated) {
      onAction(ACTION_LOADING);

      data = await AuthenticationApi.getUserPermission();
      if (data) {
        const { permissions, ...userInfo } = data;
        setNavList(treatData(permissions));
        setCentraUserInfo(userInfo); // Set userInfo locally
        currentAppObj = permissions?.find((a) => a.applicationCode === appCode);
        const _subtitle = currentAppObj;
        setSubTitle(_subtitle);
      } else {
        setError("Error");
        setCentraUser(null);
        setNavList(null);
        onAction(ACTION_ERROR);
      }
    }
    // remove param anyway
    removeUrlParameter(Q_TOKEN);
    // pass nested permission out. used for feature within pages
    const featurePermissions = {};
    currentAppObj?.applicationFeatures?.map((a) => {
      const {
        applicationFeatureCode,
        canEdit,
        canView,
        canAdd,
        canDelete,
        isPublic,
      } = a;

      if (applicationFeatureCode) {
        featurePermissions[applicationFeatureCode] = {
          canEdit,
          canView,
          canAdd,
          canDelete,
          isPublic,
        };
      }
    });

    onAction(ACTION_LOADED, featurePermissions, data);
    setLoading(false);
  };

  const {
    drawerOpen,
    isReadOnly,
    networkInfo,
    // isMobile,
    userData,
    hasWritePermission,
  } = useSelector((state) => state.app);

  const Status = (props) => {
    const { value, className } = props;
    return (
      <>
        {value === true && (
          <i className={`fa-solid fa-circle-check text-[green] ${className}`} />
        )}
        {value === false && (
          <i className={`fa-solid fa-circle-xmark text-[red] ${className}`} />
        )}
        {value !== true && value !== false && (
          <i className={`fa-solid fa-circle-dot text-[blue] ${className}`} />
        )}
      </>
    );
  };

  const userInfoContent = useCallback(() => {
    return (
      <div>
        <div>
          <span className="inline-block w-[5.8rem] text-gray-600">Email:</span>
          <span className="ml-1">{centraUserInfo.email}</span>
        </div>
        <div>
          <span className="inline-block w-[5.8rem] text-gray-600">Branch:</span>
          <span className="ml-1">{centraUserInfo.branch}</span>
        </div>
        <div>
          <span className="inline-block w-[5.8rem] text-gray-600">
            Department:
          </span>
          <span className="ml-1">{centraUserInfo.departments[0]}</span>
        </div>
        <div>
          <span className="inline-block w-[5.8rem] text-gray-600">Role:</span>
          <span className="ml-1">{centraUserInfo.roles[0]?.roleName}</span>
        </div>
        {false && (
          <div>
            <span className="inline-block w-[5.8rem] text-gray-600">
              Permission:
            </span>
            <span className="ml-1">
              {hasWritePermission ? "Read-Write" : "Read-Only"}
            </span>
          </div>
        )}
        <div>
          <div>
            <div className="flex flex-row justify-between border-bottom mb-1">
              <div className="w-[9rem] text-gray-600">Permissions:</div>
              {false && <div className="w-[2.5rem]">View</div>}
              {false && <div className="w-[2.5rem]">Add</div>}
              <div className="w-[2.5rem] text-gray-600 text-xs pt-[4px]">
                Edit
              </div>
              {false && <div className="w-[2.5rem]">Del</div>}
            </div>
            {/* As requested, only show permissions the user has access to */}
            {getUserDepartmentPermissions()
              ?.permissions?.filter((p) => p.code !== null && p.canEdit)
              ?.map((p, index) => {
                return (
                  <div
                    key={`permission-${index}`}
                    className={`text-[5px] flex flex-row justify-between ${
                      index % 2 === 0 ? "bg-slate-100" : "bg-white"
                    }`}
                  >
                    <div className="text-[10px] w-[10rem] pl-2">{p.name}</div>
                    {false && (
                      <div className="text-[10px] w-[2.5rem]">
                        <Status value={p.canView} />
                      </div>
                    )}
                    {false && (
                      <div className="text-[10px] w-[2.5rem]">
                        <Status value={p.canAdd} />
                      </div>
                    )}
                    <div className="text-[10px] w-[2.5rem]">
                      <Status value={p.canEdit} className="ml-2" />
                    </div>
                    {false && (
                      <div className="text-[10px] w-[2.5rem]">
                        <Status value={p.canDelete} />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }, [centraUserInfo, hasWritePermission, getUserDepartmentPermissions]);
  //### VGuan Worked!
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

  //### VGuan Worked!
  const handleDisplayMenu = () => {
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
    <PopupMenu
      {...{
        // v,
        appCode,
        navList,
        renderNav,
        onRoute: handleRoute,
        queryText,
        // token,
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

  return (
    <>
      {/* #### TopBar #### */}
      <div className={cn(styles.root, className)} {...rest}>
        <div className={styles.header}>
          <div
            className={cn(styles.menu_icon, classNameIcon)}
            onClick={handleDisplayMenu}
          >
            <div style={{ height, width }}>
              <IconDashboard title={`global navigation ${getNewVersion()}`} />
            </div>
          </div>

          <span className={styles.title}>
            <span className={styles.brand_title}>
              <img className={styles.logo} src="/white_logo_sm.png" alt="" />
            </span>
            {subTitle ? (
              <a href="/" className={styles.sub_title}>
                {subTitle?.displayName}
              </a>
            ) : null}
          </span>
          <div style={{ marginTop: "-3px" }}>
            <Popover
              content={userInfoContent}
              trigger="hover"
              placement="bottom"
            >
              <i className="fa-solid fa-user-gear text-xs"></i>
            </Popover>
            {isReadOnly && (
            <Tooltip title="Ready-only mode">
              <i className="fa-solid fa-lock text-xs ml-3"></i>
            </Tooltip>
          )}
          </div>
          <div>{children}</div>
        </div>
        {/* {user && !isMobileV ? ( */}
        {user ? (
          <div className={styles.account}>
            welcome, {user.name}{" "}
            {isAuthenticated ? (
              <SignOutLink cssClasses={styles.logout} text="Logout" />
            ) : (
              <SignInButton />
            )}
          </div>
        ) : null}
      </div>

      {/* #### PopUp Menu #### */}
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
              onClick={handleDisplayMenu}
            >
              <IconDashboard
                className={styles.icon}
                style={{ height, width }}
              />
            </div>
            <span className={styles.brand_title}>
              <img className={styles.logo} src={LogoBlue} alt="" />
            </span>
          </div>
          {/* PopupMenu Logout */}
          {isAuthenticated ? (
            <SignOutLink cssClasses={styles.logout} text="Logout" />
          ) : (
            <SignInButton />
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
          onClick={handleDisplayMenu}
        ></div>
      )}
    </>
  );
};

export default TopBar;
