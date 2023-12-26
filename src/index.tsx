import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


import { WagmiConfig, createConfig } from "wagmi";
import { fantomTestnet, fantom } from 'wagmi/chains';
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";


const config = createConfig(
  getDefaultConfig({
    appName: 'KirbyNFT',
    //infuraId: process.env.REACT_APP_INFURA_ID,
    //alchemyId:  process.env.REACT_APP_ALCHEMY_ID,
    chains: [fantomTestnet, fantom],
    walletConnectProjectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID!,
  })
);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ConnectKitProvider theme="retro" mode="dark">
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
