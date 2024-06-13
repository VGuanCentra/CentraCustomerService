"use client";
import React, { useState, useEffect } from "react";

import { useQuery } from "react-query";

import CollapsibleGroup from 'app/components/atoms/workorderComponents/collapsibleGroup';
import Collapse from '@mui/material/Collapse';

import { Rate, Tag } from 'antd';

import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';

import { fetchJobReviewByWONumber } from 'app/api/installationApis';

export default function JobReview({
  style,
  viewConfig,
  showJobReview,
  className,
  handleExpandCollapseCallback,
  recordId,
  actionItemId,
  workOrderNumber
}) {
  const { isFetching,
    data: jobReviewRaw,
    refetch } = useQuery("installationJobReview", () => {
      if (workOrderNumber) {
        return fetchJobReviewByWONumber(workOrderNumber)
      }
    }, { enabled: true });

  const [jobReviews, setJobReviews] = useState(null);

  const getCustomIcon = (index, val) => {
    let icon = null;

    switch (index) {
      case 1:
        icon = <FrownOutlined className={`${val == index ? "text-red-400" : "text-gray-100"}`} />;
        break;
      case 2:
        icon = <FrownOutlined className={`${val == index ? "text-orange-400" : "text-gray-100"}`} />;
        break;
      case 3:
        icon = <MehOutlined className={`${val == index ? "text-yellow-400" : "text-gray-100"}`} />;
        break;
      case 4:
        icon = <SmileOutlined className={`${val == index ? "text-lime-400" : "text-gray-100"}`} />;
        break;
      case 5:
        icon = <SmileOutlined className={`${val == index ? "text-green-400" : "text-gray-100"}`} />;
        break;
      default:
        break;
    }
    return icon;
  }

  const generateSubTitle = (data) => {
    let result = "No reviews";
    if (data) {
      let subTitle = "";
      
      if (jobReviews?.centraQuality > 0) {
        subTitle += `Centra: ${jobReviews?.centraQuality}`;
      }

      if (jobReviews?.codelQuality > 0) {
        subTitle += ` | Codel: ${jobReviews?.codelQuality}`;
      }

      if (jobReviews?.contractQuality > 0) {
        subTitle += ` | Contract: ${jobReviews?.contractQuality}`;
      }

      if (jobReviews?.remeasureQuality > 0) {
        subTitle += ` | Remeasure: ${jobReviews?.remeasureQuality}`;
      }

      result = subTitle;  
    }  
    
    return result;
  }

  useEffect(() => {
    setJobReviews(jobReviewRaw?.data);
  }, [jobReviewRaw])

  return (
    <CollapsibleGroup
      id={"title-job-review"}
      title={`Job Reviews`}
      subTitle={`(${jobReviews?.length})`}
      expandCollapseCallback={() => handleExpandCollapseCallback("jobReview")}
      value={viewConfig?.expanded ? true : showJobReview}
      style={{ marginTop: "1rem" }}
      headerStyle={{ backgroundColor: "#DAEED2" }}
    >
      <Collapse in={viewConfig?.expanded ? true : showJobReview}>
        {jobReviews?.map((jobReview, index) => 
          <div key={`job-review-${index}`} >
          <div className="p-2 flex flex-row justify-between" >
            <div className="flex flex-row w-[40%] justify-between mr-[4rem]">
              <div className="flex flex-col justify-between">
                <div className="flex flex-row">
                  <div className="mr-4 w-[8rem]">Centra Quality:</div>
                  <Rate disabled defaultValue={jobReview?.centraQuality} character={({ index = 0 }) => getCustomIcon(index + 1, jobReview.centraQuality)} />
                </div>
                <div className="flex flex-row">
                  <div className="mr-4 w-[8rem]">Codel Quality:</div>
                  <Rate disabled defaultValue={jobReview?.codelQuality} character={({ index = 0 }) => getCustomIcon(index + 1, jobReview?.codelQuality)} />
                </div>
                <div className="flex flex-row">
                  <div className="mr-4 w-[8rem]">Contract Quality:</div>
                  <Rate disabled defaultValue={jobReview?.contractQuality} character={({ index = 0 }) => getCustomIcon(index + 1, jobReview?.contractQuality)} />
                </div>
                <div className="flex flex-row">
                  <span className="mr-4 w-[8rem]">Remeasure Quality:</span>
                  <Rate disabled defaultValue={jobReview?.remeasureQuality} character={({ index = 0 }) => getCustomIcon(index + 1, jobReview?.remeasureQuality)} />
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <span className="inline-block w-[11rem]">Windows Ready:</span>
                  <span className="pl-2 text-gray-500"><Tag color="blue">{jobReview?.windowProductReady}</Tag></span>
                </div>
                <div>
                  <span className="inline-block w-[11rem]">Codel Ready:</span>
                  <span className="pl-2 text-gray-500"><Tag color="blue">{jobReview?.codelProductReady}</Tag></span>
                </div>
                <div>
                  <span className="inline-block w-[11rem]">Install Material Missing</span>
                  <span className="pl-2 text-gray-500"><Tag color="blue">{jobReview?.installMaterialMissing}</Tag></span>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between">
            </div>
            <div className="flex flex-row w-[60%] justify-around">
              <div className="w-[58%]">
                Notes
                  {jobReview?.notes &&
                    <div className="mt-1 p-1 border-dotted border-slate-300 border-1 min-h-[3.5rem] rounded text-gray-500">{jobReview.notes}</div>
                  }
              </div>
              <div className="w-[38%]">
                What was missing?
                  {jobReview?.whatwasmissing &&
                    <div className="mt-1 p-1 border-dotted border-slate-300 border-1 min-h-[3.5rem] rounded text-gray-500">{jobReview.whatwasmissing}</div>
                  }
              </div>
            </div>            
          </div>
            {index < jobReviews?.length - 1 && <div className="border-b-[1px] w-100 mt-1 mb-1 border-dotted"></div>}
          </div>
        )}
      </Collapse>
    </CollapsibleGroup>
  )
}