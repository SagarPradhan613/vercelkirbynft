import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


import { WagmiConfig, createConfig ,configureChains } from "wagmi";
import { publicProvider } from '@wagmi/core/providers/public'
import { fantom } from 'wagmi/chains';
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";

// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'


const { chains, publicClient, webSocketPublicClient } = configureChains(
  [fantom],
  [
    publicProvider(),
  ],
)



const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
  
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID ?? '3503f54f4af9f3a448774f9a20a75584',
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: (detectedName) =>
          `Injected (${
            typeof detectedName === 'string'
              ? detectedName
              : detectedName.join(', ')
          })`,
        shimDisconnect: true,
      },
    })
  ],
  publicClient,
  webSocketPublicClient,
})


// const config = createConfig(
//   getDefaultConfig({
//     appName: 'KirbyNFT',
//     //infuraId: process.env.REACT_APP_INFURA_ID,
//     //alchemyId:  process.env.REACT_APP_ALCHEMY_ID,
//     chains: [fantomTestnet, fantom],
//     walletConnectProjectId: '3503f54f4af9f3a448774f9a20a75584',
//   })
// );




const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      {/* <ConnectKitProvider theme="retro" mode="dark"> */}
        <App />
      {/* </ConnectKitProvider> */}
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
