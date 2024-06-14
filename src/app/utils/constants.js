import { RotateRightIcon, ServiceIcon, TruckFastIcon } from "./icons";

// export const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const BASE_URL =
  !process.env.NEXT_PUBLIC_ENV ||
  process.env.NEXT_PUBLIC_ENV === "development" ||
  process.env.NEXT_PUBLIC_ENV === "local"
    ? // ? "https://localhost:7244"
      // "https://localhost:44393"
      process.env.NEXT_PUBLIC_BASE_API_URL
    : process.env.NEXT_PUBLIC_ENV === "staging"
    ? "http://srvvandev:8050"
    : "https://calendarapi.centra.ca"; // Production

export const CalendarTypes = [
  {
    key: "production",
    value: "Production",
    type: "single",
    colors: {
      foreground: "#2067A9",
      background: "#E2E8F0",
    },
    fontAwesomeIconName: "fa-bars-progress",
  },
  {
    key: "installation",
    value: "Installation",
    type: "multi",
    options: [
      {
        key: "installation",
        value: "Installation",
        colors: {
          foreground: "#1b5e20",
          background: "#c8e6c9",
        },
        fontAwesomeIconName: "fa-screwdriver",
      },
      {
        key: "remeasure",
        value: "Remeasure",
        colors: {
          foreground: "#ef6c00",
          background: "#fff3e0",
        },
        fontAwesomeIconName: "fa-ruler-combined",
      },
    ],
  },
  {
    key: "paint",
    value: "Paint",
    type: "single",
    colors: {
      foreground: "#2e1065",
      background: "#4f46e5",
    },
    fontAwesomeIconName: "fa-brush",
  },
  {
    key: "shipping",
    value: "Shipping",
    type: "multi",
    options: [
      {
        key: "shipping",
        value: "Shipping",
        colors: {
          foreground: "#4d7c0f",
          background: "#f0fdf4",
        },
        fontAwesomeIconName: "fa-truck-fast",
      },
      {
        key: "backorder",
        value: "Backorder",
        colors: {
          foreground: "#b91c1c",
          background: "#fee2e2",
        },
        fontAwesomeIconName: "fa-angles-left",
      },
    ],
  },
  //{ key: "customer", value: "Customer", type: "single" },
  {
    key: "estimation",
    value: "Estimation",
    type: "single",
    colors: {
      foreground: "#134e4a",
      background: "#14b8a6",
    },
    fontAwesomeIconName: "fa-calculator",
  },
  {
    key: "woodDropOff",
    value: "Wood Dropoff",
    type: "single",
    colors: {
      foreground: "#422006",
      background: "#ca8a04",
    },
    fontAwesomeIconName: "fa-truck-field",
  },
  {
    key: "service",
    value: "Service",
    type: "single",
    colors: {
      foreground: "#2067A9",
      background: "#E2E8F0",
    },
    fontAwesomeIconName: "fa-toolbox",
  },
  {
    key: "remake",
    value: "Remake",
    type: "single",
    colors: {
      foreground: "#b91c1c",
      background: "#fee2e2",
    },
    fontAwesomeIconName: "fa-rotate-right",
  },
];

export const AppModes = {
  calendar: "calendar",
  orders: "orders",
};

export const WorkOrderSelectOptions = {
  branches: [
    { key: "selectOne", value: "Select One", label: "-" },
    { key: "VVMM59159", value: "VVMM59159", label: "Calgary" },
    { key: "000000032", value: "000000032", label: "Langley" },
    { key: "000000033", value: "000000033", label: "Kelowna" },
    { key: "000000035", value: "000000035", label: "Nanaimo" },
    { key: "000023276", value: "000023276", label: "Victoria" },
    { key: "unAllocated", value: "", label: "Unallocated" },
  ],
  shippingTypes: [
    { key: "selectOne", value: "Select One", label: "-" },
    { key: "delivery", value: "Delivery", label: "Delivery" },
    { key: "pickup", value: "PickUp", label: "Pick Up" },
    { key: "unAllocated", value: "", label: "Unallocated" },
  ],
  glassSuppliers: [
    { key: "selectOne", value: "Select One", label: "-" },
    { key: "pfg", value: "PFG", label: "PFG" },
    { key: "cardinal", value: "Cardinal", label: "Cardinal" },
    { key: "GlassFab", value: "Centra Calgary", label: "Centra Calgary" },
    { key: "noGlass", value: "No Glass", labelk: "No Glass" },
    { key: "unAllocated", value: "", label: "Unallocated" },
  ],
  glassOptions: [
    { key: "selectOne", value: "Select One", label: "-" },
    {
      key: "asap",
      value: "All Season Advanced Performance",
      label: "All Season Advanced Performance",
    },
    { key: "ep", value: "Extreme Performance", label: "Extreme Performance" },
    { key: "mp", value: "Maximum Performance", label: "Maximum Performance" },
    { key: "unAllocated", value: "", label: "Unallocated" },
  ],
  residentialTypes: [
    { key: "selectOne", value: "", label: "-" },
    { key: "sf", value: "SF", label: "Single Family" },
    { key: "mf", value: "MF", label: "Multi Family" },
    // { key: "unAllocated", value: "", label: "Unallocated" }
  ],
  jobTypes: [
    { key: "selectOne", value: "", label: "-" },
    { key: "so", value: "SO", label: "Supply Only" },
    { key: "si", value: "SI", label: "Supply and Install" },
    { key: "res", value: "RES", label: "Reservation" },
    { key: "pendingRes", value: "PendingRES", label: "Plan Reservation" },
    // { key: "unAllocated", value: "", label: "Unallocated" }
  ],
  customerTypes: [
    { key: "selectOne", value: "", label: "-" },
    { key: "builder", value: "Builder", label: "Builder" },
    { key: "dealer", value: "Dealer", label: "Dealer" },
    { key: "homeOwner", value: "Homeowner", label: "Homeowner" },
    {
      key: "modularBuilder",
      value: "Modular Builder",
      label: "Modular Builder",
    },
    {
      key: "newConstruction",
      value: "New Construction",
      label: "New Construction",
    },
    {
      key: "restorationContractor",
      value: "Restoration Contractor",
      label: "Restoration Contractor",
    },
    { key: "trackBuilder", value: "Track Builder", label: "Track Builder" },
    { key: "unAllocated", value: "", label: "Unallocated" },
  ],
  serviceBranches: [
    { key: "selectOne", value: "", label: "-" },
    { key: "Calgary", value: "Calgary", label: "Calgary" },
    { key: "Langley", value: "Langley", label: "Langley" },
    { key: "Kelowna", value: "Kelowna", label: "Kelowna" },
    { key: "Nanaimo", value: "Nanaimo", label: "Nanaimo" },
    { key: "Victoria", value: "Victoria", label: "Victoria" },
  ],
  originalWODateTypes: [
    { key: "selectOne", value: "", label: "-" },
    { key: "year", value: "Year" },
    { key: "month", value: "Month" },
    { key: "date", value: "Date" },
  ],
  serviceType: [
    { key: "selectOne", value: "", label: "-", category: "" },
    { key: "supplyOnlyWarranty", value: "Supply Only", category: "SO" },
    { key: "supplyInsWarranty", value: "Supply And Install", category: "SI" },
    { key: "chrgService", value: "Chargeable Service", category: "SO" },
    { key: "warr&Chrg", value: "Warranty & Chargeable", category: "SI" },
    { key: "newSale", value: "New Sale", category: "SI" },
    { key: "windowTesting", value: "Window Testing", category: "SO" },
    { key: "supplyOnlyService", value: "Supply Only Service", category: "SO" },
    { key: "3rdPartyWarranty", value: "3rd Party Warranty", category: "SI" },
    {
      key: "supplyOnlyGoodwill",
      value: "Supply Only Goodwill",
      category: "SO",
    },
  ],
  serviceJobType: [
    { key: "selectOne", value: "", label: "-" },
    { key: "warranty", value: "Warranty" },
    { key: "fixed", value: "Fixed" },
    { key: "billable", value: "Billable" },
  ],
  serviceHighRisk: [
    { key: "selectOne", value: "", label: "-" },
    { key: "yes", value: "Yes" },
    { key: "no", value: "No" },
  ],
  serviceReason: [
    { key: "selectOne", value: "", label: "-" },
    { key: "windowPlant", value: "Window Plant Issues" },
    { key: "dataEntry", value: "Data Entry Issues" },
    { key: "installations", value: "Installations Issues" },
    { key: "vendor", value: "Vendor Issues" },
    { key: "shippingDelivery", value: "Shipping / Delivery Issues" },
    { key: "purchasing", value: "Purchasing Issues" },
    { key: "customer", value: "Customer Issues" },
    { key: "appearance", value: "Appearance" },
  ],
  serviceSubmittedBy: [
    { key: "selectOne", value: "", label: "-" },
    { key: "salesRep", value: "Sales Rep" },
    { key: "employee", value: "Employee" },
    { key: "windowPlant", value: "Window Plant" },
    { key: "installDept", value: "Installation Department" },
    { key: "customer", value: "Customer" },
    { key: "other", value: "Other" },
  ],
  serviceRequestedBy: [
    { key: "selectOne", value: "", label: "-" },
    { key: "website", value: "Centra Website" },
    { key: "tel", value: "Telephone / Direct Contact" },
    { key: "email", value: "Email" },
    { key: "salesRep", value: "Sales Rep" },
    { key: "installDept", value: "Installation Department" },
    { key: "supplyOnlySales", value: "Supply Only Sales" },
    { key: "supplyOnlyCustomer", value: "Supply Only Customer" },
    { key: "other", value: "Other" },
  ],
  serviceRBO: [
    { key: "selectOne", value: "", label: "-" },
    { key: "yes", value: "Yes" },
    { key: "no", value: "No" },
  ],
  serviceRemainingBalanceOwing: [
    { key: "selectOne", value: "", label: "-" },
    { key: "yes", value: "Yes" },
    { key: "no", value: "No" },
  ],
};

export const CalendarFilters = [
  {
    key: "production",
    values: [
      {
        key: "state",
        label: "Record",
        fields: [
          {
            key: "scheduled",
            label: "Scheduled Work Order",
            value: true,
            type: "checkbox",
          },
          {
            key: "draft",
            label: "Draft Work Order",
            value: true,
            type: "checkbox",
          },
          {
            key: "inProgress",
            label: "In-Progress",
            value: true,
            type: "checkbox",
          },
          {
            key: "readyToShip",
            label: "Ready To Ship",
            value: true,
            type: "checkbox",
          },
          { key: "shipped", label: "Shipped", value: true, type: "checkbox" },
          { key: "onHold", label: "On Hold", value: true, type: "checkbox" },
        ],
      },
      {
        key: "branch",
        label: "Branch",
        fields: [
          { key: "calgary", label: "Calgary", value: true, type: "checkbox" },
          { key: "kelowna", label: "Kelowna", value: true, type: "checkbox" },
          { key: "langley", label: "Langley", value: true, type: "checkbox" },
          { key: "nanaimo", label: "Nanaimo", value: true, type: "checkbox" },
          { key: "victoria", label: "Victoria", value: true, type: "checkbox" },
        ],
      },
      {
        key: "jobType",
        label: "Job Type",
        fields: [
          {
            key: "missingData",
            label: "Missing Data",
            value: true,
            type: "checkbox",
          },
          {
            key: "so",
            label: "Supply Only",
            value: true,
            type: "checkbox",
          },
          {
            key: "si",
            label: "Supply and Install",
            value: true,
            type: "checkbox",
          },
          {
            key: "res",
            label: "Reservation",
            value: true,
            type: "checkbox",
          },
          {
            key: "pendingRes",
            label: "Pending Reservation",
            value: true,
            type: "checkbox",
          },
        ],
      },
      {
        key: "shippingType",
        label: "Shipping Type",
        fields: [
          {
            key: "missingData",
            label: "Missing Data",
            value: true,
            type: "checkbox",
          },
          { key: "pickup", label: "Pick Up", value: true, type: "checkbox" },
          { key: "delivery", label: "Delivery", value: true, type: "checkbox" },
        ],
      },
      {
        key: "glassSupplier",
        label: "Glass Supplier",
        fields: [
          { key: "cardinal", label: "Cardinal", value: true, type: "checkbox" },
          { key: "pfg", label: "PFG", value: true, type: "checkbox" },
          {
            key: "glassFab",
            label: "Glass Fab",
            value: true,
            type: "checkbox",
          },
          {
            key: "centraCalgary",
            label: "Centra Calgary",
            value: true,
            type: "checkbox",
          },
          //{ key: "vanbo", label: "Vanbo", value: true, type: "checkbox" },
          //{
          //  key: "oldCastle",
          //  label: "Old Castle",
          //  value: true,
          //  type: "checkbox",
          //},
          //{ key: "insulite", label: "Insulite", value: true, type: "checkbox" },
          {
            key: "unallocated",
            label: "Unallocated",
            value: true,
            type: "checkbox",
          },
          { key: "noGlass", label: "No Glass", value: true, type: "checkbox" },
          { key: "none", label: "None", value: true, type: "checkbox" },
        ],
      },
      {
        key: "engineered",
        label: "Engineered",
        fields: [
          {
            key: "engineered",
            label: "Engineered",
            value: true,
            type: "checkbox",
            eventValue: "boolean",
          },
          {
            key: "notEngineered",
            label: "Not Engineered",
            value: true,
            type: "checkbox",
            eventValue: "boolean",
          },
        ],
      },
      {
        key: "project",
        label: "Project",
        fields: [
          {
            key: "project",
            label: "Project",
            value: true,
            type: "checkbox",
            eventValue: "boolean",
          },
          {
            key: "notProject",
            label: "No Project",
            value: true,
            type: "checkbox",
            eventValue: "boolean",
          },
        ],
      },
      {
        key: "rush",
        label: "Rush",
        fields: [
          {
            key: "rush",
            label: "Rush",
            value: true,
            type: "checkbox",
            eventValue: "boolean",
          },
          {
            key: "notRush",
            label: "Not Rush",
            value: true,
            type: "checkbox",
            eventValue: "boolean",
          },
        ],
      },
    ],
  },
  {
    key: "paint",
    values: [
      {
        key: "record",
        label: "Record",
        fields: [
          {
            key: "scheduled",
            label: "Scheduled Work Order",
            value: true,
            type: "checkbox",
          },
          {
            key: "draft",
            label: "Draft Work Order",
            value: true,
            type: "checkbox",
          },
          {
            key: "inProgress",
            label: "In-Progress",
            value: true,
            type: "checkbox",
          },
          {
            key: "readyToShip",
            label: "Ready To Ship",
            value: true,
            type: "checkbox",
          },
          { key: "shipped", label: "Shipped", value: true, type: "checkbox" },
          { key: "onHold", label: "On Hold", value: true, type: "checkbox" },
        ],
      },
      {
        key: "branch",
        label: "Branch",
        fields: [
          { key: "calgary", label: "Calgary", value: true, type: "checkbox" },
          { key: "kelowna", label: "Kelowna", value: true, type: "checkbox" },
          { key: "langley", label: "Langley", value: true, type: "checkbox" },
          { key: "nanaimo", label: "Nanaimo", value: true, type: "checkbox" },
          { key: "victoria", label: "Victoria", value: true, type: "checkbox" },
        ],
      },
      {
        key: "jobType",
        label: "Job Type",
        fields: [
          {
            key: "missingData",
            label: "Missing Data",
            value: true,
            type: "checkbox",
          },
          {
            key: "supplyOnly",
            label: "Supply Only",
            value: true,
            type: "checkbox",
          },
          {
            key: "supplyAndInstall",
            label: "Supply and Install",
            value: true,
            type: "checkbox",
          },
          {
            key: "reservation",
            label: "Reservation",
            value: true,
            type: "checkbox",
          },
          {
            key: "pendingReservation",
            label: "Pending Reservation",
            value: true,
            type: "checkbox",
          },
        ],
      },
      {
        key: "shippingType",
        label: "Shipping Type",
        fields: [
          {
            key: "missingData",
            label: "Missing Data",
            value: true,
            type: "checkbox",
          },
          { key: "pickup", label: "Pick Up", value: true, type: "checkbox" },
          { key: "delivery", label: "Delivery", value: true, type: "checkbox" },
        ],
      },
    ],
  },
  {
    key: "shipping",
    values: [
      {
        key: "record",
        label: "Record",
        fields: [
          {
            key: "scheduled",
            label: "Scheduled Work Order",
            value: true,
            type: "checkbox",
          },
          {
            key: "draft",
            label: "Draft Work Order",
            value: true,
            type: "checkbox",
          },
          {
            key: "inProgress",
            label: "In-Progress",
            value: true,
            type: "checkbox",
          },
          {
            key: "readyToShip",
            label: "Ready To Ship",
            value: true,
            type: "checkbox",
          },
          { key: "shipped", label: "Shipped", value: true, type: "checkbox" },
          { key: "onHold", label: "On Hold", value: true, type: "checkbox" },
        ],
      },
      {
        key: "branch",
        label: "Branch",
        fields: [
          { key: "calgary", label: "Calgary", value: true, type: "checkbox" },
          { key: "kelowna", label: "Kelowna", value: true, type: "checkbox" },
          { key: "langley", label: "Langley", value: true, type: "checkbox" },
          { key: "nanaimo", label: "Nanaimo", value: true, type: "checkbox" },
          { key: "victoria", label: "Victoria", value: true, type: "checkbox" },
        ],
      },
      {
        key: "jobType",
        label: "Job Type",
        fields: [
          {
            key: "missingData",
            label: "Missing Data",
            value: true,
            type: "checkbox",
          },
          {
            key: "supplyOnly",
            label: "Supply Only",
            value: true,
            type: "checkbox",
          },
          {
            key: "supplyAndInstall",
            label: "Supply and Install",
            value: true,
            type: "checkbox",
          },
          {
            key: "reservation",
            label: "Reservation",
            value: true,
            type: "checkbox",
          },
          {
            key: "pendingReservation",
            label: "Pending Reservation",
            value: true,
            type: "checkbox",
          },
        ],
      },
      {
        key: "shippingType",
        label: "Shipping Type",
        fields: [
          {
            key: "missingData",
            label: "Missing Data",
            value: true,
            type: "checkbox",
          },
          { key: "pickup", label: "Pick Up", value: true, type: "checkbox" },
          { key: "delivery", label: "Delivery", value: true, type: "checkbox" },
        ],
      },
    ],
  },
  {
    key: "backorder",
    values: [
      {
        key: "record",
        label: "Record",
        fields: [
          {
            key: "scheduled",
            label: "Scheduled Work Order",
            value: true,
            type: "checkbox",
          },
          {
            key: "draft",
            label: "Draft Work Order",
            value: true,
            type: "checkbox",
          },
          {
            key: "inProgress",
            label: "In-Progress",
            value: true,
            type: "checkbox",
          },
          {
            key: "readyToShip",
            label: "Ready To Ship",
            value: true,
            type: "checkbox",
          },
          { key: "shipped", label: "Shipped", value: true, type: "checkbox" },
          { key: "onHold", label: "On Hold", value: true, type: "checkbox" },
        ],
      },
      {
        key: "branch",
        label: "Branch",
        fields: [
          { key: "calgary", label: "Calgary", value: true, type: "checkbox" },
          { key: "kelowna", label: "Kelowna", value: true, type: "checkbox" },
          { key: "langley", label: "Langley", value: true, type: "checkbox" },
          { key: "nanaimo", label: "Nanaimo", value: true, type: "checkbox" },
          { key: "victoria", label: "Victoria", value: true, type: "checkbox" },
        ],
      },
      {
        key: "jobType",
        label: "Job Type",
        fields: [
          {
            key: "missingData",
            label: "Missing Data",
            value: true,
            type: "checkbox",
          },
          {
            key: "supplyOnly",
            label: "Supply Only",
            value: true,
            type: "checkbox",
          },
          {
            key: "supplyAndInstall",
            label: "Supply and Install",
            value: true,
            type: "checkbox",
          },
          {
            key: "reservation",
            label: "Reservation",
            value: true,
            type: "checkbox",
          },
          {
            key: "pendingReservation",
            label: "Pending Reservation",
            value: true,
            type: "checkbox",
          },
        ],
      },
      {
        key: "shippingType",
        label: "Shipping Type",
        fields: [
          {
            key: "missingData",
            label: "Missing Data",
            value: true,
            type: "checkbox",
          },
          { key: "pickup", label: "Pick Up", value: true, type: "checkbox" },
          { key: "delivery", label: "Delivery", value: true, type: "checkbox" },
        ],
      },
    ],
  },
  {
    key: "customer",
    values: [
      {
        key: "record",
        label: "Record",
        fields: [
          {
            key: "scheduled",
            label: "Scheduled Work Order",
            value: true,
            type: "checkbox",
          },
          {
            key: "draft",
            label: "Draft Work Order",
            value: true,
            type: "checkbox",
          },
          {
            key: "inProgress",
            label: "In-Progress",
            value: true,
            type: "checkbox",
          },
          {
            key: "readyToShip",
            label: "Ready To Ship",
            value: true,
            type: "checkbox",
          },
          { key: "shipped", label: "Shipped", value: true, type: "checkbox" },
          { key: "onHold", label: "On Hold", value: true, type: "checkbox" },
        ],
      },
      {
        key: "branch",
        label: "Branch",
        fields: [
          { key: "calgary", label: "Calgary", value: true, type: "checkbox" },
          { key: "kelowna", label: "Kelowna", value: true, type: "checkbox" },
          { key: "langley", label: "Langley", value: true, type: "checkbox" },
          { key: "nanaimo", label: "Nanaimo", value: true, type: "checkbox" },
          { key: "victoria", label: "Victoria", value: true, type: "checkbox" },
        ],
      },
      {
        key: "jobType",
        label: "Job Type",
        fields: [
          {
            key: "missingData",
            label: "Missing Data",
            value: true,
            type: "checkbox",
          },
          {
            key: "supplyOnly",
            label: "Supply Only",
            value: true,
            type: "checkbox",
          },
          {
            key: "supplyAndInstall",
            label: "Supply and Install",
            value: true,
            type: "checkbox",
          },
          {
            key: "reservation",
            label: "Reservation",
            value: true,
            type: "checkbox",
          },
          {
            key: "pendingReservation",
            label: "Pending Reservation",
            value: true,
            type: "checkbox",
          },
        ],
      },
      {
        key: "shippingType",
        label: "Shipping Type",
        fields: [
          {
            key: "missingData",
            label: "Missing Data",
            value: true,
            type: "checkbox",
          },
          { key: "pickup", label: "Pick Up", value: true, type: "checkbox" },
          { key: "delivery", label: "Delivery", value: true, type: "checkbox" },
        ],
      },
    ],
  },
  {
    key: "installation",
    values: [
      {
        key: "state",
        label: "Status",
        fields: [
          {
            key: "installInProgress",
            label: "Install in Progress",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "installationConfirmed",
            label: "Installation Confirmed",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "installCompleted",
            label: "Install Completed",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "installationInProgressRejected",
            label: "Installation In Progress Rejected",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "installationManagerReview",
            label: "Installation Manager Review",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "jobCompleted",
            label: "Job Completed",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "jobCosting",
            label: "Job Costing",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "pendingInstallCompletion",
            label: "Pending Install Completion",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "readyForInvoicing",
            label: "Ready for Invoicing",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "readyForRemeasure",
            label: "Ready for Remeasure",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "remeasureScheduled",
            label: "ReMeasure Scheduled",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "rejectedInstallation",
            label: "Rejected Installation",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "rejectedJobCosting",
            label: "Rejected Job Costing",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "rejectedManagerReview",
            label: "Rejected Manager Review",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "rejectedRemeasure",
            label: "Rejected Remeasure",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "rejectedScheduledWork",
            label: "Rejected Scheduled Work",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "unreviewedJobCosting",
            label: "Unreviewed Job Costing",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "unreviewedWorkScheduled",
            label: "Unreviewed Work Scheduled",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "vpInstallationApproval",
            label: "VP Installation Approval",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "workScheduled",
            label: "Work Scheduled",
            value: true,
            type: "checkbox",
            symbol: true,
          },
        ],
      },
      {
        key: "salesRep",
        label: "Sales Representative",
        fields: [],
      },
      {
        key: "branch",
        label: "Branch",
        fields: [
          { key: "calgary", label: "Calgary", value: true, type: "checkbox" },
          { key: "kelowna", label: "Kelowna", value: true, type: "checkbox" },
          { key: "langley", label: "Langley", value: true, type: "checkbox" },
          { key: "nanaimo", label: "Nanaimo", value: true, type: "checkbox" },
          { key: "victoria", label: "Victoria", value: true, type: "checkbox" },
        ],
      },
      {
        key: "dueIn14Days",
        label: "Due Date",
        fields: [
          {
            key: "dueIn14Days",
            label: "Due in 14 Days",
            value: true,
            type: "checkbox",
            eventValue: "boolean",
          },
          {
            key: "notDueIn14Days",
            label: "Not Due for 14 Days",
            value: true,
            type: "checkbox",
            eventValue: "boolean",
          },
        ],
      },
      {
        key: "jobDifficulty",
        label: "Difficulty",
        fields: [
          {
            key: "a",
            label: "A",
            value: true,
            type: "checkbox",
          },
          {
            key: "b",
            label: "B",
            value: true,
            type: "checkbox",
          },
          {
            key: "c",
            label: "C",
            value: true,
            type: "checkbox",
          },
          {
            key: "d",
            label: "D",
            value: true,
            type: "checkbox",
          },
        ],
      },
    ],
  },
  {
    key: "remeasure",
    values: [
      {
        key: "state",
        label: "Status",
        fields: [
          {
            key: "installInProgress",
            label: "Install in Progress",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "installationConfirmed",
            label: "Installation Confirmed",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "installCompleted",
            label: "Install Completed",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "installationInProgressRejected",
            label: "Installation In Progress Rejected",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "installationManagerReview",
            label: "Installation Manager Review",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "jobCompleted",
            label: "Job Completed",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "jobCosting",
            label: "Job Costing",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "pendingInstallCompletion",
            label: "Pending Install Completion",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "readyForInvoicing",
            label: "Ready for Invoicing",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "readyForRemeasure",
            label: "Ready for Remeasure",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "remeasureScheduled",
            label: "ReMeasure Scheduled",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "rejectedInstallation",
            label: "Rejected Installation",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "rejectedJobCosting",
            label: "Rejected Job Costing",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "rejectedManagerReview",
            label: "Rejected Manager Review",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "rejectedRemeasure",
            label: "Rejected Remeasure",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "rejectedScheduledWork",
            label: "Rejected Scheduled Work",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "unreviewedJobCosting",
            label: "Unreviewed Job Costing",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "unreviewedWorkScheduled",
            label: "Unreviewed Work Scheduled",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "vpInstallationApproval",
            label: "VP Installation Approval",
            value: true,
            type: "checkbox",
            symbol: true,
          },
          {
            key: "workScheduled",
            label: "Work Scheduled",
            value: true,
            type: "checkbox",
            symbol: true,
          },
        ],
      },
      {
        key: "salesRep",
        label: "Sales Representative",
        fields: [
          //{ key: "calgary", label: "", value: true, type: "checkbox" },
        ],
      },
      {
        key: "branch",
        label: "Branch",
        fields: [
          { key: "calgary", label: "Calgary", value: true, type: "checkbox" },
          { key: "kelowna", label: "Kelowna", value: true, type: "checkbox" },
          { key: "langley", label: "Langley", value: true, type: "checkbox" },
          { key: "nanaimo", label: "Nanaimo", value: true, type: "checkbox" },
          { key: "victoria", label: "Victoria", value: true, type: "checkbox" },
        ],
      },
      {
        key: "dueDate",
        label: "Due Date",
        fields: [
          {
            key: "dueIn2Days",
            label: "Due in 2 Days",
            value: true,
            type: "checkbox",
            eventValue: "boolean",
          },
          {
            key: "notDueIn2Days",
            label: "Not Due for 2 Days",
            value: true,
            type: "checkbox",
            eventValue: "boolean",
          },
        ],
      },
    ],
  },
  {
    key: "estimation",
    values: [
      {
        key: "estimationRecord",
        label: "Estimation Record",
        fields: [
          {
            key: "newProjectEstimating",
            label: "New Project Estimating",
            value: true,
            type: "checkbox",
          },
          {
            key: "rejectedEstimation",
            label: "Rejected Estimation",
            value: true,
            type: "checkbox",
          },
          {
            key: "projectReview",
            label: "Project Review",
            value: true,
            type: "checkbox",
          },
          {
            key: "lostQuotes",
            label: "Lost Quotes",
            value: true,
            type: "checkbox",
          },
          {
            key: "wonQuotes",
            label: "Won Quotes",
            value: true,
            type: "checkbox",
          },
          {
            key: "presiteProjectManagementSetup",
            label: "Pre-site Project Management Setup",
            value: true,
            type: "checkbox",
          },
          {
            key: "jobCosting",
            label: "Job Costing",
            value: true,
            type: "checkbox",
          },
          {
            key: "Pre-site Finance Setup",
            label: "Pre-site Finance Setup",
            value: true,
            type: "checkbox",
          },
          {
            key: "jobSiteReview",
            label: "Job Site Review",
            value: true,
            type: "checkbox",
          },
          {
            key: "estimationInProgress",
            label: "Estimation in-Progress",
            value: true,
            type: "checkbox",
          },
          {
            key: "closingJobReview",
            label: "Closing Job Review",
            value: true,
            type: "checkbox",
          },
          {
            key: "closedEstimation",
            label: "Closed Estimation",
            value: true,
            type: "checkbox",
          },
          {
            key: "quotesTendered",
            label: "Quotes Tendered",
            value: true,
            type: "checkbox",
          },
          {
            key: "projectManagement Review",
            label: "Project Management Review",
            value: true,
            type: "checkbox",
          },
          {
            key: "financeReview",
            label: "Finance Review",
            value: true,
            type: "checkbox",
          },
          {
            key: "rejectedProject Management",
            label: "Rejected Project Management",
            value: true,
            type: "checkbox",
          },
          {
            key: "rejectedFinance",
            label: "Rejected Finance",
            value: true,
            type: "checkbox",
          },
          {
            key: "scheduledEstimations",
            label: "Scheduled Estimations",
            value: true,
            type: "checkbox",
          },
          {
            key: "allocatedWO",
            label: "Allocated WO",
            value: true,
            type: "checkbox",
          },
          /* Shop Drawings */
          {
            key: "newShopDrawings",
            label: "New Shop Drawings",
            value: true,
            type: "checkbox",
          },
          {
            key: "scheduledShopDrawings",
            label: "Scheduled Shop Drawings",
            value: true,
            type: "checkbox",
          },
          {
            key: "shopDrawingsInProgress",
            label: "Shop Drawings In Progress",
            value: true,
            type: "checkbox",
          },
          {
            key: "shopDrawingsReview",
            label: "Shop Drawings Review",
            value: true,
            type: "checkbox",
          },
          {
            key: "rejectedShopDrawings",
            label: "Rejected Shop Drawings",
            value: true,
            type: "checkbox",
          },
          {
            key: "revisionsinProgress",
            label: "Revisions in Progress",
            value: true,
            type: "checkbox",
          },
          {
            key: "shopDrawingFinalReview",
            label: "Shop Drawing Final Review",
            value: true,
            type: "checkbox",
          },
          {
            key: "completedShopDrawings",
            label: "Completed Shop Drawings",
            value: true,
            type: "checkbox",
          },
        ],
      },
      {
        key: "jobType",
        label: "Job Type",
        fields: [
          {
            key: "supplyInstall",
            label: "Supply & Install",
            value: true,
            type: "checkbox",
          },
          {
            key: "supplyOnly",
            label: "Supply Only",
            value: true,
            type: "checkbox",
          },
        ],
      },
      {
        key: "dwellingType",
        label: "Dwelling Type",
        fields: [
          {
            key: "singleHome",
            label: "Single Home",
            value: true,
            type: "checkbox",
          },
          {
            key: "multiFamily",
            label: "Multi Family",
            value: true,
            type: "checkbox",
          },
          {
            key: "townHouse",
            label: "Town House",
            value: true,
            type: "checkbox",
          },
          {
            key: "commercial",
            label: "Commercial",
            value: true,
            type: "checkbox",
          },
          { key: "condo", label: "Condo", value: true, type: "checkbox" },
        ],
      },
      {
        key: "branch",
        label: "Branch",
        fields: [
          { key: "calgary", label: "Calgary", value: true, type: "checkbox" },
          { key: "kelowna", label: "Kelowna", value: true, type: "checkbox" },
          { key: "langley", label: "Langley", value: true, type: "checkbox" },
          { key: "nanaimo", label: "Nanaimo", value: true, type: "checkbox" },
          { key: "victoria", label: "Victoria", value: true, type: "checkbox" },
        ],
      },
    ],
  },
  {
    key: "woodDropOff",
    values: [
      {
        key: "installationRecord",
        label: "Installation Record",
        fields: [
          {
            key: "newProjectEstimating",
            label: "New Project Estimating",
            value: true,
            type: "checkbox",
          },
          {
            key: "rejectedEstimation",
            label: "Rejected Estimation",
            value: true,
            type: "checkbox",
          },
          {
            key: "projectReview",
            label: "Project Review",
            value: true,
            type: "checkbox",
          },
          {
            key: "lostQuotes",
            label: "Lost Quotes",
            value: true,
            type: "checkbox",
          },
          {
            key: "wonQuotes",
            label: "Won Quotes",
            value: true,
            type: "checkbox",
          },
          {
            key: "presiteProjectManagementSetup",
            label: "Pre-site Project Management Setup",
            value: true,
            type: "checkbox",
          },
          {
            key: "jobCosting",
            label: "Job Costing",
            value: true,
            type: "checkbox",
          },
          {
            key: "Pre-site Finance Setup",
            label: "Pre-site Finance Setup",
            value: true,
            type: "checkbox",
          },
          {
            key: "jobSiteReview",
            label: "Job Site Review",
            value: true,
            type: "checkbox",
          },
          {
            key: "estimationInProgress",
            label: "Estimation in-Progress",
            value: true,
            type: "checkbox",
          },
          {
            key: "closingJobReview",
            label: "Closing Job Review",
            value: true,
            type: "checkbox",
          },
          {
            key: "closedEstimation",
            label: "Closed Estimation",
            value: true,
            type: "checkbox",
          },
          {
            key: "quotesTendered",
            label: "Quotes Tendered",
            value: true,
            type: "checkbox",
          },
          {
            key: "projectManagement Review",
            label: "Project Management Review",
            value: true,
            type: "checkbox",
          },
          {
            key: "financeReview",
            label: "Finance Review",
            value: true,
            type: "checkbox",
          },
          {
            key: "rejectedProject Management",
            label: "Rejected Project Management",
            value: true,
            type: "checkbox",
          },
          {
            key: "rejectedFinance",
            label: "Rejected Finance",
            value: true,
            type: "checkbox",
          },
          {
            key: "scheduledEstimations",
            label: "Scheduled Estimations",
            value: true,
            type: "checkbox",
          },
          {
            key: "allocatedWO",
            label: "Allocated WO",
            value: true,
            type: "checkbox",
          },
          /* Shop Drawings */
          {
            key: "newShopDrawings",
            label: "New Shop Drawings",
            value: true,
            type: "checkbox",
          },
          {
            key: "scheduledShopDrawings",
            label: "Scheduled Shop Drawings",
            value: true,
            type: "checkbox",
          },
          {
            key: "shopDrawingsInProgress",
            label: "Shop Drawings In Progress",
            value: true,
            type: "checkbox",
          },
          {
            key: "shopDrawingsReview",
            label: "Shop Drawings Review",
            value: true,
            type: "checkbox",
          },
          {
            key: "rejectedShopDrawings",
            label: "Rejected Shop Drawings",
            value: true,
            type: "checkbox",
          },
          {
            key: "revisionsinProgress",
            label: "Revisions in Progress",
            value: true,
            type: "checkbox",
          },
          {
            key: "shopDrawingFinalReview",
            label: "Shop Drawing Final Review",
            value: true,
            type: "checkbox",
          },
          {
            key: "completedShopDrawings",
            label: "Completed Shop Drawings",
            value: true,
            type: "checkbox",
          },
        ],
      },
      {
        key: "branch",
        label: "Branch",
        fields: [
          { key: "calgary", label: "Calgary", value: true, type: "checkbox" },
          { key: "kelowna", label: "Kelowna", value: true, type: "checkbox" },
          { key: "langley", label: "Langley", value: true, type: "checkbox" },
          { key: "nanaimo", label: "Nanaimo", value: true, type: "checkbox" },
          { key: "victoria", label: "Victoria", value: true, type: "checkbox" },
        ],
      },
    ],
  },
  {
    key: "service",
    values: [
      {
        key: "state",
        label: "State",
        fields: [
          // {
          //   key: "newDraft",
          //   label: "New Service Draft",
          //   value: true,
          //   type: "checkbox",
          // },
          // {
          //   key: "confirmed",
          //   label: "Confirmed Service",
          //   value: true,
          //   type: "checkbox",
          // },
          {
            key: "scheduled",
            label: "Scheduled Service",
            value: true,
            type: "checkbox",
          },
          {
            key: "inProgress",
            label: "Service In Progress",
            value: true,
            type: "checkbox",
          },
          // {
          //   key: "managerReview",
          //   label: "Manager Review",
          //   value: true,
          //   type: "checkbox",
          // },
          // {
          //   key: "cancelled",
          //   label: "Cancelled Service",
          //   value: true,
          //   type: "checkbox",
          // },
          {
            key: "complete",
            label: "Service Complete",
            value: true,
            type: "checkbox",
          },
          {
            key: "closed",
            label: "Closed Service",
            value: true,
            type: "checkbox",
          },
          // {
          //   key: "rejectedService",
          //   label: "Rejected Service",
          //   value: true,
          //   type: "checkbox",
          // },
          // { key: "closedServiceQuote", label: "Closed Service Quote", value: true, type: "checkbox" },
          // { key: "readyToInvoice", label: "Ready To Invoice", value: true, type: "checkbox" },
          // { key: "rejectedServiceCosting", label: "Rejected Service Costing", value: true, type: "checkbox" },
          // { key: "rejectedServiceDraft", label: "Rejected Service Draft", value: true, type: "checkbox" },
          // { key: "cancelledService", label: "Cancelled Service", value: true, type: "checkbox" },
        ],
      },
      {
        key: "branch",
        label: "Branch",
        fields: [
          { key: "calgary", label: "Calgary", value: true, type: "checkbox" },
          { key: "kelowna", label: "Kelowna", value: true, type: "checkbox" },
          { key: "langley", label: "Langley", value: true, type: "checkbox" },
          { key: "nanaimo", label: "Nanaimo", value: true, type: "checkbox" },
          { key: "victoria", label: "Victoria", value: true, type: "checkbox" },
        ],
      },
      // {
      //   key: "typeOfWork",
      //   label: "Type",
      //   fields: [
      //     {
      //       key: "supplyOnlyWarranty",
      //       label: "Supply Only Warranty",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "supplyInsWarranty",
      //       label: "Supply and Install Warranty",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "chrgService",
      //       label: "Chargeable Service",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "warr&Chrg",
      //       label: "Warrantly & Chargeable",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     { key: "newSale", label: "New Sale", value: true, type: "checkbox" },
      //     {
      //       key: "windowTesting",
      //       label: "Window Testing",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "supplyOnlyService",
      //       label: "Supply Only Service",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "3rdPartyWarranty",
      //       label: "3rd Party Warranty",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "supplyOnlyGoodwill",
      //       label: "Supply Only Goodwill",
      //       value: true,
      //       type: "checkbox",
      //     },
      //   ],
      // },
      {
        key: "sosi",
        label: "SO / SI",
        fields: [
          {
            key: "so",
            label: "Supply only",
            value: true,
            type: "checkbox",
          },
          {
            key: "si",
            label: "Supply and Install",
            value: true,
            type: "checkbox",
          },
        ],
      },
    ],
  },
  {
    key: "remake",
    values: [
      {
        key: "serviceRecord",
        label: "Service Record",
        fields: [
          {
            key: "cancelledService",
            label: "Cancelled Service",
            value: true,
            type: "checkbox",
          },
          {
            key: "closedServiceOrder",
            label: "Closed Service Order",
            value: true,
            type: "checkbox",
          },
          {
            key: "closedServiceQuote",
            label: "Closed Service Quote",
            value: true,
            type: "checkbox",
          },
          {
            key: "newServiceDraft",
            label: "New Service Draft",
            value: true,
            type: "checkbox",
          },
          {
            key: "readyToInvoice",
            label: "Ready To Invoice",
            value: true,
            type: "checkbox",
          },
          {
            key: "rejectedService",
            label: "Rejected Service",
            value: true,
            type: "checkbox",
          },
          {
            key: "rejectedServiceCosting",
            label: "Rejected Service Costing",
            value: true,
            type: "checkbox",
          },
          {
            key: "rejectedServiceDraft",
            label: "Rejected Service Draft",
            value: true,
            type: "checkbox",
          },
          {
            key: "scheduledService",
            label: "Scheduled Service",
            value: true,
            type: "checkbox",
          },
          {
            key: "serviceInProgress",
            label: "Service in Progress",
            value: true,
            type: "checkbox",
          },
        ],
      },
      {
        key: "branch",
        label: "Branch",
        fields: [
          { key: "calgary", label: "Calgary", value: true, type: "checkbox" },
          { key: "kelowna", label: "Kelowna", value: true, type: "checkbox" },
          { key: "langley", label: "Langley", value: true, type: "checkbox" },
          { key: "nanaimo", label: "Nanaimo", value: true, type: "checkbox" },
          { key: "victoria", label: "Victoria", value: true, type: "checkbox" },
        ],
      },
    ],
  },
];

export const SearchCategories = [
  {
    key: "production",
    value: "Production",
    fields: [
      {
        key: "workOrderNumber",
        value: "Work Order Number",
        label: "Work Order Number",
      },
      { key: "projectName", value: "Project Name", label: "Project Name" },
      { key: "customerName", value: "Customer Name", label: "Customer Name" },
      { key: "email", value: "Email", label: "Email" },
      { key: "batchNumber", value: "Batch Number", label: "Batch Number" },
      {
        key: "streetAddress",
        value: "Street Address",
        label: "Street Address",
      },
      { key: "city", value: "City", label: "City" },
      { key: "phoneNumber", value: "Phone Number", label: "Phone Number" },
      {
        key: "glassSupplier",
        value: "Glass Supplier",
        label: "Glass Supplier",
        selectionOptions: WorkOrderSelectOptions.glassSuppliers,
      },
      {
        key: "shippingType",
        value: "Shipping Type",
        label: "Shipping Type",
        selectionOptions: WorkOrderSelectOptions.shippingTypes,
      },
    ],
  },
  {
    key: "paint",
    value: "Paint",
    fields: [
      {
        key: "workOrderNumber",
        value: "Work Order Number",
        label: "Work Order Number",
      },
      { key: "projectName", value: "Project Name", label: "Project Name" },
      { key: "customerName", value: "Customer Name", label: "Customer Name" },
      { key: "email", value: "Email", label: "Email" },
      { key: "batchNumber", value: "Batch Number", label: "Batch Number" },
      {
        key: "streetAddress",
        value: "Street Address",
        label: "Street Address",
      },
      { key: "city", value: "City", label: "City" },
      { key: "phoneNumber", value: "Phone Number", label: "Phone Number" },
      {
        key: "glassSupplier",
        value: "Glass Supplier",
        label: "Glass Supplier",
      },
      { key: "shippingType", value: "Shipping Type", label: "Shipping Type" },
    ],
  },
  //{
  //    key: "customer",
  //    value: "Customer",
  //    fields: [
  //        { key: "workOrderNumber", value: "Work Order Number", label: "Work Order Number" },
  //        { key: "projectName", value: "Project Name", label: "Project Name" },
  //        { key: "customerName", value: "Customer Name", label: "Customer Name" },
  //        { key: "email", value: "Email", label: "Email" },
  //        { key: "batchNumber", value: "Batch Number", label: "Batch Number" },
  //        { key: "streetAddress", value: "Street Address", label: "Street Address" },
  //        { key: "city", value: "City", label: "City" },
  //        { key: "phoneNumber", value: "Phone Number", label: "Phone Number" },
  //        { key: "glassSupplier", value: "Glass Supplier", label: "Glass Supplier" },
  //        { key: "shippingType", value: "Shipping Type", label: "Shipping Type" }
  //    ]
  //},
  {
    key: "shipping",
    value: "Shipping",
    fields: [
      {
        key: "workOrderNumber",
        value: "Work Order Number",
        label: "Work Order Number",
      },
      { key: "projectName", value: "Project Name", label: "Project Name" },
      { key: "customerName", value: "Customer Name", label: "Customer Name" },
      { key: "email", value: "Email", label: "Email" },
      { key: "batchNumber", value: "Batch Number", label: "Batch Number" },
      {
        key: "streetAddress",
        value: "Street Address",
        label: "Street Address",
      },
      { key: "city", value: "City", label: "City" },
      { key: "phoneNumber", value: "Phone Number", label: "Phone Number" },
      {
        key: "glassSupplier",
        value: "Glass Supplier",
        label: "Glass Supplier",
      },
      { key: "shippingType", value: "Shipping Type", label: "Shipping Type" },
    ],
  },
  {
    key: "installation",
    value: "Installation",
    fields: [
      {
        key: "workOrderNumber",
        value: "Work Order Number",
        label: "Work Order Number",
      },
      { key: "firstName", value: "First Name", label: "First Name" },
      { key: "address", value: "Address", label: "Address" },
      { key: "phoneNumber", value: "Phone Number", label: "Phone Number" },
      { key: "batchNumber", value: "Batch Number", label: "Batch Number" },
      { key: "salesRep", value: "Sales Rep", label: "Sales Rep" },
      { key: "lastName", value: "Last Name", label: "Last Name" },
      { key: "city", value: "City", label: "City" },
      { key: "state", value: "State", label: "State" },
    ],
  },
  {
    key: "service",
    value: "Service",
    fields: [
      {
        key: "serviceId",
        value: "Service Id",
        label: "Service Id",
      },
      { key: "city", value: "City", label: "City" },
      { key: "customerName", value: "Customer Name", label: "Customer Name" },
      {
        key: "streetAddress",
        value: "Street Address",
        label: "Street Address",
      },
      { key: "email", value: "Email", label: "Email" },
      { key: "phoneNumber", value: "PhoneNumber", label: "Phone Number" },
    ],
  },
  {
    key: "estimation",
    value: "Estimation",
    fields: [
      { key: "jobName", value: "Job Name", label: "Job Name" },
      { key: "city", value: "City", label: "City" },
      { key: "projectManager", value: "Customer Name", label: "Customer Name" },
      { key: "customerName", value: "Customer Name", label: "Customer Name" },
      { key: "estimator", value: "Estimator", label: "Estimator" },
      { key: "engineer", value: "Engineer", label: "Engineer" },
      { key: "siteContact", value: "Site Contact", label: "Site Contact" },
      // Checkbox - { key: "phoneNumber", value: "PhoneNumber", label: "Phone Number" }
      // Checkbox - { key: "phoneNumber", value: "PhoneNumber", label: "Phone Number" }
    ],
  },
  {
    key: "remake",
    value: "Remake",
    fields: [
      {
        key: "workOrderNumber",
        value: "Work Order Number",
        label: "Work Order Number",
      },
      { key: "jobType", value: "Job Type", label: "Job Type" },
      { key: "reason", value: "Reason", label: "Reason" },
      { key: "itemNumber", value: "Item Number", label: "Item Number" },
      { key: "product", value: "Product", label: "Product" },
      { key: "notes", value: "Notes", label: "Notes" },
    ],
  },
  {
    key: "backorder",
    value: "Backorder",
    fields: [
      {
        key: "workOrderNumber",
        value: "Work Order Number",
        label: "Work Order Number",
      },
      {
        key: "backOrderNumber",
        value: "Backorder Number",
        label: "Backorder Number",
      },
    ],
  },
];

export const InProgress = "inProgress";
export const Scheduled = "scheduled";
export const Draft = "draft";
export const ReadyToShip = "readyToShip";
export const Shipped = "shipped";
export const OnHold = "onHold";

export const DepartmentIcons = {
  Service: <ServiceIcon className="text-centraBlue" />,
  Remake: <RotateRightIcon className="text-centraBlue" />,
};

export const ProductionStates = {
  inProgress: {
    color: "#A5D6A7",
    label: "In Progress",
    transitionKey: "MovetoInProgress",
    transitionTo: [Scheduled, ReadyToShip],
  }, // Green
  scheduled: {
    color: "#9FB6CD",
    secondaryColor: "#7AA9DD",
    label: "Scheduled",
    transitionKey: "ScheduleOrder",
    transitionTo: [Draft, InProgress],
  }, // Blue
  draft: {
    color: "#DDA0DD",
    label: "Draft",
    transitionKey: "MovedToDraft",
    transitionTo: [Scheduled],
  }, // Purple
  readyToShip: {
    color: "#FFFACD",
    textColor: "#64748B",
    label: "Ready To Ship",
    transitionKey: "MarkReadyToShip",
    transitionTo: [InProgress, Shipped],
  }, // Yellow
  shipped: {
    color: "#FFC966",
    label: "Shipped",
    transitionKey: "MoveShipped",
    transitionTo: [ReadyToShip],
  }, // Orange
  onHold: {
    color: "#FF6347",
    label: "On Hold",
    transitionKey: "MovetoOnHold",
    transitionTo: [Draft, Scheduled, InProgress, ReadyToShip],
  }, // Red
};

export const InstallationStates = {
  installInProgress: {
    color: "#A5D6A7",
    label: "Install in Progress",
    // transitionKey: "InstallInProgress",
    // transitionTo: [Scheduled, ReadyToShip, OnHold],
    transitionKey: "",
    transitionTo: [],
  }, // Green
  installationConfirmed: {
    color: "#60a5fa",
    label: "Installation Confirmed",
    transitionKey: "",
    transitionTo: [],
  }, // Dark Blue
  installCompleted: {
    color: "#FFC966",
    label: "Install Completed",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  installationInProgressRejected: {
    color: "#FF6347",
    label: "Installation inprogress rejected",
    transitionKey: "",
    transitionTo: [],
  }, // Red
  installationManagerReview: {
    color: "#FFC966",
    label: "Installation Manager Review",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  jobCompleted: {
    color: "#FFC966",
    label: "Job Completed",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  jobCosting: {
    color: "#FFC966",
    label: "Job Costing",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  pendingInstallCompletion: {
    color: "#FF6347",
    label: "Pending Install Completion",
    transitionKey: "",
    transitionTo: [],
  }, // Red
  readyForInvoicing: {
    color: "#FFC966",
    label: "Ready for Invoicing",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  readyForRemeasure: {
    color: "#9FB6CD",
    label: "Ready for Remeasure",
    transitionKey: "",
    transitionTo: [],
  }, // Light Blue
  remeasureScheduled: {
    color: "#9FB6CD",
    label: "Remeasure Scheduled",
    transitionKey: "",
    transitionTo: [],
  }, // Light Blue
  rejectedInstallation: {
    color: "#FF6347",
    label: "Rejected Installation",
    transitionKey: "",
    transitionTo: [],
  }, // Red
  rejectedJobCosting: {
    color: "#FF6347",
    label: "Rejected Job Costing",
    transitionKey: "",
    transitionTo: [],
  }, // Red
  rejectedManagerReview: {
    color: "#FF6347",
    label: "Rejected Manager Review",
    transitionKey: "",
    transitionTo: [],
  }, // Red
  rejectedRemeasure: {
    color: "#FF6347",
    label: "Rejected Remeasure",
    transitionKey: "",
    transitionTo: [],
  }, // Red
  rejectedScheduledWork: {
    color: "#FF6347",
    label: "Rejected Scheduled Work",
    transitionKey: "",
    transitionTo: [],
  }, // Red
  unreviewedJobCosting: {
    color: "#FFC966",
    label: "Unreviewed Job Costing",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  unreviewedWorkScheduled: {
    color: "#9FB6CD",
    label: "Unreviewed Work Scheduled",
    transitionKey: "",
    transitionTo: [],
  }, // Light Blue
  vpInstallationApproval: {
    color: "#FFC966",
    label: "VP Installation Approval",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  workScheduled: {
    color: "#9FB6CD",
    label: "Work Scheduled",
    transitionKey: "",
    transitionTo: [],
  }, // Light Blue
};

// TODO: need to confirm what is final status data values from db
export const ServiceStates = {
  newDraft: {
    color: "#4890e2",
    label: "New Service Draft",
    transitionKey: "CreateDraft",
    transitionTo: ["confirmed", "cancelled"],
    icon: "fa-regular fa-note-sticky",
    columns: [
      "Customer",
      "Created By",
      "Created On",
      "Request Date",
      "Assigned Admin",
    ],
  },
  confirmed: {
    color: "#4890e2",
    label: "Confirmed Service",
    transitionKey: "Confirm",
    transitionTo: ["scheduled", "cancelled"],
    icon: "fa-solid fa-clipboard-check",
    columns: ["Request Date", "Created By", "Created On", "Assigned Admin"],
  },
  scheduled: {
    color: "#4890e2",
    label: "Scheduled Service",
    transitionKey: "ScheduleService",
    transitionTo: ["confirmed", "inProgress", "cancelled"],
    icon: "fa-solid fa-calendar-check",
    columns: [
      "City",
      "Scheduled Start",
      "Scheduled End",
      "Assigned Technicians",
    ],
  },
  inProgress: {
    color: "#A5D6A7",
    label: "Service In Progress",
    transitionKey: "MovetoInProgress",
    transitionTo: ["scheduled", "complete", "cancelled"],
    icon: "fa-solid fa-bars-progress",
    columns: [
      "City",
      "Scheduled Start",
      "Scheduled End",
      "Assigned Technicians",
    ],
  },
  // managerReview: {
  //   color: "#4890e2",
  //   label: "Manager Review",
  //   transitionKey: "ForManagerReview",
  //   transitionTo: ["inProgress", "rejectedService", "complete"],
  //   icon: "fa-solid fa-user-clock",
  //   columns: ["Assignee", "Request Date", "Admin Reviewer"],
  // },
  complete: {
    color: "#ffc966",
    label: "Service Complete",
    transitionKey: "MovetoComplete",
    transitionTo: ["inProgress", "managerReview", "closed"],
    icon: "fa-regular fa-circle-check",
    columns: [
      "Completed Date",
      "Assignee",
      "City",
      "Scheduled Start",
      "Scheduled End",
      "Assigned Technicians",
    ],
  },
  cancelled: {
    color: "#ffc966",
    label: "Cancelled Service",
    transitionKey: "Cancel",
    transitionTo: ["newDraft", "confirmed", "scheduled", "inProgress"],
    icon: "fa-regular fa-rectangle-xmark",
    columns: [
      "Cancelled Reason",
      "Created By",
      "Created On",
      "Request Date",
      "Assigned Admin",
    ],
  },
  closed: {
    color: "#bbbbbb",
    label: "Closed Service",
    transitionKey: "MovetoClosed",
    transitionTo: ["complete", "inProgress"],
    icon: "fa-solid fa-box-archive",
    columns: [
      "Closed Date",
      "Created By",
      "Created On",
      "Request Date",
      "Assigned Admin",
    ],
  },
  // rejectedService: {
  //   color: "#ff6347",
  //   label: "Rejected Service",
  //   transitionKey: "RejectService",
  //   transitionTo: ["newDraft", "managerReview"],
  //   icon: "fa-solid fa-user-xmark",
  //   columns: ["Reject Reason"],
  // },
  // "rejectedDraft": { color: "#ff6347", label: "Rejected Service Draft",  transitionKey: "RejectDraft", transitionTo: ["newDraft", "closed"] },
  // "rejectedCosting": { color: "#ff6347", label: "Rejected Service Costing",  transitionKey: "RejectCosting", transitionTo: ["newDraft","scheduled"]},
  // "readyToInvoice": { color: "#ffc966", label: "Ready To Invoice" ,  transitionKey: "PrepareForInvoice", transitionTo: ["inProgress" , "complete"]},
  // "closedQuote": { color: "#bbbbbb", label: "Closed Service Quote",  transitionKey: "CloseQuote", transitionTo: ["newDraft", ""] },
};

export const ShippingStates = {
  inProgress: {
    color: "#A5D6A7",
    label: "In Progress",
    transitionKey: "MovetoInProgress",
    transitionTo: [Scheduled, ReadyToShip],
  }, // Green
  scheduled: {
    color: "#9FB6CD",
    secondaryColor: "#7AA9DD",
    label: "Scheduled Work Order",
    transitionKey: "ScheduleOrder",
    transitionTo: [Draft, InProgress],
  }, // Blue
  draft: {
    color: "#DDA0DD",
    label: "Draft",
    transitionKey: "MovedToDraft",
    transitionTo: [Scheduled],
  }, // Purple
  readyToShip: {
    color: "#FACC15",
    textColor: "#64748B",
    label: "Ready To Ship",
    transitionKey: "MarkReadyToShip",
    transitionTo: [InProgress, Shipped],
  }, // Yellow
  shipped: {
    color: "#FFC966",
    secondaryColor: "#FF6347",
    label: "Shipped",
    transitionKey: "MoveShipped",
    transitionTo: [ReadyToShip],
  }, // Orange
  onHold: {
    color: "#FF6347",
    label: "On Hold",
    transitionKey: "MovetoOnHold",
    transitionTo: [Draft, Scheduled, InProgress, ReadyToShip],
  }, // Red
};

export const ProductionRowStates = {
  "n/a": {
    color: "lightgrey",
    label: "N/A",
  }, // Grey
  readyToShip: {
    color: "#FFFACD",
    textColor: "#64748B",
    label: "Ready To Ship",
  }, // Yellow
  shipped: {
    color: "#FFC966",
    label: "Shipped",
  }, // Orange
  onHold: {
    color: "#FF6347",
    label: "On Hold",
  }, // Red
};

export const InstallationRowStates = {
  "n/a": {
    color: "lightgrey",
    label: "N/A",
  },
  installInProgress: {
    color: "#A5D6A7",
    label: "Install in Progress",
  }, // Green
  installationConfirmed: {
    color: "#60a5fa",
    label: "Installation Confirmed",
    transitionKey: "",
    transitionTo: [],
  }, // Dark Blue
  installCompleted: {
    color: "#FFC966",
    label: "Install Completed",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  installed: {
    color: "#FFC966",
    label: "Installed",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  installationInProgressRejected: {
    color: "#FF6347",
    label: "Installation inprogress rejected",
    transitionKey: "",
    transitionTo: [],
  }, // Red
  installationManagerReview: {
    color: "#FFC966",
    label: "Installation Manager Review",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  jobCompleted: {
    color: "#FFC966",
    label: "Job Completed",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  jobCosting: {
    color: "#FFC966",
    label: "Job Costing",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  pendingInstallCompletion: {
    color: "#FF6347",
    label: "Pending Install Completion",
    transitionKey: "",
    transitionTo: [],
  }, // Red
  readyForInvoicing: {
    color: "#FFC966",
    label: "Ready for Invoicing",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  readyForRemeasure: {
    color: "#9FB6CD",
    label: "Ready for Remeasure",
    transitionKey: "",
    transitionTo: [],
  }, // Light Blue
  remeasureScheduled: {
    color: "#9FB6CD",
    label: "Remeasure Scheduled",
    transitionKey: "",
    transitionTo: [],
  }, // Light Blue
  rejectedInstallation: {
    color: "#FF6347",
    label: "Rejected Installation",
    transitionKey: "",
    transitionTo: [],
  }, // Red
  rejectedJobCosting: {
    color: "#FF6347",
    label: "Rejected Job Costing",
    transitionKey: "",
    transitionTo: [],
  }, // Red
  rejectedManagerReview: {
    color: "#FF6347",
    label: "Rejected Manager Review",
    transitionKey: "",
    transitionTo: [],
  }, // Red
  rejectedRemeasure: {
    color: "#FF6347",
    label: "Rejected Remeasure",
    transitionKey: "",
    transitionTo: [],
  }, // Red
  rejectedScheduledWork: {
    color: "#FF6347",
    label: "Rejected Scheduled Work",
    transitionKey: "",
    transitionTo: [],
  }, // Red
  unreviewedJobCosting: {
    color: "#FFC966",
    label: "Unreviewed Job Costing",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  unreviewedWorkScheduled: {
    color: "#9FB6CD",
    label: "Unreviewed Work Scheduled",
    transitionKey: "",
    transitionTo: [],
  }, // Light Blue
  vpInstallationApproval: {
    color: "#FFC966",
    label: "VP Installation Approval",
    transitionKey: "",
    transitionTo: [],
  }, // Orange
  workScheduled: {
    color: "#9FB6CD",
    label: "Work Scheduled",
    transitionKey: "",
    transitionTo: [],
  }, // Light Blue
};

export const RemakeRowStates = {
  newOrder: {
    color: "#93C5FD",
    label: "New Order",
    transitionKey: "NewOrder",
    transitionTo: ["inProgress"],
    icon: "fa-regular fa-note-sticky",
    columns: [],
  }, // Blue
  inProgress: {
    color: "#A5D6A7",
    label: "In Progress",
    transitionKey: "InProgress",
    transitionTo: ["onHold", "completed"],
    icon: "fa-solid fa-bars-progress",
    columns: [],
  }, // Green
  completed: {
    color: "#FFC966",
    label: "Completed",
    transitionKey: "NewOrder",
    transitionTo: ["onHold", "inProgress"],
    icon: "fa-regular fa-circle-check",
    columns: [],
  }, // Orange
  onHold: {
    color: "#FF6347",
    label: "On Hold",
    transitionKey: "onHold",
    transitionTo: ["inProgress", "completed"],
    icon: "fa-regular fa-hourglass",
    columns: [],
  }, // Red
};

export const BackorderRowStates = {
  newOrder: {
    color: "#93C5FD",
    label: "New Order",
  }, // Blue
  inProgress: {
    color: "#A5D6A7",
    label: "In Progress",
  }, // Green
  completed: {
    color: "#FFC966",
    label: "Completed",
  }, // Orange
  onHold: {
    color: "#FF6347",
    label: "On Hold",
  }, // Red
};

export const GlassRowStates = {
  ordered: {
    color: "#93C5FD",
    label: "Ordered",
  }, // Blue
  notOrdered: {
    color: "#FF6347",
    label: "Not Ordered",
  }, // Red
  received: {
    color: "#FFC966",
    label: "Received",
  }, // Orange
};

export const ServiceNoteCategories = {
  admin: {
    color: "#0d6efd",
    label: "Admin",
    icon: "fa-solid fa-user-gear text-blue-500 w-6",
  },
  general: {
    color: "#A5D6A7",
    label: "General",
    icon: "fa-solid fa-note-sticky text-blue-500 w-6",
  },
  installation: {
    color: "#FFC966",
    label: "Installation",
    icon: "fa-solid fa-screwdriver-wrench text-blue-500 w-6",
  },
  highrisk: {
    color: "#FF6347",
    label: "High Risk",
    icon: "fa-solid fa-triangle-exclamation text-blue-500 w-6",
  },
  remeasure: {
    color: "#lightgrey",
    label: "Remeasure",
    icon: "fa-solid fa-ruler-vertical text-blue-500 w-6",
  },
  customer: {
    color: "#FF6347",
    label: "Customer",
    icon: "fa-solid fa-person text-blue-500 w-6",
  },
};

export const CalledMessageTypes = {
  leftMessage: {
    color: "rgb(59 130 246)",
    label: "Left Message",
    icon: "fa-solid fa-voicemail text-blue-500 w-6",
  },
  noAns: {
    color: "#FF6347",
    label: "No Answering Machine",
    icon: "fa-solid fa-phone-slash text-red-500 w-6",
  },
  spokeWithCust: {
    color: "#43A047",
    label: "Spoke with Customer",
    icon: "fa-solid fa-phone-volume text-green-600 w-6",
  },
};

export const EventsShownOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 1000, label: "All" },
];

export const CalendarFontSizeOptions = [
  { value: 0.7, label: "S" },
  { value: 0.8, label: "M" },
  { value: 0.9, label: "L" },
  { value: 1, label: "XL" },
];

export const CalendarViews = {
  day: "timeGridDay",
  week: "timeGridWeek",
  month: "dayGridMonth",
  mobile: "listMonth",
};

export const Pages = {
  day: "day",
  week: "week",
  month: "month",
  mobile: "mobile",
  searchResults: "search",
  workOrder: "workorder",
  batchUpdate: "batch-update",
  dailyReport: "daily-report",
  remakeBackorder: "remake-backorder",
};

export const FileTypes = {
  image: "img",
  file: "file",
};

export const ManufacturingFacilities = {
  langley: "Langley",
  calgary: "Calgary",
  all: "All",
};

export const ItemStatus = [
  {
    key: "na",
    value: "N/A",
    color: "grey",
  },
  {
    key: "readyToShip",
    value: "Ready To Ship",
    color: "yellow",
  },
  {
    key: "onHold",
    value: "On Hold",
    color: "#FCA5A5",
  },
  {
    key: "shipped",
    value: "Shipped",
    color: "orange",
  },
];

export const Production = "production";
export const Service = "service";
export const Installation = "installation";
export const Remeasure = "remeasure";
export const Shipping = "shipping";
export const Backorder = "backorder";

export const ProductionStartDate = "productionStartDate";
export const ProductionEndDate = "productionEndDate";
export const ReturnTripStartDate = "returnTripStartDate";

export const ProductionRemakeOptions = [
  {
    key: "product",
    value: "Product",
    options: [
      {
        key: "Window",
        value: "Window",
      },
      {
        key: "Frame",
        value: "Frame",
      },
      {
        key: "Sash",
        value: "Sash",
      },
      {
        key: "Mullion",
        value: "Mullion",
      },
      {
        key: "Screen",
        value: "Screen",
      },
      {
        key: "Hardware",
        value: "Hardware",
      },
      {
        key: "Paint",
        value: "Paint",
      },
      {
        key: "SealedUnit",
        value: "Sealed Unit",
      },
      {
        key: "Other",
        value: "Other",
      },
    ],
  },
  {
    key: "branch",
    value: "Branch",
    options: [
      {
        key: "kelowna",
        value: "Kelowna",
      },
      {
        key: "lowerMainland",
        value: "Lower Mainland",
      },
      {
        key: "nanaimo",
        value: "Nanaimo",
      },
      {
        key: "victora",
        value: "Victoria",
      },
    ],
  },
  {
    key: "departmentResponsible",
    value: "Department Responsible",
    options: [
      {
        key: "Manufacturing", // Pascal case to match backend
        value: "Manufacturing",
        options: [
          {
            key: "centraPlant",
            value: "Centra Plant",
          },
          {
            key: "sawyer",
            value: "Sawyer",
          },
          {
            key: "mullion",
            value: "Mullion",
          },
          {
            key: "breadPocketFillSillTrack",
            value: "Bread/Pocket Fill/Sill Track",
          },
          {
            key: "steel",
            value: "Steel",
          },
          {
            key: "patioDoors",
            value: "Patio Doors",
          },
          {
            key: "welder",
            value: "Welder",
          },
          {
            key: "fabricator",
            value: "Fabricator",
          },
          {
            key: "cleaner",
            value: "Cleaner",
          },
          {
            key: "assembly",
            value: "Assembly",
          },
          {
            key: "glazing",
            value: "Glazing",
          },
          {
            key: "screens",
            value: "Screens",
          },
          {
            key: "paint",
            value: "Paint",
          },
          {
            key: "waterTest",
            value: "Water Test",
          },
        ],
      },
      {
        key: "Installation",
        value: "Installation",
      },
      {
        key: "Sales",
        value: "Sales",
      },
      {
        key: "Logistics",
        value: "Logistics",
      },
      {
        key: "ShopDrawings",
        value: "Shop Drawings",
      },
      {
        key: "Remeasure",
        value: "Remeasure",
      },
      {
        key: "Vendor",
        value: "Vendor",
      },
      {
        key: "Shipping",
        value: "Shipping",
      },
      {
        key: "Purchasing",
        value: "Purchasing",
      },
      {
        key: "SupplyOnly",
        value: "Supply Only",
      },
      {
        key: "Service",
        value: "Service",
      },
      {
        key: "Other",
        value: "Other",
      },
    ],
  },
  {
    key: "reasonCategory",
    value: "Reason",
    options: [
      {
        key: "WindowPlantIssues", // Pascal case to match backend
        value: "Window Plant Issues",
        options: [
          {
            key: "frame",
            value: "Frame",
            options: [
              {
                key: "frameBadBrokenWeld",
                value: "Bad Broken Weld",
              },
              {
                key: "frameCrackedDentedProfile",
                value: "Cracked/Dented Profile",
              },
              {
                key: "frameFabricatorMilledWrongLocation",
                value: "Fabricator Milled Wrong Location",
              },
              {
                key: "frameDiscoloured",
                value: "Discoloured",
              },
              {
                key: "frameOutOfSquare",
                value: "Frame Out Of Square",
              },
              {
                key: "frameWrongSize",
                value: "Wrong Size",
              },
              {
                key: "frameBowedWarpedGauged",
                value: "Bowed/Warped/Gauged",
              },
              {
                key: "frameWrongColour",
                value: "WrongColour",
              },
            ],
          },
          {
            key: "Sash",
            value: "Sash",
            options: [
              {
                key: "sashBadBrokenWeld",
                value: "Sash - Bad Broken Weld",
              },
              {
                key: "sashCrackedDentedProfile",
                value: "Sash - Cracked/Dented Profile",
              },
              {
                key: "sashFabricatorMilledWrongLocation",
                value: "Sash - Fabricator Milled Wrong Location",
              },
              {
                key: "sashDiscoloured",
                value: "Sash - Discoloured",
              },
              {
                key: "sashOutOfSquare",
                value: "Sash - Bad Broken Weld",
              },
              {
                key: "sashWrongSize",
                value: "Sash - Wrong Size",
              },
              {
                key: "sashBowedWarpedGauged",
                value: "Sash - Bowed/Warped/Gauged",
              },
              {
                key: "sashWrongColour",
                value: "Sash - WrongColour",
              },
            ],
          },
          {
            key: "SealedUnit",
            value: "Sealed Unit",
            options: [
              {
                key: "brokenCrackedChiped",
                value: "Broken/Cracked/Chipped",
              },
              {
                key: "gridWrongPatter",
                value: "Grid Wrong Pattern",
              },
            ],
          },
          {
            key: "Screen",
            value: "Screen",
            options: [
              {
                key: "screenMissing",
                value: "Screen - Missing",
              },
              {
                key: "screenWrongSize",
                value: "Screen - Wrong Size",
              },
              {
                key: "screenRipped",
                value: "Screen - Ripped",
              },
              {
                key: "screenNotSquare",
                value: "Screen - Not Square",
              },
              {
                key: "screenDented",
                value: "Screen - Dented",
              },
              {
                key: "screenWrongColour",
                value: "Screen - Wrong Colour",
              },
            ],
          },
          {
            key: "Paint",
            value: "Paint",
            options: [
              {
                key: "chipped",
                value: "Chipped",
              },
              {
                key: "peeling",
                value: "Peeling",
              },
              {
                key: "scratched",
                value: "Scratched",
              },
              {
                key: "wrongColour",
                value: "Wrong Colour",
              },
            ],
          },
          {
            key: "Mullion",
            value: "Mullion",
            options: [
              {
                key: "mullionWrongSize",
                value: "Mullion - Wrong Size",
              },
              {
                key: "mullionMilledWrong",
                value: "Mullion - Milled Wrong",
              },
              {
                key: "mullionLockOperatorHoleWrongLocation",
                value: "Mullion - Lock/Operator Hole Wrong Location",
              },
              {
                key: "mullionWarped",
                value: "Mullion - Warped",
              },
            ],
          },
          {
            key: "wrongConfigurationBuilt",
            value: "Wrong Configuration Built",
          },
        ],
      },
      {
        key: "DataEntryIssues",
        value: "Data Entry Issues",
        options: [
          {
            key: "dataEntryWrongGlassTypeOrdered",
            value: "Wrong Glass Type Ordered",
          },
          {
            key: "dataEntryInternalGridWrongColour",
            value: "Internal Grid Wrong Colour",
          },
          {
            key: "dataEntryExternalGridWrongPattern",
            value: "External Grid Wrong Pattern",
          },
          {
            key: "dataEntryInternalGridWrongPattern",
            value: "Internal Grid Wrong Pattern",
          },
          {
            key: "dataEntryWrongSize",
            value: "Wrong Size",
          },
          {
            key: "dataEntryWrongConfiguration",
            value: "Wrong Configuration",
          },
          {
            key: "dataEntryWrongHardwareSelected",
            value: "Wrong Hardware Selected",
          },
          {
            key: "dataEntryWrongColour",
            value: "Wrong Colour",
          },
          {
            key: "dataEntryWrongProfile",
            value: "Wrong Profile",
          },
          {
            key: "dataEntryWrongTrimKitSelected",
            value: "Wrong Trim Kit Selected",
          },
          {
            key: "dataEntryWrongProductSelected",
            value: "Wrong Product Selected",
          },
          {
            key: "dataEntryMissedWindow",
            value: "Missed Window",
          },
          {
            key: "dataEntryMissedDoor",
            value: "Missed Door",
          },
          {
            key: "dataEntryDuplicatedOrder",
            value: "Duplicated Order",
          },
          {
            key: "dataEntryItemDeleted",
            value: "Item Deleted",
          },
          {
            key: "dataEntryItemChanges",
            value: "Item Changed",
          },
        ],
      },
      {
        key: "InstallationIssues",
        value: "Installation Issues",
        options: [
          {
            key: "installInstallationError",
            value: "Installation Error",
          },
          {
            key: "installDamagedWhileInstallingFrame",
            value: "Damaged While Installing - Frame",
          },
          {
            key: "installDamagedWhileInstallingSash",
            value: "Damaged While Installing - Sash",
          },
          {
            key: "installDamagedWhileInstallingSealedUnit",
            value: "Damaged While Installing Sealed Unit",
          },
          {
            key: "installDamagedWhenInstallingAlarmMagnet",
            value: "Damaged When Installing Alarm Magnet ",
          },
          {
            key: "installDamagedWhileTransporting",
            value: "Damaged While Transporting",
          },
          {
            key: "installFailedWaterTest",
            value: "Failed Water Test",
          },
        ],
      },
      {
        key: "VendorIssues",
        value: "Vendor Issues",
        options: [
          {
            key: "sealedUnitScratchSmudgeDiscoloured",
            value: "Scratch/Smudge/Discoloured",
          },
          {
            key: "sealedUnitSpacerBent",
            value: "Spacer Bent",
          },
          {
            key: "sealedUnitBrokenCrackedChipped",
            value: "Broken/Cracked/Chipped",
          },
          {
            key: "sealedUnitGridWarpedCrooked",
            value: "Grid Warped/Crooked",
          },
          {
            key: "sealedUnitGridWrongColour",
            value: "Grid Wrong Colour",
          },
          {
            key: "sealedUnitInternalGridWrongPattern",
            value: "Internal Grid Wrong Pattern",
          },
          {
            key: "doorSlabWarped",
            value: "Door Slab - Warped",
          },
          {
            key: "doorSlabDamaged",
            value: "Door Slab - Damaged",
          },
          {
            key: "productDeliveredLate",
            value: "Product Delivered Late",
          },
          {
            key: "wrongDeliveredLate",
            value: "Wrong Product Delivered",
          },
        ],
      },
      {
        key: "ShippingIssues",
        value: "Shipping Issues",
        options: [
          {
            key: "shippingFrameDamagedWhileTransporting",
            value: "Frame Damaged While Transporting",
          },
          {
            key: "shippingSashDamagedWhileTransporting",
            value: "Sash Damaged While Transporting",
          },
          {
            key: "shippingSealedUnitDamagedWhileTransporting",
            value: "Sealed Unit Damaged While Transporting",
          },
          {
            key: "shippingScreenRipped",
            value: "Screen Ripped",
          },
          {
            key: "shippingScreenMissing",
            value: "Screen Missing",
          },
          {
            key: "shippingCouldNotFindInYard",
            value: "Could Not Find In Yard",
          },
        ],
      },
      {
        key: "PurchasingIssues",
        value: "Purchasing Issues",
        options: [
          {
            key: "outOfStock",
            value: "Out-of-Stock",
          },
          {
            key: "backOrdered",
            value: "Back Ordered",
          },
        ],
      },
      {
        key: "CustomerIssues",
        value: "Customer Issues",
        options: [
          {
            key: "customerRejectedWindow",
            value: "Customer Rejected Window",
          },
          {
            key: "customerRejectedDoor",
            value: "Customer Rejected Door",
          },
        ],
      },
      {
        key: "AppearanceIssues",
        value: "AppearanceIssues",
        options: [
          {
            key: "silicone",
            value: "Silicone",
          },
          {
            key: "dirtyFrameSash",
            value: "Dirty Frame/Sash",
          },
        ],
      },
      {
        key: "Remeasure",
        value: "Remeasure",
        options: [
          {
            key: "incorrectSize",
            value: "Incorrect Size",
          },
          {
            key: "incorrectDesign",
            value: "Incorrect Design",
          },
          {
            key: "incorrectQuantity",
            value: "Incorrect Quantity",
          },
          {
            key: "incorrectGlass",
            value: "Incorrect Glass",
          },
        ],
      },
    ],
  },
];

export const ManufacturingFacilityFilter = {
  key: "manufacturingFacility",
  label: "ManufacturingFacility",
  fields: [
    { key: "langley", label: "Langley", value: true, type: "checkbox" },
    { key: "calgary", label: "Calgary", value: true, type: "checkbox" },
  ],
};

export const MenuActions = {
  batchReschedule: "batchReschedule",
  batchStatusUpdate: "batchStatusUpdate",
};

export const MissingData = "missingData";

export const InstallationNoteCategories = [
  { label: "General", value: "General", color: "blue" },
  { label: "Installation", value: "Installation", color: "green" },
  { label: "High Risk", value: "High Risk", color: "red" },
  //{ label: "Re-Measure", value: "Re-Measure", color: "volcano" },
  { label: "Admin", value: "Admin", color: "geekblue" },
  { label: "Customer", value: "Customer", color: "purple" },
];

export const InstallationCallLogCategories = [
  { label: "Left Message", value: "Left Message", color: "green" },
  {
    label: "Spoke With Customer",
    value: "Spoke With Customer",
    color: "geekblue",
  },
  {
    label: "No Answering Machine",
    value: "No Answering Machine",
    color: "red",
  },
];

export const DataTypes = {
  number: "number",
  currency: "currency",
  text: "text",
};

export const InstallationWeekDayTableColumns = [
  { key: "workOrders", value: "Work Orders", type: DataTypes.number },
  { key: "windows", value: "Windows", type: DataTypes.number },
  { key: "codelDoors", value: "Codel Doors", type: DataTypes.number },
  { key: "patioDoors", value: "Patio Doors", type: DataTypes.number },
  { key: "salesAmount", value: "Sales Amount", type: DataTypes.currency },
  { key: "salesTarget", value: "Sales Target", type: DataTypes.currency },
  { key: "salesDiff", value: "Sales Diff", type: DataTypes.currency },
  { key: "asbestosJobs", value: "Asbestos Jobs", type: DataTypes.number },
  {
    key: "woodDropOffJobs",
    value: "Wood Drop Off Jobs",
    type: DataTypes.number,
  },
  {
    key: "highRiskJobs",
    value: "High Risk Jobs",
    type: DataTypes.number,
  },
  { key: "leadPaint", value: "Lead Paint", type: DataTypes.number },
  {
    key: "windowInstallLBR",
    value: "Window Install LBR",
    type: DataTypes.number,
  },
  {
    key: "patioDoorInstallLBR",
    value: "Patio Door Install LBR",
    type: DataTypes.number,
  },
  {
    key: "codelDoorInstallLBR",
    value: "Codel Door Install LBR",
    type: DataTypes.number,
  },
  {
    key: "totalInstallLBR",
    value: "Total Install LBR",
    type: DataTypes.number,
  },
  {
    key: "actualInstallMins",
    value: "Actual Install Minutes",
    type: DataTypes.number,
  },
  {
    key: "installLBRDiff",
    value: "Install LBR Diff",
    type: DataTypes.number,
  },
  {
    key: "sidingLBRBudget",
    value: "Siding LBR Budget",
    type: DataTypes.currency,
  },
  {
    key: "sidingLBRMin",
    value: "Siding LBR Min",
    type: DataTypes.number,
  },
  { key: "sidingSQF", value: "Siding SQF", type: DataTypes.number },
  {
    key: "hazardousLBRMin",
    value: "Hazardous LBR Min",
    type: DataTypes.number,
  },
  { key: "ffiMin", value: "FFI Min", type: DataTypes.number },
  { key: "ffrMin", value: "FFR Min", type: DataTypes.number },
];

export const RemeasureWeekDayTableColumns = [
  { key: "workOrders", value: "Work Orders", type: DataTypes.number },
  { key: "windows", value: "Windows", type: DataTypes.number },
  { key: "codelDoors", value: "Codel Doors", type: DataTypes.number },
  { key: "patioDoors", value: "Patio Doors", type: DataTypes.number },
  { key: "salesAmount", value: "Sales Amount", type: DataTypes.currency },
  { key: "salesTarget", value: "Sales Target", type: DataTypes.currency },
  { key: "salesDiff", value: "Sales Diff", type: DataTypes.currency },
  { key: "asbestosJobs", value: "Asbestos Jobs", type: DataTypes.number },
  {
    key: "woodDropOffJobs",
    value: "Wood Drop Off Jobs",
    type: DataTypes.number,
  },
  {
    key: "highRiskJobs",
    value: "High Risk Jobs",
    type: DataTypes.number,
  },
  { key: "leadPaint", value: "Lead Paint", type: DataTypes.number },
  {
    key: "remeasureLBR",
    value: "Remeasure LBR",
    type: DataTypes.number,
  },
];

export const OrderFilters = [
  {
    key: "service",
    values: [
      {
        key: "sosi",
        label: "SO / SI",
        fields: [
          {
            key: "so",
            label: "Supply only",
            value: true,
            type: "checkbox",
          },
          {
            key: "si",
            label: "Supply and Install",
            value: true,
            type: "checkbox",
          },
        ],
      },
      // {
      //   key: "residentialType",
      //   label: "Residential Type",
      //   fields: [
      //     {
      //       key: "sf",
      //       label: "Single Family",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "mf",
      //       label: "Multi Family",
      //       value: true,
      //       type: "checkbox",
      //     },
      //   ],
      // },
    ],
  },
  {
    key: "remake",
    values: [
      // {
      //   key: "serviceRecord",
      //   label: "Service Record",
      //   fields: [
      //     {
      //       key: "cancelledService",
      //       label: "Cancelled Service",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "closedServiceOrder",
      //       label: "Closed Service Order",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "closedServiceQuote",
      //       label: "Closed Service Quote",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "newServiceDraft",
      //       label: "New Service Draft",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "readyToInvoice",
      //       label: "Ready To Invoice",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "rejectedService",
      //       label: "Rejected Service",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "rejectedServiceCosting",
      //       label: "Rejected Service Costing",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "rejectedServiceDraft",
      //       label: "Rejected Service Draft",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "scheduledService",
      //       label: "Scheduled Service",
      //       value: true,
      //       type: "checkbox",
      //     },
      //     {
      //       key: "serviceInProgress",
      //       label: "Service in Progress",
      //       value: true,
      //       type: "checkbox",
      //     },
      //   ],
      // },
      // {
      //   key: "branch",
      //   label: "Branch",
      //   fields: [
      //     { key: "calgary", label: "Calgary", value: true, type: "checkbox" },
      //     { key: "kelowna", label: "Kelowna", value: true, type: "checkbox" },
      //     { key: "langley", label: "Langley", value: true, type: "checkbox" },
      //     { key: "nanaimo", label: "Nanaimo", value: true, type: "checkbox" },
      //     { key: "victoria", label: "Victoria", value: true, type: "checkbox" },
      //   ],
      // },
    ],
  },
];

export const OrderTypes = [
  { key: "service", value: "Service", type: "single" },
  { key: "remake", value: "Remake", type: "single" },
];

export const Provinces = {
  bc: "BC",
  ab: "AB",
  all: "All",
};
export const ProvinceFilter = {
  key: "provinceFilter",
  label: "Province",
  fields: [
    { key: "bc", label: "BC", value: true, type: "checkbox" },
    { key: "ab", label: "AB", value: true, type: "checkbox" },
  ],
};

export const ResultType = {
  success: "success",
  error: "error",
};

export const ManufacturingFacility = "manufacturingFacility";
export const Calgary = "calgary";
export const Langley = "langley";

export const LangleyLabel = "Langley";
export const CalgaryLabel = "Calgary";
export const AllLabel = "All";

// NOTE: MAKE SURE THIS MATCHES PERMISSIONS CONFIGURATION in permissions.centra.ca
export const FEATURE_ACCESS_TYPES = {
  View: "canView",
  Add: "canAdd",
  Edit: "canEdit",
  Delete: "canDelete",
};

export const FEATURE_CODES = {
  Service: "om.srv",
  ServiceNotes: "om.srv.notes",
  ServiceCallLogs: "om.srv.calllogs",
  ServiceDocuments: "om.srv.docs",
  ServicePhotos: "om.srv.photos",
  Remake: "om.remake",
  RemakeAttachments: "om.remake.attachments",
};
