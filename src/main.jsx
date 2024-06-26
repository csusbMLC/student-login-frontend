import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import router from "@src/Router";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./index.css";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS defaultColorScheme="auto">
    <ModalsProvider>
      <RouterProvider router={router} />
    </ModalsProvider>
  </MantineProvider>
);
