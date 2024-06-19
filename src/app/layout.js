"use client";

import MyMsalProvider from "../msallib/msal/myMsalProvider";
import PageLayoutAuth from "../msallib/components/PageLayoutAuth";

/* eslint-disable @next/next/no-sync-scripts */
import "./globals.css";
import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import store from "../app/redux/store.js";
import { Provider } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import { CookiesProvider } from "react-cookie";
import { QueryClientProvider, QueryClient } from "react-query";
import InnerLayout from "../app/innerLayout";
import Fallback from "app/components/templates/fallback/fallback";
import { AuthDataProvider } from "../context/authContext";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  /* Error Boundary Callback */
  const logError = (error, info) => {
    console.log("error: ", error);
    console.log("info: ", info);
  };

  return (
    <html lang="en" className="h-full w-full fixed">
      <head>
        <title id="app-title">Centra Web Calendar</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"
        />
      </head>
      <body className={`${inter.className} h-full w-full`}>
        <MyMsalProvider>
          <main>
            <QueryClientProvider client={queryClient}>
              <Provider store={store}>
                <ErrorBoundary FallbackComponent={Fallback} onError={logError}>
                  <CookiesProvider>
                    <AuthDataProvider>
                      <PageLayoutAuth>
                        <InnerLayout>{children}</InnerLayout>
                      </PageLayoutAuth>
                    </AuthDataProvider>
                  </CookiesProvider>
                </ErrorBoundary>
              </Provider>
            </QueryClientProvider>
          </main>
        </MyMsalProvider>
      </body>
    </html>
  );
}
