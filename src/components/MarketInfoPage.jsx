import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Container, Row, Col } from 'react-bootstrap';
import { getCustomer, getItems, getTransactions, getTransactionsSplit } from '../service/service';

const MarketInfoPage = () => {
 const [activeContent, setActiveContent] = useState('transaction');
 const navigate = useNavigate();
 
 return (
  <Container fluid className="d-flex h-50">
  <Col md={3} className="bg-light border-right">
    <div className="d-flex flex-column align-items-start justify-content-start p-3 h-50">
      <Button 
        variant={(activeContent === 'customer') ? 'primary' : 'secondary'}
        onClick={() => setActiveContent('customer')}
        className="mb-2 w-100"
      >
        Customer
      </Button>
      <Button 
        variant={(activeContent === 'items') ? 'primary' : 'secondary'}
        onClick={() => setActiveContent('items')}
        className="mb-2 w-100"
      >
        Inventory
      </Button>
      <Button 
        variant={(activeContent === 'transaction') ? 'primary' : 'secondary'}
        onClick={() => setActiveContent('transaction')}
        className="mb-2 w-100"
      >
        Transaksi
      </Button>
      <Button 
        variant="primary" 
        onClick={() => navigate('/')}
        className="mt-auto w-100"
      >
        Back To Home
      </Button>
    </div>
  </Col>
  <Col md={9} className="p-3">
    {{
      'transaction': <TransactionTable />,
      'customer': <CustomerTable />,
      'items': <ItemsTable />
    }[activeContent]}
  </Col>
</Container>
 );
};

const CustomerTable = () => {
 const [listCustomer, setListCustomer] = useState([]);

 useEffect(() => {
  fetchListCustomer();
 }, []);

 const fetchListCustomer = async () => {
  try {
   const response = await getCustomer();
   setListCustomer(response.data);
  } catch (error) {
   console.log(error);
  }
 };

 return (
  <Table striped bordered hover variant="dark" responsive>
   <thead>
    <tr>
     <th>Nama Customer</th>
     <th>Jenis Wallet</th>
     <th>QR Code</th>
    </tr>
   </thead>
   <tbody>
    {listCustomer.map((item, index) => (
      <tr key={index}>
        <td>{item.nama}</td>
        <td>{item.wallet}</td>
        <td>{item.qrCode}</td>
      </tr>
    ))}
   </tbody>
  </Table>
 );
};

const TransactionTable = () => {
 const [historyTrxs, setHistoryTrxs] = useState([]);

 useEffect(() => {
  fetchHistoryTrxs();
 }, []);

 const fetchHistoryTrxs = async () => {
  try {
   const response = await getTransactionsSplit();
   setHistoryTrxs(response.data);
  } catch (error) {
   console.log(error);
  }
 };

 return (
  <Table striped bordered hover variant="dark" responsive>
   <thead>
    <tr>
     <th>Nama</th>
     <th>Nama Barang</th>
     <th>Harga Satuan</th>
     <th>Jumlah</th>
     <th>Waktu Pesan</th>
    </tr>
   </thead>
   <tbody>
    {historyTrxs.map((item, index) => (
      <tr key={index}>
        <td>{item.nama}</td>
        <td>{item.namaBarang}</td>
        <td>Rp{item.hargaSatuan}</td>
        <td>{item.jumlah}</td>
        <td>{new Date(item.waktuPesan).toLocaleString()}</td>
      </tr>
    ))}
   </tbody>
  </Table>
 );
};

const ItemsTable = () => {
 const [listItem, setListItem] = useState([]);

 useEffect(() => {
  fetchListItem();
 }, []);

 const fetchListItem = async () => {
  try {
   const response = await getItems();
   setListItem(response.data);
  } catch (error) {
   console.log(error);
  }
 };

 return (
  <Table striped bordered hover variant="dark" responsive>
   <thead>
    <tr>
     <th>Nama Barang</th>
     <th>Harga Satuan</th>
     <th>RFID</th>
    </tr>
   </thead>
   <tbody>
    {listItem.map((item, index) => (
      <tr key={index}>
        <td>{item.namaBarang}</td>
        <td>Rp{item.hargaSatuan}</td>
        <td>{item.rfid}</td>
      </tr>
    ))}
   </tbody>
  </Table>
 );
};

export default MarketInfoPage;
