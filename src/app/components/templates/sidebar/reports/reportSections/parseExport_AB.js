import {
  breakdownList,
  fragmentList,
  getSum,
  htmlEmpty,
  getUtilize,
  displayNumber,
  updateTdStyles,
  getDataBetweenDates
} from "./reportUtils";
import moment from "moment";

// NOTE: add hybrid
const parseExportData = (data, branch, startDate, endDate) => {
  // sort data by date
  data = data
    .filter((a) => a.branch === branch)
    ?.sort((a, b) => (a.reportDate > b.reportDate ? 1 : -1));

  let currWeek = [];
  let currWeekData = [];
  let allDaysData = [];
  let weekSectionsData = [];
  const weekSections = [];

  data = getDataBetweenDates(data,  startDate, endDate)

  // scan data
  data?.map((a, i) => {
    const {
      reportDate,
      dayOfWeek,
      f26CA,
      boxes,
      f29CM,
      f29CMMin,
      f61DR,
      f61DRMin,
      exteriorDoors,
      exteriorDoorsMin,
      f52PD,
      f52PDMin,
      f68,
      f68Min,
      f26HY,
      f26HYMin,
      f26CAMin,
      manufacturingFacility,
      availableManPower,
      availableStaff,
      actualManPower,
      doorAvailableManPower,
      actualDoorManPower,
      sliderStaff,
      sliderAvailableMins,
      casementStaff,
      casementAvailableMins,
      pdStaff,
      pdAvailableMins,
      edStaff,
      edAvailableMins,  
      drStaff,
      drAvailableMins,
      dailyDraftMinutes,
      dailyScheduledMinutes,
      branch,
      hY26AvailableMins,
      hY26Staff,
      isHoliday,
      isEmpty
    } = a || {};

    const isSkip = isHoliday === "Yes"
    const dayNum = (isSkip || isEmpty) ? 0 : 1;
    const c6800_1 = sliderAvailableMins;
    const c6800_2 = f68Min;
    const c6800_3 = c6800_1 - c6800_2;
    const c6800_4 = f68;
    const c6800_5 = getUtilize(c6800_2, c6800_1);

    const c2900_1 = casementAvailableMins;
    const c2900_2 = f29CMMin + f26CAMin;
    const c2900_3 = c2900_1 - c2900_2;
    const c2900_4 = f26CA;
    const c2900_5 = f29CM;
    const c2900_6 = getUtilize(c2900_2, c2900_1);

    const chybrid_1 = hY26AvailableMins
    const chybrid_2 = f26HYMin
    const chybrid_3 = chybrid_2 - chybrid_1
    const chybrid_4 = f26HY
    const chybrid_5 = getUtilize(chybrid_2, chybrid_1);

    const c5200_1 = pdAvailableMins;
    const c5200_2 = f52PDMin;
    const c5200_3 = c5200_1 - c5200_2;
    const c5200_4 = f52PD;
    const c5200_5 = getUtilize(c5200_2, c5200_1);

    // const c6100_1 = drAvailableMins;
    // const c6100_2 = f61DRMin;
    // const c6100_3 = c6100_1 - c6100_2;
    // const c6100_4 = f61DR;
    // const c6100_5 = getUtilize(c6100_2, c6100_1);

    const cExteriorDoors_1 = edAvailableMins
    const cExteriorDoors_2 = exteriorDoorsMin;
    const cExteriorDoors_3 = cExteriorDoors_1 - cExteriorDoors_2;
    const cExteriorDoors_4 = exteriorDoors;
    const cExteriorDoors_5 = getUtilize(cExteriorDoors_2, cExteriorDoors_1);

    // sum of
    const sum_1 = availableManPower;
    const sum_2 = c6800_2 + c2900_2 + c5200_2 + cExteriorDoors_2;
    const sum_3 = sum_1 - sum_2;
    const sum_4 = boxes;
    const sum_5 = getUtilize(sum_2, sum_1);

    const cLogi_1 = dailyScheduledMinutes;
    const cLogi_2 = dailyDraftMinutes;
    const cLogi_3 = getUtilize(cLogi_1, sum_2);

    const d = {
      c6800_1,
      c6800_2,
      c6800_3,
      c6800_4,
      c6800_5,
      c2900_1,
      c2900_2,
      c2900_3,
      c2900_4,
      c2900_5,
      c2900_6,
      chybrid_1,
      chybrid_2,
      chybrid_3,
      chybrid_4,
      chybrid_5,      
      c5200_1,
      c5200_2,
      c5200_3,
      c5200_4,
      c5200_5,
      cExteriorDoors_1,
      cExteriorDoors_2,
      cExteriorDoors_3,
      cExteriorDoors_4,
      cExteriorDoors_5,
      sum_1,
      sum_2,
      sum_3,
      sum_4,
      sum_5,
      cLogi_1,
      cLogi_2,
      cLogi_3,
      dayNum,
      isSkip
    };
    currWeekData.push({ ...a, ...d });
    if (isSkip || isEmpty) {
      currWeek.push(
        `
        <tr><td colspan="34" style="background: #E0E0E0; border-bottom:1px solid black;border-right:1px solid black;">holiday</td></tr>
        `
      )
    } else {
      currWeek.push(htmlTr({ ...a, ...d }));
    }
    allDaysData.push({ ...a, ...d });

    console.log(a)

    const currentDate = reportDate;
    const nextDate = data[i + 1]?.reportDate;
    const isLastDayOfWeek =
      !nextDate || moment(nextDate).week() > moment(currentDate).week();

    if (isLastDayOfWeek) {
      const firstDayOfWeek = currWeekData[0]?.reportDate;
      const currentDate = moment(firstDayOfWeek).format("MMM DD");
      const toDate = moment(reportDate).format("MMM DD");
      const weekOfYear = moment(firstDayOfWeek).week();

      const total = getSum(currWeekData);

      // push header
      currWeek.unshift(`
          <tr>
            <th style="border-top:1px solid black; border-bottom:1px solid black; border-right:1px solid black">${currentDate} - ${toDate}</th>
            <th colspan="2" style="border-top:1px solid black; border-bottom:1px solid black">#${weekOfYear} week</th>
            <th colspan="2" style="border-top:1px solid black; border-bottom:1px solid black">Staff count</th>
            <th style="border-top:1px solid black; border-bottom:1px solid black; border-right:1px solid black">${availableStaff}</th>
            <th colspan="5" style="border-top:1px solid black; border-bottom:1px solid black; border-right:1px solid black">6800 SERIES SLIDERS</th>
            <th colspan="6" style="border-top:1px solid black; border-bottom:1px solid black; border-right:1px solid black">2900/2600 CASEMENTS/AWNING</th>
            <th colspan="5" style="border-top:1px solid black; border-bottom:1px solid black; border-right:1px solid black">Hybrid CASEMENTS</th>
            <th colspan="5" style="border-top:1px solid black; border-bottom:1px solid black; border-right:1px solid black">5200 DOORS</th>
            <th colspan="5" style="border-top:1px solid black; border-bottom:1px solid black; border-right:1px solid black">EXTERIOR DOORS</th>
            <th colspan="3" style="border-top:1px solid black; border-bottom:1px solid black; border-right:1px solid black">LOGISTICS KPI'S</th>
          </tr>
          <tr>
            <td style="border-right:1px solid black; border-bottom:1px solid black">Day</td>
            <td style="border-bottom:1px solid black"># Available</td>
            <td style="border-bottom:1px solid black"># Utilized</td>
            <td style="border-bottom:1px solid black">Variance (+/-)</td>
            <td style="border-bottom:1px solid black">Total Box Count</td>
            <td style="border-bottom:1px solid black;border-right:1px solid black">% Utilized</td>
            <td style="border-bottom:1px solid black">Mins. Target</td>
            <td style="border-bottom:1px solid black">Mins. Utilized</td>
            <td style="border-bottom:1px solid black">Variance (+/-)</td>
            <td style="border-bottom:1px solid black">6800 Units</td>
            <td style="border-bottom:1px solid black;border-right:1px solid black">% Utilized</td>
            <td style="border-bottom:1px solid black">Mins. Target</td>
            <td style="border-bottom:1px solid black">Mins. Utilized</td>
            <td style="border-bottom:1px solid black">Variance (+/-)</td>
            <td style="border-bottom:1px solid black">2600 Units</td>
            <td style="border-bottom:1px solid black">2900 Units</td>
            <td style="border-bottom:1px solid black;border-right:1px solid black">% Utilized</td>

            <td style="border-bottom:1px solid black">Mins. Target</td>
            <td style="border-bottom:1px solid black">Mins. Utilized</td>
            <td style="border-bottom:1px solid black">Variance (+/-)</td>
            <td style="border-bottom:1px solid black">Hybrid Units</td>
            <td style="border-bottom:1px solid black;border-right:1px solid black">% Utilized</td>         
            
            <td style="border-bottom:1px solid black">Mins. Target</td>
            <td style="border-bottom:1px solid black">Mins. Utilized</td>
            <td style="border-bottom:1px solid black">Variance (+/-)</td>
            <td style="border-bottom:1px solid black">5200 Units</td>
            <td style="border-bottom:1px solid black;border-right:1px solid black">% Utilized</td>
            <td style="border-bottom:1px solid black">Mins. Target</td>
            <td style="border-bottom:1px solid black">Mins. Utilized</td>
            <td style="border-bottom:1px solid black">Variance (+/-)</td>
            <td style="border-bottom:1px solid black">Exterior Doors</td>
            <td style="border-bottom:1px solid black; border-right:1px solid black">% Utilized</td>
            <td style="border-bottom:1px solid black">Scheduled Minutes</td>
            <td style="border-bottom:1px solid black">Draft Minutes</td>
            <td style="border-bottom:1px solid black; border-right:1px solid black">% Scheduled</td>
          </tr>        
          `);

      const firstRow = currWeekData.find(a => !a.isSkip)
      const sumHeaderForStuff = `
              <tr>
                <th colspan="6" style="border-bottom:1px solid black"> </th>
                <th colspan="5" style="border-bottom:1px solid black">${
                  firstRow?.sliderStaff
                } STAFF</th>
                <th colspan="6" style="border-bottom:1px solid black">${
                  firstRow?.casementStaff
                } STAFF</th>
                <th colspan="5" style="border-bottom:1px solid black">${
                  firstRow?.hY26Staff
                } STAFF</th>                
                <th colspan="10" style="border-bottom:1px solid black">${
                  firstRow?.pdStaff + firstRow?.drStaff + firstRow?.edStaff
                } STAFF</th>
                <th colspan="3"> </td>
              </tr>
            `;

      currWeek.unshift(sumHeaderForStuff);

  
      currWeek.push(
        htmlTr(
          {
            ...total,
            dayOfWeek: "Week Totals",
            style: "font-weight:bold;",
          },
          [],
          true
        )
      );


      currWeek.push(`
           <tr>
            <th style="border-top:1px solid black;">Previous Week</th>
            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;">??</th>
            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;">??</th>
            <th style="border-top:1px solid black;">??%</th>

            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;">??</th>
            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;">??</th>
            <th style="border-top:1px solid black;">??%</th>

            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;">??</th>
            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;">??%</th>

            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;">??</th>
            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;">??</th>
            <th style="border-top:1px solid black;">??%</th>

            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;">??</th>
            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;">??</th>
            <th style="border-top:1px solid black;">??%</th>

            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;">??</th>
            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;">??</th>
            <th style="border-top:1px solid black;">??</th>

            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;"></th>
            <th style="border-top:1px solid black;">??%</th>
          </tr>
        `);

      if (currWeek?.length > 0) {
        weekSections.push(currWeek);
        weekSectionsData.push(total);
      }

      currWeek = [];
      currWeekData = [];
    }

    // currWeek.push()
  });

  // totals for all:
  const targetMinPerDay = 0;
  const totalObj = {
    targetMin_total: 0,
  };
  weekSectionsData?.map((d) => {
    const { sum_1 } = d;
    totalObj.targetMin_total += sum_1 || 0;
  });

  // headers:
  const sumHeaderForMin = `
      <tr>
        <td>Target Minutes Per Day</td>
        <td>${Math.ceil(totalObj.targetMin_total / weekSectionsData.length)}</td>
      </tr>
    `;

  // weeks data
  let sumWeek = "";

  // 4, 8, 12, ... weeks

  const outllookList = breakdownList(weekSectionsData) || [];

  for (let i = 0; i < outllookList.length; i++) {
    const _list = outllookList[i];
    sumWeek += htmlWeekTotal(_list?.items, branch);
  }

  const totalForAll = getSum(weekSectionsData);
  const sumBldgB = htmlBldgB(totalForAll, weekSectionsData?.length);

  const sumUnitsPerDay = htmlUnitsPerDay(weekSectionsData);

  // combine the table
  const tb = `<table style="width:100%">
        <tbody>
        ${sumHeaderForMin}
        ${weekSections
          ?.map((weekRows) => weekRows.join(""))
          .join(
            '<tr><td colspan="35"></td></tr><tr><td colspan="35"></td></tr>'
          )}
  
        <tr><td></td><tr>
        <tr><td></td><tr>
        </tbody>
        ${sumWeek}
        ${sumBldgB}
        ${sumUnitsPerDay}
      </table>`;

  return tb;
};

const htmlTr = (d, newStyles = [], showTotalColor = false) => {
  const {
    c6800_1,
    c6800_2,
    c6800_3,
    c6800_4,
    c6800_5,
    c2900_1,
    c2900_2,
    c2900_3,
    c2900_4,
    c2900_5,
    c2900_6,
    chybrid_1,
    chybrid_2,
    chybrid_3,
    chybrid_4,
    chybrid_5,

    c5200_1,
    c5200_2,
    c5200_3,
    c5200_4,
    c5200_5,
    cExteriorDoors_1,
    cExteriorDoors_2,
    cExteriorDoors_3,
    cExteriorDoors_4,
    cExteriorDoors_5,
    sum_1,
    sum_2,
    sum_3,
    sum_4,
    sum_5,
    cLogi_1,
    cLogi_2,
    cLogi_3,
    dayOfWeek,
    style = "",
  } = d;

  const bg = (num) => {
    if (!showTotalColor) {
      return "";
    }
    if (Math.abs(100 - num) >= 30) {
      return "background-color:red;";
    } else if (Math.abs(100 - num) >= 10) {
      return "background-color:yellow;";
    } else {
      return "background-color:#9aff64;";
    }
  };

  let htmlString = `
        <tr>
          <td style="border-right:1px solid black;${style}">${dayOfWeek}</td>
          <td style="${style}">${sum_1}</td>
          <td style="${style}">${sum_2}</td>
          <td style="${style}">${sum_3}</td>
          <td style="${style}">${sum_4}</td>
          <td style="border-right:1px solid black;${bg(
            sum_5
          )}${style}">${sum_5}%</td>
          <td style="${style}">${c6800_1}</td>
          <td style="${style}">${c6800_2}</td>
          <td style="${style}">${c6800_3}</td>
          <td style="${style}">${c6800_4}</td>
          <td style="border-right:1px solid black;${bg(
            c6800_5
          )}${style}">${c6800_5}%</td>
          <td style="${style}">${c2900_1}</td>
          <td style="${style}">${c2900_2}</td>
          <td style="${style}">${c2900_3}</td>
          <td style="${style}">${c2900_4}</td>
          <td style="${style}">${c2900_5}</td>
          <td style="border-right:1px solid black;${bg(
            c2900_6
          )}${style}">${c2900_6}%</td>

          <td style="${style}">${chybrid_1}</td>
          <td style="${style}">${chybrid_2}</td>
          <td style="${style}">${chybrid_3}</td>
          <td style="${style}">${chybrid_4}</td>
          <td style="border-right:1px solid black;${bg(
            chybrid_5
          )}${style}">${chybrid_5}%</td>

          <td style="${style}">${c5200_1}</td>
          <td style="${style}">${c5200_2}</td>
          <td style="${style}">${c5200_3}</td>
          <td style="${style}">${c5200_4}</td>
          <td style="border-right:1px solid black;${bg(
            c5200_5
          )}${style}">${c5200_5}%</td>
          <td style="${style}">${cExteriorDoors_1}</td>
          <td style="${style}">${cExteriorDoors_2}</td>
          <td style="${style}">${cExteriorDoors_3}</td>
          <td style="${style}">${cExteriorDoors_4}</td>
          <td style="border-right:1px solid black;${bg(
            cExteriorDoors_5
          )}${style}">${cExteriorDoors_5}%</td>
          <td style="${style}">${cLogi_1}</td>
          <td style="${style}">${cLogi_2}</td>
          <td style="border-right:1px solid black;${bg(
            cLogi_3
          )}${style}">${cLogi_3}%</td>
        </tr>
      `;

  if (newStyles?.length > 0) {
    htmlString = updateTdStyles(htmlString, newStyles);
  }

  return htmlString;
};

const htmlWeekTotal = (list, branch) => {
  const styles = [
    "background-color: yellow;",
    "background-color: #f2f5ff;",
    "background-color: #f2f5ff;",
    "background-color: #f2f5ff;",
    "background-color: #f2f5ff;",
    "background-color: #f2f5ff;",

    "background-color: #ffebeb;",
    "background-color: #ffebeb;",
    "background-color: #ffebeb;",
    "background-color: #ffebeb;",
    "background-color: #ffebeb;",

    "background-color: #f9ffeb;",
    "background-color: #f9ffeb;",
    "background-color: #f9ffeb;",
    "background-color: #f9ffeb;",
    "background-color: #f9ffeb;",
    "background-color: #f9ffeb;",

    "background-color: #f9ffa0;",
    "background-color: #f9ffa0;",
    "background-color: #f9ffa0;",
    "background-color: #f9ffa0;",
    "background-color: #f9ffa0;",

    "background-color: #ffe055;",
    "background-color: #ffe055;",
    "background-color: #ffe055;",
    "background-color: #ffe055;",
    "background-color: #ffe055;",

    "background-color: #a7c9d9;",
    "background-color: #a7c9d9;",
    "background-color: #a7c9d9;",
    "background-color: #a7c9d9;",
    "background-color: #a7c9d9;",
  ];

  let htmlStr = `
      <tr>
        <td style="color:white;border-right:1px solid black; border-bottom:1px solid black; background-color:black">${branch}</td>
        <td style="border-bottom:1px solid black"># Available</td>
        <td style="border-bottom:1px solid black"># Utilized</td>
        <td style="border-bottom:1px solid black">Variance (+/-)</td>
        <td style="border-bottom:1px solid black">Total Box Count</td>
        <td style="border-bottom:1px solid black;border-right:1px solid black">% Utilized</td>
        <td style="border-bottom:1px solid black">Mins. Target</td>
        <td style="border-bottom:1px solid black">Mins. Utilized</td>
        <td style="border-bottom:1px solid black">Variance (+/-)</td>
        <td style="border-bottom:1px solid black">6800 Units</td>
        <td style="border-bottom:1px solid black;border-right:1px solid black">% Utilized</td>

        <td style="border-bottom:1px solid black">Mins. Target</td>
        <td style="border-bottom:1px solid black">Mins. Utilized</td>
        <td style="border-bottom:1px solid black">Variance (+/-)</td>
        <td style="border-bottom:1px solid black">2600 Units</td>
        <td style="border-bottom:1px solid black">2900 Units</td>
        <td style="border-bottom:1px solid black;border-right:1px solid black">% Utilized</td>

        <td style="border-bottom:1px solid black">Mins. Target</td>
        <td style="border-bottom:1px solid black">Mins. Utilized</td>
        <td style="border-bottom:1px solid black">Variance (+/-)</td>
        <td style="border-bottom:1px solid black">Hybrid Units</td>
        <td style="border-bottom:1px solid black;border-right:1px solid black">% Utilized</td>

        <td style="border-bottom:1px solid black">Mins. Target</td>
        <td style="border-bottom:1px solid black">Mins. Utilized</td>
        <td style="border-bottom:1px solid black">Variance (+/-)</td>
        <td style="border-bottom:1px solid black">5200 Units</td>
        <td style="border-bottom:1px solid black;border-right:1px solid black">% Utilized</td>

        <td style="border-bottom:1px solid black">Mins. Target</td>
        <td style="border-bottom:1px solid black">Mins. Utilized</td>
        <td style="border-bottom:1px solid black">Variance (+/-)</td>
        <td style="border-bottom:1px solid black">Exterior Doors</td>
        <td style="border-bottom:1px solid black; border-right:1px solid black">% Utilized</td>
        <td style="border-bottom:1px solid black">Scheduled Minutes</td>
        <td style="border-bottom:1px solid black">Draft Minutes</td>
        <td style="border-bottom:1px solid black; border-right:1px solid black">% Scheduled</td>
      </tr>    
    `;
  htmlStr = updateTdStyles(htmlStr, styles);

  const d = getSum(list);
  d.dayOfWeek = `${list.length} weeks`;
  htmlStr += htmlTr(d, styles);
  htmlStr = `<tbody style="border:1px solid black; background-color: #f2f5ff;">${htmlStr}</tbody>`;
  htmlStr += `
    <tr><td>Previous Week<td><td colspan="29">??</td><tr>
    `;

  return htmlStr;
};

const htmlBldgB = (totalForAll, length) => {
  const d = totalForAll;
  const totalUnit = d?.c2900_4 + d?.c2900_5;
  const per2600 = getUtilize(d?.c2900_4, totalUnit);
  const per2900 = getUtilize(d?.c2900_5, totalUnit);

  let htmlStr = `
        <tr>
          <td colspan="12"></td>
          <td colspan = "5">${length}-week Bldg B Breakdown</td>
        </tr> 
        <tr>
          <td colspan="12"></td>
          <td colspan = "2">Total Units</td>
          <td>${totalUnit}</td>
        </tr>
        <tr>
          <td colspan="12"></td>
          <td colspan = "2">2600</td>
          <td>${per2600}%</td>
        </tr>    
        <tr>
          <td colspan="12"></td>
          <td colspan = "2">2900</td>
          <td>${per2900}%</td>
        </tr>  
    `;
  return htmlStr;
};

const htmlUnitsPerDay = (list) => {
  let htmlStr = ``;
  const styles = ["background-color: #ffebeb"];

  htmlStr += updateTdStyles(
    `
      <tr>
        <td stlye="font-weight:bold;">Units per day</td>
        <td>2600</td>
        <td>2900</td>
        <td>hybrid</td>
        <td>6800</td>
        <td>5200</td>
        <td>Exterior Doors</td>
        <td>windows</td>
        <td>doors</td>
        <td>boxes</td>     
      </tr>
    `,
    "background-color: #ffebeb"
  );
  const _list = fragmentList(list);

  for (let i = 0; i < _list.length; i++) {
    const _total = getSum(_list[i]?.items);

    const { dayNum, c2900_4, c2900_5, chybrid_4, c6800_4, c5200_4, cExteriorDoors_5, sum_4 } =
      _total;

    const avg2600 = _.round(c2900_4 / dayNum);
    const avg2900 = _.round(c2900_5 / dayNum);
    const avghybrid = _.round(chybrid_4 / dayNum);
    const avg6800 = _.round(c6800_4 / dayNum);
    const avg5200 = _.round(c5200_4 / dayNum);
    const avgExteriorDoors = _.round(cExteriorDoors_5 / dayNum);

    const totalWindows = c2900_4 + c2900_5 + c6800_4;
    const totalDoors = c5200_4 + cExteriorDoors_5;

    const avgWindows = _.round(totalWindows / dayNum);
    const avgDoors = _.round(totalDoors / dayNum);

    const avgBoxes = _.round(sum_4 / dayNum);

    let rowHtml = `  
        <tr>
          <td stlye="font-weight:bold;">${_list[i]?.title}</td>
          <td>${displayNumber(avg2600)}</td>
          <td>${displayNumber(avg2900)}</td>
          <td>${displayNumber(avghybrid)}</td>
          <td>${displayNumber(avg6800)}</td>
          <td>${displayNumber(avg5200)}</td>
          <td>${displayNumber(avgExteriorDoors)}</td>
          <td>${displayNumber(avgWindows)}</td>
          <td>${displayNumber(avgDoors)}</td>
          <td>${displayNumber(avgBoxes)}</td>     
        </tr>
      `;
    rowHtml = updateTdStyles(rowHtml, "background-color: #ffebeb");
    htmlStr += rowHtml;
  }

  return htmlStr;
};

export default parseExportData;
