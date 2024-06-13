import dayjs, { Dayjs } from "dayjs";
import DateTimeSelectField from "./dateTimeSelectField";
import { FC, useEffect, useState } from "react";
import { FormInstance } from "antd";

interface Field {
  id: string;
  label: string;
  fieldName: string;
  required: boolean;
  disabled: boolean;
}

interface DateTimeRangeFieldProps {
  form: FormInstance<any>;
  startFieldProps: Field;
  endFieldProps: Field;
}

const DateTimeRangeField: FC<DateTimeRangeFieldProps> = ({
  form,
  startFieldProps,
  endFieldProps,
}) => {
  const [startDate, setStartDate] = useState<Dayjs | undefined>(undefined);

  useEffect(() => {
    if (form) {
      let _startDate = form.getFieldValue(startFieldProps.fieldName) as
        | Dayjs
        | undefined;
      setStartDate(_startDate);
    }
  }, [form, startFieldProps]);

  const handleStartDateSelect = (value: Dayjs | null, dateString: string) => {
    let _endDate = form.getFieldValue(endFieldProps.fieldName);

    if (dayjs(_endDate).isBefore(value)) {
      // Add 15 minutes
      form.setFieldValue(
        endFieldProps.fieldName,
        dayjs(value).add(15, "minutes")
      );
    }

    setStartDate(dayjs(value));
  };

  return (
    <>
      <DateTimeSelectField
        id={startFieldProps.id}
        label={startFieldProps.label}
        fieldName={startFieldProps.fieldName}
        onChange={handleStartDateSelect}
        required={startFieldProps.required}
        disabled={startFieldProps.disabled}
      />

      <DateTimeSelectField
        id={endFieldProps.id}
        label={endFieldProps.label}
        fieldName={endFieldProps.fieldName}
        minValue={startDate}
        required={endFieldProps.required}
        disabled={endFieldProps.disabled}
      />
    </>
  );
};

export default DateTimeRangeField;
