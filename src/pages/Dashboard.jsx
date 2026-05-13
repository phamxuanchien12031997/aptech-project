import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_USERS = [
    { id: 1, name: 'Nguyễn Văn A', email: 'a@email.com', role: 'user', joined: '2026-05-01', status: 'active' },
    { id: 2, name: 'Trần Thị B', email: 'b@email.com', role: 'employer', joined: '2026-05-02', status: 'active' },
    { id: 3, name: 'Lê Văn C', email: 'c@email.com', role: 'user', joined: '2026-05-03', status: 'active' },
    { id: 4, name: 'Phạm Thị D', email: 'd@email.com', role: 'employer', joined: '2026-05-04', status: 'suspended' },
    { id: 5, name: 'Hoàng E', email: 'e@email.com', role: 'user', joined: '2026-05-05', status: 'active' },
];

const MOCK_JOBS = [
    { id: 'JP001', title: 'Lập Trình Viên Full Stack', company: 'FPT Software', status: 'active', applicants: 14, posted: '2026-05-01' },
    { id: 'JP002', title: 'Nhân Viên Marketing Digital', company: 'Admicro', status: 'active', applicants: 7, posted: '2026-05-02' },
    { id: 'JP003', title: 'Thiết Kế UX/UI Mobile App', company: 'MOMO', status: 'pending', applicants: 0, posted: '2026-05-06' },
    { id: 'JP004', title: 'Kỹ Sư Dữ Liệu', company: 'Samsung Vina', status: 'active', applicants: 9, posted: '2026-05-05' },
];

// ── Sub-components ─────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, bg }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center text-xl`}>{icon}</div>
        </div>
    </div>
);

const RoleBadge = ({ role }) => {
    const cfg = {
        admin: { label: 'Admin', cls: 'bg-purple-100 text-purple-700' },
        employer: { label: 'Nhà tuyển', cls: 'bg-blue-100 text-blue-700' },
        user: { label: 'Ứng viên', cls: 'bg-green-100 text-green-700' },
    };
    const { label, cls } = cfg[role] || cfg.user;
    return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cls}`}>{label}</span>;
};

const JobStatusBadge = ({ status }) => {
    const cfg = {
        active: { label: 'Đang hoạt động', cls: 'bg-green-100 text-green-700' },
        pending: { label: 'Chờ duyệt', cls: 'bg-yellow-100 text-yellow-700' },
        closed: { label: 'Đã đóng', cls: 'bg-gray-100 text-gray-600' },
    };
    const { label, cls } = cfg[status] || cfg.closed;
    return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cls}`}>{label}</span>;
};

const fmtDate = d => new Date(d).toLocaleDateString('vi-VN');

// ── Tabs ───────────────────────────────────────────────────────────────────
const OverviewTab = ({ users, jobs }) => {
    const stats = [
        { label: 'Tổng người dùng', value: users.length, icon: '👥', color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Nhà tuyển dụng', value: users.filter(u => u.role === 'employer').length, icon: '🏢', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Tin đang tuyển', value: jobs.filter(j => j.status === 'active').length, icon: '📋', color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Chờ phê duyệt', value: jobs.filter(j => j.status === 'pending').length, icon: '⏳', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    ];

    return (
        <div className="p-6 flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Tổng quan hệ thống</h2>
                <p className="text-sm text-gray-500">Chào mừng trở lại, Quản trị viên!</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent users */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-sm text-gray-800">Người dùng mới nhất</h3>
                        <span className="text-xs text-gray-400">{users.length} người dùng</span>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                        {users.slice(0, 4).map(u => (
                            <div key={u.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                        {u.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">{u.name}</div>
                                        <div className="text-xs text-gray-400">{u.email}</div>
                                    </div>
                                </div>
                                <RoleBadge role={u.role} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent jobs */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-sm text-gray-800">Tin tuyển dụng gần đây</h3>
                        <span className="text-xs text-gray-400">{jobs.length} tin</span>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                        {jobs.slice(0, 4).map(j => (
                            <div key={j.id} className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="text-sm font-medium text-gray-800 truncate">{j.title}</div>
                                    <div className="text-xs text-gray-400">{j.company} · {fmtDate(j.posted)}</div>
                                </div>
                                <JobStatusBadge status={j.status} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const UsersTab = ({ users, setUsers }) => {
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    const filtered = users.filter(u =>
        (filterRole === 'all' || u.role === filterRole) &&
        (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    );

    const toggleStatus = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">Quản lý người dùng</h2>
                <span className="text-sm text-gray-500">{filtered.length} người dùng</span>
            </div>

            <div className="flex gap-3 mb-5 flex-wrap">
                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm theo tên, email..."
                    className="flex-1 min-w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-400" />
                <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-400 bg-white">
                    <option value="all">Tất cả</option>
                    <option value="user">Ứng viên</option>
                    <option value="employer">Nhà tuyển dụng</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                        <tr>
                            {['Người dùng', 'Vai trò', 'Ngày tham gia', 'Trạng thái', 'Hành động'].map(h => (
                                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((u, i) => (
                            <tr key={u.id} className={`border-t border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-800">{u.name}</div>
                                            <div className="text-xs text-gray-400">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                                <td className="px-4 py-3 text-gray-500 text-xs">{fmtDate(u.joined)}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                        {u.status === 'active' ? '✓ Hoạt động' : '✗ Bị khoá'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {u.role !== 'admin' && (
                                        <button onClick={() => toggleStatus(u.id)}
                                            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${u.status === 'active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                                            {u.status === 'active' ? 'Khoá' : 'Mở khoá'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const JobsTab = ({ jobs, setJobs }) => {
    const approve = (id) => setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'active' } : j));
    const remove = (id) => setJobs(prev => prev.filter(j => j.id !== id));

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">Quản lý tin tuyển dụng</h2>
                <span className="text-sm text-gray-500">{jobs.length} tin</span>
            </div>

            <div className="flex flex-col gap-3">
                {jobs.map(j => (
                    <div key={j.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-semibold text-sm text-gray-800">{j.title}</span>
                                <JobStatusBadge status={j.status} />
                            </div>
                            <div className="text-xs text-gray-500">{j.company} · Đăng ngày {fmtDate(j.posted)} · {j.applicants} ứng viên</div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            {j.status === 'pending' && (
                                <button onClick={() => approve(j.id)}
                                    className="text-xs px-3 py-1.5 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 font-medium transition-colors">
                                    ✓ Phê duyệt
                                </button>
                            )}
                            <button onClick={() => remove(j.id)}
                                className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors">
                                🗑️ Xoá
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── Main Dashboard ─────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState(MOCK_USERS);
    const [jobs, setJobs] = useState(MOCK_JOBS);

    const name = localStorage.getItem('name') || 'Admin';

    const handleLogout = () => {
        ['token', 'role', 'name', 'email', 'industry'].forEach(k => localStorage.removeItem(k));
        navigate('/');
    };

    const tabs = [
        { id: 'overview', icon: '📊', label: 'Tổng quan' },
        { id: 'users', icon: '👥', label: 'Người dùng' },
        { id: 'jobs', icon: '📋', label: 'Tin tuyển dụng' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">
                <div className="px-5 py-4 border-b border-gray-100">
                    <div className="font-bold text-xl text-purple-600 tracking-tight">Job<span className="text-yellow-400">Hot</span></div>
                    <div className="text-xs text-gray-400 mt-0.5">Quản trị hệ thống</div>
                </div>

                <nav className="flex-1 p-3">
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-all font-medium text-left ${activeTab === t.id ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <span>{t.icon}</span>{t.label}
                        </button>
                    ))}
                </nav>

                <div className="p-3 border-t border-gray-100">
                    <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-semibold text-gray-800 truncate">{name}</div>
                            <div className="text-xs text-gray-400">Admin</div>
                        </div>
                    </div>
                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
                        🚪 Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
                    <h1 className="font-bold text-base text-gray-800">
                        {tabs.find(t => t.id === activeTab)?.label}
                    </h1>
                    <div className="flex gap-3">
                        <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full font-semibold">
                            {users.length} người dùng
                        </span>
                        <span className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-full font-semibold">
                            {jobs.filter(j => j.status === 'active').length} tin hoạt động
                        </span>
                    </div>
                </div>

                {activeTab === 'overview' && <OverviewTab users={users} jobs={jobs} />}
                {activeTab === 'users' && <UsersTab users={users} setUsers={setUsers} />}
                {activeTab === 'jobs' && <JobsTab jobs={jobs} setJobs={setJobs} />}
            </main>
        </div>
    );
};

export default AdminDashboard;