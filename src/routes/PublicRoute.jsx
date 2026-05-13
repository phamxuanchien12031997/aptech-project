import { Navigate } from 'react-router-dom';

/**
 * PublicRoute: Chỉ cho vào nếu chưa đăng nhập.
 * Nếu đã đăng nhập thì redirect về trang phù hợp theo role.
 */
const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
        if (role === 'admin') return <Navigate to="/admin" replace />;
        if (role === 'employer') return <Navigate to="/employer" replace />;
        return <Navigate to="/user" replace />;
    }

    return children;
};

export default PublicRoute;