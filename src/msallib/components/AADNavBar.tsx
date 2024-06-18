// /*
//  * VGuan AADNavBar.tsx
//  *
//  */

// import React, { useEffect, useState } from "react";
// import cn from "classnames";
// import styles from "./aadNavBar.styles.module.scss";

// function AADNavBar({
//   v,
//   options = {},
//   className,
//   children,
//   activeFeature,
//   autoClose = true,
//   ...rest
// }) {
//   return (
//     <>
//       <div className={cn(styles.root, className)} {...rest}>
//         <div className={styles.header}>
//           <div
//             className={cn(styles.menu_icon, classNameIcon)}
//             onClick={handleDisplay}
//           >
//             <div style={{ height, width }}>
//               <IconDashboard title={`global navigation ${getNewVersion()}`} />
//             </div>
//           </div>

//           <span className={styles.title}>
//             <span className={styles.brand_title}>
//               <img className={styles.logo} src={LogoWhite} />
//             </span>
//             {subTitle ? (
//               <a href="/" className={styles.sub_title}>
//                 {subTitle?.displayName}
//               </a>
//             ) : null}
//           </span>

//           <div>{children}</div>
//         </div>
//         {user && !isMobileV ? (
//           <div className={styles.account}>
//             welcome, {user?.name}{" "}
//             <span className={styles.logout} onClick={handleLogout}>
//               logout
//             </span>
//           </div>
//         ) : null}
//       </div>

//       <div
//         className={cn(
//           styles.nav_container,
//           classNameContainer,
//           isMobile ? styles.mobile : ""
//         )}
//         style={{
//           zIndex: zIndex + 1,
//           display: show ? "block" : "none", // note: css will be loaded slower, so put it in style
//           ...alignStyle,
//         }}
//       >
//         <div className={styles.nav_header}>
//           <div className={styles.title}>
//             <div
//               className={cn(styles.menu_icon, classNameIcon)}
//               onClick={handleDisplay}
//             >
//               <IconDashboard
//                 className={styles.icon}
//                 style={{ height, width }}
//               />
//             </div>
//             <span className={styles.brand_title}>
//               <img className={styles.logo} src={LogoBlue} />
//             </span>
//           </div>
//           {isMobileV && (
//             <div className={styles.logout} onClick={handleLogout}>
//               logout
//             </div>
//           )}
//         </div>
//         <div className={styles.search}>
//           <input
//             placeholder="Filter App..."
//             value={queryText}
//             onChange={(e) => setQueryText(e.target.value)}
//             onKeyDown={handleKeydown}
//             ref={inputRef}
//           />
//           <IconSearch className={styles.searchicon} />
//         </div>
//         <div className={styles.nav_items_container}>{jsxNavArea}</div>
//       </div>
//       {show && (
//         <div
//           style={{ zIndex }}
//           className={styles.overlay}
//           onClick={handleDisplay}
//         ></div>
//       )}
//     </>
//   );
// };

// export default AADNavBar;
