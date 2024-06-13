"use client";
import styles from "../serviceWorkorder.module.css";
import React from "react";

import Group from "app/components/atoms/workorderComponents/group";
import TextField from "app/components/atoms/formFields/ts/textField";
import TextAreaField from "app/components/atoms/formFields/ts/textAreaField";

export default function ServiceCustomerInfo(props) {
  const { isReadOnly = false } = props;

  return (
    <Group
      id={"title-customerInfo"}
      title={"Customer Information"}
      style={{ minWidth: "21rem" }}
      contentStyle={{
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
      }}
      className={styles.groupSchedule}
    >
      <TextField
        id="firstName"
        label="First Name"
        fieldName="firstName"
        required
        disabled={isReadOnly}
      />
      <TextField
        id="lastName"
        label="Last Name"
        fieldName="lastName"
        // required
        disabled={isReadOnly}
      />
      <TextAreaField
        id="streetAddress"
        label="Street Address"
        fieldName="streetAddress"
        required
        disabled={isReadOnly}
        minRows={4}
      />
      <TextField
        id="city"
        label="City"
        fieldName="city"
        required
        disabled={isReadOnly}
      />
      <TextField
        id="postalCode"
        label="Postal Code"
        fieldName="postalCode"
        disabled={isReadOnly}
      />
      <TextField
        id="email"
        label="Email Address"
        fieldName="email"
        disabled={isReadOnly}
      />
      <TextField
        id="homePhone"
        label="Home Phone"
        fieldName="homePhone"
        disabled={isReadOnly}
      />

      <TextField
        id="cellPhone"
        label="Cell Phone"
        fieldName="cellPhone"
        disabled={isReadOnly}
      />
    </Group>
  );
}
