import React, { ReactElement, useEffect, useState } from "react";
import Header from "../components/Header";
import { Col, Row, Image, Container } from "react-bootstrap";
import Images from "../shared/Images";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useAccount, useNetwork, useEnsName } from "wagmi";
import { getContract, getWalletClient } from "@wagmi/core";
import { erc20abi } from "../abis/erc20";
import { erc721abi } from "../abis/erc721";
import { inoabi } from "../abis/ino";
import BigNumber from "bignumber.js";
import { writeContract } from "@wagmi/core";

const erc20Add = process.env.REACT_APP_ERC20;
const erc721Add = process.env.REACT_APP_ERC721;
const inoAdd = process.env.REACT_APP_INO;
const MAX_NUMBER =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

const HomePage = () => {
  const [mintValue, setmintValue] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [showConnect, setShowConnect] = useState(false);
  const [showMint, setShowMint] = useState(false);
  const [congatulationModal, setCongatulationModal] = useState(false);
  const [sorryModal, setSorryModal] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const [isMintLive, setisMintLive] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [priceWei, setPriceWei] = useState(0);
  const [price, setPrice] = useState(0);
  const [decimal, setDecimal] = useState(0);
  const [remaining, setremaining] = useState(0);
  const [userTokenBal, setuserTokenBal] = useState(0);
  const [userAllowance, setuserAllowance] = useState(0);

  const { address } = useAccount();

  const erc20Contract = getContract({
    address: erc20Add,
    abi: erc20abi,
  });
  const erc721Contract = getContract({
    address: erc721Add,
    abi: erc721abi,
  });
  const inoContract = getContract({
    address: inoAdd,
    abi: inoabi,
  });

  useEffect(() => {
    const globalCalls = async () => {
      const ismintLive = await inoContract.read.claimenabled();
      setisMintLive(ismintLive);

      const decimal = await inoContract.read.tokenDecimal();
      setDecimal(Number(decimal));
      const priceWei = await inoContract.read.price();
      setPriceWei(priceWei);

      const price = new BigNumber(priceWei).div(`1e${Number(decimal)}`);
      setPrice(price.toFixed());

      setSymbol(await erc20Contract.read.symbol());
    };

    const userCalls = async () => {
      if (address) {
        const decimal = await inoContract.read.tokenDecimal();
        const remainingContr = await inoContract.read.remainigContribution([
          address,
        ]);
        if (price) {
          const mintable = new BigNumber(remainingContr)
            .div(price)
            .div(`1e${Number(decimal)}`);
          setremaining(mintable.toFixed(0));
        }

        const balance = await erc20Contract.read.balanceOf([address]);
        setuserTokenBal(balance);

        const allowance = await erc20Contract.read.allowance([address, inoAdd]);
        setuserAllowance(allowance);
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
      }, 500000); // Adjust the interval time as needed (5000 milliseconds in this example)

    // Clear the interval when the component unmounts or when the dependency array changes
    return () => clearInterval(userCallsInterval);
  }, [address, inoContract, erc20Contract]);

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
    setShowMint(true);
  };
  const handleCloseCngratulationModal = () => {
    setCongatulationModal(false);
  };
  const handleShowCongatulation = () => {
    const s = Math.floor(Math.random() * 2);
    s === 1 ? setCongatulationModal(true) : setSorryModal(true);
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

  const handleMint = async () => {
    try {
      if (
        new BigNumber(priceWei)
          .mul(mintValue)
          .greaterThanOrEqualTo(userAllowance)
      ) {
        const { hash } = await writeContract({
          address: erc20Add,
          abi: erc20abi,
          functionName: "approve",
          args: [inoAdd, MAX_NUMBER],
        });
      }

      const { hash } = await writeContract({
        address: inoAdd,
        abi: inoabi,
        functionName: "trade",
        args: [mintValue],
      });
    } catch (error) {
      console.log("error", error.message);
      throw error;
    }
  };

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
          <p className="text-center text-white mt-5 mb-5 bellow-img">
            Kirby is the ultimate memecoin platform, and it couldn't be easier
            to get your hands on the token in our presale.
          </p>
          <Col className="flex flex-row flex-justify">
            <button
              type="button"
              className="button increment-decrement"
              onClick={decrementMint}
            >
              <span className="decrement">-</span>
            </button>
            <input type="text" value={mintValue} className="mint-value" />
            <button
              type="button"
              className="button increment-decrement"
              onClick={incrementMint}
            >
              +
            </button>
          </Col>
          {address && isMintLive && (
            <button
              type="button"
              className="button full mt-5"
              onClick={handleShowMint}
            >
              MINT NOW
            </button>
          )}
          <p className="text-center text-white mt-5">
            Price {price} {symbol} + Gas <br />
            {/* Floor Price 2.01 ETH */}
          </p>
        </Col>
        {/* <Container>
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
        </Container> */}
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
            <button type="button">
              <Image src={Images.connectModalBgOne} alt="Button BG" />
              <br />
              <p>Wallet Connect</p>
            </button>
            <button type="button">
              <Image src={Images.connectModalBgTwo} alt="Button BG" />
              <br />
              <p>Metamask</p>
            </button>
            <button type="button">
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
                  Checkout
                </h4>
                <Col className="modal-left-container">
                  <p>
                    You are about to mint <strong>{mintValue} NFT</strong> from{" "}
                    <strong>{erc721Add}</strong> collection
                  </p>
                  <Col className="modal-inner-container flex flex-row flex-justify flex-middle">
                    <span className="flex flex-row">
                      <Image src={Images.bllingIcon} alt="" /> &nbsp;
                      <span className="flex flex-column flex-start">
                        <small>
                          <small>
                            {address && (
                              <small className="text-white">
                                {address.slice(0, 8)}......{address.slice(-8)}{" "}
                              </small>
                            )}
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
                        {price} {symbol} x {mintValue} edition
                      </small>
                      <strong>
                        {price * mintValue} {symbol}{" "}
                      </strong>
                    </span>
                    {/* <span className="flex flex-row flex-justify mt-1">
                                            <small>Platform fee</small>
                                            <strong>0 BNB</strong>
                                        </span> */}
                    <span className="divider mt-2 mb-2"></span>
                    <span className="flex flex-row flex-justify mt-1">
                      <small>Balance</small>
                      <strong>
                        {new BigNumber(userTokenBal)
                          .div(`1e${decimal}`)
                          .toFixed()}{" "}
                        {symbol}
                      </strong>
                    </span>
                    <span className="flex flex-row flex-justify mt-1">
                      <small>You will pay</small>
                      <strong>
                        {price * mintValue} {symbol}
                      </strong>
                    </span>
                  </Col>
                </Col>
              </Col>
              <Col xl={5} md={5} sm={12} xs={12}>
                <h4 className="text-center hide-in-mobile text-white">
                  Checkout
                </h4>
                <Image
                  src={Images.modalBg}
                  alt="Charater"
                  width={180}
                  height={140}
                  className="mt-4 hide-in-mobile"
                />
                <button
                  type="button"
                  disabled={new BigNumber(userTokenBal)
                    .div(`1e${decimal}`)
                    .lessThan(price * mintValue)}
                  className="button full btn-checkout mt-4"
                  onClick={handleShowCheckoutModal}
                >
                  CHECKOUT NOW
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
            <p className="text-white">0x24safshdhgsjsbfhsfsdgsjh</p>
            <h6>is Whitelisted!</h6>
          </Col>
          <Col className="mt-5 mb-3">
            <button type="button" className="button full">
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
            <p className="text-white">0x24safshdhgsjsbfhsfsdgsjh</p>
            <h6>is Not Whitelisted!</h6>
          </Col>
          <Col className="mt-5 mb-3">
            <button type="button" className="button full">
              DONE!
            </button>
          </Col>
        </Col>
      </Col>
      {/* Checkout success modal */}
      <Col
        className={
          checkoutSuccess ? "modal-overlay show-overlay" : "modal-overlay"
        }
      >
        <Col
          className={
            checkoutSuccess
              ? "modal-container show-sorry-modal p-4 checkout-modal"
              : "modal-container p-4 checkout-modal"
          }
        >
          <span className="close-icon" onClick={handleCloseCheckoutModal}>
            X
          </span>
          <h6 className="text-white">
            MINTED <span className="text-blue">{mintValue} NFTS</span>
          </h6>
          <h4 className="text-white text-center">Successfully</h4>
          <Col className="text-center">
            <Carousel showThumbs={false} showStatus={false} infiniteLoop={true}>
              <div>
                <img src={Images.leftsideImg} alt="" height={250} />
              </div>
              <div>
                <img src={Images.leftsideImg} alt="" height={250} />
              </div>
              <div>
                <img src={Images.leftsideImg} alt="" height={250} />
              </div>
            </Carousel>
          </Col>
          <Col className="mt-3">
            <span className="flex flex-row flex-justify mt-2 small-text-modal">
              <span className="text-gray">ID</span>
              <span className="text-white">#24</span>
            </span>
            <span className="flex flex-row flex-justify mt-2 small-text-modal">
              <span className="text-gray">Mouth</span>
              <span className="text-white">Bubble</span>
            </span>
            <span className="flex flex-row flex-justify mt-2 small-text-modal">
              <span className="text-gray">Head</span>
              <span className="text-white">Cowboy hat</span>
            </span>
            <span className="flex flex-row flex-justify mt-2 small-text-modal">
              <span className="text-gray">Eyes</span>
              <span className="text-white">Blue Laser</span>
            </span>
            <span className="flex flex-row flex-justify mt-2 small-text-modal">
              <span className="text-gray">Cloths</span>
              <span className="text-white">Bubble</span>
            </span>
            <span className="flex flex-row flex-justify mt-2 small-text-modal">
              <span className="text-gray">Base Char</span>
              <span className="text-white">Blue Laser</span>
            </span>
            <span className="flex flex-row flex-justify mt-2 small-text-modal">
              <span className="text-gray">Eyes</span>
              <span className="text-white">Blue Laser</span>
            </span>
          </Col>
          <Col className="mt-2 mb-1">
            <button type="button" className="button full">
              DONE!
            </button>
          </Col>
        </Col>
      </Col>
    </Col>
  );
};
export default HomePage;
