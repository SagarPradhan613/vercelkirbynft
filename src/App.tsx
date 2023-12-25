import React, { ReactElement } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import HomePage from './pages/HomePage';
import {
    Col
} from 'react-bootstrap';
import Footer from './components/Footer';

const App = (): ReactElement<React.FC> => {
    return (
        <>
            <Col className="main-wrapper">
                <HomePage />
            </Col>
            <Footer />
        </>
    );
}

export default App;
