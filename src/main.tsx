import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { Provider } from "react-redux";
import { store } from "./app/Store.ts";
import { BrowserRouter as Router } from "react-router-dom";
import { registerLicense } from "@syncfusion/ej2/base";
import TestImage from "./TestImage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomAreaChart from "./Admin/components/report/ChartSample.tsx";

registerLicense(
  // import.meta.env.VITE_APP_SYNCFUSION_LICENSE
  `Ngo9BigBOggjHTQxAR8/V1NDaF5cWGFCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH9eeHRSQmNdVURzVkY=`
);

disableReactDevTools();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <Router>
          <App />
        </Router>
      </NextUIProvider>
    </Provider>
  </React.StrictMode>
);
