// import axios from "axios";
// import { getToken } from "../msalLib/msal";

// // export async function callWebApiByAxios(url) {
// export async function getWebApiByAxios(url) {
//   console.log("using axios ....");
//   var accessToken = "";
//   //getToken;
//   await getToken().then((response) => {
//     // console.log("Azure AD accessToken ...." + response);
//     accessToken = response;
//     //alert(`token is ${response}`);
//   });

//   const apiResponse = await axios.get(url, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   return apiResponse.data;
// }

// export async function postWebApiByAxios(url) {
//   console.log("using axios ....");
//   var accessToken = "";
//   //getToken;
//   await getToken().then((response) => {
//     // console.log("Azure AD accessToken ...." + response);
//     accessToken = response;
//     //alert(`token is ${response}`);
//   });

//   const apiResponse = await axios.post(url, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   return apiResponse.data;
// }

// /**
//  *
//  * @param accessToken
//  */
// export async function callWebApiByFetch(accessToken, url) {
//   // call API
//   const headers = new Headers();
//   const bearer = `Bearer ${accessToken}`;

//   headers.append("Authorization", bearer);

//   const options = {
//     method: "GET",
//     headers: headers,
//   };

//   return fetch(url, options)
//     .then((response) => response.json())
//     .catch((error) => console.log(error));
// }

// // export default function GetTokenTestPage() {
// //   useEffect(() => {
// //     async function fetchToken() {
// //       await getToken().then((response) => {
// //         alert(`token is ${response}`);
// //       });
// //     }
// //     fetchToken();
// //   });
// // }
