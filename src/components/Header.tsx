import React, { ReactElement, useState } from "react";
// import {
//     Col,
//     Row,
//     Container,
//     Image,
// } from "react-bootstrap";
import Images from "../shared/Images";
import { useAccount, useDisconnect } from "wagmi";
import './Header.css';


const Header = ({ handleShowConnect }: any): ReactElement<React.FC> => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const showConnectModal = (): void => {
        setShowMenu(false);
        handleShowConnect();
    }

    const { address } = useAccount()
    const disconnect = useDisconnect()

    return (
        // <Container>
        //     <Col xl={12} md={12} sm={12} xs={12}>
        //         <Row className="p-3">
        //             <Col xl={6} md={6} sm={6} xs={10}>
        //                 <Image src={Images.logo} alt="Logo" className="logo" />
        //             </Col>
        //             <Col xl={6} md={6} sm={6} xs={4} className="hide-in-mobile text-end">
        //                 {address ? <button type="button" onClick={() => disconnect?.disconnect()} className="button">{address.slice(0, 7)}...{address.slice(-7)}</button> : <button type="button" onClick={showConnectModal} className="button">CONNECT</button>}
        //             </Col>
        //             {
        //                 !showMenu && <Col xl={6} md={6} sm={6} xs={2} className="show-in-mobile text-end mr-2">
        //                     <Image src={Images.meuIcon} alt="Menu Icon" onClick={() => setShowMenu(true)} />
        //                 </Col>
        //             }

        //         </Row>
        //     </Col>
        //     <Col className={showMenu ? 'responsive-menu show-menu p-4' : 'responsive-menu p-4'}>
        //         <Col className="flex flex-row flex-justify">
        //             <Image src={Images.logo} alt="" width='120' />
        //             <Image src={Images.closeIcon} alt="" onClick={() => setShowMenu(false)} />
        //         </Col>
        //         <Col>
        //             {address ? <button type="button" className="button full mt-4" onClick={() => disconnect?.disconnect()}>{address.slice(0, 4)}...{address.slice(-4)}</button> : <button type="button" className="button full mt-4" onClick={showConnectModal}>Connect</button>}
        //         </Col>
        //         <Col className="text-center m-100">
        //             <a href="https://t.me/bluekirbyftm" target="_blank" rel="noopener noreferrer"><Image src={Images.telegramIcon} /></a> &nbsp;
        //             <a href="https://twitter.com/Bluekirbyftm" target="_blank" rel="noopener noreferrer"><Image src={Images.twitterIcon} /></a> &nbsp;
        //             <a href="https://ftmscan.com/token/0x97bdAfe3830734acF12Da25359674277fcc33729" target="_blank" rel="noopener noreferrer"><Image src={Images.circleLogo} /></a> &nbsp;
        //         </Col>
        //     </Col>
        // </Container>
        <>
            <div className="MainHeaderContainer bg-[#1E2B45]">
                <div className="HeaderLeftPortion">
                    <div className="logo-container">
                        <img src="/Images/cropknightlogo.png" style={{ width: "100%", height: "100%" }}></img>
                    </div>

                    <div className="leftLinkContainer lg:flex hidden">
                        <a href="/" className="head-links">TRADE</a>
                        <a href="/" className="head-links">SWAP</a>
                        <div className="spcl-container">
                            <svg width="31" height="5" viewBox="0 0 31 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="2.5" cy="2.5" r="2.5" fill="#FF720D" />
                                <circle cx="15.5" cy="2.5" r="2.5" fill="#FF720D" />
                                <circle cx="28.5" cy="2.5" r="2.5" fill="#FF720D" />
                            </svg>
                        </div>

                    </div>

                </div>
                <div className="lg:flex hidden HeaderRightPortion">
                    <div className="rightLinkContainer">
                        <p style={{ fontWeight: "800", color: "#FF720D" }}>$0.026</p>
                        <div className="coin-img">
                            {/* <svg width="39" height="40" viewBox="0 0 39 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M36.5083 15.9861H35.0354C34.6659 14.5729 34.1143 13.2351 33.4071 12L34.4498 10.9422C35.4227 9.95499 35.4227 8.35452 34.4498 7.36736L32.128 5.01167C31.1551 4.02451 29.5776 4.02451 28.6047 5.01167L27.562 6.06955C26.3447 5.35203 25.0262 4.79255 23.6334 4.4175V2.92244C23.6334 1.52631 22.5179 0.394531 21.1419 0.394531H17.8584C16.4824 0.394531 15.3669 1.52631 15.3669 2.92244V4.4175C13.9742 4.7924 12.6556 5.35203 11.4384 6.0694L10.3956 5.01152C9.42268 4.02436 7.84524 4.02436 6.8723 5.01167L4.55067 7.36736C3.57772 8.35452 3.57772 9.95499 4.55067 10.9422L5.59317 11.9999C4.88598 13.235 4.33441 14.5729 3.96491 15.9861H2.49137C1.11548 15.9861 0 17.1178 0 18.514V21.8452C0 23.2413 1.11548 24.3731 2.49137 24.3731H3.96491C4.33456 25.7863 4.88613 27.1242 5.59332 28.3593L4.55067 29.4172C3.57772 30.4043 3.57772 32.0048 4.55067 32.992L6.87245 35.3477C7.84539 36.3348 9.42282 36.3348 10.3958 35.3477L11.4386 34.2896C12.6557 35.0072 13.9744 35.5668 15.3671 35.9417V37.4366C15.3671 38.8327 16.4825 39.9645 17.8586 39.9645H21.142C22.518 39.9645 23.6335 38.8327 23.6335 37.4366V35.9417C25.0264 35.5666 26.3449 35.007 27.5622 34.2895L28.605 35.3477C29.5779 36.3348 31.1553 36.3348 32.1283 35.3477L34.4501 32.992C34.9175 32.5178 35.1799 31.875 35.1799 31.2045C35.1799 30.534 34.9174 29.8912 34.4501 29.417L33.4073 28.359C34.1145 27.1241 34.6659 25.786 35.0355 24.373H36.5085C37.8845 24.373 39 23.2412 39 21.8451V18.5138C38.9999 17.1178 37.8844 15.9861 36.5083 15.9861ZM19.5001 29.2272C14.5829 29.2272 10.5824 25.1683 10.5824 20.1794C10.5824 15.1904 14.5829 11.1316 19.5001 11.1316C24.4173 11.1316 28.4177 15.1904 28.4177 20.1794C28.4177 25.1683 24.4173 29.2272 19.5001 29.2272Z" fill="#FF720D" />
                            </svg> */}
                            <img src="/Images/setting.png"></img>
                        </div>
                        <div className="coin-img">
                            <img src="/Images/coin.png"></img>
                        </div>

                        <div className="flex gap-3 items-center">
                            <p className="text-white font-bold bnb text-lg">BNB Smart Chain</p>
                            <svg width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 2L9.99912 10.0009L1.99995 2.0017" stroke="white" stroke-width="3" />
                            </svg>
                        </div>
                        <div>
                            <div className="bg-[#FF720D] connect flex justify-center items-center py-2 px-8 text-white font-bold text-lg rounded-[19.5px]">Connect Wallet</div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
export default React.memo(Header);