import AppProvider from "./provider";
import AppRouter from "./routes";
import Modal from "./components/shared/modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { WagmiProvider } from "wagmi";
import store from "@/store/redux";
import { CWagmiConfig } from "./utils/crypto";
import Loading from "./components/shared/loading";
import { Suspense } from "react";

export default function App() {
  return (
    <AppProvider>
      <Suspense fallback={<Loading />}>
        <WagmiProvider config={CWagmiConfig}>
          <Provider store={store}>
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar
              newestOnTop={false}
              limit={1}
              rtl={false}
              closeOnClick
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover
              theme="light"
            />
            <Modal />
            <AppRouter />
          </Provider>
        </WagmiProvider>
      </Suspense>
    </AppProvider>
  );
}
