"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";
import ServiceEvent from "app/components/organisms/events/serviceEvent";
import moment from "moment";

export default function ServiceRescheduleModal(props) {
  const {
    showRescheduleConfirmation,
    handleMoveOk,
    handleMoveCancel,
    changeEvent,
  } = props;

  const { isReadOnly } = useSelector((state) => state.app);

  useEffect(() => {
    if (changeEvent) {
      console.log(changeEvent?.oldEvent);
    }
  }, [changeEvent]);

  return (
    <ConfirmationModal
      title={"Reschedule Confirmation"}
      open={showRescheduleConfirmation}
      onOk={handleMoveOk}
      onCancel={handleMoveCancel}
      cancelLabel={"Cancel"}
      okLabel={"Ok"}
      showIcon={false}
      okDisabled={isReadOnly}
    >
      <div
        className="pt-2 text-sm text-semibold pr-2"
        style={{ width: "25rem" }}
      >
        <ServiceEvent
          event={changeEvent?.event}
          style={{
            backgroundColor:
              changeEvent?.event.backgroundColor ||
              changeEvent?.event?._def?.ui?.backgroundColor,
            borderRadius: "3px",
            padding: "0.2rem 0.5rem",
          }}
          textStyle={{
            fontWeight: "500",
          }}
          showSchedule={false}
          title={changeEvent?.event.serviceWorkOrderNumber}
        />
        <div className="pt-2" style={{ width: "100%" }}>
          <table>
            <tr>
              <td style={{ width: "6rem" }}></td>
              <td className="font-semibold text-blue-600">Old Date</td>
              <td className="font-semibold text-blue-600">New Date</td>
            </tr>
            <tr>
              <td className="font-semibold">Start</td>
              <td className="text-xs">
                {moment(changeEvent?.oldEvent?.startStr).format(
                  "YYYY-MM-DD h:mm A"
                )}
              </td>
              <td className="text-xs">
                {moment(changeEvent?.event?.startStr).format(
                  "YYYY-MM-DD h:mm A"
                )}
              </td>
            </tr>
            <tr>
              <td className="font-semibold">End</td>
              <td className="text-xs">
                {moment(changeEvent?.oldEvent?.endStr).format(
                  "YYYY-MM-DD h:mm A"
                )}
              </td>
              <td className="text-xs">
                {moment(changeEvent?.event?.endStr).format("YYYY-MM-DD h:mm A")}
              </td>
            </tr>
          </table>
          <div className="pt-3">Do you want to proceed with the update?</div>
        </div>
      </div>
    </ConfirmationModal>
  );
}
