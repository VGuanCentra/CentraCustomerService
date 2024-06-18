import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./styles.module.scss";
import { objectToUrlParams, urlParamsToObject } from "../../lib/utils";

const handleMergeParam = (url, obj) => {
  if (!url) {
    return "";
  }

  const { params, baseurl } = urlParamsToObject(url);
  const urlWithObj = {
    ...params,
    ...obj,
  };

  return baseurl + "?" + objectToUrlParams(urlWithObj);
};

// work with filter. if child is in filter result, need to expand parent 
const handleFilterByQuery = (arr, q) => {
  return arr?.map(a => {
    const { navItems, featureName } = a
    const newNavItems = handleFilterByQuery(navItems, q)

    // isMatch will work with Enter key.
    const isMatch = featureName?.toLowerCase()?.includes(q?.toLowerCase())
    const isExpandForQuery = newNavItems.filter(b => b.isExpandForQuery || b.isMatch)?.length > 0
    return {
      ...a,
      isExpandForQuery,
      isMatch,
      navItems: newNavItems
    }
  })
}

const handleDefaultCascadeExpand = (arr, activeFeature, expandArr = []) => {
  return arr?.map(a => {
    const { navItems, applicationFeatureId } = a
    const newNavItems = handleDefaultCascadeExpand(navItems, activeFeature, expandArr)

    // isMatch will work with Enter key.
    const isExpandForActive = newNavItems.filter(b => b.isExpandForActive || b.featureKey === activeFeature)?.length > 0

    if (isExpandForActive) {
      expandArr.push(applicationFeatureId)
    }

    return {
      ...a,
      isExpandForActive,
    }
  })
}

const AuthNav = ({
  appCode,
  queryText,
  navList = [],
  renderNav,
  onRoute,
  token,
  activeFeature,
  loadingFeature,
  isLocalAppOnly,
}) => {
  // export default ({ appCode, queryText, navList = [], renderNav, onRoute, token, activeFeature, loadingFeature, isLocalAppOnly }) => {

  // work with input filter
  const [displayApps, setDisplayApps] = useState({ [appCode]: true });
  const [expandItems, setExpandItems] = useState({});
  const handleTab = (appKey) => {
    // if its only showing local, we dont need to collapse it
    if (!isLocalAppOnly) {
      setDisplayApps((prev) => ({ ...prev, [appKey]: !prev?.[appKey] }));
    }
  };

  const onExpand = (id) => {
    setExpandItems((prev) => {
      return { ...prev, [id]: !prev[id] };
    });
  };

  useEffect(() => {
    if (navList && activeFeature) {
      const expandArr = [];
      handleDefaultCascadeExpand(navList, activeFeature, expandArr);
      setExpandItems((prev) => {
        const newExpand = {};
        expandArr.map((a) => (newExpand[a] = true));
        return { ...prev, ...newExpand };
      });
    }
  }, [activeFeature]);

  // apply queryText to navList
  const _list = handleFilterByQuery(
    JSON.parse(JSON.stringify(navList)),
    queryText
  );

  return (
    <div className={styles.root}>
      {_list?.map((o) => {
        const { appName, appKey, navItems, subLength } = o;

        // work with filter input
        const filteredItems =
          navItems?.filter((a) => a.isExpandForQuery || a.isMatch) || [];

        // work with application toggle; if there is filter, expand it when children applies
        const displayChildren =
          displayApps[appKey] || (queryText && filteredItems.length > 0);

        // if (queryText && !(isExpandForQuery || isMatch)) return null

        return (
          <React.Fragment key={appKey}>
            <div
              className={styles.app_header}
              onClick={() => handleTab(appKey)}
            >
              <div className={styles.app_header_line}></div>
              <div className={styles.app_header_padding}>
                <div className={styles.app_header_content}>
                  <span>{appName}</span> <small>( {subLength} )</small>
                </div>
              </div>
            </div>

            {displayChildren && (
              <ul>
                {filteredItems?.map((a, i) => {
                  const { featureKey, isExpandForQuery, isMatch } = a;

                  if (queryText && !(isExpandForQuery || isMatch)) return null;

                  return (
                    <DisplayItem
                      key={`${featureKey}_${i}`}
                      layer={0}
                      item={a}
                      {...{
                        onExpand,
                        expandItems,
                        renderNav,
                        onRoute,
                        token,
                        queryText,
                        activeFeature,
                        loadingFeature,
                      }}
                    />
                  );
                })}
              </ul>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default AuthNav;

const DisplayItem = ({ item, renderNav, onRoute, token, layer, onExpand, expandItems, queryText, activeFeature, loadingFeature }) => {
  const {
    applicationFeatureId,
    isExpandForQuery,
    isMatch,
    navItems,
    featureName,
    featureDescription,
    featureUrl,
    isLocal,
    featureKey,
    config = {},
  } = item;

  let isActive = false, isLoadingFeature = false

  // if parent app force active, it should be 1st priority
  if (activeFeature) {
    isActive = activeFeature === featureKey
  } else {
    if (isLocal) {
      const path = window.location.pathname;
      isActive = path?.startsWith(featureUrl);
    } else {
      // here is just in case (app doesnt set local app code). only "path" should be enough
      const fullUrl = window.location.protocol + "//" + window.location.hostname + window.location.pathname;
      isActive = fullUrl?.startsWith(featureUrl);
    }
  }

  if (loadingFeature && loadingFeature.applicationFeatureId === applicationFeatureId) {
    isLoadingFeature = true
  }

  if (queryText && !(isExpandForQuery || isMatch)) return null
  const { iconClassName } = config;
  const isSub = navItems && navItems.length > 0;

  const jsxAddIcon = isSub ? (
    <div className={styles.addIcon}>
      <i className={cn("fa-solid", expandItems[applicationFeatureId] ? "fa-minus" : "fa-plus")}></i>
    </div>
  ) : null;

  // right now there is only class icon. :
  const jsxNavIcon =  iconClassName ? <i className={cn(iconClassName, styles.navIcon)}/> : null

  const jsxLayerTag = layer > 0 ? <div className={styles.layerTag} /> : null;
  const jsxFeatureName = <><HighlightText text={featureName} query={queryText}/>{isSub?<small className={styles.subCounts} style={{marginLeft: '5px', fontSize: '.6rem'}}> ( {navItems?.length} )</small>:null}</> 
  
  const jsxLink = (_url) => (
    <a href={_url} title={featureDescription}>
      <div className={styles.itemLabel} style={{ paddingLeft: 10 * layer }}>
        {jsxLayerTag}
        {jsxNavIcon}
        {jsxFeatureName}
        {isLoadingFeature && <LoadingFeature/>}
      </div>
      {jsxAddIcon}
    </a>
  );

  let returnValue = null;

  if (isSub) {
    returnValue = (
      <>
        <span className={styles.local_link} onClick={() => onExpand(applicationFeatureId)} title={featureDescription}>
          <div className={styles.itemLabel} style={{ paddingLeft: 10 * layer }}>
            {jsxLayerTag}
            {jsxNavIcon}
            {jsxFeatureName}
            {isLoadingFeature && <LoadingFeature/>}
          </div>
          {jsxAddIcon}
        </span>
      </>
    );
  } else if (typeof onRoute === "function" && isLocal) {
    returnValue = (
      <>
        <span className={styles.local_link} onClick={() => onRoute(featureUrl, item)} title={featureDescription}>
          <div className={styles.itemLabel} style={{ paddingLeft: 10 * layer }}>
            {jsxLayerTag}
            {jsxNavIcon}
            {jsxFeatureName}
            {isLoadingFeature && <LoadingFeature/>}
          </div>
          {jsxAddIcon}
        </span>
      </>
    );
  } else if (typeof renderNav === "function" && isLocal) {
    returnValue = renderNav(item, jsxLink(featureUrl));
  } else {
    const externalFeatureUrl = isLocal ? featureUrl : handleMergeParam(featureUrl, { authnav_token: token });
    returnValue = jsxLink(externalFeatureUrl);
  }

  return (
    <React.Fragment>
      <li className={cn(styles.layer2Title, isActive ? styles.active : "", isSub ?  styles.isSub : styles.isNav)}>
        {returnValue}
      </li>
      {isSub && (expandItems[applicationFeatureId] || (queryText && isExpandForQuery))? (
        <li className={styles.layer2navs}>
          <ul>
            {navItems?.map((a, i) => {
              const { featureKey } = a;
              return (
                <DisplayItem
                  key={`${featureKey}_${i}`}
                  layer={layer + 1}
                  item={a}
                  {...{ onExpand, expandItems, renderNav, onRoute, token, queryText, activeFeature, loadingFeature }}
                />
              );
            })}
          </ul>
        </li>
      ) : null}
    </React.Fragment>
  );
};

const HighlightText = ({ text, query }) => {
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return (
    <span style={{ whiteSpace: 'pre-wrap' }}>
      {parts.map((part, index) => 
        regex.test(part) 
          ? <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> 
          : part
      )}
    </span>
  );
};

const LoadingFeature = () => {
  return <span className={styles.featureLoading}> (Loading...)</span>
}