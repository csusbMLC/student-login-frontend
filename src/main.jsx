import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "@src/App.jsx";
import StudentLogin from "@components/Student/Login/Login.jsx";
import ErrorPage from "@src/components/Error/error-page.jsx";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./index.css";
import Classes from "@src/components/Student/Classes/Classes.jsx";
import AdminLogin from "@src/components/Admin/Login/Login";
import Dashboard from "@components/Admin/Dashboard/Dashboard.jsx";
import { studentLoader } from "@services/loaders/studentLoader";
import { studentsLoader } from "@services/loaders/studentsLoader";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ModalsProvider } from "@mantine/modals";
import Logout from "@src/components/Student/Logout/Logout";

dayjs.extend(customParseFormat);

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
      { path: "/", element: <StudentLogin /> },
      {
        path: "/students/:studentId/loggedout",
        element: <Logout />,
        loader: studentLoader,
      },
    ],
  },
  {
    path: "/admin",
    loader: studentsLoader,
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS defaultColorScheme="auto">
    <ModalsProvider>
      <RouterProvider router={router} />
    </ModalsProvider>
  </MantineProvider>
);
