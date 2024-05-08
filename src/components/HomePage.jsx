import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Button} from 'react-bootstrap';

const HomePage = () => {
  const navigate = useNavigate();
  const checkTimeZone = () => {
    let currentDate = new Date(new Date().toLocaleString('en', { timeZone: 'Asia/Jakarta' }));
    let currentDateGlobal = new Date();
    console.log(currentDate);
    console.log(currentDateGlobal);
  };

  return (
    <div className='w-full h-full grid place-items-center' onClick={() => checkTimeZone()}>
    <Navbar className="bg-body-white" >
      <Container>
        <Navbar.Brand href="#home" style={{fontFamily:'fantasy'}}>X-Mart</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-center">
        <Button className="my-2" style={{ width: '8rem', background:'white', color:'black', margin:'2px', borderColor:'white', fontFamily:'Times New Roman' }} onClick={() => navigate('/customer-detail')} >      
            Shop
        </Button>
          <Button style={{ width: '8rem', background:'white', color:'black', margin:'2px', borderColor:'white', fontFamily:'Times New Roman' }} onClick={() => navigate('/market-info')}>
            Info Market
          </Button>
          <Button style={{ width: '10rem', background:'white', color:'black',margin:'2px', borderColor:'white', fontFamily:'Times New Roman' }} onClick={() => navigate('/transaction-list')}>
            History Transaksi
          </Button>

        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  );
};

export default HomePage;
