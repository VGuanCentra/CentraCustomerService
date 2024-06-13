"use client";
import React from "react";
import { useQuery } from "react-query";
import _ from "lodash";

import { fetchUsersByDepartment } from "app/api/usersApis";
import { AvatarGroup } from "@mui/material";
import UserAvatar from "app/components/organisms/users/userAvatar";
import { Skeleton } from "antd";

export default function UserGroup(props) {
  const { value } = props;

  const fetchInstallationUsers = async () => {
    const result = await fetchUsersByDepartment("Installations");
    return result.data;
  };

  const fetchServiceUsers = async () => {
    const result = await fetchUsersByDepartment("Service");
    return result.data;
  };

  const fetchITUsers = async () => {
    const result = await fetchUsersByDepartment("IT");
    return result.data;
  };
  const filterOption = (input, option) => {
    const username = _.get(option, "props.label.props.username");
    return username && username.toLowerCase().includes(input.toLowerCase());
  };

  const {
    isLoading: isLoadingInstallationUsers,
    data: installationUsers,
    isFetching: isFetchingInstallationUsers,
    refetch: refetchInstallationUsers,
  } = useQuery(["ad_install_users"], fetchInstallationUsers, {
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: isLoadingServiceUsers,
    data: serviceUsers,
    isFetching: isFetchingServiceUsers,
    refetch: refetchServiceUsers,
  } = useQuery(["ad_service_users"], fetchServiceUsers, {
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: isLoadingITUsers,
    data: itUsers,
    isFetching: isFetchingITUsers,
    refetch: refetchITUsers,
  } = useQuery(["ad_it_users"], fetchITUsers, {
    refetchOnWindowFocus: false,
  });

  const getUserName = (email) => {
    if (email) {
      const lowercaseEmail = email ? email.toLowerCase() : "";
      const user =
        installationUsers.find(
          (x) =>
            (x.email && x.email.toLowerCase() === lowercaseEmail) ||
            x.id.replace("centrawindows.com", "centra.ca") === lowercaseEmail
        ) ||
        serviceUsers.find(
          (x) =>
            (x.email && x.email.toLowerCase() === lowercaseEmail) ||
            x.id.replace("centrawindows.com", "centra.ca") === lowercaseEmail
        ) ||
        itUsers.find(
          (x) =>
            (x.email && x.email.toLowerCase() === lowercaseEmail) ||
            x.id.replace("centrawindows.com", "centra.ca") === lowercaseEmail
        );
      if (user) {
        return user.name;
      } else {
        return email;
      }
    }
    return "";
  };

  return (
    <>
      {installationUsers && serviceUsers && itUsers ? (
        <AvatarGroup
          sx={{
            width: "100%",
            justifyContent: "left",
            "& .MuiAvatar-root": {
              width: 19,
              height: 19,
              fontSize: 8,
              paddingTop: "1px",
            },
          }}
          max={8}
        >
          {value?.map((email, i) => {
            let userName = getUserName(email);

            return <UserAvatar key={`ag_${i}`} username={userName} />;
          })}
        </AvatarGroup>
      ) : (
        <Skeleton.Input active size="small" />
      )}
    </>
  );
}
