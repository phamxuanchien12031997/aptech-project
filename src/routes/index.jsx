import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import HomePage from '../pages/Home';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import ForgotPasswordPage from '../pages/ForgotPassword';
import UserPage from '../pages/User';
import EmployerPage from '../pages/Employer';
import AdminDashboard from '../pages/Dashboard';

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            {/* ── Public: chỉ vào được khi chưa đăng nhập ── */}
            <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

            {/* ── Private: người tìm việc ── */}
            <Route path="/user" element={
                <PrivateRoute allowedRoles={['user']}>
                    <UserPage />
                </PrivateRoute>
            } />

            {/* ── Private: nhà tuyển dụng ── */}
            <Route path="/employer" element={
                <PrivateRoute allowedRoles={['employer']}>
                    <EmployerPage />
                </PrivateRoute>
            } />

            {/* ── Private: admin ── */}
            <Route path="/admin" element={
                <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                </PrivateRoute>
            } />

            {/* Legacy route /dashboard → redirect về /admin */}
            <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;