"use client";
import styles from './report.module.css';
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useQuery } from "react-query";
import moment from 'moment';
import { Production } from "app/utils/constants";
import { fetchProductionWorkOrders } from 'app/api/productionApis';
import ReportHeader from "../../../batch-update/subComponents/batchUpdateHeader";
import DayReportTable from "./dayReportTable";
import ExcelExport from "./excelExport";

import { updateDepartment } from "app/redux/calendar";

import { getDepartmentFromPathname, YMDDateFormat } from "app/utils/utils";

import { Empty } from 'antd';

export default function DailyReport(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    const pathname = usePathname();

    const searchParams = useSearchParams();    
    const departmentParam = searchParams.get('department');

    const [date, setDate] = useState(moment());
    const [cardinalItems, setCardinalItems] = useState([]);
    const [pfgItems, setPfgItems] = useState([]);
    const [centraCalgaryItems, setCentraCalgaryItems] = useState([]);
    
    const { isFetching, data: workOrders, refetch } = useQuery("workorders", () => {
        const day = moment(date).format("DD");
        const month = moment(date).format("M");
        const year = moment(date).format("YYYY");

        if (day && month && year) {            
            if (department?.key === Production) {
                return fetchProductionWorkOrders(`${year}-${month}-${day}T00:00:00`, `${year}-${month}-${day}T23:59:59`);
            } 
        }
    }, { enabled: true });

    const { department } = useSelector(state => state.calendar);

    useEffect(() => {
        if (pathname) {
            dispatch(updateDepartment(getDepartmentFromPathname(pathname)));
        }
    }, [dispatch, pathname]);

    const getProductMix = (data) => {
        let result = "";
        if (data) {
            let { windows, doors, f52PD } = data;
            
            if (windows > 0) {
                result += `W:${windows} `
            }

            if (doors > 0) {
                result += `D:${doors} `
            }

            if (f52PD > 0) {
                result += `PD:${f52PD} `
            }
        }
        
        return result;
    }

    const getConcatenatedComments = (data) => {
        let result = "";

        if (data) {
            let { doorShopNotes, officeNotes, returnTripNotes, shippingNotes } = data;

            if (doorShopNotes) {
                result += `${doorShopNotes} `;
            }

            if (officeNotes) {
                result += `${officeNotes} `;
            }

            if (returnTripNotes) {
                result += `${returnTripNotes} `;
            }

            if (shippingNotes) {
                result += `${shippingNotes} `;
            }
        }

        return result;
    }

    const generateDayReportTable = useCallback((data) => {
        if (data?.length > 0) {
            let x = data.map((d) => {
                let y = {
                    block: d.blockNo,
                    batch: d.batchNo,
                    won: d.workOrderNumber,
                    branch: d.branch,
                    prodMix: getProductMix(d),
                    f6800: parseInt(d.f68CA, 10) + parseInt(d.f68SL, 10),
                    f2900: parseInt(d.f29CA, 10) + parseInt(d.f29CM, 10),
                    f2600: parseInt(d.f6CA, 10),
                    f5200: parseInt(d.f52PD, 10),
                    f2700: parseInt(d.f27DS, 10) + parseInt(d.f27TS, 10) + parseInt(d.f27TT, 10),
                    f6100: parseInt(d.f61DR, 10),
                    shape: 0,
                    min: parseInt(d.totalLBRMin,10),
                    notes: getConcatenatedComments(d),
                    del: YMDDateFormat(d.deliveryDate)
                }
                return y;
            });

            return x;
        }
    }, []);

    useEffect(() => {
        if (workOrders?.data) {
            let _cardinal = workOrders.data.filter(x => x.glassSupplier === "Cardinal");
            let _pfg = workOrders.data.filter(x => x.glassSupplier === "PFG");
            let _centraCalgary = workOrders.data.filter(x => x.glassSupplier === "Centra Calgary");

            setCardinalItems(generateDayReportTable(_cardinal));
            setPfgItems(generateDayReportTable(_pfg));
            setCentraCalgaryItems(generateDayReportTable(_centraCalgary));
        }
    }, [workOrders, generateDayReportTable]);

    useEffect(() => {
        if (date && department) {
            refetch();
        }
    }, [date, refetch, department]);
    
    const hasData = useMemo(() => {
        let result = false;

        if (cardinalItems?.length > 0 || pfgItems?.length > 0 || centraCalgaryItems?.length > 0) {
            result = true;
        }

        return result;
    }, [cardinalItems, pfgItems, centraCalgaryItems]);
        
    return (
        <div className={styles.root}>
            <ReportHeader date={date} setDate={setDate} />
            <div className={styles.outerContainer}>
                <div className={styles.innerContainer}>
                    <div className="float-right">
                        <ExcelExport
                            data={{
                                cardinal: cardinalItems,
                                pfg: pfgItems,
                                centra: centraCalgaryItems
                            }}
                            date={date}
                        />
                    </div>

                    {hasData &&
                        <>
                            <DayReportTable title={"Cardinal"} data={cardinalItems} style={{ marginTop: "1rem" }} />
                            <DayReportTable title={"PFG"} data={pfgItems} style={{ marginTop: "1rem" }} />
                            <DayReportTable title={"Centra Calgary"} data={centraCalgaryItems} style={{ marginTop: "1rem" }} />
                        </>
                    }

                    {!hasData &&
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%"
                        }}>
                            <Empty />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}