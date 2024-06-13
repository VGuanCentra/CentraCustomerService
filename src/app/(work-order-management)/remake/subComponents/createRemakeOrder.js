import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import moment from "moment";
import AntDatePicker from "app/components/atoms/datePicker/datePicker";
import WOSelection from "app/components/organisms/woSelection/woSelection";
import ProductionWorkOrder from "app/components/templates/productionWorkorder/productionWorkorder";
import { Space, Typography } from "antd";

import { fetchProductionWorkOrders } from "app/api/productionApis";
const { Text } = Typography;
import CloseButton from "app/components/atoms/closeButton";
import { updateDepartment, updateWorkOrderData } from "app/redux/calendar";
import { CalendarTypes } from "app/utils/constants";

export default function CreateRemakeOrder(props) {
  const dispatch = useDispatch();
  const action = "remake";

  const workOrderNumberParam = props.orderId;

  const { onClose } = props;

  const [workOrderNumber, setWorkOrderNumber] = useState(
    workOrderNumberParam || ""
  );

  const [date, setDate] = useState(moment());

  const { branch } = useSelector((state) => state.calendar);

  const [hasChanges, setHasChanges] = useState(false);

  const HEADER_HEIGHT_OFFSET = 140;

  const [woData, setWOData] = useState([]);

  const {
    isFetching,
    data: workOrders,
    refetch,
  } = useQuery(
    "workorders",
    () => {
      const daysInMonth = moment(date).daysInMonth();
      const year = moment(date).format("YYYY");
      const month = moment(date).format("M");

      if (daysInMonth && month && year) {
        return fetchProductionWorkOrders(
          `${year}-${month}-01T00:00:00`,
          `${year}-${month}-${daysInMonth}T23:59:59`
        );
      }
    },
    { enabled: false }
  );

  useEffect(() => {
    if (date) {
      refetch();
      setWorkOrderNumber(null);

      const _department = CalendarTypes.find((x) => x.key === "production");

      dispatch(updateDepartment(_department));
    }
  }, [date, refetch, dispatch]);

  useEffect(() => {
    if (workOrderNumberParam) {
      setWorkOrderNumber(workOrderNumberParam);
    }
  }, [workOrderNumberParam]);

  useEffect(() => {
    if (workOrders) {
      setWOData(workOrders.data);
    }
  }, [workOrders]);

  useEffect(() => {
    if (workOrderNumber) {
      setWOData((prev) => {
        return prev.filter((x) =>
          x.workOrderNumber
            .toLowerCase()
            .includes(workOrderNumber.toLowerCase())
        );
      });
    } else {
      setWOData(workOrders?.data || []);
    }
  }, [workOrderNumber, workOrders]);

  const handleSelect = useCallback(
    (value) => {
      setHasChanges(true);

      if (value) {
        setWorkOrderNumber(value.id);
        dispatch(updateWorkOrderData({ workOrderNumber: value.id }));
      } else {
        setWorkOrderNumber("");
        dispatch(updateWorkOrderData({}));
      }
    },
    [dispatch]
  );

  const handleDateChange = (e) => {
    if (e) {
      setDate(moment(e));
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div>{`Create Remake(s)`}</div>
        <CloseButton
          onClose={onClose}
          title="Close Remake"
          // hasChanges={hasChanges}
        />
      </div>
      <div
        className={`border w-full rounded bg-white pr-2 pl-2 pb-2`}
        style={{
          height: `${window.innerHeight - HEADER_HEIGHT_OFFSET}px`,
          width: props.style.width || "80vw",
          overflow: "hidden",
          overflowY: "scroll",
        }}
      >
        {!workOrderNumberParam ? (
          <div
            className="flex flex-row justify-center pb-3 sticky z-10 bg-white pt-3 w-full"
            style={{ borderBottom: "1px dotted lightgrey", top: 0 }}
          >
            <Space.Compact className="w-full justify-center">
              <AntDatePicker
                value={date}
                picker={"month"}
                onChange={handleDateChange}
                format={"MMMM YYYY"}
                style={{
                  borderRadius: "5px 0 0 5px !important",
                  width: "9rem",
                  height: "2rem",
                }}
              />
              <WOSelection
                branch="All"
                onChange={() => {}}
                workOrders={woData}
                handleSelect={handleSelect}
                workOrderNumber={workOrderNumber}
                setWorkOrderNumber={setWorkOrderNumber}
                width="20rem"
              />
            </Space.Compact>
          </div>
        ) : null}

        <div className="w-full md:px-2 px-0 pb-2">
          {!workOrderNumber && (
            <div
              className="flex w-100 justify-center items-center"
              style={{ height: "70vh" }}
            >
              <div className="text-sm">
                <Text type="secondary">
                  Find a work order from the selection menu above.
                </Text>
              </div>
            </div>
          )}
          {workOrderNumber && (
            <div className="pt-3">
              <ProductionWorkOrder
                viewConfig={{
                  hideCustomerInfo: true,
                  hideOrder: true,
                  hideNotes: true,
                  hideRemake: true,
                  hideBackorder: true,
                  hideGlass: true,
                  stickyHeader: false,
                  width: "75vw",
                  hideNavigation: true,
                  hideLoading: true,
                  expanded: true,
                }}
                action={action}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
