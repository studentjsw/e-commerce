import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Components/home';
import ViewProduct from './Components/viewProduct';
import Login from './Components/login';
import Cart from './Components/cart';
import Payment from './Components/payment';
import SignUp from './Components/signUp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route extra path='/home' element={<Home/>}/>
        <Route path='/product/:id' element={<ViewProduct/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/payment' element={<Payment/>}/>
        <Route path='*' element={<Navigate to="/home"/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
