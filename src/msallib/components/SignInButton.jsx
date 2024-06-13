"use client";

import React from "react";
import Button from "react-bootstrap/Button";
import { handleLogin } from "../msal/msal";
/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
export const SignInButton = ({ text = "Login" }) => {
  return (
    <Button
      variant="secondary"
      className="ml-auto"
      onClick={() => handleLogin("redirect")}
    >
      {text}
    </Button>
  );
};
