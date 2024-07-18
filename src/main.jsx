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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

dayjs.extend(customParseFormat);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <QueryClientProvider client={queryClient}>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      defaultColorScheme="auto"
    >
      <ModalsProvider>
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  </QueryClientProvider>
);
