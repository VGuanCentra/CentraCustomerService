import { Drawer } from "antd";

import {
  updateOrdersSideBarOpen,
  updateFilters,
  updateLocation,
  updateDefaultUserSettings,
  updateShowDefaultSettingsPopUp,
  updateFilterHasChanges,
} from "app/redux/orders";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import OrderSidebar from "./orderSideBar";
import { useAuthData } from "context/authContext";
import { useQuery } from "react-query";
import { fetchUserModuleSettings } from "app/api/genericApis/userSettingsApi";
import { Provinces } from "app/utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

export default function OrderRootContainer({ children }) {
  const { ordersSideBarOpen, department } = useSelector(
    (state) => state.orders
  );
  const { isMobile } = useSelector((state) => state.app);
  const pathname = usePathname();
  // const { loggedInUser } = useAuthData();
  const loggedInUser = null;
  const dispatch = useDispatch();

  const fetchUserSettings = async () => {
    if (!loggedInUser) return;

    if (!department) return;

    const result = await fetchUserModuleSettings(
      loggedInUser?.email,
      department
    );

    if (result.data) {
      // set filters to default
      dispatch(updateDefaultUserSettings(result.data));

      let _settings = JSON.parse(result.data.settings);

      if (_settings) {
        let _filters = _settings.filters ?? [];
        let _location = _settings.province ?? Provinces.all;

        dispatch(updateFilters(_filters));
        dispatch(updateLocation(_location));
      }
    } else {
      dispatch(updateFilterHasChanges(true));
      console.log("No settings found for user.");
    }
  };

  const {
    isLoading: isLoadingSettings,
    data: userSettings,
    isFetching: isFetchingSettings,
    refetch: refetchUserSettings,
  } = useQuery(
    ["service_settings", department, loggedInUser],
    fetchUserSettings,
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }

    const tourCompleted = localStorage.getItem("tourCompleted");

    if (!tourCompleted) {
      localStorage.setItem("tourCompleted", true);
      dispatch(updateShowDefaultSettingsPopUp(true));
    }
  }, [dispatch, loggedInUser]);

  return (
    <>
      {isMobile ? (
        <div className="h-full">
          <Drawer
            title="Menu"
            placement={"top"}
            width={ordersSideBarOpen ? 280 : 55}
            onClose={() => dispatch(updateOrdersSideBarOpen(false))}
            open={ordersSideBarOpen}
            mask={true}
            bodyStyle={{ padding: 0 }}
            zIndex={1}
            height={"100%"}
            closeIcon={
              <FontAwesomeIcon
                icon={faXmark}
                size="xl"
                className="text-slate-500 cursor-pointer"
              />
            }
            rootStyle={{
              marginTop: "40px",
              padding: "0",
              height: "100%",
              overflow: "auto",
            }}
          >
            {pathname !== "/timesheet" && (
              <OrderSidebar
                style={
                  ordersSideBarOpen
                    ? { padding: "0 1rem" }
                    : { padding: "0 0.7rem" }
                }
              />
            )}
          </Drawer>
          <div className="h-full flex flex-col">{children}</div>
        </div>
      ) : (
        <div
          style={{
            marginLeft: ordersSideBarOpen ? 280 : 55,
            transition: "margin-left 0.3s",
            height: "100%",
          }}
        >
          <Drawer
            title=""
            placement={"left"}
            width={ordersSideBarOpen ? 280 : 55}
            onClose={() => dispatch(updateOrdersSideBarOpen(false))}
            open={true}
            mask={isMobile ? true : false}
            bodyStyle={{ padding: 0 }}
            zIndex={1}
            closeIcon={null}
            rootStyle={{ marginTop: "40px", padding: "0" }}
          >
            {pathname !== "/timesheet" && (
              <OrderSidebar
                style={
                  ordersSideBarOpen
                    ? { padding: "0 1rem" }
                    : { padding: "0 0.7rem" }
                }
              />
            )}
          </Drawer>
          <div className="h-full flex flex-col">{children}</div>
        </div>
      )}
    </>
  );
}
