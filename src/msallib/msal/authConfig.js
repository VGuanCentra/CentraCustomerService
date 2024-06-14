const CLIENT_ID = "b1e9cca5-d8ef-4166-a20a-b2c42fec330a";
export const API_SCOPE = "api://" + CLIENT_ID + "/api.scope";
export const API_SCOPE_VGuanDemoScope =
  "api://" + CLIENT_ID + "/VGuanDemoScope";

export const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority:
      "https://login.microsoftonline.com/7c9bfdbe-55d0-49a9-b43e-c01229dc857e",
    // redirectUri: "https://centra-customer-service.vercel.app/",
    redirectUri: "https://centra-customer-service.vercel.app",
    // redirectUri: "http://localhost:3000/",
    postLogoutRedirectUri: "/",
    scope: API_SCOPE,
    domain: "centrawindows.com",
  },
  cache: {
    // Optional
    cacheLocation: "localStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

export const loginRequest = {
  scopes: [API_SCOPE, API_SCOPE_VGuanDemoScope],
};

export const userDataLoginRequest = {
  scopes: ["user.read"],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
