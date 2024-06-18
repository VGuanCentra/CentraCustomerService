"use client";

import React from "react";
import { handleLogout } from "../msal/msal";
import Button from "react-bootstrap/Button";

/**
 * Renders a sign-out button
 */
export const SignOutButton = ({ text = "Logout" }) => {
  return (
    <Button
      variant="secondary"
      className="ml-auto"
      onClick={() => handleLogout("redirect")}
    >
      {text}
    </Button>
  );
};

/**
 * Renders a sign-out link
 * https://stackoverflow.com/questions/65703228/react-pass-scss-object-as-property
 * interface Props {
       cssClasses: CSSStyles;
    }
    ({ cssClasses }: Props) => {   
 */

export const SignOutLink = ({ text = "Logout", cssClasses }) => {
  return (
    <span
      className={cssClasses.logout}
      onClick={() => handleLogout("redirect")}
    >
      {text}
    </span>
  );
};
