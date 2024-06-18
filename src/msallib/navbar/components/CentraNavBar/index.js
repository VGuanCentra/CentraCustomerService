import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./styles.module.scss";
import { objectToUrlParams, urlParamsToObject } from "../../lib/utils";

const CentraNavBar = (
  {
    //   appCode,
    //   queryText,
    //   navList = [],
    //   renderNav,
    //   onRoute,
    //   token,
    //   activeFeature,
    //   loadingFeature,
    //   isLocalAppOnly,
  }
) => {
  return (
    <div className={styles.root}>

      {/* return ( */}
        <React.Fragment >
        
        <div
          className={styles.app_header}
          //   onClick={() => handleTab(appKey)}
        >
          <div className={styles.app_header_line}></div>
          <div className={styles.app_header_padding}>
            <div className={styles.app_header_content}>
              {/* <span>{appName}</span> <small>( {subLength} )</small> */}
              <span>VGuan appName </span> <small>VGuan  subLength</small>
            </div>
          </div>
        </div>
      </React.Fragment>
      {/* ); */}
    </div>
  );
};

export default CentraNavBar;
