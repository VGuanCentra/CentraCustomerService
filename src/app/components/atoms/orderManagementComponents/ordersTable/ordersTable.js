import { Pagination, Table } from "antd";
import styles from "./ordersTable.module.css";
import { Button } from "react-bootstrap";

import {
  updatePageNumber,
  updatePageSize,
  updateSortOrder,
} from "app/redux/orders";
import { useDispatch, useSelector } from "react-redux";
import { getPaginationPrefix } from "app/utils/utils";

export default function OrdersTable(props) {
  const {
    data,
    columns,
    selectedRows,
    setSelectedRows,
    isLoading,
    onCreateClick,
    isReadOnly,
  } = props;
  const dispatch = useDispatch();
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRows(newSelectedRowKeys);
  };

  const { pageNumber, pageSize, total } = useSelector((state) => state.orders);

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: onSelectChange,
  };

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
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center sticky">
            <div className="flex space-x-2 sticky">
              <Button size="sm" className="text-sm" onClick={onCreateClick}>
                <span>Create</span>
              </Button>
              {/* //VGuan Debug 202406
              {!isReadOnly && (
                <Button size="sm" className="text-sm" onClick={onCreateClick}>
                  <span>Create</span>
                </Button>
              )} */}
            </div>

            <div className="flex justify-end items-center">
              <Pagination
                onChange={onChangeProps}
                total={total}
                showTotal={(total) => (
                  <div className="text-xs font-semibold mt-1">{`${getPaginationPrefix(
                    total,
                    pageNumber,
                    pageSize
                  )}${total.toLocaleString()} record(s)`}</div>
                )}
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
              scroll={
                data.length < pageSize
                  ? ""
                  : {
                      y: "calc(100vh - 240px)",
                      scrollToFirstRowOnChange: true,
                    }
              }
              style={{ height: "100%", fontSize: "12px" }}
              onChange={onTableChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
