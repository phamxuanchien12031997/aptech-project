import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/img/Logo.png';

const MOCK_USERS = [
    { id: 1, name: 'Nguyễn Văn A', email: 'a@email.com', role: 'job_seeker', joined: '2026-05-01', status: 'active' },
    { id: 2, name: 'Trần Thị B', email: 'b@email.com', role: 'employer', joined: '2026-05-02', status: 'active' },
    { id: 3, name: 'Lê Văn C', email: 'c@email.com', role: 'job_seeker', joined: '2026-05-03', status: 'active' },
    { id: 4, name: 'Phạm Thị D', email: 'd@email.com', role: 'employer', joined: '2026-05-04', status: 'suspended' },
    { id: 5, name: 'Hoàng E', email: 'e@email.com', role: 'job_seeker', joined: '2026-05-05', status: 'active' },
];

const MOCK_JOBS = [
    { id: 'JP001', title: 'Lập Trình Viên Full Stack', company: 'FPT Software', status: 'active', applicants: 14, posted: '2026-05-01' },
    { id: 'JP002', title: 'Nhân Viên Marketing Digital', company: 'Admicro', status: 'active', applicants: 7, posted: '2026-05-02' },
    { id: 'JP003', title: 'Thiết Kế UX/UI Mobile App', company: 'MOMO', status: 'pending', applicants: 0, posted: '2026-05-06' },
    { id: 'JP004', title: 'Kỹ Sư Dữ Liệu', company: 'Samsung Vina', status: 'active', applicants: 9, posted: '2026-05-05' },
];

// DATA: ROLE CONFIG
// Maps a role string to its display label and Tailwind badge classes.
// Used by the RoleBadge component.

const ROLE_CONFIG = {
    admin: { label: 'Admin', cls: 'bg-purple-100 text-purple-700' },
    employer: { label: 'Nhà tuyển', cls: 'bg-blue-100 text-blue-700' },
    job_seeker: { label: 'Ứng viên', cls: 'bg-green-100 text-green-700' },
};

// DATA: JOB STATUS CONFIG
// Maps a job status string to its display label and Tailwind badge classes.
// Used by the JobStatusBadge component.

const JOB_STATUS_CONFIG = {
    active: { label: 'Đang hoạt động', cls: 'bg-green-100 text-green-700' },
    pending: { label: 'Chờ duyệt', cls: 'bg-yellow-100 text-yellow-700' },
    closed: { label: 'Đã đóng', cls: 'bg-gray-100 text-gray-600' },
};

// HELPER: formatDate
// Formats a date string into locale format (DD/MM/YYYY).

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN');
}

// HELPER: getNavTabClasses
// Returns Tailwind classes for a sidebar navigation button.
// Active tab gets a purple highlight, inactive tabs are plain gray.

function getNavTabClasses(isActive) {
    const base = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-all font-medium text-left';

    if (isActive) {
        return base + ' bg-purple-50 text-purple-700';
    } else {
        return base + ' text-gray-600 hover:bg-gray-50';
    }
}

// HELPER: getUserStatusClasses
// Returns Tailwind classes for the user status badge pill.
// Green for active, red for suspended.

function getUserStatusClasses(status) {
    const base = 'text-xs px-2.5 py-1 rounded-full font-semibold';

    if (status === 'active') {
        return base + ' bg-green-100 text-green-700';
    } else {
        return base + ' bg-red-100 text-red-600';
    }
}

// HELPER: getUserStatusLabel
// Returns the label for a user status string.

function getUserStatusLabel(status) {
    if (status === 'active') {
        return '✓ Hoạt động';
    } else {
        return '✗ Bị khoá';
    }
}

// HELPER: getToggleButtonClasses
// Returns Tailwind classes for the lock/unlock button in the users table.
// Red style when locking an active user, green style when unlocking.

function getToggleButtonClasses(status) {
    const base = 'text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors';

    if (status === 'active') {
        return base + ' border-red-200 text-red-600 hover:bg-red-50';
    } else {
        return base + ' border-green-200 text-green-600 hover:bg-green-50';
    }
}

// HELPER: getToggleButtonLabel
// Returns the label for the lock/unlock button.

function getToggleButtonLabel(status) {
    if (status === 'active') {
        return 'Khoá';
    } else {
        return 'Mở khoá';
    }
}

// HELPER: getRowClasses
// Returns Tailwind classes for alternating table row background colors.
// Even rows are white, odd rows are very light gray.

function getRowClasses(index) {
    const base = 'border-t border-gray-50';

    if (index % 2 === 0) {
        return base + ' bg-white';
    } else {
        return base + ' bg-gray-50/30';
    }
}

// COMPONENT: StatCard
// A single summary card showing a label, a large number, and an icon.
// Used in the Overview tab's four-card grid.

function StatCard({ label, value, icon, color, bg }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
                    <p className={'text-3xl font-bold ' + color}>{value}</p>
                </div>
                <div className={'w-11 h-11 rounded-xl ' + bg + ' flex items-center justify-center text-xl'}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

// COMPONENT: RoleBadge
// A small colored pill showing a user's role.
// Falls back to "job_seeker" style if the role string is unrecognised.

function RoleBadge({ role }) {
    let config = ROLE_CONFIG[role];

    // Fall back to job_seeker style for any unrecognised role
    if (!config) {
        config = ROLE_CONFIG.job_seeker;
    }

    return (
        <span className={'text-xs px-2.5 py-1 rounded-full font-semibold ' + config.cls}>
            {config.label}
        </span>
    );
}

// COMPONENT: JobStatusBadge
// A small colored pill showing a job's current status.
// Falls back to "closed" style if the status string is unrecognised.

function JobStatusBadge({ status }) {
    let config = JOB_STATUS_CONFIG[status];

    // Fall back to closed style for any unrecognised status
    if (!config) {
        config = JOB_STATUS_CONFIG.closed;
    }

    return (
        <span className={'text-xs px-2.5 py-1 rounded-full font-semibold ' + config.cls}>
            {config.label}
        </span>
    );
}

// COMPONENT: OverviewTab
// The admin dashboard home screen.
// Shows four stat cards and two "recent items" panels (users and jobs).
//
// Props:
//   users - full users array from root state
//   jobs  - full jobs array from root state

function OverviewTab({ users, jobs }) {

    // Calculate summary numbers for the four stat cards
    const employerCount = users.filter(function (u) { return u.role === 'employer'; }).length;
    const activeJobCount = jobs.filter(function (j) { return j.status === 'active'; }).length;
    const pendingJobCount = jobs.filter(function (j) { return j.status === 'pending'; }).length;

    const stats = [
        { label: 'Tổng người dùng', value: users.length, icon: '👥', color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Nhà tuyển dụng', value: employerCount, icon: '🏢', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Tin đang tuyển', value: activeJobCount, icon: '📋', color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Chờ phê duyệt', value: pendingJobCount, icon: '⏳', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    ];

    return (
        <div className="p-6 flex flex-col gap-6">

            {/* Tab heading */}
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Tổng quan hệ thống</h2>
                <p className="text-sm text-gray-500">Chào mừng trở lại, Quản trị viên!</p>
            </div>

            {/* ── Four stat cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(function (stat) {
                    return (
                        <StatCard
                            key={stat.label}
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color}
                            bg={stat.bg}
                        />
                    );
                })}
            </div>

            {/* ── Two recent-items panels side by side ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent users panel */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-sm text-gray-800">Người dùng mới nhất</h3>
                        <span className="text-xs text-gray-400">{users.length} người dùng</span>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                        {users.slice(0, 4).map(function (user) {
                            return (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar shows first letter of name */}
                                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-800">{user.name}</div>
                                            <div className="text-xs text-gray-400">{user.email}</div>
                                        </div>
                                    </div>
                                    <RoleBadge role={user.role} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent jobs panel */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-sm text-gray-800">Tin tuyển dụng gần đây</h3>
                        <span className="text-xs text-gray-400">{jobs.length} tin</span>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                        {jobs.slice(0, 4).map(function (job) {
                            return (
                                <div key={job.id} className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-gray-800 truncate">{job.title}</div>
                                        <div className="text-xs text-gray-400">{job.company} · {formatDate(job.posted)}</div>
                                    </div>
                                    <JobStatusBadge status={job.status} />
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}

// COMPONENT: UsersTab
// Lists all users with a search bar and role filter.
// Each row has a lock/unlock button (hidden for admin accounts).
//
// Props:
//   users    - the users array from root state
//   setUsers - setter to toggle a user's status

function UsersTab({ users, setUsers }) {
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [editUser, setEditUser] = useState(null);   // user being edited (or null)
    const [editForm, setEditForm] = useState({});

    const filteredUsers = users.filter(function (user) {
        let roleMatch = filterRole === 'all' || user.role === filterRole;
        const keyword = search.toLowerCase();
        const keywordMatch = user.name.toLowerCase().includes(keyword) || user.email.toLowerCase().includes(keyword);
        return roleMatch && keywordMatch;
    });

    function toggleStatus(id) {
        setUsers(users.map(function (user) {
            if (user.id !== id) return user;
            return { ...user, status: user.status === 'active' ? 'suspended' : 'active' };
        }));
    }

    function deleteUser(id) {
        if (!window.confirm('Xoá tài khoản này? Hành động không thể hoàn tác.')) return;
        setUsers(users.filter(function (u) { return u.id !== id; }));
    }

    function startEdit(user) {
        setEditUser(user);
        setEditForm({ name: user.name, email: user.email, role: user.role });
    }

    function saveEdit() {
        if (!editForm.name.trim() || !editForm.email.trim()) return;
        setUsers(users.map(function (u) {
            if (u.id !== editUser.id) return u;
            return { ...u, name: editForm.name.trim(), email: editForm.email.trim(), role: editForm.role };
        }));
        setEditUser(null);
    }

    const columnHeaders = ['Người dùng', 'Vai trò', 'Ngày tham gia', 'Trạng thái', 'Hành động'];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">Quản lý người dùng</h2>
                <span className="text-sm text-gray-500">{filteredUsers.length} người dùng</span>
            </div>

            <div className="flex gap-3 mb-5 flex-wrap">
                <input
                    value={search}
                    onChange={function (e) { setSearch(e.target.value); }}
                    placeholder="Tìm theo tên, email..."
                    className="flex-1 min-w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-400"
                />
                <select
                    value={filterRole}
                    onChange={function (e) { setFilterRole(e.target.value); }}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-400 bg-white"
                >
                    <option value="all">Tất cả</option>
                    <option value="job_seeker">Ứng viên</option>
                    <option value="employer">Nhà tuyển dụng</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                        <tr>
                            {columnHeaders.map(function (header) {
                                return (
                                    <th key={header} className="px-4 py-3 text-left font-semibold">{header}</th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(function (user, index) {
                            return (
                                <tr key={user.id} className={getRowClasses(index)}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800">{user.name}</div>
                                                <div className="text-xs text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(user.joined)}</td>
                                    <td className="px-4 py-3">
                                        <span className={getUserStatusClasses(user.status)}>{getUserStatusLabel(user.status)}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1.5 flex-wrap">
                                            {/* Edit */}
                                            <button onClick={function () { startEdit(user); }} className="text-xs px-2.5 py-1.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">✏️ Sửa</button>
                                            {/* Lock/Unlock — only for non-admin */}
                                            {user.role !== 'admin' && (
                                                <button onClick={function () { toggleStatus(user.id); }} className={getToggleButtonClasses(user.status)}>
                                                    {getToggleButtonLabel(user.status)}
                                                </button>
                                            )}
                                            {/* Delete — never allow deleting admin */}
                                            {user.role !== 'admin' && (
                                                <button onClick={function () { deleteUser(user.id); }} className="text-xs px-2.5 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">🗑️ Xoá</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Edit user modal */}
            {editUser && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-gray-800">Chỉnh sửa tài khoản</h3>
                            <button onClick={function () { setEditUser(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">Họ và tên</label>
                                <input type="text" value={editForm.name} onChange={function (e) { setEditForm({ ...editForm, name: e.target.value }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
                                <input type="email" value={editForm.email} onChange={function (e) { setEditForm({ ...editForm, email: e.target.value }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">Vai trò</label>
                                <select value={editForm.role} onChange={function (e) { setEditForm({ ...editForm, role: e.target.value }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500 bg-white">
                                    <option value="job_seeker">Người tìm việc</option>
                                    <option value="employer">Nhà tuyển dụng</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={function () { setEditUser(null); }} className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors">Huỷ</button>
                            <button onClick={saveEdit} className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">Lưu thay đổi</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// COMPONENT: JobsTab
// Lists all job postings. Pending jobs have an "Approve" button.
// All jobs have a "Delete" button.
//
// Props:
//   jobs    - the jobs array from root state
//   setJobs - setter to approve or remove a job

function JobsTab({ jobs, setJobs }) {

    //approve
    // Changes a pending job's status to "active".
    // Rebuilds each job object manually (no spread).

    function approve(id) {
        const updated = jobs.map(function (job) {
            if (job.id !== id) {
                return job;
            }

            return {
                id: job.id,
                title: job.title,
                company: job.company,
                applicants: job.applicants,
                posted: job.posted,
                status: 'active',
            };
        });

        setJobs(updated);
    }


    //remove
    // Permanently removes a job from the list.

    function remove(id) {
        const updated = jobs.filter(function (job) { return job.id !== id; });
        setJobs(updated);
    }

    //Render

    return (
        <div className="p-6">

            {/* Tab header */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">Quản lý tin tuyển dụng</h2>
                <span className="text-sm text-gray-500">{jobs.length} tin</span>
            </div>

            {/* Job cards list */}
            <div className="flex flex-col gap-3">
                {jobs.map(function (job) {
                    return (
                        <div key={job.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4 flex-wrap">

                            {/* Job info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="font-semibold text-sm text-gray-800">{job.title}</span>
                                    <JobStatusBadge status={job.status} />
                                </div>
                                <div className="text-xs text-gray-500">
                                    {job.company} · Đăng ngày {formatDate(job.posted)} · {job.applicants} ứng viên
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 shrink-0">

                                {/* Approve button — only shown for pending jobs */}
                                {job.status === 'pending' && (
                                    <button
                                        onClick={function () { approve(job.id); }}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 font-medium transition-colors"
                                    >
                                        ✓ Phê duyệt
                                    </button>
                                )}

                                {/* Delete button — always shown */}
                                <button
                                    onClick={function () { remove(job.id); }}
                                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors"
                                >
                                    🗑️ Xoá
                                </button>

                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}

// ─── DEFAULT CATEGORIES ────────────────────────────────────────────────
const DEFAULT_CATEGORIES = [
    { id: 1, name: 'IT & Software', icon: '💻', count: 0 },
    { id: 2, name: 'Marketing', icon: '📣', count: 0 },
    { id: 3, name: 'Finance', icon: '💰', count: 0 },
    { id: 4, name: 'Healthcare', icon: '🏥', count: 0 },
    { id: 5, name: 'Government', icon: '🏛️', count: 0 },
];

// COMPONENT: CategoriesTab
// Lets admin add, edit name/icon, and delete job categories.

function CategoriesTab({ categories, setCategories }) {
    const [newName, setNewName] = useState('');
    const [newIcon, setNewIcon] = useState('📂');
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editIcon, setEditIcon] = useState('');
    const [addError, setAddError] = useState('');

    function handleAdd() {
        const trimmed = newName.trim();
        if (!trimmed) { setAddError('Vui lòng nhập tên danh mục.'); return; }
        if (categories.some(function (c) { return c.name.toLowerCase() === trimmed.toLowerCase(); })) {
            setAddError('Danh mục này đã tồn tại.');
            return;
        }
        const next = {
            id: Date.now(),
            name: trimmed,
            icon: newIcon || '📂',
            count: 0,
        };
        setCategories([...categories, next]);
        setNewName('');
        setNewIcon('📂');
        setAddError('');
    }

    function handleDelete(id) {
        if (!window.confirm('Xoá danh mục này?')) return;
        setCategories(categories.filter(function (c) { return c.id !== id; }));
        if (editId === id) setEditId(null);
    }

    function startEdit(cat) {
        setEditId(cat.id);
        setEditName(cat.name);
        setEditIcon(cat.icon);
    }

    function saveEdit() {
        const trimmed = editName.trim();
        if (!trimmed) return;
        setCategories(categories.map(function (c) {
            if (c.id !== editId) return c;
            return { id: c.id, name: trimmed, icon: editIcon || c.icon, count: c.count };
        }));
        setEditId(null);
    }

    return (
        <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Quản lý danh mục</h2>

            {/* Add new category */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Thêm danh mục mới</p>
                <div className="flex gap-2 flex-wrap">
                    <input
                        type="text"
                        placeholder="Tên danh mục..."
                        value={newName}
                        onChange={function (e) { setNewName(e.target.value); setAddError(''); }}
                        onKeyDown={function (e) { if (e.key === 'Enter') handleAdd(); }}
                        className="flex-1 min-w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500"
                    />
                    <input
                        type="text"
                        placeholder="Biểu tượng (emoji)"
                        value={newIcon}
                        onChange={function (e) { setNewIcon(e.target.value); }}
                        className="w-36 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500"
                    />
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                        + Thêm
                    </button>
                </div>
                {addError && <p className="text-xs text-red-500 mt-2">{addError}</p>}
            </div>

            {/* Category list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map(function (cat) {
                    const isEditing = editId === cat.id;
                    return (
                        <div key={cat.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
                            {isEditing ? (
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={function (e) { setEditName(e.target.value); }}
                                            className="flex-1 px-2 py-1.5 border border-purple-400 rounded-lg text-sm outline-none"
                                            autoFocus
                                        />
                                        <input
                                            type="text"
                                            value={editIcon}
                                            onChange={function (e) { setEditIcon(e.target.value); }}
                                            className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-sm outline-none text-center"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={saveEdit} className="flex-1 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors">Lưu</button>
                                        <button onClick={function () { setEditId(null); }} className="flex-1 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-xs hover:bg-gray-50 transition-colors">Huỷ</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{cat.icon}</span>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-800">{cat.name}</p>
                                            <p className="text-xs text-gray-400">{cat.count} tin đăng</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={function () { startEdit(cat); }} className="text-xs px-2.5 py-1.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">✏️ Sửa</button>
                                        <button onClick={function () { handleDelete(cat.id); }} className="text-xs px-2.5 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">🗑️ Xoá</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// COMPONENT: StatsTab
// Displays overview statistics with a simple bar chart per category.

function StatsTab({ users, jobs, categories }) {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(function (j) { return j.status === 'active'; }).length;
    const pendingJobs = jobs.filter(function (j) { return j.status === 'pending'; }).length;
    const totalUsers = users.length;
    const employers = users.filter(function (u) { return u.role === 'employer'; }).length;
    const jobSeekers = users.filter(function (u) { return u.role === 'job_seeker'; }).length;

    // Bar chart data: jobs per category (mock distribution for demo)
    const barMax = Math.max(1, totalJobs);
    const catData = categories.map(function (cat, i) {
        const count = jobs.filter(function (j) {
            // Try matching by category field, fall back to index-based distribution
            if (j.category) return j.category === cat.name;
            return i < jobs.length && jobs[i] !== undefined ? 1 : 0;
        }).length;
        return { name: cat.name, icon: cat.icon, count: count };
    });

    // Stat card colours
    const statCards = [
        { label: 'Tổng tin đăng', value: totalJobs, color: 'bg-purple-100 text-purple-700', icon: '📋' },
        { label: 'Đang hoạt động', value: activeJobs, color: 'bg-green-100 text-green-700', icon: '✅' },
        { label: 'Chờ duyệt', value: pendingJobs, color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
        { label: 'Tổng người dùng', value: totalUsers, color: 'bg-blue-100 text-blue-700', icon: '👥' },
        { label: 'Nhà tuyển dụng', value: employers, color: 'bg-orange-100 text-orange-700', icon: '🏢' },
        { label: 'Người tìm việc', value: jobSeekers, color: 'bg-pink-100 text-pink-700', icon: '🧑‍💼' },
    ];

    return (
        <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Thống kê & Báo cáo</h2>

            {/* Stat cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {statCards.map(function (s) {
                    return (
                        <div key={s.label} className={'rounded-xl p-4 flex flex-col gap-1 ' + s.color}>
                            <div className="text-2xl">{s.icon}</div>
                            <div className="text-2xl font-bold">{s.value}</div>
                            <div className="text-xs font-medium opacity-80">{s.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Bar chart: jobs per category */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                <p className="text-sm font-semibold text-gray-700 mb-4">Số tin theo danh mục</p>
                <div className="flex flex-col gap-3">
                    {catData.map(function (cat) {
                        const pct = barMax > 0 ? Math.round((cat.count / barMax) * 100) : 0;
                        return (
                            <div key={cat.name} className="flex items-center gap-3">
                                <span className="text-lg w-6">{cat.icon}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>{cat.name}</span>
                                        <span className="font-medium">{cat.count}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500 rounded-full transition-all"
                                            style={{ width: pct + '%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* User breakdown pie-style bar */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-4">Phân loại người dùng</p>
                {totalUsers > 0 ? (
                    <div>
                        <div className="flex h-4 rounded-full overflow-hidden mb-3">
                            <div className="bg-blue-400 transition-all" style={{ width: (employers / totalUsers * 100) + '%' }} title="Nhà tuyển dụng" />
                            <div className="bg-pink-400 transition-all" style={{ width: (jobSeekers / totalUsers * 100) + '%' }} title="Người tìm việc" />
                        </div>
                        <div className="flex gap-4 text-xs">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-400 inline-block" /> Nhà tuyển dụng ({employers})</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-pink-400 inline-block" /> Người tìm việc ({jobSeekers})</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">Chưa có dữ liệu người dùng.</p>
                )}
            </div>
        </div>
    );
}

// COMPONENT: AdminDashboard  (main / entry point)
// Holds the top-level state (users, jobs, active tab),
// renders the sidebar and the currently active tab panel.

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState(MOCK_USERS);
    const [jobs, setJobs] = useState(MOCK_JOBS);
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

    // ── Add User Modal state ──
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [addUserForm, setAddUserForm] = useState({ name: '', email: '', role: 'job_seeker', password: '' });
    const [addUserError, setAddUserError] = useState('');

    function handleAddUser() {
        if (!addUserForm.name.trim() || !addUserForm.email.trim() || !addUserForm.password.trim()) {
            setAddUserError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(addUserForm.email)) {
            setAddUserError('Email không hợp lệ.');
            return;
        }
        if (users.some(function (u) { return u.email === addUserForm.email.trim(); })) {
            setAddUserError('Email đã tồn tại.');
            return;
        }
        const newUser = {
            id: Date.now(),
            name: addUserForm.name.trim(),
            email: addUserForm.email.trim(),
            role: addUserForm.role,
            joined: new Date().toISOString().slice(0, 10),
            status: 'active',
        };
        setUsers([...users, newUser]);
        setAddUserOpen(false);
        setAddUserForm({ name: '', email: '', role: 'job_seeker', password: '' });
        setAddUserError('');
    }

    // Read the logged-in admin's name from localStorage.
    // Falls back to "Admin" if nothing is stored.
    const storedName = localStorage.getItem('name');
    let adminName;

    if (storedName) {
        adminName = storedName;
    } else {
        adminName = 'Admin';
    }

    const tabs = [
        { id: 'overview', icon: '📊', label: 'Tổng quan' },
        { id: 'users', icon: '👥', label: 'Người dùng' },
        { id: 'jobs', icon: '📋', label: 'Tin tuyển dụng' },
        { id: 'categories', icon: '🗂️', label: 'Danh mục' },
        { id: 'stats', icon: '📈', label: 'Thống kê' },
    ];


    //handleLogout
    // Removes all stored auth keys and redirects to the home page.

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('industry');
        navigate('/');
    }

    //getActiveTabLabel
    // Returns the label for the currently active tab.
    // Used in the top header bar.

    function getActiveTabLabel() {
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].id === activeTab) {
                return tabs[i].label;
            }
        }
        return '';
    }


    //Active job count
    // Shown in the top bar badge.

    const activeJobCount = jobs.filter(function (j) { return j.status === 'active'; }).length;

    //Render

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            {/* ── Sidebar ── */}
            <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">

                {/* Logo + subtitle */}
                <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                        <img src={Logo} alt="JobHot Logo" className="h-16 ml-8 mt-5 w-auto" />
                    </div>
                    <div className="text-xs text-gray-400 ml-8">Quản trị hệ thống</div>
                </div>

                {/* Navigation tabs */}
                <nav className="flex-1 p-3">
                    {tabs.map(function (tab) {
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={function () { setActiveTab(tab.id); }}
                                className={getNavTabClasses(isActive)}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                {/* User info + logout at the bottom of the sidebar */}
                <div className="p-3 border-t border-gray-100">
                    <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {adminName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-semibold text-gray-800 truncate">{adminName}</div>
                            <div className="text-xs text-gray-400">Admin</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                        🚪 Đăng xuất
                    </button>
                </div>

            </aside>

            {/* ── Main content area ── */}
            <main className="flex-1 overflow-y-auto">

                {/* Sticky top header bar */}
                <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
                    <h1 className="font-bold text-base text-gray-800">
                        {getActiveTabLabel()}
                    </h1>
                    <div className="flex gap-3">
                        <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full font-semibold">
                            {users.length} người dùng
                        </span>
                        <span className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-full font-semibold">
                            {activeJobCount} tin hoạt động
                        </span>
                    </div>
                </div>

                {/* Render the correct tab panel */}
                {activeTab === 'overview' && <OverviewTab users={users} jobs={jobs} />}
                {activeTab === 'users' && (
                    <div>
                        {/* Add user button */}
                        <div className="flex justify-end px-6 pt-5">
                            <button
                                onClick={function () { setAddUserOpen(true); }}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                                + Thêm tài khoản
                            </button>
                        </div>
                        <UsersTab users={users} setUsers={setUsers} />
                    </div>
                )}
                {activeTab === 'jobs' && <JobsTab jobs={jobs} setJobs={setJobs} />}
                {activeTab === 'categories' && <CategoriesTab categories={categories} setCategories={setCategories} />}
                {activeTab === 'stats' && <StatsTab users={users} jobs={jobs} categories={categories} />}

                {/* ── Add User Modal ── */}
                {addUserOpen && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-lg font-bold text-gray-800">Thêm tài khoản</h3>
                                <button onClick={function () { setAddUserOpen(false); setAddUserError(''); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
                            </div>
                            {addUserError && (
                                <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{addUserError}</div>
                            )}
                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Họ và tên</label>
                                    <input type="text" value={addUserForm.name} onChange={function (e) { setAddUserForm({ ...addUserForm, name: e.target.value }); setAddUserError(''); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500" placeholder="Nguyễn Văn A" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
                                    <input type="email" value={addUserForm.email} onChange={function (e) { setAddUserForm({ ...addUserForm, email: e.target.value }); setAddUserError(''); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500" placeholder="email@domain.com" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Mật khẩu</label>
                                    <input type="password" value={addUserForm.password} onChange={function (e) { setAddUserForm({ ...addUserForm, password: e.target.value }); setAddUserError(''); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500" placeholder="Tối thiểu 6 ký tự" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Vai trò</label>
                                    <select value={addUserForm.role} onChange={function (e) { setAddUserForm({ ...addUserForm, role: e.target.value }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500 bg-white">
                                        <option value="job_seeker">Người tìm việc</option>
                                        <option value="employer">Nhà tuyển dụng</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-5">
                                <button onClick={function () { setAddUserOpen(false); setAddUserError(''); }} className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors">Huỷ</button>
                                <button onClick={handleAddUser} className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">Thêm tài khoản</button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default AdminDashboard;