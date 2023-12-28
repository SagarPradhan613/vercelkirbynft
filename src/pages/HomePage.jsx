import React, { ReactElement, useEffect, useState } from "react";
import Header from "../components/Header";
import { Col, Row, Image, Container } from "react-bootstrap";
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
  const [nftData, setNftData] = useState([]);
  const { chain } = useNetwork();
  const etherProvider = new ethers.providers.JsonRpcProvider(chain?.rpcUrls?.public?.http[0]);

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
      const ismintLive = await inoContract.read.claimenabled();
      setisMintLive(ismintLive);

      setDecimal(18);
      const priceWei = await inoContract.read.price();
      setPriceWei(priceWei);

      const price = new BigNumber(priceWei).div(1e18);
      setPrice(price.toFixed());
    };

    const userCalls = async () => {
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
    };

    globalCalls(); // Call globalCalls once

    if (address) {
      userCalls(); // Call userCalls initially if address is present
    }

    const userCallsInterval =
      address &&
      setInterval(() => {
        userCalls(); // Call userCalls repeatedly at the specified interval only if address is present
      }, 5000); // Adjust the interval time as needed (5000 milliseconds in this example)

    // Clear the interval when the component unmounts or when the dependency array changes
    return () => clearInterval(userCallsInterval);
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

      const logs =  receipt?.logs?.filter((data) => {
        return data?.address?.toLowerCase() === inoAdd.toLowerCase();
      })
 
      const nftData = []
      logs.forEach((data) => {
        const obj = {};
        const id = parseInt(data.topics[2], 16)
        obj['nftId'] = id 
        obj['metaData'] = require(`../Meta/${id}.json`);
        obj['img'] = `https://plum-elaborate-gecko-166.mypinata.cloud/ipfs/QmdVpWphPvs2fjvoAm6v3BkH4iXiRKiHtXEc8WSGpLx9rj/${id}.png`
        nftData.push(obj)
      })

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

  return (
    <Col>
      <Header handleShowConnect={handleShowConnect} />
      <Image
        src={Images.characterOne}
        className="character one hide-on-small"
        alt="Character One"
      />
      <Image
        src={Images.characterTwo}
        className="character two hide-on-small"
        alt="Character One"
      />
      <Image
        src={Images.characterThree}
        className="character three hide-on-small"
        alt="Character One"
      />
      <Image
        src={Images.characterTwo}
        className="character four hide-on-small"
        alt="Character One"
      />
      <Image
        src={Images.characterThree}
        className="character five hide-on-small"
        alt="Character One"
      />
      <Image
        src={Images.characterTwo}
        className="character six hide-on-small"
        alt="Character One"
      />
      <Image
        src={Images.characterOne}
        className="character seven hide-on-small"
        alt="Character One"
      />
      <Image
        src={Images.characterTwo}
        className="character eight hide-on-small"
        alt="Character One"
      />
      <Row className="main-content">
        {isMintLive && (
          <h3 className="text-center text-white mt-5 show-in-mobile">
            Mint is Live Now
          </h3>
        )}
        <Col xl={6} md={6} sm={12} xs={12} className="m-10 text-center">
          <Image
            src={Images.leftsideImg}
            alt="Left side image"
            className="img-responsive"
          />
        </Col>
        <Col xl={1} md={1} sm={1} xs={1} className="m-10"></Col>
        <Col xl={5} md={5} sm={12} xs={12} className="m-10">
          {isMintLive && (
            <h1 className="text-white ml-5 text-center hide-in-mobile">
              Mint is Live Now
            </h1>
          )}
          <p className="text-center text-white mt-5 mb-5 bellow-img h6">
            Blue Kirby NFTs are ready to be minted. Mint yours for free from
            below!
          </p>
          <Col className="flex flex-row flex-justify">
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
                  fill="currentColor"
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
                fill="currentColor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg>
            </button>
          </Col>
          {address && isMintLive && isWhiteListed && (
            <button
              type="button"
              className="button full mt-5"
              onClick={handleShowMint}
            >
              MINT NOW
            </button>
          )}
        </Col>
        <Container>
          <Col xl={12} md={12} sm={12} xs={12} className="bg-wrapper">
            <Row className="p-4 mt-5">
              <Col xl={4} md={4} sm={12} xs={12}>
                <h5 className="text-white text-end mt-2">Check on Whitelist</h5>
              </Col>
              <Col xl={4} md={4} sm={12} xs={12}>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter your Wallet Address"
                />
              </Col>
              <Col xl={4} md={4} sm={12} xs={12}>
                <button
                  type="button"
                  className="button"
                  onClick={handleShowCongatulation}
                >
                  Check Now
                </button>
              </Col>
            </Row>
          </Col>
        </Container>
      </Row>
      {/* Connect modal */}
      <Col
        className={showConnect ? "modal-overlay show-overlay" : "modal-overlay"}
      >
        <Col
          className={
            showConnect
              ? "modal-container show-connect-modal"
              : "modal-container"
          }
        >
          <span className="close-icon" onClick={handleCloseConnect}>
            X
          </span>
          <Image
            src={Images.connectModalTop}
            alt="Connect modal"
            className=""
            width={280}
          />
          <br />
          <Col className="mt-5 mb-3 modal-button">
            <button
              disabled={!walletConnectConnector.ready}
              key={walletConnectConnector.id}
              onClick={() => {
                connect({ connector: walletConnectConnector });
                handleCloseConnect();
              }}
              type="button"
            >
              <Image src={Images.connectModalBgOne} alt="Button BG" />
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
              <Image src={Images.connectModalBgTwo} alt="Button BG" />
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
              <Image src={Images.connectModalBgThree} alt="Button BG" />
              <br />
              <p>Trust Wallet</p>
            </button>
          </Col>
        </Col>
      </Col>
      {/* Mint modal */}
      <Col
        className={showMint ? "modal-overlay show-overlay" : "modal-overlay"}
      >
        <Col
          className={
            showMint ? "modal-container show-connect-modal" : "modal-container"
          }
        >
          <span className="close-icon" onClick={handleCloseMint}>
            X
          </span>
          <Col className="mt-2 mb-3">
            <Row>
              <Col xl={7} md={7} sm={12} xs={12}>
                <h4 className="text-center show-in-mobile text-white">
                  Details
                </h4>
                <Col className="modal-left-container">
                  <p>
                    YOU ARE ABOUT TO MINT <strong>{mintValue} NFT</strong>
                  </p>
                  <Col className="modal-inner-container flex flex-row flex-justify flex-middle">
                    <span className="flex flex-row">
                      <Image src={Images.bllingIcon} alt="" /> &nbsp;
                      <span className="flex flex-column flex-start">
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
                  </Col>
                  <Col className="mt-3 details">
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
                  </Col>
                </Col>
              </Col>
              <Col xl={5} md={5} sm={12} xs={12}>
                <h4 className="text-center hide-in-mobile text-white">
                  Details
                </h4>
                <Image
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
              </Col>
            </Row>
          </Col>
        </Col>
      </Col>
      {/* Success modal */}
      <Col
        className={
          congatulationModal ? "modal-overlay show-overlay" : "modal-overlay"
        }
      >
        <Col
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
          <Image
            src={Images.characterTwo}
            alt="Connect modal"
            className="conngratulation-img"
            width={100}
          />
          <br />
          <Col className="text-center conngratulation">
            <p>Your wallet</p>
            <p className="text-white">{walletAddress}</p>
            <h6>is Whitelisted!</h6>
          </Col>
          <Col className="mt-5 mb-3">
            <button
              type="button"
              className="button full"
              onClick={handleCloseCngratulationModal}
            >
              DONE!
            </button>
          </Col>
        </Col>
      </Col>
      {/* Failed modal */}
      <Col
        className={sorryModal ? "modal-overlay show-overlay" : "modal-overlay"}
      >
        <Col
          className={
            sorryModal ? "modal-container show-sorry-modal" : "modal-container"
          }
        >
          <span className="close-icon" onClick={handleCloseSorryModal}>
            X
          </span>
          <h4 className="text-white text-center">Sorry</h4>
          <Image
            src={Images.sorryModal}
            alt="Connect modal"
            className="sorry-img"
            width={100}
          />
          <br />
          <Col className="text-center conngratulation sorry">
            <p>Your wallet</p>
            <p className="text-white">{walletAddress}</p>
            <h6>is Not Whitelisted!</h6>
          </Col>
          <Col className="mt-5 mb-3">
            <button
              type="button"
              className="button full"
              onClick={handleCloseSorryModal}
            >
              DONE!
            </button>
          </Col>
        </Col>
      </Col>
      {/* Checkout success modal */}
      <Col
        className={
          checkoutSuccess ? "modal-overlay1 show-overlay" : "modal-overlay1"
        }
      >
        <Col
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

          <Col className="text-center w-100">
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
                  <span className="text-white">{data.metaData.attributes[4].value}</span>
                </span>
                <span className="flex flex-row flex-justify mt-2 small-text-modal">
                  <span className="text-gray">Head</span>
                  <span className="text-white">{data.metaData.attributes[3].value}</span>
                </span>
                <span className="flex flex-row flex-justify mt-2 small-text-modal">
                  <span className="text-gray">Eyes</span>
                  <span className="text-white">{data.metaData.attributes[2].value}</span>
                </span>
                <span className="flex flex-row flex-justify mt-2 small-text-modal">
                  <span className="text-gray">Body</span>
                  <span className="text-white">{data.metaData.attributes[1].value}</span>
                </span>
                <span className="flex flex-row flex-justify mt-2 small-text-modal">
                  <span className="text-gray">Outifit</span>
                  <span className="text-white">{data.metaData.attributes[5].value}</span>
                </span>
                <span className="flex flex-row flex-justify mt-2 small-text-modal">
                  <span className="text-gray">Background</span>
                  <span className="text-white">{data.metaData.attributes[0].value}</span>
                </span>
                </div>
              ))}
             
             
            
            </Carousel>
          </Col>

          <Col className="mt-2 mb-1">
            <button
              type="button"
              className="button full"
              onClick={handleCloseCheckoutModal}
            >
              DONE!
            </button>
          </Col>
        </Col>
      </Col>
    </Col>
  );
};
export default HomePage;
