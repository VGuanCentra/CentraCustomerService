// /*
//  * VGuan Add PageLayoutAuth
//  */

// import React, { ReactNode, useState } from "react";
// import TopBar from "msallib/navbar/components/TopBar";
// import router from "next/router";
// import { useAuthData } from "../../context/authContext";

// function PageLayoutAuth({ children }) {
//   // const [navParams, setNavParams] = useState<any[]>([]);
//   const activeCurrentFeature = "customerService";
//   let appCode =
//     typeof window !== "undefined" &&
//     (window?.location?.href?.includes("/service?status=scheduled") ||
//       window?.location?.href?.includes("/remake"))
//       ? "OM"
//       : "WC";
//   const { onAuthNavAction } = useAuthData();

//   return (
//     // Not put here !!! ==> <AuthDataProvider> <== Not put here !!!
//     <>
//       <TopBar
//         v=""
//         options={{
//           zIndex: 999,
//           onAction: onAuthNavAction,
//           // onRoute: async (path: string, params: any) => {
//           onRoute: async (path, params) => {
//             await router.push(path);
//             return true;
//           },
//           appCode: appCode,
//         }}
//         className="navbarStyle"
//         activeFeature={activeCurrentFeature}
//       >
//         <></>
//         {/* Move into TopBar NOT use childern */}
//         {/* <div style={{ marginTop: "-3px" }}>
//             <Popover
//               content={userInfoContent}
//               trigger="hover"
//               placement="bottom"
//             >
//               <i className="fa-solid fa-user-gear text-xs"></i>
//             </Popover>
//             {isReadOnly && (
//               <Tooltip title="Ready-only mode">
//                 <i className="fa-solid fa-lock text-xs ml-3"></i>
//               </Tooltip>
//             )}
//           </div> */}
//       </TopBar>
//       <br />
//       <br />
//       {children}
//     </>
//     // </AuthDataProvider>
//   );
// };

// export default PageLayoutAuth;
