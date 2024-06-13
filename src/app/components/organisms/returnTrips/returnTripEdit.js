import { useEffect, useState } from "react";
import { Button, DatePicker } from "antd";
import LockButton from "app/components/atoms/lockButton/lockButton";
import TextArea from "antd/es/input/TextArea";
import { convertToLocaleDateTime } from "app/utils/date";
import dayjs from "dayjs";

export default function ReturnTripEdit(props) {
  const { returnTrip, onCancelClick, onSaveClick, onDtChange, onReasonChange } =
    props;
  const DATE_FORMAT = "YYYY-MM-DD h:mm A";

  const [minValue, setMinValue] = useState(undefined);

  useEffect(() => {
    setMinValue(dayjs(convertToLocaleDateTime(returnTrip.startDate)));
  }, [returnTrip]);

  const handleStartDateSelect = (value, dateString) => {
    let _endDate = returnTrip.endDate;

    if (dayjs(convertToLocaleDateTime(_endDate)).isBefore(value)) {
      // Add 15 minutes
      onDtChange(returnTrip.id, "endDate", dayjs(value).add(15, "minutes"));
    }

    setMinValue(dayjs(value));
    onDtChange(returnTrip.id, "startDate", value);
  };

  const handleEndDateSelect = (value, dateString) => {
    onDtChange(returnTrip.id, "endDate", value);
  };

  const handleDisabledDate = (currentDate) => {
    if (minValue) {
      return dayjs(currentDate).isBefore(minValue);
    }
    return false;
  };

  const handleDisabledTime = (current) => {
    if (!current || !minValue) return {};

    const _isSameDay = dayjs(current).isSame(minValue, "day");

    if (_isSameDay) {
      const disabledHour = dayjs(minValue).hour();
      const disabledMinute = dayjs(minValue).minute();

      return {
        disabledHours: () => Array.from({ length: disabledHour }, (_, i) => i),
        disabledMinutes: () => {
          if (current.hour() === disabledHour) {
            return Array.from({ length: disabledMinute + 15 }, (_, i) => i);
          }
          return [];
        },
      };
    }

    return {};
  };

  return (
    <div className="w-full flex flex-col text-xs rounded-sm shadow-sm p-2 space-y-2">
      <div className="flex w-full justify-between items-center">
        <DatePicker
          showTime
          use12Hours
          size="small"
          changeOnBlur
          className="text-xs"
          format={DATE_FORMAT}
          onChange={handleStartDateSelect}
          placeholder="Select Start Date"
          value={
            returnTrip.startDate
              ? dayjs(convertToLocaleDateTime(returnTrip.startDate))
              : null
          }
        />

        <DatePicker
          showTime
          use12Hours
          size="small"
          changeOnBlur
          className="text-xs"
          format={DATE_FORMAT}
          onChange={handleEndDateSelect}
          placeholder="Select End Date"
          value={
            returnTrip.endDate
              ? dayjs(convertToLocaleDateTime(returnTrip.endDate))
              : null
          }
          disabledDate={handleDisabledDate}
          disabledTime={handleDisabledTime}
        />
      </div>
      <TextArea
        placeholder="Return Trip Reason"
        autoSize={{ minRows: 2, maxRows: 3 }}
        value={returnTrip.reason}
        onChange={(e) => onReasonChange(returnTrip.id, e.target.value)}
      />
      <div className="flex space-x-2 justify-end">
        <Button
          onClick={() => onCancelClick(returnTrip.id)}
          size="small"
          style={{ backgroundColor: "white" }}
        >
          Cancel
        </Button>
        <LockButton
          tooltip={"Save Return Trip"}
          onClick={() => onSaveClick(returnTrip)}
          disabled={
            !returnTrip.startDate || !returnTrip.endDate || !returnTrip.reason
          }
          showLockIcon={false}
          label={"Save"}
          size="small"
        />
      </div>
    </div>
  );
}
