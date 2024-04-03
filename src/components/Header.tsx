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
            {/* <div className="MainHeaderContainer hidden lg:flex bg-[#1E2B45]"> */}
            <div className="MainHeaderContainer justify-between w-full flex bg-[#1E2B45]">
                <div className="HeaderLeftPortion">
                    <div className="logo-container lg:block hidden hover:scale-105 transition-all duration-500 ease-in-out">
                        <img src="/Images/cropknightlogo.png" style={{ width: "100%", height: "100%" }}></img>
                    </div>
                    <div className="lg:hidden block">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36.355" height="51" viewBox="8855.158 6671.504 36.355 51" className="sc-8a800401-0 fGhPpn mobile-icon" color="text"><g data-name="Group 1102"><g data-name="Path 14773"><path d="M8875.05 6718.604h-3.428l.184 3.4-5.905-3.492-.12-.542c-1.922-8.63-9.163-11.127-9.237-11.15l-.798-.265-.076-.836c-.023-.252-.17-2.853 1.688-16.354 1.992-14.487 15.597-17.287 15.734-17.314l.244-.047.244.047c.137.027 13.741 2.827 15.734 17.314 1.857 13.5 1.71 16.102 1.688 16.354l-.076.836-.799.265c-.294.1-7.327 2.576-9.236 11.15l-.12.542-5.905 3.492.185-3.4Z" fill="#002d56" fill-rule="evenodd"></path><path d="M2461.707 533.665h-3.429l.184 3.4-5.904-3.492-.12-.542c-1.922-8.63-9.164-11.127-9.237-11.15l-.798-.265-.076-.836c-.023-.252-.17-2.853 1.688-16.354 1.992-14.487 15.597-17.287 15.734-17.314l.243-.047.245.047c.137.027 13.741 2.827 15.734 17.314 1.857 13.5 1.71 16.103 1.687 16.354l-.075.836-.799.266c-.294.1-7.327 2.575-9.236 11.149l-.121.542-5.904 3.492.184-3.4Z" stroke-linejoin="round" stroke-linecap="round" stroke="#fff" fill="transparent" transform="matrix(1.02828 0 0 1.02 6343.765 6174.698)"></path></g><path d="M8870.164 6717.322h6.757l3.62-18.994s4.611-5.457 4.49-10.371l-8.821 2.714-1.924 7.336-.558 2.728-.726-8.663-2.585-1.4-8.45-3.235s-.417 9.905 6.544 11.213l1.653 18.672Z" fill="#002d56" fill-rule="evenodd" data-name="Path 14774"></path><path d="M8888.042 6689.539c-1.89-13.745-14.707-16.229-14.707-16.229s-12.815 2.484-14.706 16.229c-1.89 13.745-1.68 16.063-1.68 16.063s7.984 2.65 10.084 12.09l3.36 1.986-1.26-23.184s-6.723-.993-5.673-7.12l7.354 2.816.84 8.611 1.681.497 1.681-.497.84-8.611 7.354-2.816c1.05 6.128-5.672 7.12-5.672 7.12l-1.261 23.184 3.361-1.987c2.101-9.44 10.085-12.089 10.085-12.089s.21-2.318-1.681-16.063Z" fill="#78848a" fill-rule="evenodd" data-name="Path 14775"></path><path d="m8869.243 6696.495 1.247 22.93-.01.24-.61-.36-2.132-21.779-2.46-1.497c-3.85-2.566-1.708-6.655-1.708-6.655-1.049 6.127 5.673 7.121 5.673 7.121Z" fill="#b0bfc6" fill-rule="evenodd" data-name="Path 14776"></path><path d="m8858.565 6697.123-.32 7.62s4.972 2.004 6.896 7.538l-1.443-7.298s-2.406.72-3.77-.882c-1.363-1.603-1.363-6.978-1.363-6.978Z" fill="#b0bfc6" fill-rule="evenodd" data-name="Path 14777"></path><path d="m8867.388 6718.697-4.385-17.538s1.204 10.24 1.417 11.523c-.001.002 1.791 5.588 2.968 6.015Z" fill="#002d56" fill-rule="evenodd" data-name="Path 14778"></path><path d="m8877.539 6696.495-1.247 22.93.011.24.609-.36 2.133-21.779 2.46-1.497c3.849-2.566 1.706-6.655 1.706-6.655 1.05 6.127-5.672 7.121-5.672 7.121Z" fill="#acbac3" fill-rule="evenodd" data-name="Path 14779"></path><path d="m8888.239 6697.123.32 7.62s-4.972 2.004-6.897 7.538l1.444-7.298s2.405.72 3.77-.882c1.364-1.603 1.363-6.978 1.363-6.978Z" fill="#919ea5" fill-rule="evenodd" data-name="Path 14780"></path><path d="M8869.632 6676.512a13.375 13.375 0 0 0-8.1 9.865c.72-.562 2.565-3.77 6.496-3.93 3.93-.16 5.534-2.326 4.812-4.25-.722-1.926-2.404-2.006-3.208-1.685Z" fill="#b0bfc6" fill-rule="evenodd" data-name="Path 14781"></path><path d="M8863.777 6685.575s1.122-1.444 2.486-1.524c1.363-.08-1.604 3.368-2.486 1.524Z" fill="#b0bfc6" fill-rule="evenodd" data-name="Path 14782"></path></g></svg>
                    </div>

                    {/* <div className="leftLinkContainer lg:flex hidden"> */}
                    <div className="leftLinkContainer hidden md:flex lg:flex ">
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
                {/* <div className="lg:flex hidden HeaderRightPortion"> */}
                <div className="flex justify-end HeaderRightPortion">

                    <div className="rightLinkContainer">
                        <p className="price lg:block hidden" style={{ fontWeight: "800", }}>$0.026</p>
                        <div className="coin-img hover:scale-110 transition-all duration-500 ease-in-out">
                            {/* <svg width="39" height="40" viewBox="0 0 39 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M36.5083 15.9861H35.0354C34.6659 14.5729 34.1143 13.2351 33.4071 12L34.4498 10.9422C35.4227 9.95499 35.4227 8.35452 34.4498 7.36736L32.128 5.01167C31.1551 4.02451 29.5776 4.02451 28.6047 5.01167L27.562 6.06955C26.3447 5.35203 25.0262 4.79255 23.6334 4.4175V2.92244C23.6334 1.52631 22.5179 0.394531 21.1419 0.394531H17.8584C16.4824 0.394531 15.3669 1.52631 15.3669 2.92244V4.4175C13.9742 4.7924 12.6556 5.35203 11.4384 6.0694L10.3956 5.01152C9.42268 4.02436 7.84524 4.02436 6.8723 5.01167L4.55067 7.36736C3.57772 8.35452 3.57772 9.95499 4.55067 10.9422L5.59317 11.9999C4.88598 13.235 4.33441 14.5729 3.96491 15.9861H2.49137C1.11548 15.9861 0 17.1178 0 18.514V21.8452C0 23.2413 1.11548 24.3731 2.49137 24.3731H3.96491C4.33456 25.7863 4.88613 27.1242 5.59332 28.3593L4.55067 29.4172C3.57772 30.4043 3.57772 32.0048 4.55067 32.992L6.87245 35.3477C7.84539 36.3348 9.42282 36.3348 10.3958 35.3477L11.4386 34.2896C12.6557 35.0072 13.9744 35.5668 15.3671 35.9417V37.4366C15.3671 38.8327 16.4825 39.9645 17.8586 39.9645H21.142C22.518 39.9645 23.6335 38.8327 23.6335 37.4366V35.9417C25.0264 35.5666 26.3449 35.007 27.5622 34.2895L28.605 35.3477C29.5779 36.3348 31.1553 36.3348 32.1283 35.3477L34.4501 32.992C34.9175 32.5178 35.1799 31.875 35.1799 31.2045C35.1799 30.534 34.9174 29.8912 34.4501 29.417L33.4073 28.359C34.1145 27.1241 34.6659 25.786 35.0355 24.373H36.5085C37.8845 24.373 39 23.2412 39 21.8451V18.5138C38.9999 17.1178 37.8844 15.9861 36.5083 15.9861ZM19.5001 29.2272C14.5829 29.2272 10.5824 25.1683 10.5824 20.1794C10.5824 15.1904 14.5829 11.1316 19.5001 11.1316C24.4173 11.1316 28.4177 15.1904 28.4177 20.1794C28.4177 25.1683 24.4173 29.2272 19.5001 29.2272Z" fill="#FF720D" />
                            </svg> */}
                            <img src="/Images/setting.png"></img>
                        </div>
                        <div className="coin-img hover:scale-110 transition-all duration-500 ease-in-out">
                            <img src="/Images/coin.png"></img>
                        </div>

                        <div className="flex gap-3 hover:text-[#949393] transition-all bnbcontinaer duration-500 ease-in-out items-center">
                            <p className=" cursor-pointer hidden lg:block font-bold bnb text-lg">BNB Smart Chain</p>
                            <svg width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 2L9.99912 10.0009L1.99995 2.0017" stroke="white" stroke-width="3" />
                            </svg>
                        </div>
                        {address ?
                            <div onClick={() => disconnect?.disconnect()}>
                                <div className="bg-[#FF720D] hover:scale-105 transition-all duration-500 ease-in-out connect flex justify-center items-center py-2 px-8 text-white font-bold text-lg rounded-[19.5px]">{address.slice(0, 4)}...{address.slice(-4)}</div>
                            </div>
                            :
                            <div onClick={showConnectModal}>
                                <div className="bg-[#FF720D] hover:scale-105 transition-all duration-500 ease-in-out connect flex justify-center items-center py-2 px-8 text-white font-bold text-lg rounded-[19.5px]">Connect Wallet</div>
                            </div>
                        }


                    </div>
                </div>
            </div>


            {/* <div className="MainHeaderContainer flex lg:hidden bg-[#1E2B45]">
                <div className="HeaderLeftPortion flex w-full justify-between items-center pr-3" >
                    <div className="logo-container">
                        <img src="/Images/cropknightlogo.png" style={{ width: "100%", height: "100%" }}></img>
                    </div>
                    {
                        !showMenu &&
                        <div onClick={() => setShowMenu(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30"
                                style={{ fill: "#FFFFFF" }}>
                                <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"></path>
                            </svg>
                        </div>
                    }
                </div>
            </div>

            <div className={showMenu ? 'responsive-menu show-menu p-4' : 'responsive-menu p-4 lg:hidden block'}>
                <div className="flex flex-row flex-justify">
                    <div className="logo-container">
                        <img src="/Images/cropknightlogo.png" style={{ width: "100%", height: "100%" }}></img>
                    </div>
                    <div onClick={() => setShowMenu(false)}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.6684 1.5L2.09732 16.0711" stroke="white" stroke-width="2" stroke-linecap="round" />
                            <path d="M15.9024 16.071L1.33136 1.49997" stroke="white" stroke-width="2" stroke-linecap="round" />
                        </svg>
                    </div>
                </div>

                <div className="text-center w-full flex justify-center items-center flex-col gap-6 mt-10">
                    <a href="/" className="head-links">TRADE</a>
                    <a href="/" className="head-links">SWAP</a>
                  
                    <div className="flex items-center  gap-4">
                        <p style={{ fontWeight: "800", color: "#FF720D" }}>$0.026</p>
                        <div className="coin-img">
                          
                            <img src="/Images/setting.png"></img>
                        </div>
                    </div>



                    <div className="flex gap-3 items-center">
                        <div className="coin-img">
                            <img src="/Images/coin.png"></img>
                        </div>
                        <p className="text-white font-bold bnb text-lg">BNB Smart Chain</p>
                        <svg width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 2L9.99912 10.0009L1.99995 2.0017" stroke="white" stroke-width="3" />
                        </svg>
                    </div>

                   
                </div>

                <div>
                    {address ? <button type="button" className="button full mt-4" onClick={() => disconnect?.disconnect()}>{address.slice(0, 4)}...{address.slice(-4)}</button> : <button type="button" className="button full mt-4" onClick={showConnectModal}>Connect</button>}
                </div>
            </div> */}
        </>

    )
}
export default React.memo(Header);