import { Navigate, useLocation } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const location = useLocation();

    // Nếu đã đăng nhập và đang ở trang login/register, redirect về dashboard tương ứng
    if (token && (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password')) {
        if (role === 'admin')
            return <Navigate to="/admin" replace />;
        if (role === 'employer')
            return <Navigate to="/employer" replace />;
        // Job seekers redirect về HomePage
        return <Navigate to="/" replace />;
    }

    // Cho phép truy cập các trang public khác (như HomePage, JobDetail)
    return children;
};

export default PublicRoute;