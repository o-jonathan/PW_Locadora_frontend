import { Navigate } from "react-router";
import { getToken } from "./Autenticacao";

const WithAuth = (Component) => {

  const AuthRoute = () => {    
    const isAuth = getToken() ? true : false;
    if (isAuth) {
      return <Component />;
    } else {
      return <Navigate to="/login" />;
    }
  };

  return AuthRoute;
};

export default WithAuth;