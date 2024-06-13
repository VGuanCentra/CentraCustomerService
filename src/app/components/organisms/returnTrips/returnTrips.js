"use client";
import React, { useCallback, useEffect, useState } from "react";

import { Timeline } from "antd";
import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";
import { useAuthData } from "context/authContext";
import _ from "lodash";
import ReturnTripView from "app/components/organisms/returnTrips/returnTripView";
import ReturnTripEdit from "app/components/organisms/returnTrips/returnTripEdit";
import { ReturnJobIcon } from "app/utils/icons";

export default function ReturnTrips(props) {
  const {
    moduleId,
    returnTrips = [],
    showAdd,
    cancelAddCallback,
    saveAddCallback,
    deleteCallback,
    disabled,
    onAddReturnTripClick,
  } = props;

  const { loggedInUser } = useAuthData();
  const [returnTripTLInput, setReturnTripTLInput] = useState([]);
  const [showAddReturnTrip, setShowAddReturnTrip] = useState(false);
  const [showDeleteReturnTrip, setShowDeleteReturnTrip] = useState(false);
  const [returnTripIdToDelete, setReturnTripIdToDelete] = useState(null);
  const [originalReturnTrips, setOriginalReturnTrips] = useState([]);
  const [tempReturnTrips, setTempReturnTrips] = useState([]);
  const [selectedReturnTrip, setSelectedReturnTrip] = useState(null);

  useEffect(() => {
    if (returnTrips) {
      const _originalCallLogs = _.cloneDeep(returnTrips);
      setOriginalReturnTrips(_originalCallLogs);

      const _t = _.cloneDeep(returnTrips);

      _t.forEach((t) => {
        t["isEditing"] = false;
      });

      setTempReturnTrips(_t);
    }
  }, [returnTrips]);

  useEffect(() => {
    if (tempReturnTrips) {
      var tlItems = [];

      if (!disabled) {
        var item = {
          // label: isMobile ? null : RTLabel(cl),
          children: (
            <div
              className="flex text-xs items-center space-x-1 cursor-pointer hover:underline"
              onClick={disabled ? () => {} : onAddReturnTripClick}
            >
              <span className="text-centraBlue hover:underline hover:text-blue-400 mt-1">
                Create Return Trip
              </span>
            </div>
          ),
          color: "#0062A8",
          dot: <i className="fa-solid fa-plus" />,
        };
        tlItems.push(item);
      }

      const hasAddItemEnabled =
        tempReturnTrips.filter((cl) => cl.id === 0 && cl.isEditing === true)
          .length > 0;

      let _count = tempReturnTrips?.length;
      if (_count > 0) {
        tempReturnTrips.map((cl, index) => {
          var item = {
            // label: isMobile ? null : RTLabel(cl),
            children: returnTripChild(cl, _count - index),
            color: "orange",
            dot: <ReturnJobIcon style={{ width: "15px", height: "15px" }} />,
          };

          tlItems.push(item);
        });
      }

      setReturnTripTLInput(tlItems);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempReturnTrips]);

  useEffect(() => {
    if (showAdd && !_.find(tempReturnTrips, (x) => x.id === "")) {
      setTempReturnTrips((prev) => {
        let _p = _.cloneDeep(prev);
        _p.forEach((p) => {
          let _og = originalReturnTrips.find((cl) => cl.id === p.id);
          if (_og) {
            Object.assign(p, _og);
            p.isEditing = false;
          }
        });

        let _nCL = {
          id: "",
          parentId: moduleId,
          reason: "",
          startDate: null,
          endDate: null,
          createdBy: loggedInUser ? loggedInUser.name : "Test User",
          isEditing: true,
        };

        _p.unshift(_nCL);

        setSelectedReturnTrip(_nCL);
        return _p;
      });
    }
  }, [showAdd, loggedInUser, moduleId, originalReturnTrips, tempReturnTrips]);

  const handleUpdateRT = useCallback(
    (returnTripId, column, value) => {
      setTempReturnTrips((prev) => {
        let _p = JSON.parse(JSON.stringify(prev));
        let _rt = _p.find((p) => p.id === returnTripId);

        if (column === "isEditing") {
          if (value === true) {
            _p.forEach((rt) => {
              if (rt.id !== returnTripId && rt[column] === true) {
                let _og = originalReturnTrips.find((cl) => cl.id === rt.id);
                if (_og) {
                  Object.assign(rt, _og);
                  rt.isEditing = false;
                }
              }
            });
            _rt.isEditing = true;
          } else {
            if (_rt && _rt.id === "") {
              if (cancelAddCallback) {
                cancelAddCallback();
              }
              return _p.filter((p) => p.id !== returnTripId);
            } else {
              // Handle the case when isEditing is set to false
              let _og = originalReturnTrips.find(
                (cl) => cl.id === returnTripId
              );
              if (_og) {
                Object.assign(_rt, _og);
                _rt.isEditing = false;
              }
            }
          }
        } else {
          if (column === "startDate" || column === "endDate") {
            let _dt = null;
            if (value) {
              _dt = value;
              _rt[column] = _dt.toISOString();
            }
          } else _rt[column] = value;
        }

        return _p;
      });
    },
    [originalReturnTrips, cancelAddCallback]
  );

  const onCancelClick = useCallback(
    (id) => {
      handleUpdateRT(id, "isEditing", false);
    },
    [handleUpdateRT]
  );

  const onDtChange = (id, name, dateValue) => {
    handleUpdateRT(id, name, dateValue);
  };

  const onReasonChange = useCallback(
    (id, val) => {
      handleUpdateRT(id, "reason", val);
    },
    [handleUpdateRT]
  );

  const onEditClick = useCallback(
    (returnTrip) => {
      setSelectedReturnTrip(returnTrip);
      handleUpdateRT(returnTrip.id, "isEditing", true);
    },
    [handleUpdateRT]
  );

  const onSaveClick = (rt) => {
    setShowAddReturnTrip(true);
    setSelectedReturnTrip(rt);
  };

  const onDeleteClick = (id) => {
    if (id) {
      setReturnTripIdToDelete(id);
      setShowDeleteReturnTrip(true);
    }
  };

  const onAddConfirm = useCallback(async () => {
    if (selectedReturnTrip && saveAddCallback) {
      setShowAddReturnTrip(false);
      await saveAddCallback(selectedReturnTrip);
      setSelectedReturnTrip(null);
    }
  }, [selectedReturnTrip, saveAddCallback]);

  const onAddCancel = useCallback(async () => {
    setShowAddReturnTrip(false);
    setSelectedReturnTrip(null);
  }, []);

  const onDeleteConfirm = useCallback(async () => {
    if (returnTripIdToDelete && deleteCallback) {
      setShowDeleteReturnTrip(false);
      await deleteCallback(returnTripIdToDelete);
      setReturnTripIdToDelete(null);
    }
  }, [returnTripIdToDelete, deleteCallback]);

  const onDeleteCancel = useCallback(async () => {
    setShowDeleteReturnTrip(false);
    setReturnTripIdToDelete(null);
  }, []);

  const returnTripChild = (returnTrip, id) => {
    return (
      <div
        className={`flex items-center space-x-2 text-xs  ${
          returnTrip.isEditing ? "bg-gray-100" : "bg-gray-100"
        } rounded-sm w-100 mt-2`}
      >
        {returnTrip.isEditing ? (
          <ReturnTripEdit
            {...{
              returnTrip,
              onCancelClick,
              onSaveClick,
              onDtChange,
              onReasonChange,
            }}
          />
        ) : (
          <ReturnTripView
            {...{ returnTrip, id, disabled, onEditClick, onDeleteClick }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full ">
      {returnTripTLInput.length > 0 ? (
        <Timeline mode="left" items={returnTripTLInput} />
      ) : (
        <div className="flex w-full h-full justify-center items-center text-center text-gray-400 text-xs">
          <div>No return trips have been scheduled for this order.</div>
        </div>
      )}

      <ConfirmationModal
        title={`Create Return Trip?`}
        open={showAddReturnTrip}
        onOk={onAddConfirm}
        onCancel={onAddCancel}
        cancelLabel={"No"}
        okLabel={"Yes"}
      >
        <div className="pt-2">
          <div>Are you sure you want to save this return trip?</div>
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        title={`Delete Return Trip`}
        open={showDeleteReturnTrip}
        onOk={onDeleteConfirm}
        onCancel={onDeleteCancel}
        cancelLabel={"No"}
        okLabel={"Yes"}
      >
        <div className="pt-2">
          <div>Are you sure you want to delete this return trip?</div>
        </div>
      </ConfirmationModal>
    </div>
  );
}
