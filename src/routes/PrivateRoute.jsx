import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === 'admin')
            return <Navigate to="/admin" replace />;
        if (role === 'employer')
            return <Navigate to="/employer" replace />;
        return <Navigate to="/user" replace />;
    }

    return children;
};

export default PrivateRoute;