import { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../assets/img/Logo.png';

const API = '/server/index.php';

// ============================================================
// SIDEBAR COMPONENT
// ============================================================
function Sidebar({ activeTab, setActiveTab, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const userName = localStorage.getItem('name') || 'Admin';

    const tabs = [
        { id: 'overview', icon: '📊', label: 'Tổng quan' },
        { id: 'users', icon: '👥', label: 'Người dùng' },
        { id: 'employers', icon: '🏢', label: 'Nhà tuyển dụng' },
        { id: 'jobs', icon: '💼', label: 'Việc làm' },
        { id: 'categories', icon: '📂', label: 'Danh mục' }
    ];

    return (
        <aside style={{
            width: 240,
            background: '#fff',
            borderRight: '1px solid #f3f4f6',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
        }}>
            {/* Logo */}
            <div style={{ padding: '20px 16px', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src={Logo} alt="JobHot" style={{ height: 32 }} />
                    <div style={{ fontWeight: 700, fontSize: 20, color: '#7c3aed', letterSpacing: -0.5 }}>JobHot</div>
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Quản trị hệ thống</div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            marginBottom: 4,
                            background: activeTab === tab.id ? '#f5f3ff' : 'transparent',
                            color: activeTab === tab.id ? '#7c3aed' : '#6b7280',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: activeTab === tab.id ? 600 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            textAlign: 'left',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ fontSize: 16 }}>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* User info - moved to bottom */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6' }}>
                <div
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        cursor: 'pointer',
                        padding: 8,
                        borderRadius: 8,
                        background: menuOpen ? '#f9fafb' : 'transparent'
                    }}
                >
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 600
                    }}>
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>Quản trị viên</div>
                    </div>
                    <span style={{ fontSize: 10, color: '#9ca3af', transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▲</span>
                </div>
                {menuOpen && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f3f4f6' }}>
                        <button
                            onClick={onLogout}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: '#fef2f2',
                                color: '#dc2626',
                                border: 'none',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}
                        >
                            🚪 Đăng xuất
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}

// ============================================================
// OVERVIEW TAB
// ============================================================
function OverviewTab({ stats, jobs }) {
    return (
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
            {/* Stats cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Việc làm</div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#7c3aed' }}>{stats.jobs}</div>
                        </div>
                        <div style={{ fontSize: 36 }}>💼</div>
                    </div>
                </div>
                <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Công ty</div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#3b82f6' }}>{stats.companies}</div>
                        </div>
                        <div style={{ fontSize: 36 }}>🏢</div>
                    </div>
                </div>
                <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Ứng viên</div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>{stats.candidates}</div>
                        </div>
                        <div style={{ fontSize: 36 }}>👥</div>
                    </div>
                </div>
            </div>

            {/* Recent jobs */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#111827' }}>Việc làm mới nhất</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Tiêu đề</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Công ty</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Địa điểm</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.slice(0, 5).map(job => (
                                <tr key={job.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                    <td style={{ padding: '12px 8px', fontSize: 13, color: '#111827' }}>{job.title}</td>
                                    <td style={{ padding: '12px 8px', fontSize: 13, color: '#6b7280' }}>{job.company}</td>
                                    <td style={{ padding: '12px 8px', fontSize: 13, color: '#6b7280' }}>{job.location}</td>
                                    <td style={{ padding: '12px 8px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: 12,
                                            fontSize: 11,
                                            fontWeight: 500,
                                            background: job.status === 'active' ? '#d1fae5' : job.status === 'pending' ? '#fef3c7' : '#f3f4f6',
                                            color: job.status === 'active' ? '#065f46' : job.status === 'pending' ? '#92400e' : '#6b7280'
                                        }}>
                                            {job.status === 'active' ? 'Đang hoạt động' : job.status === 'pending' ? 'Chờ duyệt' : 'Đã đóng'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// USERS TAB
// ============================================================
function UsersTab({ users, loading }) {
    return (
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#111827' }}>Danh sách người dùng</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>ID</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Họ tên</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Email</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Vai trò</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Đang tải...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Chưa có người dùng</td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                        <td style={{ padding: '12px 8px', fontSize: 13, color: '#6b7280' }}>{user.id}</td>
                                        <td style={{ padding: '12px 8px', fontSize: 13, color: '#111827', fontWeight: 500 }}>{user.full_name}</td>
                                        <td style={{ padding: '12px 8px', fontSize: 13, color: '#6b7280' }}>{user.email}</td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: 12,
                                                fontSize: 11,
                                                fontWeight: 500,
                                                background: user.role === 'admin' ? '#f5f3ff' : user.role === 'employer' ? '#dbeafe' : '#f3f4f6',
                                                color: user.role === 'admin' ? '#7c3aed' : user.role === 'employer' ? '#3b82f6' : '#6b7280'
                                            }}>
                                                {user.role === 'admin' ? 'Quản trị viên' : user.role === 'employer' ? 'Nhà tuyển dụng' : 'Ứng viên'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: 12,
                                                fontSize: 11,
                                                fontWeight: 500,
                                                background: user.status === 'active' ? '#d1fae5' : '#fee2e2',
                                                color: user.status === 'active' ? '#065f46' : '#991b1b'
                                            }}>
                                                {user.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// EMPLOYERS TAB
// ============================================================
function EmployersTab({ employers, loading }) {
    return (
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#111827' }}>Danh sách nhà tuyển dụng</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>ID</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Họ tên</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Email</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Công ty</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Đang tải...</td>
                                </tr>
                            ) : employers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Chưa có nhà tuyển dụng</td>
                                </tr>
                            ) : (
                                employers.map(employer => (
                                    <tr key={employer.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                        <td style={{ padding: '12px 8px', fontSize: 13, color: '#6b7280' }}>{employer.id}</td>
                                        <td style={{ padding: '12px 8px', fontSize: 13, color: '#111827', fontWeight: 500 }}>{employer.full_name}</td>
                                        <td style={{ padding: '12px 8px', fontSize: 13, color: '#6b7280' }}>{employer.email}</td>
                                        <td style={{ padding: '12px 8px', fontSize: 13, color: '#3b82f6', fontWeight: 500 }}>{employer.company || '-'}</td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: 12,
                                                fontSize: 11,
                                                fontWeight: 500,
                                                background: employer.status === 'active' ? '#d1fae5' : '#fee2e2',
                                                color: employer.status === 'active' ? '#065f46' : '#991b1b'
                                            }}>
                                                {employer.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// JOBS TAB
// ============================================================
function JobsTab({ jobs, onApprove, onDelete }) {
    return (
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#111827' }}>Quản lý việc làm</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>ID</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Tiêu đề</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Công ty</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Địa điểm</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Trạng thái</th>
                                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(job => (
                                <tr key={job.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                    <td style={{ padding: '12px 8px', fontSize: 13, color: '#6b7280' }}>{job.id}</td>
                                    <td style={{ padding: '12px 8px', fontSize: 13, color: '#111827', fontWeight: 500 }}>{job.title}</td>
                                    <td style={{ padding: '12px 8px', fontSize: 13, color: '#6b7280' }}>{job.company}</td>
                                    <td style={{ padding: '12px 8px', fontSize: 13, color: '#6b7280' }}>{job.location}</td>
                                    <td style={{ padding: '12px 8px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: 12,
                                            fontSize: 11,
                                            fontWeight: 500,
                                            background: job.status === 'active' ? '#d1fae5' : job.status === 'pending' ? '#fef3c7' : '#f3f4f6',
                                            color: job.status === 'active' ? '#065f46' : job.status === 'pending' ? '#92400e' : '#6b7280'
                                        }}>
                                            {job.status === 'active' ? 'Đang hoạt động' : job.status === 'pending' ? 'Chờ duyệt' : 'Đã đóng'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 8px' }}>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {job.status === 'pending' && (
                                                <button
                                                    onClick={() => onApprove(job.id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: '#10b981',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: 6,
                                                        fontSize: 12,
                                                        fontWeight: 500,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Duyệt
                                                </button>
                                            )}
                                            <button
                                                onClick={() => onDelete(job.id)}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#ef4444',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: 6,
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// CATEGORIES TAB
// ============================================================
function CategoriesTab({ categories }) {
    return (
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#111827' }}>Danh mục việc làm</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                {categories.map((cat, index) => (
                    <div key={index} style={{
                        background: '#fff',
                        borderRadius: 12,
                        padding: 16,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12
                    }}>
                        <div style={{ fontSize: 32 }}>{cat.icon}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 }}>{cat.label}</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>{cat.count} việc làm</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================
// MAIN ADMIN DASHBOARD
// ============================================================
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ jobs: 0, companies: 0, candidates: 0 });
    const [users, setUsers] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchEmployers();
        fetchJobs();
        fetchCategories();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API}?action=get-stats`);
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('fetchUsers - Token from localStorage:', token);
            if (!token) {
                console.error('No token found in localStorage');
                setLoading(false);
                return;
            }
            const response = await axios.get(`${API}?action=get-users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log('fetchUsers - Response:', response.data);
            if (response.data.success) {
                setUsers(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            console.error('Error response:', error.response);
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async () => {
        try {
            const response = await axios.get(`${API}?action=get-jobs`);
            if (response.data.success) {
                setJobs(response.data.data?.jobs || response.data.jobs || []);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API}?action=get-categories`);
            if (response.data.success) {
                setCategories(response.data.data?.categories || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchEmployers = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('fetchEmployers - Token from localStorage:', token);
            if (!token) {
                console.error('No token found in localStorage');
                return;
            }
            const response = await axios.get(`${API}?action=get-employers`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log('fetchEmployers - Response:', response.data);
            if (response.data.success) {
                setEmployers(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching employers:', error);
            console.error('Error response:', error.response);
        }
    };

    const handleApproveJob = async (jobId) => {
        if (!window.confirm('Bạn có chắc muốn duyệt tin tuyển dụng này?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API}?action=approve-job`,
                { job_id: jobId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                alert('Đã duyệt tin tuyển dụng');
                fetchJobs();
            } else {
                alert(response.data.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Không thể duyệt tin tuyển dụng');
            console.error('Error approving job:', error);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Bạn có chắc muốn xóa tin tuyển dụng này?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API}?action=delete-job`,
                { job_id: jobId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                alert('Đã xóa tin tuyển dụng');
                fetchJobs();
            } else {
                alert(response.data.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Không thể xóa tin tuyển dụng');
            console.error('Error deleting job:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const TAB_TITLES = {
        overview: 'Tổng quan',
        users: 'Quản lý người dùng',
        employers: 'Quản lý nhà tuyển dụng',
        jobs: 'Quản lý việc làm',
        categories: 'Danh mục'
    };

    return (
        <>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                * { box-sizing: border-box; }
                body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; }
            `}</style>

            <div style={{ display: 'flex', height: '100vh', background: '#f9fafb', overflow: 'hidden' }}>
                {/* Sidebar */}
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

                {/* Main content */}
                <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                    {/* Top header */}
                    <div style={{
                        padding: '14px 24px',
                        borderBottom: '1px solid #f3f4f6',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexShrink: 0
                    }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111827' }}>{TAB_TITLES[activeTab]}</h1>
                            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>JobHot - Quản trị viên</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <div style={{
                                fontSize: 12,
                                background: '#f0fdf4',
                                color: '#15803d',
                                padding: '4px 12px',
                                borderRadius: 20,
                                fontWeight: 500
                            }}>
                                {stats.jobs} việc làm
                            </div>
                            <div style={{
                                fontSize: 12,
                                background: '#dbeafe',
                                color: '#1e40af',
                                padding: '4px 12px',
                                borderRadius: 20,
                                fontWeight: 500
                            }}>
                                {stats.candidates} ứng viên
                            </div>
                        </div>
                    </div>

                    {/* Tab content */}
                    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                        {activeTab === 'overview' && <OverviewTab stats={stats} jobs={jobs} />}
                        {activeTab === 'users' && <UsersTab users={users} loading={loading} />}
                        {activeTab === 'employers' && <EmployersTab employers={employers} loading={loading} />}
                        {activeTab === 'jobs' && <JobsTab jobs={jobs} onApprove={handleApproveJob} onDelete={handleDeleteJob} />}
                        {activeTab === 'categories' && <CategoriesTab categories={categories} />}
                    </div>
                </main>
            </div>
        </>
    );
}
