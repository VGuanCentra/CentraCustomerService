import React from "react";

import { Dropdown } from "antd";

export default function MobileNavDropdown(props) {
  const { menuItems } = props;

  return (
    <Dropdown menu={{ items: menuItems }} style={{ height: "100%" }}>
      <span className="flex items-center justify-center">
        <i className="fa-solid fa-ellipsis"></i>
      </span>
    </Dropdown>
  );
}
