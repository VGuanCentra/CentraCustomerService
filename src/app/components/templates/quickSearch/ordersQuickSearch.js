"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { Input, Space } from "antd";
import { updateSearchEntry } from "app/redux/orders";
import { SearchOutlined } from "@material-ui/icons";
import { SearchIcon } from "app/utils/icons";

export default function OrdersQuickSearch(props) {
  const [searchDisabled, setSearchDisabled] = useState(true);
  const [searchEntry, setSearchEntry] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const { isMobile } = useSelector((state) => state.app);

  useEffect(() => {
    setSearchDisabled(searchEntry?.length < 2);
  }, [searchEntry]);

  const onSearchInputChange = (e) => {
    setSearchEntry(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      dispatch(updateSearchEntry(searchEntry));
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch, searchEntry]);

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        let searchButton = document.getElementById("button-search");

        if (searchButton) {
          searchButton.click();
        }
      }
    };

    document.addEventListener("keyup", handleKeyUp, true);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="w-100">
      <Space.Compact className="w-100">
        <Input
          placeholder="Search..."
          onChange={onSearchInputChange}
          style={{ width: "100%" }}
          size={props.size ?? "middle"}
          prefix={props.showIcon ? <SearchIcon /> : null}
          allowClear
        />
      </Space.Compact>
    </div>
  );
}
