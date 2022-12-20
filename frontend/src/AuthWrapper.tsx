import { message } from "antd";
import { useEffect } from "react";
import RestService from "./services/RestService";
import { loginSuccess, selectLogout } from "./store/authSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { loadUser, loadUserSuccess } from "./store/userSlice";
import { AuthResponse } from "./types";

export default function AuthWrapper({ children }: { children: any }) {
  const shouldLogout = useAppSelector(selectLogout);
  const dispatch = useAppDispatch();

    function logout() {
        return new RestService().logout();
    }

    useEffect(() => {
        // Fetch the user and logout if fails
        dispatch(loadUser());
        new RestService().me().then(me => {
          dispatch(loadUserSuccess(me));
        }).catch(e => {
            message.error(e.message || e.error);
            logout();
        });

        const auth: AuthResponse | null =
            localStorage.getItem('auth')
            &&
            JSON.parse(localStorage.getItem('auth') as string);

        if(shouldLogout) {
            logout();
        }

        // If access token gets deleted from localStorage
        const interval = setInterval(() => {
          if(!auth || !auth.access_token) {
            logout();
          }
        }, 500);

        // logic to refresh token here if there is activity, but for now we just logout instead
        const tokenInterval = setInterval(() => {
              logout();
          }, Number(auth?.expires_in) * 1000);

        return  () => {
          clearInterval(interval);
          clearInterval(tokenInterval);
        }
      }, [shouldLogout, dispatch]);

      return children;

}