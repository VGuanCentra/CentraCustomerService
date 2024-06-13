import { Pagination, Table } from "antd";
import styles from "./ordersTableMobile.module.css";

import {
  updatePageNumber,
  updatePageSize,
  updateSortOrder,
} from "app/redux/orders";
import { useDispatch, useSelector } from "react-redux";
import UserAvatar from "app/components/organisms/users/userAvatar";
import OrdersQuickSearch from "app/components/templates/quickSearch/ordersQuickSearch";
import { useAuthData } from "context/authContext";

export default function OrdersTableMobile(props) {
  const { data, columns, isLoading, selectedStatus, states } = props;

  const dispatch = useDispatch();

  const { pageNumber, pageSize, total, assignedToMe } = useSelector(
    (state) => state.orders
  );
  // const { loggedInUser } = useAuthData();
  const loggedInUser = null;

  const onChangeProps = (page, pageSize) => {
    dispatch(updatePageNumber(page));
    dispatch(updatePageSize(pageSize));
  };

  const onTableChange = (pagination, filters, sorter) => {
    if (sorter.hasOwnProperty("column")) {
      dispatch(
        updateSortOrder({
          sortBy: sorter.field,
          isDescending: sorter.order === "descend",
        })
      );
    }
  };
  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <OrdersQuickSearch size="small" showIcon={true} />

        <div className="flex justify-between items-center sticky">
          <div className="flex space-x-2 items-center">
            {assignedToMe ? (
              <>
                <UserAvatar username={loggedInUser?.name ?? "test"} />
                <span className="text-xs pr-3 font-semibold">
                  Assigned To Me
                </span>
              </>
            ) : (
              <>
                {selectedStatus ? (
                  <>
                    <i
                      className={`${states[selectedStatus]?.icon} pl-2`}
                      style={{
                        color: `${states[selectedStatus]?.color}`,
                      }}
                    ></i>
                    <span className="text-xs pr-3 font-semibold">
                      {states[selectedStatus]?.label}
                    </span>
                  </>
                ) : (
                  <span className="text-xs pr-3 font-semibold">
                    All Records
                  </span>
                )}
              </>
            )}
          </div>
          <div className="flex space-x-2 items-center">
            <Pagination
              onChange={onChangeProps}
              total={total}
              current={pageNumber}
              pageSize={pageSize}
              size="small"
            />
          </div>
        </div>

        <div style={{ height: "100%" }}>
          <Table
            columns={columns}
            dataSource={data}
            size="small"
            pagination={false}
            loading={isLoading}
            scroll={{ y: "calc(100vh - 290px)" }}
            style={{ height: "100%", fontSize: "0.6rem" }}
            onChange={onTableChange}
          />
        </div>
      </div>
    </div>
  );
}
