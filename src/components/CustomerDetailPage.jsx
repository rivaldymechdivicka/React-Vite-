import React, { useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import QRCode from 'react-qr-code';
import { useDispatch } from 'react-redux';
import { setCustomer } from '../redux/slices/customerSlice';
import { useNavigate } from 'react-router-dom';
import { getCustomerById } from '../service/service';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const CustomerDetailPage = () => {
  const [scanResult, setScanResult] = useState();
  const [customer, setCustomer] = useState();
  const navigate = useNavigate();

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 500, height: 500 },
      fps: 1,
      disableFlip: false,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_128
      ]
    }, false);

    scanner.render(async (result) => {
      const customerExist = await checkCustomer(result);
      setCustomer(customerExist);
      setScanResult(result);
      scanner.clear();
    }, (error) => {
      console.warn(error);
    });
  };

  const checkCustomer = async (qrResult) => {
    const response = await getCustomerById(qrResult);
    return response ? response.data : null;
  };

  return (
    <Container className="p-5">
      <Row>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>QR Scanner for Customer</Card.Title>
              <div id='reader'></div>
              <div className="d-flex justify-content-evenly mt-3">
                <Button variant="primary" onClick={() => navigate('/')}>Back</Button>
                <Button variant="primary" onClick={startScanner}>Start Scanner</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Customer Details</Card.Title>
              {scanResult ? (
                customer ? (
                  <CustomerInfoCard customer={customer} />
                ) : (
                  <Card.Text className="text-center">
                    Customer with this QR Code is not found, please scan again.
                  </Card.Text>
                )
              ) : (
                <Card.Text className="text-center">
                  Scan QRCode to show customer details.
                </Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const CustomerInfoCard = ({ customer }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const startShopping = () => {
    dispatch(setCustomer(customer));
    navigate('/cart');
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>QR Code Customer: {customer.qrCode}</Card.Title>
        <QRCode value={customer.qrCode} />
        <Card.Text>
          Name: {customer.nama}
        </Card.Text>
        <Card.Text>
          Wallet: {customer.wallet}
        </Card.Text>
        <Button onClick={startShopping}>Start Shopping</Button>
      </Card.Body>
    </Card>
  );
};

export default CustomerDetailPage;
