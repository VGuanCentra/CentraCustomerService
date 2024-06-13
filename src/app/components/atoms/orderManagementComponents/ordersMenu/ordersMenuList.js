import UserAvatar from "app/components/organisms/users/userAvatar";
import OrdersMenuItem from "./ordersMenuItem";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuthData } from "context/authContext";
import Tooltip from "../../tooltip/tooltip";

export default function OrdersMenuList(props) {
  const { department, statusOptions } = props;
  const router = useRouter();
  // const { loggedInUser } = useAuthData();
  const loggedInUser = null;
  const { ordersSideBarOpen } = useSelector((state) => state.orders);
  const {
    statusCount,
    statusView,
    assignedToMe,
    assignedToMeCount,
    showAssignedToMeTab,
  } = useSelector((state) => state.orders);

  const [totalCount, setTotalCount] = useState(0);

  const handleStatusFilterChange = (status, assignedToMe = false) => {
    if (status.length > 0)
      router.push(`/${department.toLowerCase()}?status=${status}`, undefined, {
        shallow: true,
      });
    else {
      let _url = `/${department.toLowerCase()}${
        assignedToMe ? `?assignedToMe=1` : ""
      }`;
      router.push(_url, undefined, { shallow: true });
    }
  };

  useEffect(() => {
    let total = 0;

    for (let i = 0; i < statusCount.length; i++) {
      total += statusCount[i].count || 0;
    }

    setTotalCount(total);
  }, [statusCount]);

  return (
    <>
      {showAssignedToMeTab && (
        <Tooltip title="Assigned To Me">
          <OrdersMenuItem
            key={`menu_item_assigned_to_me_filter}`}
            selected={assignedToMe}
            onClick={() => handleStatusFilterChange("", true)}
          >
            {ordersSideBarOpen ? (
              <>
                <div className="flex space-x-3 items-center">
                  <UserAvatar username={loggedInUser?.name ?? "test"} />
                  <div className="flex space-x-2 items-center">
                    Assigned to Me
                  </div>
                </div>
                {assignedToMeCount > 0 && (
                  <div className="px-2 text-xs rounded-md">
                    {assignedToMeCount}
                  </div>
                )}
              </>
            ) : (
              <UserAvatar username={loggedInUser?.name ?? "test"} />
            )}
          </OrdersMenuItem>
        </Tooltip>
      )}
      <Tooltip title="All Records">
        <OrdersMenuItem
          key={`menu_item_all_filter}`}
          selected={statusView === "" && !assignedToMe}
          onClick={() => handleStatusFilterChange("")}
        >
          {ordersSideBarOpen ? (
            <>
              <div className="flex space-x-2 items-center">
                All {department}s
              </div>
              {totalCount > 0 && (
                <div className="px-2 text-xs rounded-md">{totalCount}</div>
              )}
            </>
          ) : (
            <>All</>
          )}
        </OrdersMenuItem>
      </Tooltip>

      {statusOptions.map((status, index) => {
        let _statCount = statusCount?.filter(
          (x) => x.status === status.value
        )[0]?.count;

        return (
          <Tooltip
            key={`menu_item_status_${index}_filter_tooltip`}
            title={status.value}
            placement="right"
          >
            <OrdersMenuItem
              key={`menu_item_status_${index}_filter`}
              selected={statusView === status.key && !assignedToMe}
              onClick={() => handleStatusFilterChange(status.key)}
            >
              {ordersSideBarOpen ? (
                <>
                  <div className="flex space-x-2 items-center">
                    <i
                      className={`${status.icon} pr-4`}
                      style={{ color: `${status.color}` }}
                    ></i>
                    {status.value}
                  </div>
                  {_statCount > 0 && (
                    <div className="px-2 text-xs rounded-md">{_statCount}</div>
                  )}
                </>
              ) : (
                <i
                  className={`${status.icon}`}
                  style={{ color: `${status.color}` }}
                />
              )}
            </OrdersMenuItem>
          </Tooltip>
        );
      })}
    </>
  );
}
