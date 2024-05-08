import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices/cartSlice';
import { clearCustomer } from '../redux/slices/customerSlice';
import { addTransactionToMDB } from '../service/service';
import { Container, Row, Col, Button, Table, Card } from 'react-bootstrap';

const TransactionDetailPage = () => {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({});
  const cartSaved = useSelector((state) => state.cart);
  const customerSaved = useSelector((state) => state.customer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchDataTransaction();
  }, []);

  const getTotalPrice = () => {
    if (cart.length === 0) {
      return 0;
    } else {
      return cart.reduce((total, item) => total + item.hargaSatuan * item.jumlah, 0);
    }
  };

  const fetchDataTransaction = () => {
    if (Object.keys(customerSaved).length === 0) {
      alert('Please Input QR Customer first !');
      navigate('/customer-detail');
    } else if (cartSaved.length === 0) {
      alert('Keranjang kosong !');
      navigate('/cart');
    } else {
      setCart(cartSaved);
      setCustomer(customerSaved);
    }
  };

  const saveTransaction = async () => {
    try {
      for (const item of cartSaved) {
        const transaction = {
          qrCode: customerSaved.qrCode,
          rfid: item.rfid,
          hargaSatuan: item.hargaSatuan,
          jumlah: item.jumlah,
        };
        const response = await addTransactionToMDB(transaction);
        console.log(response);
      }
      alert('Transaksi berhasil tersimpan !');
      dispatch(clearCart());
      dispatch(clearCustomer());
      navigate('/');
    } catch (error) {
      alert('Transaksi gagal !');
      console.log(error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="w-100" style={{ maxWidth: '600px' }}>
        <Card.Body>
          <Card.Title>Detail Transaksi</Card.Title>
          <Row className="mb-3">
            <Col>
              <h5>Pembeli:</h5>
              <p>{customer.nama}</p>
            </Col>
            <Col>
              <h5>Wallet:</h5>
              <p>{customer.wallet}</p>
            </Col>
            <Col>
              <h5>Total Bayar:</h5>
              <p>Rp{getTotalPrice()}</p>
            </Col>
          </Row>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Harga Satuan</th>
                <th>Total Harga</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td>{item.namaBarang}</td>
                  <td>{item.jumlah}</td>
                  <td>Rp{item.hargaSatuan}</td>
                  <td>Rp{item.hargaSatuan * item.jumlah}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between">
            <Button variant="primary" onClick={() => navigate('/cart')}>Kembali</Button>
            <Button variant="success" onClick={saveTransaction}>Simpan Transaksi</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TransactionDetailPage;
