import React, { useEffect, useReducer } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AuthWrapper from './AuthWrapper';
import NotFound from './pages/404';
import CreateProduct from './pages/CreateProduct';
import Home from './pages/Home';
import Login from './pages/Login';
import PageTemplate from './pages/PageTemplate';
import Register from './pages/Register';
import Seller from './pages/Seller';
import { AppAction, AppActionType, AppState, AuthResponse, RoleName } from './types';


const initialState: AppState = {
  user: undefined,
  auth: undefined,
  logout: false,
};

function reducer(state: AppState, action: AppAction) {
  switch(action.type) {
    case AppActionType.STORE_AUTH:
      return {
        ...state,
        auth: action.payload
      }
    case AppActionType.STORE_USER:
        return {
          ...state,
          user: action.payload
        };
    case AppActionType.LOGOUT:
      return {
        ...state,
        logout: true
      };
    default:
      return {
        ...state
      }
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [token, setToken] = useState<string | null>();

  useEffect(() => {
    // TODO: Use redux to make token persist in app state
    const auth: string | null = localStorage.getItem('auth');
    let payload: AuthResponse;
    if(auth) {
      payload = JSON.parse(auth);
      dispatch({
        type: AppActionType.STORE_AUTH,
        payload
      });
    }
  }, [])

  return (
    <>
        {
          state.auth?.access_token ? (
              <AuthWrapper state={state} dispatch={dispatch}>
                <Routes>
                  <Route element={<PageTemplate state={state} dispatch={dispatch}/>}>
                    <Route index path='/' element={<Home state={state} dispatch={dispatch} />} />
                    {
                      state?.user?.roleName === RoleName.SELLER
                        &&
                      <Route index path='/create-product' element={<CreateProduct state={state} dispatch={dispatch} />} />
                    }
                    <Route index path='/products' element={<Seller state={state} dispatch={dispatch} />} />
                    <Route path='*' element={<NotFound />} />
                  </Route>
                </Routes>
              </AuthWrapper>
          ) : (
            <Routes>
              <Route element={<PageTemplate state={state} dispatch={dispatch}/>}>
                <Route index path='login' element={<Login state={state} dispatch={dispatch} />} />
                <Route path='register' element={<Register state={state} dispatch={dispatch} />} />
                <Route path='*' element={<Navigate to={"/login"} />} />
              </Route>
            </Routes>
          )
        }
    </>
  );
}

export default App;
