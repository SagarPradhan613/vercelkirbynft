import React, { ReactElement, useEffect } from "react";
// import { ConnectKitButton } from 'connectkit';

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import HomePage from "./pages/HomePage";
// import { Col } from "react-bootstrap";
import Footer from "./components/Footer";
import { useNetwork, useSwitchNetwork } from "wagmi";

const App = (): ReactElement<React.FC> => {
  const { chain } = useNetwork();
  const { chains, error, pendingChainId, switchNetwork, status } =
    useSwitchNetwork();

  useEffect(() => {
    if (switchNetwork) {
      switchNetwork(chains[0].id);
    }
  }, [chain]);

  return (
    <>
      <div className="main-wrapper relative">
        {/* <ConnectKitButton /> */}
        <HomePage />
        <div className="w-full  flex md:hidden fixed bottom-0 py-4 px-4 justify-around gap-6 bg-[#1e2b45]">
          <a href="/" className="head-links cursor-pointer">TRADE</a>
          <a href="/" className="head-links cursor-pointer ">SWAP</a>
          <div className="spcl-container">
            <svg className="svg-hover" width="31" height="5" viewBox="0 0 31 5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="2.5" cy="2.5" r="2.5" fill="#FF720D" />
              <circle cx="15.5" cy="2.5" r="2.5" fill="#FF720D" />
              <circle cx="28.5" cy="2.5" r="2.5" fill="#FF720D" />
            </svg>
          </div>
        </div>
      </div>
      {/* <Footer /> */}


    </>
  );
};

export default App;
