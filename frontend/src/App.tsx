import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AuthWrapper from './AuthWrapper';
import NotFound from './pages/404';
import Buyer from './pages/Buyer';
import CreateProduct from './pages/CreateProduct';
import Home from './pages/Home';
import Login from './pages/Login';
import PageTemplate from './pages/PageTemplate';
import Register from './pages/Register';
import Seller from './pages/Seller';
import { loginSuccess, selectAuth } from './store/authSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { AuthResponse } from './types';


function App() {
  // const [token, setToken] = useState<string | null>();
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);

  useEffect(() => {
    // TODO: Use redux to make token persist in app state
    const auth: string | null = localStorage.getItem('auth');
    let payload: AuthResponse;
    if(auth) {
      payload = JSON.parse(auth);
      dispatch(loginSuccess(payload));
    }
  }, [dispatch]);

  return (
    <>
        {
          authState?.access_token ? (
              <AuthWrapper>
                <Routes>
                  <Route element={<PageTemplate/>}>
                    <Route path='/create-product' element={<CreateProduct />} />
                    <Route path='/update-product/:productId' element={<CreateProduct />} />
                    <Route index path='/products' element={<Seller />} />
                    <Route index path='/' element={<Seller />} />
                    <Route index path='/deposit' element={<Buyer />} />
                    <Route path='*' element={<NotFound />} />
                  </Route>
                </Routes>
              </AuthWrapper>
          ) : (
            <Routes>
              <Route element={<PageTemplate />}>
                <Route index path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
                <Route path='*' element={<NotFound />} />
              </Route>
            </Routes>
          )
        }
    </>
  );
}

export default App;
