"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import _ from "lodash";

import { Form, Select, Skeleton } from "antd";
import { fetchUsersByDepartment } from "app/api/usersApis";
import { useAuthData } from "context/authContext";

import styles from "./fields.module.css";
import UserLabel from "app/components/organisms/users/userLabel";

export default function UserSelectField(props) {
  const {
    value,
    isMultiSelect = false,
    label,
    fieldName,
    size = "middle",
    fontSize = "text-sm",
    labelPos = "left",
    labelSpan = 9,
    inputSpan = 15,
    showAssignToMe = false,
    disabled,
    onChange,
    required,
    showAsLabel = false,
    width = "100%",
  } = props;

  const { loggedInUser } = useAuthData();

  const dispatch = useDispatch();
  const { Option, OptGroup } = Select;
  const [options, setOptions] = useState([]);

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

  const onUserSelect = (value) => {
    onChange(fieldName, value);
  };

  const onAssignToMeClick = () => {
    if (loggedInUser?.email && isUserEmailInOptions(loggedInUser?.email)) {
      onChange(fieldName, loggedInUser?.email, true);
    }
  };

  const isUserEmailInOptions = (email) => {
    const emailList = _.flatMap(options, "options").map(
      (option) => option.value
    );

    if (_.includes(emailList, email)) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (installationUsers && serviceUsers && itUsers) {
      setOptions((prevOptions) => {
        let _options = [];

        const installOptions = {
          label: "Installations",
          options: installationUsers.map((u) => ({
            label: <UserLabel username={u.name} size={fontSize} />,
            value: u.email
              ? u.email.toLowerCase()
              : u.id.replace("centrawindows.com", "centra.ca"),
          })),
        };

        _options.push(installOptions);

        const serviceOptions = {
          label: "Service",
          options: serviceUsers.map((u) => ({
            label: <UserLabel username={u.name} size={fontSize} />,
            value: u.email
              ? u.email.toLowerCase()
              : u.id.replace("centrawindows.com", "centra.ca"),
          })),
        };

        _options.push(serviceOptions);

        const itOptions = {
          label: "IT",
          options: itUsers.map((u) => ({
            label: <UserLabel username={u.name} size={fontSize} />,
            value: u.email
              ? u.email.toLowerCase()
              : u.id.replace("centrawindows.com", "centra.ca"),
          })),
        };

        _options.push(itOptions);

        return _options;
      });
    }
  }, [installationUsers, serviceUsers, itUsers, fontSize]);

  const [labelValue, setLabelValue] = useState("");

  useEffect(() => {
    if (showAsLabel && installationUsers && serviceUsers && itUsers && value) {
      const lowercaseEmail = value ? value.toLowerCase() : "";
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
        setLabelValue(user.name);
      } else {
        setLabelValue(value);
      }
    }
  }, [installationUsers, serviceUsers, itUsers, value, showAsLabel]);

  return (
    <>
      <Form.Item
        label={
          label ? <span className={styles.customLabel}>{label}</span> : null
        }
        name={fieldName}
        labelAlign="left"
        style={{ margin: "3px 0px" }}
        labelCol={
          label
            ? labelPos === "left"
              ? { span: labelSpan }
              : { span: 24 }
            : null
        }
        wrapperCol={
          label
            ? labelPos === "left"
              ? { span: inputSpan }
              : { span: 24 }
            : { span: 24 }
        }
        rules={
          !disabled
            ? [
                {
                  required: required,
                  message: `${label} is required`,
                },
              ]
            : null
        }
      >
        {installationUsers && serviceUsers && itUsers ? (
          <>
            {showAsLabel ? (
              <UserLabel username={labelValue} size={fontSize} />
            ) : (
              <>
                <Select
                  mode={isMultiSelect ? "multiple" : ""}
                  disabled={
                    isLoadingServiceUsers ||
                    isFetchingServiceUsers ||
                    isLoadingInstallationUsers ||
                    isFetchingInstallationUsers ||
                    isLoadingITUsers ||
                    isFetchingITUsers ||
                    disabled
                  }
                  placeholder={
                    <UserLabel username="Unassigned" size={fontSize} />
                  }
                  showSearch
                  value={value}
                  style={{ width: width }}
                  onChange={onUserSelect}
                  size={size}
                  filterOption={filterOption}
                >
                  {options.map((group, groupIndex) => (
                    <>
                      <OptGroup key={groupIndex} label={group.label}>
                        {group.options.map((option) => (
                          <Option
                            key={option.value}
                            value={option.value}
                            label={option.label}
                          >
                            <span className={size === "small" ? "text-xs" : ""}>
                              {option.label}
                            </span>
                          </Option>
                        ))}
                      </OptGroup>
                    </>
                  ))}
                </Select>
                {showAssignToMe && !disabled ? (
                  <div className="text-xs flex my-2 w-full">
                    <span
                      className="cursor-pointer text-centraBlue  hover:text-blue-500 hover:underline "
                      onClick={onAssignToMeClick}
                    >
                      Assign to me
                    </span>
                  </div>
                ) : null}
              </>
            )}
          </>
        ) : (
          <Skeleton.Input active size="small" />
        )}
      </Form.Item>
    </>
  );
}
