"use client";
import React from "react";
import { Popover } from "antd";

import Tooltip from "app/components/atoms/tooltip/tooltip";
import EventLabelValue from "app/components/organisms/events/eventLabelValue";

import {
  HomeDepotIcon,
  FinancingIcon,
  WoodDropOffIcon,
  AsbestosIcon,
  LeadPaintIcon,
  HighRiskIcon,
  ExteriorDoorsShippedIcon,
  ExteriorDoorsNotShippedIcon,
  PatioDoorShippedIcon,
  PatioDoorNotShippedIcon,
  WindowShippedIcon,
  WindowNotShippedIcon,  
  PowerDisconnectedIcon,
  AbatementIcon
} from "app/utils/icons";

import EmailIcon from '@mui/icons-material/LocalPostOfficeOutlined';
import SmsIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import QueueIcon from '@mui/icons-material/MoveDownOutlined';

import { capitalizeEachWord } from "app/utils/utils";

export default function RemeasureEvent(props, cookies, markedWorkOrderId) {
  const {
    event,
    style,
    textStyle,
    className,
    isWONFirst
  } = props;

  let _event = event?._def || event; // event?._def - FullCalendar, event - transferlist props;
  let ep = { ..._event?.extendedProps };

  const tooltip = `${event?.title}, ${ep?.lastName}, ${ep?.city}, Difficulty: ${ep.jobDifficulty}, Installers: ${ep.installerCount}, Days: ${Math.round(ep?.days === 0 ? 1 : (ep.days + 1))}, W:${0} PD:${0} ED:${0}`;

  const getOptionsStyle = (cookies) => {
    let optionsStyle = {
      overflow: "hidden",
      textOverflow: "ellipsis",
    }

    if (cookies?.options?.expandEvents) {
      optionsStyle = {
        overflowWrap: "anywhere",
        whiteSpace: "break-spaces",
      }
    }

    return optionsStyle;
  }

  const IconContainer = (props) => {
    
    return (
      <span>
        {ep.isInQueue &&          
          <Tooltip title="Messages in Queue">
            <QueueIcon className="text-gray-600 ml-[2px]" style={{fontSize: "0.8rem"}} />
          </Tooltip>
        }

        {ep.isTextSent &&
          <Tooltip title="SMS Sent">
            <SmsIcon className="text-gray-600 ml-[2px] mr-[2px]" style={{ fontSize: "0.8rem" }} />
          </Tooltip>
        }

        {ep.isEmailSent &&
          <Tooltip title="Email Sent">
            <EmailIcon className="text-gray-600 ml-[2px] mr-[2px]" style={{ fontSize: "0.8rem" }} />
          </Tooltip>
        }

        <Tooltip title={`Number of installers: ${ep?.installerCount}`} className="mr-[4px]">
          {ep?.installerCount && ep?.installerCount > -1 &&
            <span className="ml-[3px] pl-[3px] align-middle rounded-full bg-[#6b7280]">
              <i className={`fa-solid fa-${ep.installerCount} text-[#FFF] fa-sm mr-[3px]`} />
            </span>
          }
        </Tooltip>

        {ep.windows > 0 && !ep.areAllWindowsShipped && // Window Not Shipped
          <Tooltip title={`Windows: ${ep.windows} (Not yet shipped)`}>
            <WindowNotShippedIcon className="mr-[4px]" />
          </Tooltip>
        }

        {ep.windows > 0 && ep.areAllWindowsShipped && // Window Shipped
          <Tooltip title={`Windows: ${ep.windows} (Shipped)`}>
            <WindowShippedIcon className="mr-[4px]" />
          </Tooltip>
        }

        {ep.doors > 0 && !ep.areAllPatioDoorsShipped &&// Patio Door Not Shipped
          <Tooltip title={`Patio Doors: ${ep.doors} (Not yet shipped)`}>
            <PatioDoorShippedIcon className="mr-[4px]" />
          </Tooltip>
        }

        {ep.doors > 0 && ep.areAllPatioDoorsShipped && // Patio Door Shipped
          <Tooltip title={`Patio Doors: ${ep.doors} (Shipped)`}>
            <PatioDoorNotShippedIcon className="mr-[4px]" />
          </Tooltip>
        }

        {ep.extDoors > 0 && !ep.areAllExteriorDoorsShipped &&// Exterior Door Not Shipped
          <Tooltip title={`Exterior Doors: ${ep.extDoors} (Not yet shipped)`}>
            <ExteriorDoorsNotShippedIcon className="mt-[-1px] mr-[2px]" />
          </Tooltip>
        }

        {ep.extDoors > 0 && ep.areAllExteriorDoorsShipped && // Exterior Door Shipped
          <Tooltip title={`Exterior Doors: ${ep.extDoors} (Shipped)`}>
            <ExteriorDoorsShippedIcon className="mt-[-1px] mr-[2px]"/>
          </Tooltip>
        }

        {ep.highRisk > 0 &&
          <HighRiskIcon className="mt-[-1px] mr-[4px]"/>
        }

        {ep.powerDisconnect === "Yes" &&
          <PowerDisconnectedIcon className="mr-[4px]" />
        }

        {ep.homeDepotJob === "Yes" &&
          <Tooltip title="Home Depot">
            <span className="ml-[3px] mr-[2px] bg-white"><HomeDepotIcon /></span>
          </Tooltip>
        }

        {ep.asbestos > 0 &&
          <AsbestosIcon className="mr-[4px]"/>
        }

        {ep.leadPaint === "Yes" &&
          <LeadPaintIcon className="mr-[4px]" />
        }

        {ep.financing === "Yes" &&
          <FinancingIcon className="mr-[4px]" />
        }

        {ep.abatement === "Yes" && ep.asbestos > 0 &&
          <AbatementIcon className="mr-[4px]" />
        }

        {ep.woodDropOff > 0 &&
          <WoodDropOffIcon className="mr-[4px]" />
        }
      </span>
    );
  }

  const eventPopoverContent =
    (
      <div>
        <div className="text-md flex flex-row justify-between min-w-[15rem] text-xs">
          <span className="font-bold pt-1">{`${event.title}`}
            <div className="inline-block ml-1">
              <Tooltip title="Copy to Clipboard">
                <i
                  className="fa-solid fa-copy text-gray-400 hover:text-blue-400 hover:cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(event.title)}
                />
              </Tooltip>
            </div>
          </span>
          <div style={{ backgroundColor: event.backgroundColor }} className="p-1 rounded-sm mb-1">{ep.state}
          </div>
        </div>
        <div className="mt-2 text-xs font-bold text-blue-500">
          {ep?.lastName && <span className="">{`${ep.lastName}`}</span>}

          {ep?.city && <span className="" style={{ ...textStyle }}>{` (${capitalizeEachWord(ep.city)})`}</span>}
        </div>
        <div style={{ borderTop: "1px dotted lightgrey" }} className="pt-1 mt-1">
          {ep?.jobDifficulty &&
            <div>
              <span className="ml-[3px] pl-[4px] pr-[5px] pb-[2px] align-middle rounded-sm bg-[#000] text-[#FFF] font-bold">
                {ep.jobDifficulty}
              </span>
              <span className="pl-3 text-xs">Job Difficulty</span>
            </div>
          }

          {ep?.installerCount && ep?.installerCount > -1 &&
            <div>
              <span className="ml-[3px] pl-[5px] pr-[5px] align-middle rounded-full bg-[#6b7280]">
                <i className={`fa-solid fa-${ep.installerCount} text-[#FFF] fa-sm`} />
              </span>
              <span className="pl-2 text-xs">Number of Installers</span>
            </div>
          }

          {ep?.windows > 0 && !ep.areAllWindowsShipped && <div><WindowNotShippedIcon className="pl-1" style={{ width: "22px" }} /><EventLabelValue className="pl-1" label={"Unshipped Windows"} value={`${ep?.windows}`} /></div>}
          {ep?.windows > 0 && ep.areAllWindowsShipped && <div><WindowShippedIcon className="pl-1" style={{ width: "20px" }} /><EventLabelValue className="pl-1" label={"Shipped Windows"} value={`${ep?.windows}`} /></div>}

          {ep?.doors > 0 && !ep.areAllPatioDoorsShipped && <div><PatioDoorNotShippedIcon className="pl-1" style={{ width: "20px" }} /><EventLabelValue className="pl-1" label={"Unshipped Doors"} value={`${ep?.doors}`} /></div>}
          {ep?.doors > 0 && ep.areAllPatioDoorsShipped && <div><PatioDoorShippedIcon className="pl-1" style={{ width: "20px" }} /><EventLabelValue className="pl-1" label={"Shipped Doors"} value={`${ep?.doors}`} /></div>}

          {ep?.extDoors > 0 && !ep.areAllExteriorDoorsShipped && <div><ExteriorDoorsNotShippedIcon className="pl-1" style={{ width: "20px" }} /><EventLabelValue className="pl-1" label={"Unshipped Exterior Doors"} value={`${ep?.extDoors}`} /></div>}
          {ep?.extDoors > 0 && ep.areAllExteriorDoorsShipped && <div><ExteriorDoorsShippedIcon className="pl-1" style={{ width: "20px" }} /><EventLabelValue className="pl-1" label={"Shipped Exterior Doors"} value={`${ep?.extDoors}`} /></div>}

          {ep?.highRisk > 0 && <div className="pl-1"><HighRiskIcon style={{ width: "20px" }} /><span className="pl-2 text-xs">High Risk Job</span></div>}
          {ep?.powerDisconnect === "Yes" && <div className="pl-1"><PowerDisconnectedIcon style={{ width: "20px" }} /><span className="pl-2 text-xs">Power Disconnected</span></div>}
          {ep?.homeDepotJob === "Yes" && <div className="pl-1"><HomeDepotIcon style={{ width: "18px" }} /><span className="pl-2 text-xs">Home Depot Job</span></div>}
          {ep?.asbestos > 0 && <div className="pl-1"><AsbestosIcon style={{ width: "18px" }} /><span className="pl-2 text-xs">Asbestos present</span></div>}
          {ep?.abatement === "Yes" && <div className="pl-1"><AbatementIcon style={{ width: "18px" }} /><span className="pl-2 text-xs">Asbestos abatement</span></div>}
          {ep?.leadPaint === "Yes" && <div className="pl-1"><LeadPaintIcon style={{ width: "18px" }} /><span className="pl-2 text-xs">Lead Paint present</span></div>}
          {ep?.financing === "Yes" && <div className="pl-1"><FinancingIcon style={{ width: "18px" }} /><span className="pl-2 text-xs">Financing</span></div>}
          {ep?.woodDropOff > 0 && <div className="pl-1"><WoodDropOffIcon style={{ width: "18px" }} /><span className="pl-2 text-xs">Wood Drop-Off</span></div>}

          <div className="pl-7"><EventLabelValue label={"Branch"} value={ep.branch} /></div>
        </div>
      </div>
    )

  return (
    <div
      data-html="true"
      style={{ ...style, ...getOptionsStyle(cookies) }}
      won={event.title || _event.title}
      className={`${className} hover:cursor-pointer`}
    >
      {ep.icons && !isWONFirst &&
        <span>
          {markedWorkOrderId && markedWorkOrderId === event?.title && <i className="fa-solid fa-circle-arrow-right pl-1 pr-1 text-red-600 fa-beat" style={{ "--fa-beat-scale": "2.0" }}></i>}
          <IconContainer icons={ep.icons} />
        </span>
      }

      <Popover
        content={eventPopoverContent}
        title=""
        className={`${className} hover:cursor-pointer hover:text-blue-500`}
        placement="top"
      >
        <span className="pl-1 pr-1 font-semibold">{event.title || _event.title}</span>
      </Popover>

      {ep.icons && isWONFirst &&
        <span>
          <IconContainer icons={ep.icons} />
        </span>
      }

      <span>
        {ep?.lastName && <span className="align-middle">{`${ep.lastName}`}</span>}

        {ep?.city && <span className="align-middle" style={{ ...textStyle }}>{` (${capitalizeEachWord(ep.city)})`}</span>}
      </span>
    </div>
  )
}