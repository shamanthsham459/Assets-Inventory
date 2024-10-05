import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/auth';
// import { AuthContext } from '../auth/auth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;



// ##2
// import React, { useContext } from 'react';
// import { Route, Redirect } from 'react-router-dom';
// import { AuthContext } from '../auth/auth';

// const ProtectedRoute = ({ component: Component, ...rest }) => {
//   const { isAuthenticated } = useContext(AuthContext);

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
//       }
//     />
//   );
// };

// export default ProtectedRoute;