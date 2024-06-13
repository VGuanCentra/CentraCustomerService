"use client";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

import { Production, Service, Installation } from "app/utils/constants";

const usePermission = () => {
  const [userPermissions, setUserPermissions] = useState([]);
  const [departmentPermissions, setDepartmentPermissions] = useState([]);
  const [userDepartmentPermissions, setUserDepartmentPermissions] = useState([]);

  const { userData } = useSelector((state) => state.app);
  const { department } = useSelector((state) => state.calendar);
    
  const ApplicationCodeWebCalendar = "WC";

  // Set user permissions
  useEffect(() => {
    if (userData?.permissions?.length > 0) {
      const _userPermissions = userData.permissions
        ?.find((x) => x.applicationCode === ApplicationCodeWebCalendar)
        ?.applicationFeatures;

      if (_userPermissions?.length > 0) {
        setUserPermissions(_userPermissions)
      }
    }
  }, [userData]);

  // Set department permissions
  useEffect(() => {
    if (userData?.defaultPermissions?.length > 0) {
      const _departmentPermissions = userData.defaultPermissions[0]
        ?.permissions
        ?.find((x) => x.applicationCode === ApplicationCodeWebCalendar)
        ?.applicationFeatures;

      if (_departmentPermissions?.length > 0) {
        setDepartmentPermissions(_departmentPermissions);
      }
    }
  }, [userData]);
  
  const getUserHasFeatureEditByName = useCallback((featureName) => {
    if (userDepartmentPermissions && featureName) {     
      let result = false;
      result = userDepartmentPermissions.permissions?.find(p => p.name === featureName)?.canEdit;
      return result;
    }
  }, [userDepartmentPermissions]);

  const getUserHasFeatureEditByCode = useCallback((featureCode) => {
    if (userDepartmentPermissions && featureCode) {
      let result = false;
      result = userDepartmentPermissions.permissions?.find(p => p.code === featureCode)?.canEdit;
      return result;
    }
  }, [userDepartmentPermissions]);
  
  useEffect(() => {
    const FeatureCodeInstallation = "wc.inst";
    const FeatureCodeProduction = "wc.prod";
    const FeatureCodeService = "wc.serv";

    let deptCode = null;

    const isASubFeature = (val) => {
      return val?.split('.').length === 3;
    }

    if (department) {
      if (department.key === Production) {
        deptCode = FeatureCodeProduction;
      } else if (department.key === Installation) {
        deptCode = FeatureCodeInstallation;
      } else if (department.key === Service) {
        deptCode = FeatureCodeService;
      }
    }

    if (deptCode) {
      let deptId = userPermissions.find(p => p.applicationFeatureCode === deptCode)?.applicationFeatureId;

      if (deptId) {
        let userDeptPermissions = userPermissions.filter(p => p.parentFeatureId === deptId)?.map(p => {
          return ({
            code: p.applicationFeatureCode,
            name: p.name,
            sequence: p.displaySeqNum,
            canAdd: p.canAdd,
            canDelete: p.canDelete,
            canEdit: p.canEdit,
            canView: p.canView
          });
        });

        // Filter out non-sub features (code w less than 2 '.') and sort by sequence number
        const sortedSubFeaturePermissions = userDeptPermissions?.sort((a, b) => a.sequence - b.sequence)?.filter(p => isASubFeature(p.code));

        setUserDepartmentPermissions({ department: department.key, permissions: [...sortedSubFeaturePermissions] });
      }
    }
  }, [department, userPermissions, departmentPermissions]);

  const getUserDepartmentPermissions = useCallback(() => {
    return userDepartmentPermissions;
  }, [userDepartmentPermissions]);

  return {
    getUserHasFeatureEditByName,
    getUserDepartmentPermissions,
    getUserHasFeatureEditByCode
  }
}

export default usePermission;
