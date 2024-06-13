import _ from "lodash";
import moment from "moment";

export const tablesToExcel = (function () {
  var uri = "data:application/vnd.ms-excel;base64,",
    template =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>',
    templateend =
      "</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>",
    body = "<body>",
    tablevar = "{table",
    tablevarend = "}",
    bodyend = "</body></html>",
    worksheet = "<x:ExcelWorksheet><x:Name>",
    worksheetend =
      "</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>",
    worksheetvar = "{worksheet",
    worksheetvarend = "}",
    base64 = function (s) {
      return window.btoa(unescape(encodeURIComponent(s)));
    },
    format = function (s, c) {
      return s.replace(/{(\w+)}/g, function (m, p) {
        return c[p];
      });
    };

  return function (tables, names, filename) {
    var wstemplate = "";
    var tabletemplate = "";
    for (var i = 0; i < tables.length; ++i) {
      wstemplate +=
        worksheet + worksheetvar + i + worksheetvarend + worksheetend;
      tabletemplate += tablevar + i + tablevarend;
    }

    var allTemplate = template + wstemplate + templateend;
    var allWorksheet = body + tabletemplate + bodyend;
    var allOfIt = allTemplate + allWorksheet;

    var ctx = {};
    for (var j = 0; j < tables.length; ++j) {
      ctx["worksheet" + j] = names[j];
    }

    for (var k = 0; k < tables.length; ++k) {
      var exceltable;
      if (!tables[k].nodeType) exceltable = tables[k];
      ctx["table" + k] = exceltable;
    }
    /*window.location.href = uri + base64(format(allOfIt, ctx));*/
    var link = document.createElement("a");
    link.download = filename;
    link.href = uri + base64(format(allOfIt, ctx));
    link.click();
  };
})();

// ============================================== utils ==============================================

export function breakdownList(list) {
  const breakdown = [];
  const step = 4;

  for (let i = step; i <= list.length; i += step) {
    breakdown.push({
      title: `${i} weeks outlook`,
      items: list.slice(0, i),
    });
  }

  // Check if the last segment has less than 4 items
  if (list.length % step !== 0) {
    breakdown.push({
      title: `${list.length} weeks outlook`,
      items: list,
    });
  }

  return breakdown;
}

export function fragmentList(list) {
  const fragments = [];
  const fragmentSize = 4;

  for (let i = 0; i < list.length; i += fragmentSize) {
    let items = list.slice(i, i + fragmentSize);

    fragments.push({
      title: `${i + 1} to ${i + items.length} weeks`,
      items,
    });
  }

  return fragments;
}

export const getSum = (list) => {
  const total = list.reduce((acc, curr) => {
    const v = {};
    Object.keys(curr).map((k) => {
      if (curr[k] === "??") {
        v[k] = "??";
      } else if (curr[k] == "--" || isNaN(curr[k])) {
        v[k] = acc[k] || 0;
      } else {
        v[k] = (acc[k] || 0) + curr[k];
      }
    });
    return v;
  }, {});

  // get averages:
  Object.keys(total)?.map((k) => {
    switch (k) {
      case "sum_5":
        total[k] = getUtilize(total["sum_2"], total["sum_1"]);
        break;
      case "c6800_5":
        total[k] = getUtilize(total["c6800_2"], total["c6800_1"]);
        break;
      case "c2900_6":
        total[k] = getUtilize(total["c2900_2"], total["c2900_1"]);
        break;
      case "chybrid_5":
        total[k] = getUtilize(total["chybrid_2"], total["chybrid_1"]);
        break;
      case "cExteriorDoors_5":
        total[k] = getUtilize(total["cExteriorDoors_2"], total["cExteriorDoors_1"]);
        break;
      case "c5200_5":
        total[k] = getUtilize(total["c5200_2"], total["c5200_1"]);
        break;
      case "c6100_5":
        total[k] = getUtilize(total["c6100_2"], total["c6100_1"]);
        break;
      case "cLogi_3":
        total[k] = getUtilize(total["cLogi_1"], total["sum_2"]);
        break;
      default:
        break;
    }
  });

  return total;
};

export const htmlEmpty = () =>
  `<tr><td colspan="30"></td></tr><tr><td colspan="30"></td></tr>`;

export const getUtilize = (a, b) => {
  if (!b || isNaN(a) || isNaN(b)) return "--";

  const a_num = _.toNumber(a);
  const b_num = _.toNumber(b);

  const returnV = Math.round((a_num / b_num) * 100)
  return returnV;
};

export const displayNumber = (a) => {
  if (isNaN(a)) return "--"
  return a
}

export function updateTdStyles(htmlString, newStyles) {
  // Wrap the input string in a <table> tag
  const wrappedHtmlString = `<table>${htmlString}</table>`;

  // Convert the wrapped string to a DOM element
  const parser = new DOMParser();
  const doc = parser.parseFromString(wrappedHtmlString, "text/html");
  const tds = doc.querySelectorAll("td");

  // Update the styles of each <td> element
  tds.forEach((td, index) => {
    const currentStyle = td.getAttribute("style") || "";
    let styleInline;
    if (typeof newStyles === "string") {
      styleInline = newStyles;
    } else {
      styleInline = newStyles[index];
    }

    if (currentStyle) {
      styleInline = [styleInline, currentStyle].join(";");
    }

    td.setAttribute("style", styleInline);
  });

  // Extract the updated <tr> string from the parsed document
  const updatedTrString = doc.querySelector("tr").outerHTML;

  return updatedTrString;
}

export function openGeneratedPage(htmlString, title) {
  // Wrap the table in a complete HTML document if necessary
  const completeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || "Generated Report"}</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
          /* Add your table styling here */
        </style>
      </head>
      <body>
        ${htmlString}
      </body>
    </html>
  `;

  const blob = new Blob([completeHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

export function getWeekdaysBetween(start, end) {
  let startDate = moment(start);
  const endDate = moment(end);
  const weekdays = [];

  while (startDate.isSameOrBefore(endDate)) {
    if (startDate.day() !== 0 && startDate.day() !== 6) {
      weekdays.push(startDate.format("YYYY-MM-DD"));
    }
    startDate = startDate.add(1, "days");
  }

  return weekdays;
}

export function getDataBetweenDates(data, start, end) {
  const addDates = getWeekdaysBetween(start, end);
  const dataMapping = {};
  // make data to date:data mapping
  data?.map((a) => {
    const _date = moment(a.reportDate).format("YYYY-MM-DD");
    dataMapping[_date] = {...a, reportDate:_date};
  });

  const newDate = addDates.map((d) => {
    return dataMapping[d] || {reportDate: d, isEmpty: true};
  });

  return newDate
}
