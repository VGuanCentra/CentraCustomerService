import moment from "moment";

export const convertToLocaleDateTime = (date) => {
  const dateString = String(date);
  const dateZ = dateString.endsWith("Z") ? date : date + "Z";
  return moment.utc(dateZ).local().toDate();
};

export const convertToLocaleDateTimeLLL = (date) => {
  const dateString = String(date);
  const dateZ = dateString.endsWith("Z") ? date : date + "Z";
  return moment.utc(dateZ).local().format("LLL");
};

export const convertToLocaleDateTimell = (date) => {
  const dateString = String(date);
  const dateZ = dateString.endsWith("Z") ? date : date + "Z";
  return moment.utc(dateZ).local().format("ll");
};

export const convertToLocaleDateTimelll = (date) => {
  const dateString = String(date);
  const dateZ = dateString.endsWith("Z") ? date : date + "Z";
  return moment.utc(dateZ).local().format("lll");
};

export const getTimeAMPMUtc = (date) => {
  const dateString = String(date);
  const dateZ = dateString.endsWith("Z") ? date : date + "Z";

  return moment.utc(dateZ).local().format("hh:mm A");
};

export const getTimeHHmm = (date) => {
  const dateString = String(date);
  const dateZ = dateString.endsWith("Z") ? date : date + "Z";

  return moment.utc(dateZ).local().format("HH:mm");
};

export const convertToLocaleDateTimeYYYYMMDD = (date) => {
  const dateString = String(date);
  const dateZ = dateString.endsWith("Z") ? date : date + "Z";
  return moment.utc(dateZ).local().format("YYYY-MM-DD");
};

export const convertUtcDateTimeToLocal = (date) => {
  const dateString = String(date);
  const dateZ = dateString.endsWith("Z") ? date : date + "Z";

  return moment.utc(dateZ).local();
};

export const convertToLocalDateTime = (dateTime) => {
  const dateString = String(dateTime);
  const dateZ = dateString.endsWith("Z") ? dateTime : dateTime + "Z";

  return moment.utc(dateZ).local().format("YYYY-MM-DD h:mm A");
};

export const getTimeDifferenceInHours = (startDateTime, endDateTime) => {
  const result =
    (new Date(endDateTime) - new Date(startDateTime)) / (1000 * 60 * 60);

  return result;
};
