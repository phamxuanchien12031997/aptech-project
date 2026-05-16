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
import JobDetailPage from '../pages/JobDetail';

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
            <Route path="/jobs/:id" element={<PublicRoute><JobDetailPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

            <Route path="/user" element={
                <PrivateRoute allowedRoles={['job_seeker']}>
                    <UserPage />
                </PrivateRoute>
            } />

            <Route path="/employer" element={
                <PrivateRoute allowedRoles={['employer']}>
                    <EmployerPage />
                </PrivateRoute>
            } />

            <Route path="/admin" element={
                <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                </PrivateRoute>
            } />

            <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;