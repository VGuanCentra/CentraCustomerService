"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import useMediaQuery from "@mui/material/useMediaQuery";

import Tooltip from "app/components/atoms/tooltip/tooltip";
import MobileMenu from "app/components/organisms/mobileMenu/mobileMenu";
import Sidebar from "app/components/templates/sidebar/sidebar";

import { Pages, ResultType } from "app/utils/constants";

// import AuthNav from "@centrawindows-ca/authnav";
import { useAuthData } from "../context/authContext";

import usePermissions from "app/hooks/usePermissions";

import {
  ConfigProvider,
  Drawer,
  Grid,
  message,
  notification,
  Popover,
} from "antd";

const { useBreakpoint } = Grid;

import {
  updateDrawerOpen,
  updateIsMobile,
  updateNetworkInfo,
  updateUserToken,
  updateAppVersion,
} from "./redux/app";
import { updateIsLoading, updatePage } from "./redux/calendar";

import { useCookies } from "react-cookie";

export default function InnerLayout({ children }) {
  //const [calendarHeight, setCalendarHeight] = useState(0);
  const [, setCookie] = useCookies(["c.token"]);

  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [navParams, setNavParams] = useState(null);

  const {
    drawerOpen,
    isReadOnly,
    networkInfo,
    isMobile,
    userData,
    hasWritePermission,
  } = useSelector((state) => state.app);

  const { result, showMessage } = useSelector((state) => state.calendar);

  const dispatch = useDispatch();
  const router = useRouter();
  const screens = useBreakpoint();
  const searchParams = useSearchParams();
  //VGuan Debug 202406
  const { onAuthNavAction } = useAuthData();

  const isTablet = useMediaQuery("(max-width:768px)");
  const pageParam = searchParams.get("page") || Pages.month;

  const { getUserDepartmentPermissions } = usePermissions();

  //const MONTH_HEADER_HEIGHT_OFFSET = 200;

  if (typeof window !== "undefined") {
    if (window.location?.href === "https://orders.centra.ca/") {
      router.push("/service");
    }
  }

  //useEffect(() => {
  //  function updateSize() {
  //    setCalendarHeight(window.innerHeight - MONTH_HEADER_HEIGHT_OFFSET);
  //  }
  //  window.addEventListener("resize", updateSize);
  //  return () => window.removeEventListener("resize", updateSize);
  //}, []);

  const showResultPopup = useCallback(
    (result) => {
      if (result?.type == ResultType.success) {
        notificationApi.success({
          closeIcon: false,
          description: result.message,
          duration: 3,
          message: result.source,
          placement: "bottomLeft",
        });
      } else if (result?.type == ResultType.error) {
        notificationApi.error({
          closeIcon: false,
          description: result.message,
          duration: 3,
          message: result.source,
          placement: "bottomLeft",
        });
      } else if (result?.type == "info") {
        notificationApi.info({
          closeIcon: false,
          description: result.message,
          duration: 3,
          message: result.source,
          placement: "bottomLeft",
        });
      }
    },
    [notificationApi]
  );

  useEffect(() => {
    if (result) {
      showResultPopup(result);
    }
  }, [result, showResultPopup]);

  useEffect(() => {
    let _page = Pages.month;

    if (pageParam && !isMobile) {
      _page = pageParam;
    } else if (isMobile) {
      _page = Pages.mobile;
    } else {
      _page = Pages.month;
    }

    dispatch(updatePage(_page));
  }, [dispatch, pageParam, isMobile]);

  useEffect(() => {
    dispatch(updateDrawerOpen(drawerOpen));
  }, [dispatch, drawerOpen]);

  useEffect(() => {
    if (!screens.xl) {
      dispatch(updateDrawerOpen(false));
    }
  }, [dispatch, screens]);

  // Network Info
  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
        const response = await fetch("api/networkInfo");
        const data = await response.json();

        var _eth =
          data?.networkInfo?.Ethernet ?? data?.networkInfo["Ethernet 2"];
        var _vpn = data?.networkInfo["SonicWall NetExtender"];

        if (_eth) {
          if (_eth?.length > 0) {
            let localIp = _eth[1]?.address;
            if (localIp.includes("192.168.2")) {
              dispatch(updateNetworkInfo({ ip: localIp, isTest: true }));
            }
          }
        } else {
          if (_vpn?.length > 0) {
            let localIp = _vpn[0]?.address;
            if (localIp.includes("192.168.2")) {
              dispatch(updateNetworkInfo({ ip: localIp, isTest: true }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching network information:", error);
      }
    };

    fetchNetworkInfo();
  }, [dispatch]);

  // App Version
  useEffect(() => {
    const fetchAppVersion = async () => {
      try {
        const response = await fetch("api/appVersion");
        const data = await response.json();

        if (data?.version) {
          dispatch(updateAppVersion(data.version));
        }
      } catch (error) {
        console.error("Error fetching app version:", error);
      }
    };

    fetchAppVersion();
  }, [dispatch]);

  useEffect(() => {
    let _isMobile = false;

    if (screens.xs) {
      _isMobile = true;
    } else if (screens.sm && screens.md && !screens.lg && !screens.xl) {
      _isMobile = true;
    } else if (screens.sm && !screens.md) {
      _isMobile = true;
    } else {
      _isMobile = false;
    }

    dispatch(updateIsMobile(_isMobile));

    if (_isMobile) {
      dispatch(updateIsLoading(false));
    }
  }, [dispatch, screens]);

  useEffect(() => {
    const tokenString = localStorage.getItem("authnav_user");
    if (tokenString) {
      const tokenObject = JSON.parse(tokenString);
      if (tokenObject) {
        dispatch(updateUserToken(tokenObject?.token));
        setCookie("c.token", tokenObject, {
          path: "/",
          expires: new Date(Date.now() + 2592000),
          maxAge: 2592000,
        });
      }
    }
  }, [dispatch, setCookie]);

  useEffect(() => {
    if (showMessage?.value) {
      messageApi.open({
        type: "loading",
        content: showMessage.message,
        duration: showMessage?.duration || 10,
        style: {
          marginTop: "30vh",
        },
      });
    } else {
      messageApi.destroy();
    }
  }, [messageApi, showMessage]);

  let appCode =
    typeof window !== "undefined" &&
    (window?.location?.href?.includes("/service") ||
      window?.location?.href?.includes("/remake"))
      ? "OM"
      : "WC";

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
          <span className="ml-1">{userData.email}</span>
        </div>
        <div>
          <span className="inline-block w-[5.8rem] text-gray-600">Branch:</span>
          <span className="ml-1">{userData.branch}</span>
        </div>
        <div>
          <span className="inline-block w-[5.8rem] text-gray-600">
            Department:
          </span>
          <span className="ml-1">{userData.departments[0]}</span>
        </div>
        <div>
          <span className="inline-block w-[5.8rem] text-gray-600">Role:</span>
          <span className="ml-1">{userData.roles[0]?.roleName}</span>
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
  }, [userData, hasWritePermission, getUserDepartmentPermissions]);

  return (
    <div style={{ height: "100%" }}>
      {networkInfo?.isTest && (
        <div className="h-10 pt-2 pl-2 bg-red-600">
          {networkInfo?.isTest && (
            <div className="pl-2 text-white font-bold">
              <i className="fa-solid fa-network-wired pr-2"></i>
              {`${networkInfo?.ip} `}
            </div>
          )}
        </div>
      )}
      {/*  Nav Bar
       {!networkInfo?.isTest && (
        <AuthNav
          options={{
            zIndex: 999,
            onAction: onAuthNavAction,
            onRoute: async (path, params) => {
              await router.push(path);
              setNavParams(params);
              dispatch(updateIsLoading(true));
              return true;
            },
            appCode: appCode,
          }}
          activeFeature={navParams?.featureKey}
        >
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
        </AuthNav>
      )} */}
      {messageContextHolder}
      {contextHolder}
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 3,
          },
        }}
      >
        {!isTablet && false && (
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                marginTop: "2.5rem",
                zIndex: 0,
              },
            }}
            variant="persistent"
            anchor="left"
            open={drawerOpen}
          >
            <Sidebar style={{ padding: "0 1rem 0 1rem" }} />
          </Drawer>
        )}
        <Drawer
          title=""
          placement={"left"}
          width={355}
          onClose={() => dispatch(updateDrawerOpen(false))}
          open={drawerOpen}
          bodyStyle={{ padding: 0 }}
          style={{ marginTop: "40px" }}
          contentWrapperStyle={{ boxShadow: "none" }}
        >
          <Sidebar style={{ padding: "0 1rem 0 1rem" }} />
        </Drawer>
        <div className="h-full">
          {children}
          {isMobile && appCode === "WC" && <MobileMenu />}
        </div>
      </ConfigProvider>
    </div>
  );
}
