import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactionsFromMDB } from '../service/service';
import { Container, Table, Button, Row, Col, Breadcrumb, Spinner, Alert } from 'react-bootstrap';

const ListTransactionPage = () => {
  const [historyTrx, setHistoryTrx] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistoryTrx();
  }, []);

  const fetchHistoryTrx = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTransactionsFromMDB();
      setHistoryTrx(response.data.data.ListTransaksi);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError('Failed to fetch transactions');
      setLoading(false);
    }
  };

  const checkCurrentDate = (date) => {
    const currentDate = new Date(date);
    console.log(currentDate);
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>History Transaksi</Breadcrumb.Item>
          </Breadcrumb>
          <h2 className="text-center mb-5">History Transaksi</h2>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="bg-dark text-light">
                <tr>
                  <th>QR Code</th>
                  <th>RFID</th>
                  <th>Harga Satuan</th>
                  <th>Jumlah</th>
                  <th>Waktu Pesan</th>
                </tr>
              </thead>
              <tbody>
                {historyTrx.map((item, index) => (
                  <tr key={index} onClick={() => checkCurrentDate(item.waktuPesan)}>
                    <td>{item.qrCode}</td>
                    <td>{item.rfid}</td>
                    <td>Rp{item.hargaSatuan}</td>
                    <td>{item.jumlah}</td>
                    <td>{new Date(item.waktuPesan).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          <div className="d-grid">
            <Button variant="primary" size="lg" onClick={() => navigate('/')}>
              Back To Home 
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ListTransactionPage;
