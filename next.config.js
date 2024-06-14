/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  env: {
    NEXT_PUBLIC_BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,

    NEXT_PUBLIC_SERVICE_POST_COMMON_Transit:
      process.env.NEXT_PUBLIC_SERVICE_POST_COMMON_Transit,
    NEXT_PUBLIC_SERVICE_POST_COMMON_UpdateEventSchedule:
      process.env.NEXT_PUBLIC_SERVICE_POST_COMMON_UpdateEventSchedule,

    NEXT_PUBLIC_SERVICE_GET_ServicesByRange:
      process.env.NEXT_PUBLIC_SERVICE_GET_ServicesByRange,
    NEXT_PUBLIC_SERVICE_GET_AllServiceWorkOrders:
      process.env.NEXT_PUBLIC_SERVICE_GET_AllServiceWorkOrders,
    NEXT_PUBLIC_SERVICE_GETServiceByServiceId:
      process.env.NEXT_PUBLIC_SERVICE_GETServiceByServiceId,
    NEXT_PUBLIC_SERVICE_GETServiceReturnTrips:
      process.env.NEXT_PUBLIC_SERVICE_GETServiceReturnTrips,
    NEXT_PUBLIC_SERVICE_GETServiceCountByStatus:
      process.env.NEXT_PUBLIC_SERVICE_GETServiceCountByStatus,
    NEXT_PUBLIC_SERVICE_GETServicesPaginated:
      process.env.NEXT_PUBLIC_SERVICE_GETServicesPaginated,
    NEXT_PUBLIC_SERVICE_POSTAddService:
      process.env.NEXT_PUBLIC_SERVICE_POSTAddService,
    NEXT_PUBLIC_SERVICE_GETServiceCountByAssignedToMe:
      process.env.NEXT_PUBLIC_SERVICE_GETServiceCountByAssignedToMe,
    NEXT_PUBLIC_SERVICE_GETServicesByWO:
      process.env.NEXT_PUBLIC_SERVICE_GETServicesByWO,
    NEXT_PUBLIC_SERVICE_GETServiceById:
      process.env.NEXT_PUBLIC_SERVICE_GETServiceById,
    NEXT_PUBLIC_SERVICE_DeleteServiceReturnTrip:
      process.env.NEXT_PUBLIC_SERVICE_DeleteServiceReturnTrip,
    NEXT_PUBLIC_SERVICE_DeleteService:
      process.env.NEXT_PUBLIC_SERVICE_DeleteService,

    NEXT_PUBLIC_SERVICE_POSTSaveServiceReturnTrip:
      process.env.NEXT_PUBLIC_SERVICE_POSTSaveServiceReturnTrip,
    NEXT_PUBLIC_SERVICE_POSTScheduleService:
      process.env.NEXT_PUBLIC_SERVICE_POSTScheduleService,
    NEXT_PUBLIC_SERVICE_POSTUpdateService:
      process.env.NEXT_PUBLIC_SERVICE_POSTUpdateService,
    NEXT_PUBLIC_SERVICE_POSTUpdateServiceAssignedAdmin:
      process.env.NEXT_PUBLIC_SERVICE_POSTUpdateServiceAssignedAdmin,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    config.module.rules.push({
      test: /\.webp$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[name].[contenthash].[ext]",
            outputPath: "static/images/",
            publicPath: "/_next/static/images/",
          },
        },
      ],
    });
    return config;
  },
  images: {
    unoptimized: true,
  },
};
