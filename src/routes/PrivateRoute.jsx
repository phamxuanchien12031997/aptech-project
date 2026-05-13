import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute: Bảo vệ route theo role
 * Props:
 *   - children: component cần render
 *   - allowedRoles: mảng role được phép vào, VD: ['admin'] | ['user'] | ['employer']
 *                   nếu không truyền thì chỉ cần đăng nhập là vào được
 */
const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Chưa đăng nhập → về login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Nếu có yêu cầu role cụ thể mà role hiện tại không khớp → về trang phù hợp
    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === 'admin') return <Navigate to="/admin" replace />;
        if (role === 'employer') return <Navigate to="/employer" replace />;
        return <Navigate to="/user" replace />;
    }

    return children;
};

export default PrivateRoute;