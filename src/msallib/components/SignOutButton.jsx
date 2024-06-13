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
