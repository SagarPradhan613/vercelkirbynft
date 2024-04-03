import React, { useEffect, useState } from "react";
import Header from "../components/Header";
// import { div, Row, Image, Container } from "react-bootstrap";
import Images from "../shared/Images";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
// import { truncateSync } from "fs";

import {
  useAccount,
  useNetwork,
  useEnsName,
  useConnect,
  useSwitchNetwork,
} from "wagmi";
import { getContract, getWalletClient } from "@wagmi/core";
import { inoabi } from "../abis/ino";
import BigNumber from "bignumber.js";
import { writeContract } from "@wagmi/core";
import { ethers } from "ethers";

const inoAdd = process.env.REACT_APP_INO;

const HomePage = () => {
  const [mintValue, setmintValue] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [showConnect, setShowConnect] = useState(false);
  const [showMint, setShowMint] = useState(false);
  const [congatulationModal, setCongatulationModal] = useState(false);
  const [sorryModal, setSorryModal] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [mintLength, setMintLength] = useState([]);

  const [isMintLive, setisMintLive] = useState(false);
  const [priceWei, setPriceWei] = useState(0);
  const [price, setPrice] = useState(0);
  const [decimal, setDecimal] = useState(0);
  const [remaining, setremaining] = useState(0);
  const [userTokenBal, setuserTokenBal] = useState(0);
  const [isWhiteListed, setisWhiteListed] = useState(false);
  const [totalMint, settotalMint] = useState(0);
  const [nftData, setNftData] = useState([]);
  const { chain } = useNetwork();
  const etherProvider = new ethers.providers.JsonRpcProvider(
    chain?.rpcUrls?.public?.http[0]
  );

  const { connect, connectors, isLoading, pendingConnector } = useConnect();

  const metaMaskConnector = connectors[0];
  const walletConnectConnector = connectors[1];
  const injectedConnector = connectors[2];

  const { address, connector } = useAccount();
  // console.log("addres", address);

  const inoContract = getContract({
    address: inoAdd,
    abi: inoabi,
  });

  useEffect(() => {
    const globalCalls = async () => {
      try {
        const ismintLive = await inoContract.read.claimenabled();
        setisMintLive(ismintLive);

        setDecimal(18);
        const priceWei = await inoContract.read.price();
        setPriceWei(priceWei);

        const price = new BigNumber(priceWei).div(1e18);
        setPrice(price.toFixed());
      } catch (error) {
        console.error(error);
      }
    };

    const totalMintCalls = async () => {
      try {
        const totalmint = await inoContract.read.claimIndex();
        settotalMint(Number(totalmint));
      } catch (error) {
        console.error(error);
      }
    };

    const userCalls = async () => {
      try {
        if (address) {
          const decimal = 18;
          const remainingContr = await inoContract.read.remainigContribution([
            address,
          ]);
          if (price) {
            const mintable = new BigNumber(remainingContr)
              .div(price)
              .div(`1e${Number(decimal)}`);
            setremaining(mintable.toFixed(0));
          }

          const balance = await inoContract.read.checkbalance([address]);
          setuserTokenBal(balance);

          const isWhitelisted = await inoContract.read.isWhitelisted([address]);
          setisWhiteListed(isWhitelisted);
        }
      } catch (error) {
        console.error(error);
      }
    };

    globalCalls(); // Call globalCalls once

    if (address) {
      userCalls(); // Call userCalls initially if address is present
    }

    totalMintCalls();

    const userCallsInterval =
      address &&
      setInterval(() => {
        userCalls(); // Call userCalls repeatedly at the specified interval only if address is present
      }, 5000); // Adjust the interval time as needed (5000 milliseconds in this example)

    const mintInterval = setInterval(() => {
      totalMintCalls(); // Call userCalls repeatedly at the specified interval only if address is present
    }, 5000); // Adjust the interval time as needed (5000 milliseconds in this example)

    // Clear the interval when the component unmounts or when the dependency array changes
    return () => {
      clearInterval(userCallsInterval);
      clearInterval(mintInterval);
    };
  }, [address, inoContract]);

  const incrementMint = () => {
    if (mintValue + 1 > remaining) {
      setmintValue(remaining);
      return;
    }
    setmintValue(mintValue + 1);
  };
  const decrementMint = () => {
    mintValue > 0 ? setmintValue(mintValue - 1) : setmintValue(0);
  };
  const handleCloseConnect = () => {
    setShowConnect(false);
  };
  const handleShowConnect = () => {
    setShowConnect(true);
  };
  const handleCloseMint = () => {
    setShowMint(false);
  };
  const handleShowMint = () => {
    if (mintValue !== 0) {
      setShowMint(true);
    }
  };
  const handleCloseCngratulationModal = () => {
    setCongatulationModal(false);
  };
  const handleShowCongatulation = async () => {
    try {
      const isWhitelisted = await inoContract.read.isWhitelisted([
        walletAddress,
      ]);
      isWhitelisted ? setCongatulationModal(true) : setSorryModal(true);
    } catch (error) {
      throw error;
    }
  };
  const handleCloseSorryModal = () => {
    setSorryModal(false);
  };
  const handleCloseCheckoutModal = () => {
    setCheckoutSuccess(false);
  };
  const handleShowCheckoutModal = async () => {
    setShowMint(false);
    await handleMint();
    setCheckoutSuccess(true);
  };

  const handleMintValue = (e) => {
    // console.log(e.target.value);

    if (e.target.value) {
      if (Number(e.target.value) > Number(remaining)) {
        setmintValue(parseInt(remaining));
        return;
      }
      setmintValue(parseInt(e.target.value));
    } else {
      setmintValue(0);
    }
  };

  const handleMint = async () => {
    try {
      const { hash } = await writeContract({
        address: inoAdd,
        abi: inoabi,
        functionName: "trade",
        args: [mintValue],
        value: new BigNumber(priceWei).mul(mintValue).toString(),
      });

      const receipt = await etherProvider.waitForTransaction(hash);
      console.log("receipt", receipt);

      const logs = receipt?.logs?.filter((data) => {
        return data?.address?.toLowerCase() === inoAdd.toLowerCase();
      });

      const nftData = [];
      logs.forEach((data) => {
        const obj = {};
        const id = parseInt(data.topics[2], 16);
        obj["nftId"] = id;
        obj["metaData"] = require(`../Meta/${id}.json`);
        obj[
          "img"
        ] = `https://plum-elaborate-gecko-166.mypinata.cloud/ipfs/QmeePpAbxTpWafoZRCcCQfnKCB2gDMPeaT7tq6S6SDkE3N/${id}.png`;
        nftData.push(obj);
      });

      setNftData(nftData);
    } catch (error) {
      console.log("error", error.message);
      throw error;
    }
  };

  useEffect(() => {
    const newMintLength = [];
    for (let i = 0; i < mintValue; i++) {
      newMintLength.push(i);
    }
    setMintLength(newMintLength);
  }, [mintValue]);

  console.log(showConnect,"showconnect")

  return (
    <div>
      <Header showConnect={setShowConnect} setShowConnect={setShowConnect}  handleShowConnect={handleShowConnect} />

      <div className="h-full py-6 res-px flex lg:px-44 lg:py-36 lg:flex-row flex-col gap-4  w-full">
        <div className="a  lg:w-[40%] justify-center res-main-left  items-center  w-full lg:min-h-[500px] ">
          <img src="/Images/knightleft.png" className="h-full w-full"></img>
        </div>

        <div className="b w-full res-main-right lg:min-h-[500px] lg:w-[60%] justify-center flex items-center ">
          <div className="bg-[#1E2B45] flex justify-between flex-col border-[#423e4e] border-[1px]  py-10 px-4 lg:py-16 lg:px-10 h-full w-full rounded-[20px]">
            <div>
              <div className="flex w-full items-center justify-center">
                <p className="text-white lg:text-6xl res-head-text text-3xl text-center font-semibold">Mint is Live Now</p>
              </div>
              <div className="flex justify-center mt-4 items-center w-full">
                <p className="text-white text-sm res-para-text font-semibold opacity-50 text-center lg:w-[80%] lg:text-lg ">Blue Kirby NFTs are ready to be minted. Mint yours for free from below!</p>
              </div>
            </div>


            <div>
              <div className="flex mt-10 lg:mt-0 lg:flex-row flex-col gap-3 lg:gap-4 w-full">
                <div className="lg:w-[60%] w-full p-2 bg-[#121d32] rounded-[20px] flex items-center justify-between ">
                  <button type="button" onClick={decrementMint} className="bg-[#1E2B45]  rounded-[20px]  w-[20%] h-[50px] flex justify-center  items-center ">
                    <svg width="14" height="5" viewBox="0 0 14 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5414 2.90796L0.2601 2.90796" stroke="white" stroke-width="4" />
                    </svg>
                  </button>

                  <div className="w-[70%]">
                    <input value={mintValue} onChange={handleMintValue} className="w-full px-4 bg-transparent border-none font-normal text-2xl lg:text-3xl text-white opacity-40" placeholder="0.00"></input>
                  </div>

                  <button type="button"
                    onClick={incrementMint} className="bg-[#1E2B45] w-[20%] h-[50px] rounded-[20px] flex justify-center items-center ">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.49429 0.935791V14.8539" stroke="white" stroke-width="4" />
                      <path d="M14.4534 7.89478L0.53536 7.89477" stroke="white" stroke-width="4" />
                    </svg>
                  </button>
                </div>


                {address && isMintLive && isWhiteListed && (
                 <div className=" w-full lg:w-[30%]">
                  <button onClick={handleShowMint} type="button" className="bg-[#FF720D] py-3 lg:py-0 rounded-[19.5px] text-white flex text-lg font-bold h-full w-full items-center justify-center text-center" >
                    Mint now
                  </button>
                </div>
                )}
                


              </div>

              <div className="mt-4 w-full gap-4 flex justify-center items-center">
                <p className="font-semibold text-white text-lg opacity-50"> NFTs Minted:</p>
                <p className="font-semibold text-white text-xl">{totalMint}/511</p>
              </div>
            </div>


          </div>
        </div>


      </div>

      <div className="mt-10 social-container gap-8 flex w-full justify-center items-center">
        <a href="https://t.me/bluekirbyftm" target="_blank">
          <svg width="32" height="29" viewBox="0 0 32 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.1304 0.982432C29.1304 0.982432 32.0763 -0.199093 31.8308 2.67033C31.749 3.85187 31.0125 7.9872 30.4397 12.4602L28.4757 25.7102C28.4757 25.7102 28.3121 27.6512 26.8391 27.9888C25.3661 28.3264 23.1567 26.8073 22.7475 26.4697C22.4202 26.2165 16.6102 22.4187 14.5644 20.5621C13.9915 20.0557 13.3369 19.0429 14.6462 17.8614L23.2385 9.42196C24.2205 8.4092 25.2025 6.04615 21.1109 8.91558L9.65452 16.9331C9.65452 16.9331 8.34522 17.777 5.89032 17.0175L0.57126 15.3296C0.57126 15.3296 -1.39269 14.0637 1.96239 12.7977C10.1455 8.83112 20.2108 4.78016 29.1304 0.982432Z" fill="#DAE7FF" />
          </svg>

        </a>
        <a href="https://twitter.com/Bluekirbyftm" target="_blank">
          <svg width="35" height="29" viewBox="0 0 35 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.241 3.16503C27.0034 2.08296 24.6362 1.31391 22.202 0.878174C21.8983 1.44416 21.5452 2.20762 21.2995 2.8124C18.7139 2.4051 16.0835 2.4051 13.4979 2.8124C13.2268 2.15153 12.9221 1.50589 12.5852 0.878174C10.1489 1.31462 7.77993 2.08549 5.54113 3.17032C1.08674 10.1279 -0.121115 16.9126 0.482812 23.6004C3.08304 25.6295 6.00448 27.1765 9.11692 28.1724C9.81623 27.1778 10.4348 26.1251 10.9662 25.0251C9.95538 24.6269 8.98082 24.1366 8.05408 23.5599C8.29804 23.373 8.53688 23.1773 8.76719 22.9763C14.3817 25.6898 20.4806 25.6898 26.0286 22.9763C26.2623 23.1773 26.5011 23.373 26.7417 23.5599C25.8187 24.1347 24.8412 24.6284 23.8244 25.0268C24.355 26.1273 24.9736 27.1801 25.6737 28.1741C28.7886 27.1789 31.7121 25.6306 34.313 23.5987C35.021 15.8477 33.1034 9.12462 29.241 3.16503ZM11.7305 19.4869C10.045 19.4869 8.66312 17.8612 8.66312 15.8812C8.66312 13.9011 10.016 12.2719 11.7305 12.2719C13.4451 12.2719 14.8269 13.8976 14.7979 15.8812C14.7996 17.8612 13.4451 19.4869 11.7305 19.4869ZM23.0652 19.4869C21.3797 19.4869 19.9978 17.8612 19.9978 15.8812C19.9978 13.9011 21.3507 12.2719 23.0652 12.2719C24.7798 12.2719 26.1616 13.8976 26.1326 15.8812C26.1326 17.8612 24.7798 19.4869 23.0652 19.4869Z" fill="#DAE7FF" />
          </svg>

        </a>
        <a href="https://ftmscan.com/token/0x97bdAfe3830734acF12Da25359674277fcc33729" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" width="31" height="32" viewBox="0 0 31 32" fill="none">
            <g clip-path="url(#clip0_25_10626)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.24658 0.293457H26.7535C29.0987 0.293457 31 2.19471 31 4.54003V27.0468C31 29.3922 29.0987 31.2935 26.7535 31.2935H4.24658C1.90126 31.2935 0 29.3922 0 27.0468V4.54003C0 2.19471 1.90126 0.293457 4.24658 0.293457ZM15.5103 4.35934C15.0314 4.35934 14.5609 4.48527 14.1459 4.72451L14.1447 4.72526L6.70537 8.97556L6.70262 8.97714C6.35393 9.17878 6.05499 9.45455 5.82633 9.7839C5.78008 9.82541 5.73949 9.87481 5.70669 9.93151C5.67759 9.98183 5.65653 10.0346 5.64311 10.0883C5.44361 10.4746 5.33893 10.9036 5.33861 11.3396V11.3401V19.8434V19.8438C5.33896 20.3226 5.46515 20.7929 5.70456 21.2076C5.94396 21.6222 6.28814 21.9666 6.70262 22.2063L6.70535 22.2079L14.1447 26.4585L14.1461 26.4594C14.46 26.6404 14.806 26.7567 15.1634 26.8025C15.2616 26.871 15.3811 26.9113 15.5099 26.9113C15.6387 26.9113 15.758 26.8711 15.8561 26.8026C16.214 26.7569 16.5603 26.6407 16.8747 26.4594L16.876 26.4585L24.3141 22.2078L24.3165 22.2065C24.7312 21.9671 25.0757 21.6227 25.3154 21.208C25.5551 20.7934 25.6816 20.323 25.682 19.844V19.8434V11.3401V11.3396C25.6818 10.9013 25.576 10.4702 25.3745 10.0823C25.361 10.0307 25.3404 9.97995 25.3125 9.93149C25.2806 9.87653 25.2415 9.82843 25.1969 9.78773C24.968 9.45668 24.6681 9.17956 24.318 8.97714L24.3153 8.97556L16.876 4.72526L16.8748 4.72457C16.4599 4.4853 15.9893 4.35934 15.5103 4.35934ZM16.1154 25.488C16.1683 25.465 16.2201 25.4389 16.2705 25.4099L16.2728 25.4085L23.711 21.1578L23.7119 21.1573C23.9423 21.024 24.1337 20.8325 24.2671 20.602C24.4005 20.3712 24.4709 20.1094 24.4711 19.8427V11.3405C24.4711 11.2686 24.4659 11.1972 24.4559 11.1265L16.1154 15.9516V25.488ZM14.9045 15.9515L6.56472 11.1273C6.55472 11.1976 6.54961 11.2688 6.54955 11.3403V19.8432C6.54978 20.1096 6.62003 20.3713 6.75325 20.6021C6.88627 20.8325 7.07743 21.024 7.30761 21.1573L7.30882 21.158L14.7478 25.4085L14.7502 25.4099C14.8002 25.4388 14.8518 25.4647 14.9045 25.4876V15.9515ZM15.5099 14.9028L23.821 10.0948C23.7861 10.0705 23.7501 10.0476 23.7132 10.0262L23.7119 10.0254L16.2729 5.77532L16.2705 5.77397C16.0394 5.64052 15.7772 5.57027 15.5103 5.57027C15.2435 5.57027 14.9812 5.64052 14.7502 5.77397L14.7478 5.77532L7.30882 10.0254L7.30755 10.0262C7.27034 10.0477 7.23415 10.0708 7.19907 10.0953L15.5099 14.9028Z" fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_25_10626">
                <rect width="31" height="31" fill="white" transform="translate(0 0.293457)" />
              </clipPath>
            </defs>
          </svg>
        </a>

      </div>

      {/* Connect modal */}
      <div
        className={showConnect ? "modal-overlay show-overlay" : "modal-overlay"}
      // className="modal-overlay show-overlay"
      >
        <div
          className={
            showConnect
              ? "modal-container show-connect-modal"
              : "modal-container"
          }

        // className="modal-container show-connect-modal"

        >

          {/* <img
            src={Images.connectModalTop}
            alt="Connect modal"
            className=""
            width={280}
          /> */}
          <div className="w-full items-center px-3 py-3 flex justify-between">
            <p className="text-white  font-bold lg:text-3xl text-xl">Select Provider</p>

            <span onClick={handleCloseConnect}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6684 1.5L2.09732 16.0711" stroke="white" stroke-width="2" stroke-linecap="round" />
                <path d="M15.9024 16.071L1.33136 1.49997" stroke="white" stroke-width="2" stroke-linecap="round" />
              </svg>
            </span>
          </div>


          <div className=" mb-3 flex lg:flex-row  modal-button">
            <button
              className="bg-[#121D32] flex flex-col justify-center items-center text-white"
              disabled={!walletConnectConnector.ready}
              key={walletConnectConnector.id}
              onClick={() => {
                connect({ connector: walletConnectConnector });
                handleCloseConnect();
              }}
              type="button"
            >
              <div className="wallet-connect-img-container">
                <img src={Images.connectModalBgOne} alt="Button BG" />
              </div>


              <p>Wallet Connect</p>
              {!walletConnectConnector.ready && " (unsupported)"}
            </button>
            <button
              className="bg-[#121D32] flex flex-col justify-center items-center text-white"
              disabled={!metaMaskConnector.ready}
              key={metaMaskConnector.id}
              onClick={() => {
                connect({ connector: metaMaskConnector });
                handleCloseConnect();
              }}
              type="button"
            >
              <img src={Images.connectModalBgTwo} alt="Button BG" />

              <p>Metamask</p>
            </button>
            <button
              className="bg-[#121D32] flex flex-col justify-center items-center text-white"
              disabled={!injectedConnector.ready}
              key={injectedConnector.id}
              onClick={() => {
                connect({ connector: injectedConnector });
                handleCloseConnect();
              }}
              type="button"
            >
              <img src={Images.connectModalBgThree} alt="Button BG" />

              <p>Trust Wallet</p>
            </button>
          </div>
        </div>
      </div>
      {/* Mint modal */}
      <div
        className={showMint ? "modal-overlay show-overlay" : "modal-overlay"}
      // className="modal-overlay show-overlay"
      >
        <div
          className={
            showMint ? "modal-container show-connect-modal" : "modal-container"
          }
        // className="modal-container show-connect-modal"
        >

          <div className="mt-2 mb-3">
            <div>
              <div xl={7} md={7} sm={12} xs={12}>
                {/* <h4 className="text-center mb-4 show-in-mobile text-white">
                  Details
                </h4> */}
                <div className="w-full items-center px-3 py-3 flex justify-between">

                  <h6 className="text-white font-semibold lg:text-2xl text-xl">
                    Details
                  </h6>

                  <span onClick={handleCloseMint}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.6684 1.5L2.09732 16.0711" stroke="white" stroke-width="2" stroke-linecap="round" />
                      <path d="M15.9024 16.071L1.33136 1.49997" stroke="white" stroke-width="2" stroke-linecap="round" />
                    </svg>
                  </span>

                </div>
                <div className="modal-left-container">
                  <p>
                    YOU ARE ABOUT TO MINT <strong className="ml-1">{mintValue} NFT</strong>
                  </p>
                  <div className="modal-inner-container mt-6 flex flex-row flex-justify flex-middle">
                    <span className="flex flex-row">
                      <img src={Images.bllingIcon} alt="" /> &nbsp;
                      <span className="flex flex-col ml-2 flex-divumn flex-start">
                        <small>
                          <small>
                            <small className="text-white">
                              {address?.slice(0, 6)}....{address?.slice(-6)}
                            </small>
                          </small>
                        </small>
                        <small>
                          <small className="fantom text-white">FANTOM</small>
                        </small>
                      </span>
                    </span>
                    <span className="dots"></span>&nbsp;
                    <small>
                      <small className="text-success text-[12px]">Connected</small>
                    </small>
                  </div>
                  <div className="mt-3 details">
                    <span className="flex flex-row flex-justify mt-1">
                      <small>
                        {price} FTM x {mintValue} NFTs
                      </small>
                      <strong>
                        {(price * mintValue).toFixed(3)} FTM Approx.
                      </strong>
                    </span>
                    <span className="divider mt-2 mb-2"></span>
                    <span className="flex flex-row flex-justify mt-1">
                      <small>Balance</small>
                      <strong>
                        {new BigNumber(userTokenBal).div(1e18).toFixed(4)} FTM
                      </strong>
                    </span>
                    <span className="flex flex-row flex-justify mt-1">
                      <small>You will pay</small>
                      <strong>
                        {(price * mintValue).toFixed(3)} FTM Approx.
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
              <div xl={5} md={5} sm={12} xs={12}>
                {/* <h4 className="text-center hide-in-mobile text-white">
                  Details
                </h4> */}
                {/* <img
                  src={Images.modalBg}
                  alt="Charater"
                  width={180}
                  height={140}
                  className="mt-4 hide-in-mobile"
                /> */}
                <button
                  disabled={new BigNumber(userTokenBal).lessThan(
                    new BigNumber(priceWei).mul(mintValue)
                  )}
                  type="button"
                  className="button full btn-checkout mt-4"
                  onClick={handleShowCheckoutModal}
                >
                  Mint Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success modal */}
      <div
        className={
          congatulationModal ? "modal-overlay show-overlay" : "modal-overlay"
        }
      // className="modal-overlay show-overlay"
      >
        <div
          className={
            congatulationModal
              ? "modal-container show-success-modal"
              : "modal-container"
          }
        // className="modal-container show-success-modal"
        >

          <div className="w-full items-center px-3  py-3 flex justify-between">
            <p className="text-white  font-bold lg:text-3xl text-xl">Congratulations!</p>

            <span className="" onClick={handleCloseCngratulationModal}>
              {/* X */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6684 1.5L2.09732 16.0711" stroke="white" stroke-width="2" stroke-linecap="round" />
                <path d="M15.9024 16.071L1.33136 1.49997" stroke="white" stroke-width="2" stroke-linecap="round" />
              </svg>
            </span>
          </div>
          {/* <h4 className="text-white text-center">Congratulations!</h4> */}

          {/* <img
            src={Images.characterTwo}
            alt="Connect modal"
            className="conngratulation-img"
            width={100}
          /> */}
          {/* <br /> */}
          <div className="p-4 rounded-[20px] bg-[#121D32]">
            <div className="text-center conngratulation">
              <p className="font-semibold text-base">Your wallet</p>
              <p className="text-white font-semibold text-base">{walletAddress}</p>
              <h6 className="font-semibold text-base">is Whitelisted!</h6>
            </div>
            <div className="mt-5 mb-3">
              <button
                type="button"
                className="button full font-bold "
                onClick={handleCloseCngratulationModal}
              >
                DONE!
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Failed modal */}
      <div
        className={sorryModal ? "modal-overlay show-overlay" : "modal-overlay"}
      // className="modal-overlay show-overlay"
      >
        <div
          className={
            sorryModal ? "modal-container show-sorry-modal" : "modal-container"
          }
        // className="modal-container show-sorry-modal"
        >
          {/* <span className="close-icon" onClick={handleCloseSorryModal}>
            X
          </span> */}
          {/* <h4 className="text-white text-center">Sorry</h4> */}
          <div className="w-full items-center px-3 py-3 flex justify-between">
            <p className="text-white font-bold lg:text-3xl text-xl">Sorry</p>
            <span className="" onClick={handleCloseSorryModal}>
              {/* X */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6684 1.5L2.09732 16.0711" stroke="white" stroke-width="2" stroke-linecap="round" />
                <path d="M15.9024 16.071L1.33136 1.49997" stroke="white" stroke-width="2" stroke-linecap="round" />
              </svg>

            </span>
          </div>


          {/* <img
            src={Images.sorryModal}
            alt="Connect modal"
            className="sorry-img"
            width={100}
          />
          <br /> */}
          <div className="p-4 rounded-[20px] bg-[#121D32]">
            <div className="text-center conngratulation sorry">
              <p className="font-semibold text-base">Your wallet</p>
              <p className="text-white">{walletAddress}</p>
              <h6 className="font-semibold text-base">is Not Whitelisted!</h6>
            </div>
            <div className="mt-5 mb-3">
              <button
                type="button"
                className="button font-bold full"
                onClick={handleCloseSorryModal}
              >
                DONE!
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Checkout success modal */}
      <div
        className={
          checkoutSuccess ? "modal-overlay1 show-overlay" : "modal-overlay1"
        }
      // className="modal-overlay1 show-overlay"
      >
        <div
          className={`${checkoutSuccess
            ? "modal-container1 show-sorry-modal p-4 checkout-modal"
            : "modal-container1 p-4 checkout-modal "
            }`}
        // className="modal-container1 show-sorry-modal p-2 checkout-modal"
        >
          <div className="w-full items-center px-3 py-3 flex justify-between">
            <h6 className="text-white font-semibold lg:text-2xl text-xl">
              Report
            </h6>
            <span className="" onClick={handleCloseCheckoutModal}>
              {/* X */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6684 1.5L2.09732 16.0711" stroke="white" stroke-width="2" stroke-linecap="round" />
                <path d="M15.9024 16.071L1.33136 1.49997" stroke="white" stroke-width="2" stroke-linecap="round" />
              </svg>

            </span>
          </div>

          <div className="p-4 rounded-[20px] bg-[#121D32]">
            <h6 className="text-white font-semibold lg:text-2xl text-xl">
              MINTED <span className="text-blue">{mintValue}</span>
            </h6>
            <h4 className="text-white text-center font-medium lg:text-xl ">Successfully</h4>

            <div className="text-center w-100">
              <Carousel showThumbs={false} showStatus={false} infiniteLoop={true}>
                {nftData?.map((data, index) => (
                  <div className="blue-bg" key={index}>
                    <img src={data.img} alt="" />

                    <span className="flex flex-row flex-justify mt-2 small-text-modal">
                      <span className="font-semibold text-lg text-[rgba(255,255,255,0.6)]">Id</span>
                      <span className="text-white text-xl lg:text-2xl font-semibold">{data.nftId}</span>
                    </span>

                    <span className="flex flex-row flex-justify mt-2 small-text-modal">
                      <span className="font-semibold text-lg text-[rgba(255,255,255,0.6)]">Mouth</span>
                      <span className="text-white text-xl lg:text-2xl font-semibold">
                        {data.metaData.attributes[5].value}
                      </span>
                    </span>
                    <span className="flex flex-row flex-justify mt-2 small-text-modal">
                      <span className="font-semibold text-lg text-[rgba(255,255,255,0.6)]">Head</span>
                      <span className="text-white text-xl lg:text-2xl font-semibold">
                        {data.metaData.attributes[4].value}
                      </span>
                    </span>
                    <span className="flex flex-row flex-justify mt-2 small-text-modal">
                      <span className="font-semibold text-lg text-[rgba(255,255,255,0.6)]">Eyes</span>
                      <span className="text-white text-xl lg:text-2xl font-semibold">
                        {data.metaData.attributes[2].value}
                      </span>
                    </span>
                    <span className="flex flex-row flex-justify mt-2 small-text-modal">
                      <span className="font-semibold text-lg text-[rgba(255,255,255,0.6)]">Body</span>
                      <span className="text-white text-xl lg:text-2xl font-semibold">
                        {data.metaData.attributes[1].value}
                      </span>
                    </span>
                    <span className="flex flex-row flex-justify mt-2 small-text-modal">
                      <span className="font-semibold text-lg text-[rgba(255,255,255,0.6)]">Outifit</span>
                      <span className="text-white text-xl lg:text-2xl font-semibold">
                        {data.metaData.attributes[6].value}
                      </span>
                    </span>
                    <span className="flex flex-row flex-justify mt-2 small-text-modal">
                      <span className="font-semibold text-lg text-[rgba(255,255,255,0.6)]">Feet</span>
                      <span className="text-white text-xl lg:text-2xl font-semibold">
                        {data.metaData.attributes[3].value}
                      </span>
                    </span>
                    <span className="flex flex-row flex-justify mt-2 small-text-modal">
                      <span className="font-semibold text-lg text-[rgba(255,255,255,0.6)]">Background</span>
                      <span className="text-white text-xl lg:text-2xl font-semibold">
                        {data.metaData.attributes[0].value}
                      </span>
                    </span>
                  </div>
                ))}
              </Carousel>
            </div>

            <div className="mt-2 mb-1">
              <button
                type="button"
                className="button full"
                onClick={handleCloseCheckoutModal}
              >
                DONE!
              </button>
            </div>
          </div>

        </div>
      </div>


      {/* <div class="bubbles">
        <div class="bubble">
          <img
            src={Images.characterOne}
            className="character one "
            alt="Character One"
          />
        </div>
        <div class="bubble">
          <img
            src={Images.characterTwo}
            className="character one "
            alt="Character One"
          />
        </div>
        <div class="bubble">
          <img
            src={Images.characterThree}
            className="character one "
            alt="Character One"
          />
        </div>
        <div class="bubble">
          <img
            src={Images.characterOne}
            className="character one hide-on-small"
            alt="Character One"
          />
        </div>
        <div class="bubble">
          <img
            src={Images.characterTwo}
            className="character one hide-on-small"
            alt="Character One"
          />
        </div>
        <div class="bubble">
          <img
            src={Images.characterThree}
            className="character one hide-on-small"
            alt="Character One"
          />
        </div>
      </div> */}
      {/* <div className="main-content">
        {isMintLive && (
          <h3 className="text-center text-white mt-5 show-in-mobile">
            Mint is Live Now
          </h3>
        )}
        <div xl={6} md={6} sm={12} xs={12} className="m-10 text-center">
          <img
            src={
              "https://kirbygif.s3.eu-north-1.amazonaws.com/New+Blue+Kirby.gif"
            }
            alt="Left side image"
            className="img-responsive"
          />
        </div>
        <div xl={1} md={1} sm={1} xs={1} className="m-10"></div>
        <div xl={5} md={5} sm={12} xs={12} className="m-10">
          {isMintLive && (
            <h1 className="text-white ml-5 text-center hide-in-mobile">
              Mint is Live Now
            </h1>
          )}
          <p className="text-center text-white mt-5 mb-5 bellow-img h6">
            Blue Kirby NFTs are ready to be minted. Mint yours for free from
            below!
          </p>
          <div className="flex flex-row flex-justify">
            <button
              type="button"
              className="button increment-decrement"
              onClick={decrementMint}
            >
              <span className="decrement">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  fill="currentdivor"
                  className="bi bi-dash"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                </svg>
              </span>
            </button>
            <input
              type="text"
              value={mintValue}
              className="mint-value mx-1"
              onChange={handleMintValue}
            />
            <button
              type="button"
              className="button increment-decrement"
              onClick={incrementMint}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill="currentdivor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg>
            </button>
          </div>

          <p className="text-center text-white mt-4  bellow-img h6">
            NFTs Minted: {totalMint}/511
          </p>
          {address && isMintLive && isWhiteListed && (
            <button
              type="button"
              className="button full mt-5"
              onClick={handleShowMint}
            >
              MINT NOW
            </button>
          )}
        </div>
        <div>
          <div xl={12} md={12} sm={12} xs={12} className="bg-wrapper">
            <div className="p-4 mt-5">
              <div xl={4} md={4} sm={12} xs={12}>
                <h5 className="text-white text-end mt-2">Check on Whitelist</h5>
              </div>
              <div xl={4} md={4} sm={12} xs={12}>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter your Wallet Address"
                />
              </div>
              <div xl={4} md={4} sm={12} xs={12}>
                <button
                  type="button"
                  className="button"
                  onClick={handleShowCongatulation}
                >
                  Check Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* Connect modal */}
      {/* <div
        className={showConnect ? "modal-overlay show-overlay" : "modal-overlay"}
      >
        <div
          className={
            showConnect
              ? "modal-container show-connect-modal"
              : "modal-container"
          }
        >
          <span className="close-icon" onClick={handleCloseConnect}>
            X
          </span>
          <img
            src={Images.connectModalTop}
            alt="Connect modal"
            className=""
            width={280}
          />
          <br />
          <div className="mt-5 mb-3 modal-button">
            <button
              disabled={!walletConnectConnector.ready}
              key={walletConnectConnector.id}
              onClick={() => {
                connect({ connector: walletConnectConnector });
                handleCloseConnect();
              }}
              type="button"
            >
              <img src={Images.connectModalBgOne} alt="Button BG" />
              <br />
              <p>Wallet Connect</p>
              {!walletConnectConnector.ready && " (unsupported)"}
            </button>
            <button
              disabled={!metaMaskConnector.ready}
              key={metaMaskConnector.id}
              onClick={() => {
                connect({ connector: metaMaskConnector });
                handleCloseConnect();
              }}
              type="button"
            >
              <img src={Images.connectModalBgTwo} alt="Button BG" />
              <br />
              <p>Metamask</p>
            </button>
            <button
              disabled={!injectedConnector.ready}
              key={injectedConnector.id}
              onClick={() => {
                connect({ connector: injectedConnector });
                handleCloseConnect();
              }}
              type="button"
            >
              <img src={Images.connectModalBgThree} alt="Button BG" />
              <br />
              <p>Trust Wallet</p>
            </button>
          </div>
        </div>
      </div> */}
      {/* Mint modal */}
      {/* <div
        className={showMint ? "modal-overlay show-overlay" : "modal-overlay"}
      >
        <div
          className={
            showMint ? "modal-container show-connect-modal" : "modal-container"
          }
        >
          <span className="close-icon" onClick={handleCloseMint}>
            X
          </span>
          <div className="mt-2 mb-3">
            <div>
              <div xl={7} md={7} sm={12} xs={12}>
                <h4 className="text-center show-in-mobile text-white">
                  Details
                </h4>
                <div className="modal-left-container">
                  <p>
                    YOU ARE ABOUT TO MINT <strong>{mintValue} NFT</strong>
                  </p>
                  <div className="modal-inner-container flex flex-row flex-justify flex-middle">
                    <span className="flex flex-row">
                      <img src={Images.bllingIcon} alt="" /> &nbsp;
                      <span className="flex flex-divumn flex-start">
                        <small>
                          <small>
                            <small className="text-white">
                              {address?.slice(0, 6)}....{address?.slice(-6)}
                            </small>
                          </small>
                        </small>
                        <small>
                          <small className="fantom">FANTOM</small>
                        </small>
                      </span>
                    </span>
                    <span className="dots"></span>&nbsp;
                    <small>
                      <small className="text-success">Connected</small>
                    </small>
                  </div>
                  <div className="mt-3 details">
                    <span className="flex flex-row flex-justify mt-1">
                      <small>
                        {price} FTM x {mintValue} NFTs
                      </small>
                      <strong>
                        {(price * mintValue).toFixed(3)} FTM Approx.
                      </strong>
                    </span>
                    <span className="divider mt-2 mb-2"></span>
                    <span className="flex flex-row flex-justify mt-1">
                      <small>Balance</small>
                      <strong>
                        {new BigNumber(userTokenBal).div(1e18).toFixed(4)} FTM
                      </strong>
                    </span>
                    <span className="flex flex-row flex-justify mt-1">
                      <small>You will pay</small>
                      <strong>
                        {(price * mintValue).toFixed(3)} FTM Approx.
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
              <div xl={5} md={5} sm={12} xs={12}>
                <h4 className="text-center hide-in-mobile text-white">
                  Details
                </h4>
                <img
                  src={Images.modalBg}
                  alt="Charater"
                  width={180}
                  height={140}
                  className="mt-4 hide-in-mobile"
                />
                <button
                  disabled={new BigNumber(userTokenBal).lessThan(
                    new BigNumber(priceWei).mul(mintValue)
                  )}
                  type="button"
                  className="button full btn-checkout mt-4"
                  onClick={handleShowCheckoutModal}
                >
                  Mint Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* Success modal */}
      {/* <div
        className={
          congatulationModal ? "modal-overlay show-overlay" : "modal-overlay"
        }
      >
        <div
          className={
            congatulationModal
              ? "modal-container show-success-modal"
              : "modal-container"
          }
        >
          <span className="close-icon" onClick={handleCloseCngratulationModal}>
            X
          </span>
          <h4 className="text-white text-center">Congratulations!</h4>
          <img
            src={Images.characterTwo}
            alt="Connect modal"
            className="conngratulation-img"
            width={100}
          />
          <br />
          <div className="text-center conngratulation">
            <p>Your wallet</p>
            <p className="text-white">{walletAddress}</p>
            <h6>is Whitelisted!</h6>
          </div>
          <div className="mt-5 mb-3">
            <button
              type="button"
              className="button full"
              onClick={handleCloseCngratulationModal}
            >
              DONE!
            </button>
          </div>
        </div>
      </div> */}
      {/* Failed modal */}
      {/* <div
        className={sorryModal ? "modal-overlay show-overlay" : "modal-overlay"}
      >
        <div
          className={
            sorryModal ? "modal-container show-sorry-modal" : "modal-container"
          }
        >
          <span className="close-icon" onClick={handleCloseSorryModal}>
            X
          </span>
          <h4 className="text-white text-center">Sorry</h4>
          <img
            src={Images.sorryModal}
            alt="Connect modal"
            className="sorry-img"
            width={100}
          />
          <br />
          <div className="text-center conngratulation sorry">
            <p>Your wallet</p>
            <p className="text-white">{walletAddress}</p>
            <h6>is Not Whitelisted!</h6>
          </div>
          <div className="mt-5 mb-3">
            <button
              type="button"
              className="button full"
              onClick={handleCloseSorryModal}
            >
              DONE!
            </button>
          </div>
        </div>
      </div> */}
      {/* Checkout success modal */}
      {/* <div
        className={
          checkoutSuccess ? "modal-overlay1 show-overlay" : "modal-overlay1"
        }
      >
        <div
          className={`${
            checkoutSuccess
              ? "modal-container1 show-sorry-modal p-4 checkout-modal"
              : "modal-container1 p-4 checkout-modal "
          }`}
        >
          <span className="close-icon" onClick={handleCloseCheckoutModal}>
            X
          </span>
          <h6 className="text-white">
            MINTED <span className="text-blue">{mintValue}</span>
          </h6>
          <h4 className="text-white text-center">Successfully</h4>

          <div className="text-center w-100">
            <Carousel showThumbs={false} showStatus={false} infiniteLoop={true}>
              {nftData?.map((data, index) => (
                <div className="blue-bg" key={index}>
                  <img src={data.img} alt="" />

                  <span className="flex flex-row flex-justify mt-2 small-text-modal">
                    <span className="text-gray">Id</span>
                    <span className="text-white">{data.nftId}</span>
                  </span>

                  <span className="flex flex-row flex-justify mt-2 small-text-modal">
                    <span className="text-gray">Mouth</span>
                    <span className="text-white">
                      {data.metaData.attributes[5].value}
                    </span>
                  </span>
                  <span className="flex flex-row flex-justify mt-2 small-text-modal">
                    <span className="text-gray">Head</span>
                    <span className="text-white">
                      {data.metaData.attributes[4].value}
                    </span>
                  </span>
                  <span className="flex flex-row flex-justify mt-2 small-text-modal">
                    <span className="text-gray">Eyes</span>
                    <span className="text-white">
                      {data.metaData.attributes[2].value}
                    </span>
                  </span>
                  <span className="flex flex-row flex-justify mt-2 small-text-modal">
                    <span className="text-gray">Body</span>
                    <span className="text-white">
                      {data.metaData.attributes[1].value}
                    </span>
                  </span>
                  <span className="flex flex-row flex-justify mt-2 small-text-modal">
                    <span className="text-gray">Outifit</span>
                    <span className="text-white">
                      {data.metaData.attributes[6].value}
                    </span>
                  </span>
                  <span className="flex flex-row flex-justify mt-2 small-text-modal">
                    <span className="text-gray">Feet</span>
                    <span className="text-white">
                      {data.metaData.attributes[3].value}
                    </span>
                  </span>
                  <span className="flex flex-row flex-justify mt-2 small-text-modal">
                    <span className="text-gray">Background</span>
                    <span className="text-white">
                      {data.metaData.attributes[0].value}
                    </span>
                  </span>
                </div>
              ))}
            </Carousel>
          </div>

          <div className="mt-2 mb-1">
            <button
              type="button"
              className="button full"
              onClick={handleCloseCheckoutModal}
            >
              DONE!
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};
export default HomePage;
