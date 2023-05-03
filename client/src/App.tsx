import {
  AuthBindings,
  Authenticated,
  GitHubBanner,
  Refine,
} from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { MuiInferencer } from "@refinedev/inferencer/mui";
import {
  ErrorComponent,
  RefineSnackbarProvider,
  notificationProvider,
} from "@refinedev/mui";

import {
  AccountCircleOutlined,
  ChatBubbleOutlined,
  PeopleAltOutlined,
  StarOutlineRounded,
  VillaOutlined,
} from '@mui/icons-material'

import { ThemedLayoutV2 } from "@refinedev/mui";
import { CustomHeader } from "components/themedLayout/header";
import { CustomSider } from "components/themedLayout/sider";
import { CustomTitle} from "components/themedLayout/title";

import { CssBaseline, GlobalStyles } from "@mui/material";
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import axios, { AxiosRequestConfig } from "axios";
import { ColorModeContextProvider } from "contexts/color-mode";
import { CredentialResponse } from "interfaces/google";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "pages/categories";
import { Login } from "pages/login";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { parseJwt } from "utils/parse-jwt";
import { light } from "@mui/material/styles/createPalette";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (request.headers) {
    request.headers["Authorization"] = `Bearer ${token}`;
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
});

function App() {
  const authProvider: AuthBindings = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      if (profileObj) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...profileObj,
            avatar: profileObj.picture,
          })
        );

        localStorage.setItem("token", `${credential}`);

        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
      };
    },
    logout: async () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return {};
        });
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Token not found",
        },
        logout: true,
        redirectTo: "/login",
      };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user);
      }

      return null;
    },
  };

  return (
    <BrowserRouter>
      <GitHubBanner />

        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
              notificationProvider={notificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={[
                {
                  name: "property",
                  list : MuiInferencer,
                  icon : <VillaOutlined/>,
                  meta: {
                    canDelete: true,
                  },
                },
                {
                  name: "agent",
                  list : MuiInferencer,
                  icon : <PeopleAltOutlined/>,
                  meta: {
                    canDelete: true,
                  },
                },
                {
                  name: "review",
                  list : MuiInferencer,
                  icon : <StarOutlineRounded/>,
                  meta: {
                    canDelete: true,
                  },
                },
                {
                  name: "message",
                  list : MuiInferencer,
                  icon : <ChatBubbleOutlined/>,
                  meta: {
                    canDelete: true,
                  },
                },
                {
                  name: "my-profile",
                  options : {label : 'My Profile'},
                  list : MuiInferencer,
                  icon : <AccountCircleOutlined/>,
                  meta: {
                    canDelete: true,
                  },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                      <ThemedLayoutV2 Header={() => <CustomHeader/>}
                                    Sider={() => <CustomSider
                                      Title={({ collapsed }) => (
                                        <CustomTitle collapsed={collapsed} />
                                    )}
                                    />}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                </Route>
                <Route
                  element={
                    <Authenticated fallback={<Outlet />}>
                      <NavigateToResource resource="blog_posts" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                </Route>

                <Route
                  element={
                    <Authenticated>
                      <ThemedLayoutV2 Header={() => <CustomHeader/>}
                                    Sider={() => <CustomSider
                                      Title={({ collapsed }) => (
                                        <CustomTitle collapsed={collapsed} />
                                    )}
                                    />}
                        >
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
              </Routes>
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
    </BrowserRouter>
  );
}

export default App;
