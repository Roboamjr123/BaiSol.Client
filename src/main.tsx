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

const syncfusionLicense = import.meta.env.VITE_APP_SYNCFUSION_LICENSE;

registerLicense(
  syncfusionLicense
  // `Ngo9BigBOggjHTQxAR8/V1NDaF5cWGFCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH9eeHRSQmNdVURzVkY=`
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
