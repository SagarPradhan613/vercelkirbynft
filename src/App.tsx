import React, { ReactElement, useEffect } from "react";
// import { ConnectKitButton } from 'connectkit';

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import HomePage from "./pages/HomePage";
import { Col } from "react-bootstrap";
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
      <Col className="main-wrapper">
        {/* <ConnectKitButton /> */}
        <HomePage />
      </Col>
      <Footer />
    </>
  );
};

export default App;
