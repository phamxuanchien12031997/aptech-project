import { Navigate, useLocation } from 'react-router-dom';

// PublicRoute
// - If rememberMe flag is set AND a token exists, auto-redirect the user
//   to their dashboard when they hit login/register pages.
// - All other public pages (home, jobs, contact, about) remain accessible.

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const rememberMe = localStorage.getItem('rememberMe');
    const location = useLocation();

    const authOnlyPaths = ['/login', '/register', '/forgot-password'];

    // If logged in with remember-me and visiting an auth-only page, skip to dashboard
    if (token && rememberMe === 'true' && authOnlyPaths.includes(location.pathname)) {
        if (role === 'admin') return <Navigate to="/admin" replace />;
        if (role === 'employer') return <Navigate to="/employer" replace />;
        return <Navigate to="/" replace />;
    }

    // If logged in without remember-me, still redirect away from auth pages
    // (token exists from this session) to avoid confusion
    if (token && authOnlyPaths.includes(location.pathname)) {
        if (role === 'admin') return <Navigate to="/admin" replace />;
        if (role === 'employer') return <Navigate to="/employer" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
