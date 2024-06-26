import { createBrowserRouter } from "react-router-dom";
import App from "@src/App.jsx";
import StudentLogin from "@components/Student/Login/Login.jsx";
import ErrorPage from "@components/Error/error-page.jsx";
import Classes from "@components/Student/Classes/Classes.jsx";
import AdminLogin from "@components/Admin/Login/Login";
import Dashboard from "@components/Admin/Dashboard/Dashboard.jsx";
import Logout from "@components/Student/Logout/Logout";
import { studentLoader } from "@services/loaders/studentLoader";
import { studentsLoader } from "@services/loaders/studentsLoader";

/**
 * Router configuration for the application using react-router-dom.
 *
 * @type {Object}
 * @property {Array} routes - Array of route objects.
 * @property {string} routes.path - Path for the route.
 * @property {JSX.Element} routes.element - Component to be rendered for the route.
 * @property {Function} [routes.loader] - Optional loader function to fetch data before rendering the component.
 * @property {JSX.Element} [routes.errorElement] - Optional component to be rendered in case of an error.
 * @property {Array} [routes.children] - Optional array of child routes.
 */
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

export default router;
