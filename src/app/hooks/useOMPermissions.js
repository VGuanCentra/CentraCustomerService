import React, { useState, useEffect, useCallback } from "react";

import _ from "lodash";
import { useSelector } from "react-redux";
import { FEATURE_ACCESS_TYPES } from "app/utils/constants";

const useOMPermissions = (appFeatureCode) => {
  const { userData } = useSelector((state) => state.app);
  const applicationCode = "OM";

  const userAppPermissions = _.find(userData?.permissions, (app) => {
    return app.applicationCode === applicationCode;
  })?.applicationFeatures;

  const [permissions, setPermissions] = useState({
    canAdd: false,
    canEdit: false,
    canView: false,
    canDelete: false,
  });

  const userHasUrlAccess = (url) => {
    return _.find(userData?.permissions, { url });
  };

  const userHasFeatureAccessType = useCallback(
    (appFeatureCode, accessType) => {
      let _permission = _.find(userAppPermissions, (permission) => {
        return permission.applicationFeatureCode === appFeatureCode;
      });

      if (!_permission) return false;

      return _permission[accessType] ?? false;
    },
    [userAppPermissions]
  );

  useEffect(() => {
    if (!userAppPermissions) return;

    const _canView = userHasFeatureAccessType(
      appFeatureCode,
      FEATURE_ACCESS_TYPES.View
    );
    const _canAdd = userHasFeatureAccessType(
      appFeatureCode,
      FEATURE_ACCESS_TYPES.Add
    );
    const _canDelete = userHasFeatureAccessType(
      appFeatureCode,
      FEATURE_ACCESS_TYPES.Delete
    );
    const _canEdit = userHasFeatureAccessType(
      appFeatureCode,
      FEATURE_ACCESS_TYPES.Edit
    );

    setPermissions((prev) => {
      prev[FEATURE_ACCESS_TYPES.Add] = _canAdd;
      prev[FEATURE_ACCESS_TYPES.View] = _canView;
      prev[FEATURE_ACCESS_TYPES.Edit] = _canEdit;
      prev[FEATURE_ACCESS_TYPES.Delete] = _canDelete;

      return prev;
    });
  }, [appFeatureCode, userAppPermissions, userHasFeatureAccessType]);

  return { permissions };
};

export default useOMPermissions;
