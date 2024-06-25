import React, { createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "@src/App.jsx";
import Login from "@components/Login.jsx";
import ErrorPage from "@src/error-page.jsx";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./index.css";
import Classes from "@components/Classes.jsx";
import AdminLogin from "@components/AdminLogin.jsx";
import AdminContextProvider from "@components/AdminContextProvider.jsx";
import Dashboard from "@components/Dashboard/Dashboard.jsx";
import { studentLoader } from "@services/loaders/studentLoader";
import { studentsLoader } from "@services/loaders/studentsLoader";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ModalsProvider } from "@mantine/modals";
import Logout from "@components/Logout/Logout";

dayjs.extend(customParseFormat);

export const AdminAuthContext = createContext({
  user: null,
  setUser: () => {},
});

function AdminAuth({ children, redirectTo }) {
  const { user } = useContext(AdminAuthContext);
  if (user) {
    return children;
  } else {
    return <Navigate to={redirectTo} replace={true} />;
  }
}

function GuestOnly({ children, redirectTo }) {
  const { user } = useContext(AdminAuthContext);
  if (!user) {
    return children;
  } else {
    return <Navigate to={redirectTo} replace={true} />;
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/students/:studentId",
        element: <Classes />,
        loader: studentLoader,
      },
      { path: "/", element: <Login /> },
      {
        path: "/students/:studentId/loggedout",
        element: <Logout />,
        loader: studentLoader,
      },
      // { path: '/admin', element: <Admin />}
    ],
  },
  // {
  //   path: '/students/:studentId',
  //   element: <Classes />,
  //   errorElement: <ErrorPage />,
  //   loader: studentLoader,
  // },
  {
    path: "/admin",
    loader: studentsLoader,
    element: (
      // <AdminAuth redirectTo="/admin/login">
      <Dashboard />
      // </AdminAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/login",
    element: (
      // <GuestOnly redirectTo="/admin">
      <AdminLogin />
      // </GuestOnly>
    ),
    errorElement: <ErrorPage />,
  },
  // {
  //   path: '/admin',
  //   element: <Admin />,
  //   errorElement: <ErrorPage />,
  // },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS defaultColorScheme="auto">
    <ModalsProvider>
      <RouterProvider router={router} />
    </ModalsProvider>
  </MantineProvider>
);
