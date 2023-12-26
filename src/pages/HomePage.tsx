import React, { ReactElement, useState } from "react";
import Header from "../components/Header";
import {
    Col,
    Row,
    Image,
    Container,
} from "react-bootstrap";
import Images from "../shared/Images";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { truncateSync } from "fs";

const HomePage = (): ReactElement<React.FC> => {
    const [mintValue, setmintValue] = useState<number>(0);
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [showConnect, setShowConnect] = useState<boolean>(false);
    const [showMint, setShowMint] = useState<boolean>(false);
    const [congatulationModal, setCongatulationModal] = useState<boolean>(false);
    const [sorryModal, setSorryModal] = useState<boolean>(false);
    const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
    const [nowallet, setNowallet] = useState<boolean>(false)
    const incrementMint = (): void => {
        setmintValue(mintValue + 1);
    }
    const decrementMint = (): void => {
        mintValue > 0 ? setmintValue(mintValue - 1) : setmintValue(0);
    }
    const handleCloseConnect = (): void => {
        setShowConnect(false)
    }
    const handleShowConnect = (): void => {
        setShowConnect(true);
    }
    const handleCloseMint = (): void => {
        setShowMint(false);
    }
    const handleShowMint = (): void => {
        if (mintValue !== 0) {
            setShowMint(true);
        }
    }
    const handleCloseCngratulationModal = (): void => {
        setCongatulationModal(false);
    }
    const handleShowCongatulation = (): void => {
        if (walletAddress.length !== 0) {
            setNowallet(false)
            const s = Math.floor(Math.random() * 2)
            s === 1 ? setCongatulationModal(true) : setSorryModal(true);
        } else {
            setNowallet(true)
        }
    }
    const handleCloseSorryModal = (): void => {
        setSorryModal(false);
    }
    const handleCloseCheckoutModal = (): void => {
        setCheckoutSuccess(false);
    }
    const handleShowCheckoutModal = (): void => {
        setShowMint(false);
        setCheckoutSuccess(true);
    }
    const handleMintValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
        console.log(e.target.value);

        if (e.target.value) {
            setmintValue(parseInt(e.target.value))
        } else {
            setmintValue(0)
        }
    }
    return (
        <Col>
            <Header handleShowConnect={handleShowConnect} />
            <Image src={Images.characterOne} className="character one hide-on-small" alt="Character One" />
            <Image src={Images.characterTwo} className="character two hide-on-small" alt="Character One" />
            <Image src={Images.characterThree} className="character three hide-on-small" alt="Character One" />
            <Image src={Images.characterTwo} className="character four hide-on-small" alt="Character One" />
            <Image src={Images.characterThree} className="character five hide-on-small" alt="Character One" />
            <Image src={Images.characterTwo} className="character six hide-on-small" alt="Character One" />
            <Image src={Images.characterOne} className="character seven hide-on-small" alt="Character One" />
            <Image src={Images.characterTwo} className="character eight hide-on-small" alt="Character One" />
            <Row className="main-content">
                <h3 className="text-center text-white mt-5 show-in-mobile">Mint is Live Now</h3>
                <Col xl={6} md={6} sm={12} xs={12} className="m-10 text-center">
                    <Image src={Images.leftsideImg} alt="Left side image" className="img-responsive" />
                </Col>
                <Col xl={1} md={1} sm={1} xs={1} className="m-10"></Col>
                <Col xl={5} md={5} sm={12} xs={12} className="m-10">
                    <h1 className="text-white ml-5 text-center hide-in-mobile">Mint is Live Now</h1>
                    <p className="text-center text-white mt-5 mb-5 bellow-img h6">Blue Kirby NFTs are ready to be minted. Mint yours for free from below!</p>
                    <Col className="flex flex-row flex-justify">
                        <button type="button" className="button increment-decrement" onClick={decrementMint}><span className="decrement"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-dash" viewBox="0 0 16 16">
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                        </svg></span></button>
                        <input type="text" value={mintValue} className="mint-value mx-1" onChange={handleMintValue} />
                        <button type="button" className="button increment-decrement" onClick={incrementMint}><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                        </svg></button>
                    </Col>
                    <button type="button" className="button full mt-5" onClick={handleShowMint}>MINT NOW</button>
                </Col>
                <Container>
                    <Col xl={12} md={12} sm={12} xs={12} className="bg-wrapper">
                        <Row className="p-4 mt-5">
                            <Col xl={4} md={4} sm={12} xs={12}>
                                <h5 className="text-white text-end mt-2">Check on Whitelist</h5>
                            </Col>
                            <Col xl={4} md={4} sm={12} xs={12}>

                                <input type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="Enter your Wallet Address" />
                            </Col>
                            <Col xl={4} md={4} sm={12} xs={12}>
                                <button type="button" className="button" onClick={handleShowCongatulation}>Check Now</button>
                            </Col>
                        </Row>
                    </Col>
                </Container>
            </Row>
            {/* Connect modal */}
            <Col className={showConnect ? 'modal-overlay show-overlay' : 'modal-overlay'}>
                <Col className={showConnect ? 'modal-container show-connect-modal' : 'modal-container'}>
                    <span className="close-icon" onClick={handleCloseConnect}>X</span>
                    <Image src={Images.connectModalTop} alt="Connect modal" className="" width={280} /><br />
                    <Col className="mt-5 mb-3 modal-button">
                        <button type="button"><Image src={Images.connectModalBgOne} alt="Button BG" /><br /><p>Wallet Connect</p></button>
                        <button type="button"><Image src={Images.connectModalBgTwo} alt="Button BG" /><br /><p>Metamask</p></button>
                        <button type="button"><Image src={Images.connectModalBgThree} alt="Button BG" /><br /><p>Trust Wallet</p></button>
                    </Col>
                </Col>
            </Col>
            {/* Mint modal */}
            <Col className={showMint ? 'modal-overlay show-overlay' : 'modal-overlay'}>
                <Col className={showMint ? 'modal-container show-connect-modal' : 'modal-container'}>
                    <span className="close-icon" onClick={handleCloseMint}>X</span>
                    <Col className="mt-2 mb-3">
                        <Row>
                            <Col xl={7} md={7} sm={12} xs={12}>
                                <h4 className="text-center show-in-mobile text-white">Details</h4>
                                <Col className="modal-left-container">
                                    <p>
                                        YOU ARE ABOUT TO MINT <strong>{mintValue} NFT</strong>
                                    </p>
                                    <Col className="modal-inner-container flex flex-row flex-justify flex-middle">
                                        <span className="flex flex-row">
                                            <Image src={Images.bllingIcon} alt="" /> &nbsp;
                                            <span className="flex flex-column flex-start">
                                                <small><small><small className="text-white">0x3ac...fbc8</small></small></small>
                                                <small><small className="fantom">FANTOM</small></small>
                                            </span>
                                        </span>
                                        <span className="dots"></span>&nbsp;<small><small className="text-success">Connected</small></small>
                                    </Col>
                                    <Col className="mt-3 details">
                                        <span className="flex flex-row flex-justify mt-1">
                                            <small>100 FTM x 1 edition</small>
                                            <strong>100 FTM</strong>
                                        </span>
                                        <span className="divider mt-2 mb-2"></span>
                                        <span className="flex flex-row flex-justify mt-1">
                                            <small>Balance</small>
                                            <strong>0 FTM</strong>
                                        </span>
                                        <span className="flex flex-row flex-justify mt-1">
                                            <small>You will pay</small>
                                            <strong>100 FTM</strong>
                                        </span>
                                    </Col>
                                </Col>
                            </Col>
                            <Col xl={5} md={5} sm={12} xs={12}>
                                <h4 className="text-center hide-in-mobile text-white">Details</h4>
                                <Image src={Images.modalBg} alt="Charater" width={180} height={140} className="mt-4 hide-in-mobile" />
                                <button type="button" className="button full btn-checkout mt-4" onClick={handleShowCheckoutModal}>Mint Now</button>
                            </Col>
                        </Row>
                    </Col>
                </Col>
            </Col>
            {/* Success modal */}
            <Col className={congatulationModal ? 'modal-overlay show-overlay' : 'modal-overlay'}>
                <Col className={congatulationModal ? 'modal-container show-success-modal' : 'modal-container'}>
                    <span className="close-icon" onClick={handleCloseCngratulationModal}>X</span>
                    <h4 className="text-white text-center">Congratulations!</h4>
                    <Image src={Images.characterTwo} alt="Connect modal" className="conngratulation-img" width={100} /><br />
                    <Col className="text-center conngratulation">
                        <p>Your wallet</p>
                        <p className="text-white">{walletAddress}</p>
                        <h6>is Whitelisted!</h6>
                    </Col>
                    <Col className="mt-5 mb-3">
                        <button type="button" className="button full" onClick={handleCloseCngratulationModal}>DONE!</button>
                    </Col>
                </Col>
            </Col>
            {/* Failed modal */}
            <Col className={sorryModal ? 'modal-overlay show-overlay' : 'modal-overlay'}>
                <Col className={sorryModal ? 'modal-container show-sorry-modal' : 'modal-container'}>
                    <span className="close-icon" onClick={handleCloseSorryModal}>X</span>
                    <h4 className="text-white text-center">Sorry</h4>
                    <Image src={Images.sorryModal} alt="Connect modal" className="sorry-img" width={100} /><br />
                    <Col className="text-center conngratulation sorry">
                        <p>Your wallet</p>
                        <p className="text-white">{walletAddress}</p>
                        <h6>is Not Whitelisted!</h6>
                    </Col>
                    <Col className="mt-5 mb-3">
                        <button type="button" className="button full" onClick={handleCloseSorryModal}>DONE!</button>
                    </Col>
                </Col>
            </Col>
            {/* Checkout success modal */}
            <Col className={checkoutSuccess ? 'modal-overlay1 show-overlay' : 'modal-overlay1'}>
                <Col className={`${checkoutSuccess ? "modal-container1 show-sorry-modal p-4 checkout-modal" : "modal-container1 p-4 checkout-modal "}`}>
                    <span className="close-icon" onClick={handleCloseCheckoutModal}>X</span>
                    <h6 className="text-white">MINTED <span className="text-blue">{mintValue} NFTS</span></h6>
                    <h4 className="text-white text-center">Successfully</h4>
                    <Col className="text-center w-100" >
                        <Carousel showThumbs={false} showStatus={false} infiniteLoop={true}>
                            <div className="blue-bg">
                                <img src={Images.leftsideImg} alt="" />
                            </div>
                            <div className="blue-bg">
                                <img src={Images.leftsideImg} alt="" />
                            </div>
                            <div className="blue-bg">
                                <img src={Images.leftsideImg} alt="" />
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
                        <button type="button" className="button full" onClick={handleCloseCheckoutModal}>DONE!</button>
                    </Col>
                </Col>
            </Col>
        </Col>
    )
}
export default HomePage;