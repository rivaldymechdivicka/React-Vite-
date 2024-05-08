import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { BsCartPlusFill } from 'react-icons/bs';
import { FiShoppingBag } from 'react-icons/fi';
import { IoIosAddCircle, IoIosRemoveCircle, IoIosTrash } from 'react-icons/io';
import { addToCart, increaseItem, decreaseItem, removeItem } from '../redux/slices/cartSlice';
import { setCustomer, clearCustomer } from '../redux/slices/customerSlice';
import { getItems } from '../service/service';

const CartPage = () => {
  const [listItem, setListItem] = useState([]);
  const [customer, setCustomer] = useState({});
  const carts = useSelector((state) => state.cart);
  const customerSaved = useSelector((state) => state.customer);
  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(customerSaved).length !== 0) {
      setCustomer(customerSaved);
      getListItem();
    } else {
      alert('Please Input QR Customer first!');
      navigate('/customer-detail');
    }
  }, []);

  const getListItem = async () => {
    try {
      const listItemSaved = await getItems();
      setListItem(listItemSaved.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalPrice = () => {
    if (carts.length === 0) {
      return 0;
    } else {
      return carts.reduce((total, item) => total + item.hargaSatuan * item.jumlah, 0);
    }
  };

  return (
    <Container fluid className="p-5 d-flex h-100">
      <Col md={8} className="bg-light rounded-3 p-5 overflow-auto">
        <Button variant="primary" className="mb-3" onClick={() => navigate('/customer-detail')}>Kembali</Button>
        <h1 className="text-center mb-4">Item List</h1>
        <Row>
          {listItem.map(item => (
            <ProductCard
              namaBarang={item.namaBarang}
              hargaSatuan={item.hargaSatuan}
              rfid={item.rfid}
            />
          ))}
        </Row>
      </Col>
      <Col md={4} className="bg-light rounded-3 p-5">
        <h1 className="text-center mb-4">Cart</h1>
        <div className="d-flex flex-column overflow-auto">
          {carts.map(item => (
            <CartList
              namaBarang={item.namaBarang}
              hargaSatuan={item.hargaSatuan}
              rfid={item.rfid}
              jumlah={item.jumlah}
            />
          ))}
        </div>
        <div className="mt-auto">
          <h2>Total Price: Rp{getTotalPrice()}</h2>
          <h2>Customer: {customer.nama}</h2>
          <h2>Wallet: {customer.wallet}</h2>
          {carts.length === 0 ? (
            <Button variant="secondary" className="mt-2">
              Keranjang Kosong
            </Button>
          ) : (
            <Button variant="primary" className="mt-2" onClick={() => navigate('/transaction-detail')}>
              Buat Transaksi
            </Button>
          )}
        </div>
      </Col>
    </Container>
  );
};

const ProductCard = ({ namaBarang, hargaSatuan, rfid }) => {
  const dispatch = useDispatch();
  return (
    <Card className="m-2" style={{ width: '18rem' }}>
      <Card.Body className="d-flex flex-column align-items-center p-2">
        <FiShoppingBag size={75} />
        <Card.Title>{namaBarang}</Card.Title>
        <Card.Text>
          Rp{hargaSatuan}
        </Card.Text>
        <Button variant="outline-primary" onClick={() => dispatch(addToCart({
          namaBarang,
          hargaSatuan,
          rfid,
        }))}>
          <BsCartPlusFill size={25} />
        </Button>
      </Card.Body>
    </Card>
  );
};

const CartList = ({ namaBarang, hargaSatuan, rfid, jumlah }) => {
  const dispatch = useDispatch();
  return (
    <div className='d-flex justify-content-between align-items-center bg-light rounded px-2 my-2'>
      <div>
        <h5>{namaBarang}</h5>
        <h6>Rp{hargaSatuan * jumlah}</h6>
      </div>
      <div className='d-flex align-items-center'>
        <Button variant="outline-secondary" onClick={() => dispatch(decreaseItem(rfid))}><IoIosRemoveCircle size={30} /></Button>
        <span className='mx-3'>{jumlah}</span>
        <Button variant="outline-secondary" onClick={() => dispatch(increaseItem(rfid))}><IoIosAddCircle size={30} /></Button>
        <Button variant="danger" onClick={() => dispatch(removeItem(rfid))}><IoIosTrash size={30} /></Button>
      </div>
    </div>
  );
};

export default CartPage;
