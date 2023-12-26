import React, { ReactElement, useState } from "react";
import {
    Col,
    Row,
    Container,
    Image,
} from "react-bootstrap";
import Images from "../shared/Images";

const Header = ({handleShowConnect}:any): ReactElement<React.FC> => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const showConnectModal = ():void=>{
        setShowMenu(false);
        handleShowConnect();
    }
    return(
        <Container>
            <Col xl={12} md={12} sm={12} xs={12}>
                <Row className="p-3">
                    <Col xl={6} md={6} sm={6} xs={10}>
                        <Image src={Images.logo} alt="Logo" className="logo" />
                    </Col>
                    <Col xl={6} md={6} sm={6} xs={4} className="hide-in-mobile text-end">
                        <button type="button" onClick={showConnectModal} className="button">CONNECT</button>
                    </Col>
                    <Col xl={6} md={6} sm={6} xs={2} className="show-in-mobile text-end mr-2">
                        <Image src={Images.meuIcon} alt="Menu Icon" onClick={()=>setShowMenu(true)} />
                    </Col>
                </Row>
            </Col>
            <Col className={showMenu?'responsive-menu show-menu p-4':'responsive-menu p-4'}>
                <Col className="flex flex-row flex-justify">
                    <Image src={Images.logo} alt="" width='120' />
                    <Image src={Images.closeIcon} alt="" onClick={()=>setShowMenu(false)} />
                </Col>
                <Col>
                    <button type="button" className="button full mt-4" onClick={showConnectModal}>Connect</button>
                </Col>
                <Col className="text-center m-100">
                    <a href="/"><Image src={Images.telegramIcon} /></a> &nbsp; 
                    <a href="/"><Image src={Images.twitterIcon} /></a> &nbsp; 
                    <a href="/"><Image src={Images.circleLogo} /></a> &nbsp; 
                </Col>
            </Col>
        </Container>
    )
}
export default React.memo(Header);