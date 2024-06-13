"use client";
import styles from "./workorderComponents.module.css";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Tooltip from "app/components/atoms/tooltip/tooltip";
import Title from "app/components/atoms/title/title";
import WOStatus from "app/components/organisms/woStatus/woStatus";

import { mapProductionStateToKey, getKeyFromVal } from "app/utils/utils";
import {
  ProductionStates,
  InstallationStates,
  Production,
  Installation,
  Remeasure, Shipping
} from "app/utils/constants";

import {
  updateProdOrder,
} from 'app/api/productionApis';

import { Popover, Input, Button, Space, Form } from "antd";

export default function WOInfoBar(props) {
  const {
    data,
    statusKey,
    setStatusKey,    
    handleStatusOk,
    updateStatus,
    type,
    titleColor,
    titleBackgroundColor,
    canEdit
  } = props;

  const { isMobile } = useSelector(state => state.app);

  const { department, subDepartment } = useSelector(state => state.calendar);

  const [statusList, setStatusList] = useState(ProductionStates);
  const [showSiteContact, setShowSiteContact] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (data && setStatusKey && department) {
      if (data.currentStateName) {
        switch (department.key) {
          case Production:
            setStatusKey(mapProductionStateToKey(data.currentStateName)); // Special function needed due to inconsistent state data
            break;
          case Installation:            
            setStatusKey(getKeyFromVal(InstallationStates, data.currentStateName));
            setStatusList(InstallationStates);
            break;
          case Shipping:
            setStatusKey(mapProductionStateToKey(data.currentStateName));            
            break;
          default:
            break;
        }        
      }
    }
  }, [data, setStatusKey, department]);

  const onFinish = useCallback((values) => {
    if (values) {
      
      let updateData = {
        actionItemId: data?.actionItemId,
        siteContact: values?.siteContact,
        siteContactPhoneNumber: values?.siteContactPhoneNumber,
        siteContactEmail: values?.siteContactEmail
      };

      updateProdOrder(updateData);

      setShowSiteContact(false);
    }
  }, [data]);

  const getIconName = useCallback(() => {
    let result = "fa-clipboard";

    switch (department?.key) {
      case Production:
        result = "fa-bars-progress"
        break;
      case Installation:
        result = "fa-screwdriver"
        if (subDepartment?.key === Remeasure) {
          result = "fa-ruler-combined"
        }        
        break;
      case Shipping:
        result = "fa-truck-fast"
        if (subDepartment?.key === Remeasure) {
          result = "fa-ruler-combined"
        }
        break;
      default:
        break;
    }

    return result;

  }, [department, subDepartment]);

  const siteContactContent = (
    <Form
      labelCol={{ span: 4 }}
      form={form}
      onFinish={onFinish}
      onFinishFailed={(values) => {  }}
      initialValues={{ siteContact: data?.siteContact, siteContactPhoneNumber: data?.siteContactPhoneNumber, siteContactEmail: data?.siteContactEmail }}
    >
      <Title
        label={"Edit Site Contact"}
        className="inline-block mr-4 pt-1 pb-1 mb-2 pr-2"
      />
      <div className="flex flex-row justify-between pt-2 w-[18rem]">
        <Form.Item
          label="Name"
          name="siteContact"
          style={{ marginBottom: 0 }}
        >
          <Input prefix={<Tooltip title="Copy to Clipboard">
            <i
              className="fa-solid fa-copy text-gray-400 hover:text-blue-400 hover:cursor-pointer text-xs"
              onClick={() => navigator.clipboard.writeText(form.getFieldValue('siteContact'))}
            />
          </Tooltip>} placeholder="Empty" size="small" className="w-[15rem]" />
        </Form.Item>                 
      </div>
      <div className="flex flex-row justify-between w-[18rem]">
        <Form.Item
          label="Phone"
          name="siteContactPhoneNumber"
          style={{ marginBottom: 0 }}
        >
          <Input prefix={<Tooltip title="Copy to Clipboard">
            <i
              className="fa-solid fa-copy text-gray-400 hover:text-blue-400 hover:cursor-pointer text-xs"
              onClick={() => navigator.clipboard.writeText(form.getFieldValue('siteContactPhoneNumber'))}
            />
          </Tooltip>} placeholder="Empty" size="small" className="w-[15rem]" />
        </Form.Item>
        
      </div>
      <div className="flex flex-row justify-between w-[18rem]">
        <Form.Item
          label="Email"
          name="siteContactEmail"
          style={{ marginBottom: 0 }}
        >
          <Input prefix={<Tooltip title="Copy to Clipboard">
            <i
              className="fa-solid fa-copy text-gray-400 hover:text-blue-400 hover:cursor-pointer text-xs"
              onClick={() => navigator.clipboard.writeText(form.getFieldValue('siteContactEmail'))}
            />
          </Tooltip> } placeholder="Empty" size="small" className="w-[15rem]"/>
        </Form.Item>        
      </div>
      <div className="flex flex-row justify-end pt-3">
        <div className="flex flex-row">
          <Space>
            <Button size="small" onClick={() => setShowSiteContact(false)}>Cancel</Button>
            <Button
              size="small"
              key="submit"
              type="primary"
              htmlType="submit"
              disabled={!canEdit}
            >
              Save
            </Button>
          </Space>
        </div>
      </div>      
    </Form>
  )

  return (
    <div className="flex flex-col flex-start pb-2 mr-8 lg:flex-row">
      <div>
        <Title
          label={""}
          className="inline-block mr-4 pt-1 pb-1"
          Icon={() => {
            return <i className={`fa-solid ${getIconName()} pr-2 text-xs`}
            />
          }}
          color={titleColor}
          backgroundColor={titleBackgroundColor}
        >
          <span>Work Order #</span>
          <span className="font-semibold pl-2 pr-2">{data?.workOrderNumber}</span>
        </Title>
        {statusKey &&
          <WOStatus
            statusKey={statusKey}
            setStatusKeyCallback={setStatusKey}
            handleStatusOkCallback={handleStatusOk}
            updateStatusCallback={updateStatus}
            handleStatusCancelCallback={() => { }}
            statusList={statusList}
            canEdit={canEdit}
          />
        }
        {false &&
          <span className="pl-2 pt-1 cursor-pointer text-blue-800 hover:text-blue-500">
            <Tooltip title="Communication History">
              <i className="bi bi-chat-left-text mr-2"></i>
            </Tooltip>
          </span>
        }
      </div>

      {type === Production &&
        <div className={`${styles.siteContactContainer} lg:pl-4 lg:pt-1 text-sm pt-[5px]`}>
          <div className={`${styles.customerInfoIcon} pr-1 flex flex-row`} style={{ paddingTop: "3px" }}>
            <span className="text-stone-400">|</span>
            <Tooltip title="Site contact" className="mt-[-1px]">
              <i className="fa-solid fa-s pl-1 text-xs"></i>
              <i className="fa-solid fa-c text-xs"></i>:
            </Tooltip>
            {data?.siteContact ?
              <div className="pl-1 pr-1 text-black">{data?.siteContact}</div>
              :
              <div className="pl-1 pr-1 text-gray-400">{`<Empty>`}</div>
            }
            {data?.siteContactPhoneNumber && 
              <>
                <Tooltip title="Site contact phone number" className="mt-[-1px]">
                  <i className="fa-solid fa-phone pl-2 text-xs"></i>
                </Tooltip>
                {data.siteContactPhoneNumber ?
                <div className="pl-1 pr-1 text-black"><a href={`tel:${data.workPhoneNumber}`}>{data?.siteContactPhoneNumber}</a></div>
                  :
                  <div className="pl-1 pr-1 text-gray-400">{`<Empty>`}</div>
                }
              </>
            }
            {data?.siteContactEmail && 
              <>
                <Tooltip title="Site contact email" className="mt-[-1px]">
                  <i className="fa-solid fa-at pl-2 text-xs"></i>
                </Tooltip>
                {data.siteContactEmail ? 
                <div className="pl-1 pr-1 text-black"><a href={`mailto:${data.email}`} className="inline">{data?.siteContactEmail}</a></div>
                  :
                  <div className="pl-1 pr-1 text-gray-400">{`<Empty>`}</div>
                }
              </>
            }
            <span className="text-stone-400">|</span>
              <Tooltip title="Edit site contact info">
              <Popover title="" open={showSiteContact} content={siteContactContent} placement="bottomRight">
                  <i className="fa-solid fa-pen pl-1 pt-[6px] text-blue-500 hover:cursor-pointer" style={{ fontSize: "0.6rem" }} onClick={()=>setShowSiteContact(true)}></i>
                </Popover>
              </Tooltip>            
          </div>          
        </div>
      }
    </div>
  )
}