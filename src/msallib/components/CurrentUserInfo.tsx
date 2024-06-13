"use client";

import { useEffect, useState } from "react";
import { getUserPhotoAvatar } from "../msal/msalGraph";
import { msalInstance } from "../msal/msal";
import Image from "next/image";
import { extractInitials } from "../msal/userHelper";

export default function CurrentUserInfo() {
  // const [userPhoto, setUserPhoto] = useState<string | null>(null);
  // const [showUserInitials, setShowUserInitials] = useState(false);
  // const [userInitials, setUserInitials] = useState("?");

  const user = msalInstance.getActiveAccount();

  // useEffect(() => {
  //   if (user) {
  //     getUserPhotoAvatar().then((response: any) => {
  //       console.log("getUserPhotoAvatar", response);
  //       if (response instanceof Blob) {
  //         const url = URL.createObjectURL(response);
  //         setUserPhoto(url);
  //       } else if (typeof response === "string") {
  //         setUserPhoto(response);
  //         setShowUserInitials(false);
  //       } else {
  //         console.log("Unsupported photo data type.");
  //       }
  //     });
  //     setShowUserInitials(false);
  //     setUserInitials(extractInitials(user.name));
  //     console.log(user);
  //   }
  // }, []); //intentionally left the dependency blank.

  // function onImgError() {
  //   setShowUserInitials(true);
  // }

  return user.name;
}
