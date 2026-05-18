import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/img/Logo.png';

// ─────────────────────────────────────────────
// MOCK DATA
// Placeholder data used while there is no real backend connected.
// Replace these with real API calls when ready.
// ─────────────────────────────────────────────

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


// ─────────────────────────────────────────────
// DATA: ROLE CONFIG
// Maps a role string to its display label and Tailwind badge classes.
// Used by the RoleBadge component.
// ─────────────────────────────────────────────

const ROLE_CONFIG = {
    admin: { label: 'Admin', cls: 'bg-purple-100 text-purple-700' },
    employer: { label: 'Nhà tuyển', cls: 'bg-blue-100 text-blue-700' },
    job_seeker: { label: 'Ứng viên', cls: 'bg-green-100 text-green-700' },
};


// ─────────────────────────────────────────────
// DATA: JOB STATUS CONFIG
// Maps a job status string to its display label and Tailwind badge classes.
// Used by the JobStatusBadge component.
// ─────────────────────────────────────────────

const JOB_STATUS_CONFIG = {
    active: { label: 'Đang hoạt động', cls: 'bg-green-100 text-green-700' },
    pending: { label: 'Chờ duyệt', cls: 'bg-yellow-100 text-yellow-700' },
    closed: { label: 'Đã đóng', cls: 'bg-gray-100 text-gray-600' },
};


// ─────────────────────────────────────────────
// HELPER: formatDate
// Formats a date string into Vietnamese locale format (DD/MM/YYYY).
// ─────────────────────────────────────────────

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN');
}


// ─────────────────────────────────────────────
// HELPER: getNavTabClasses
// Returns Tailwind classes for a sidebar navigation button.
// Active tab gets a purple highlight, inactive tabs are plain gray.
// ─────────────────────────────────────────────

function getNavTabClasses(isActive) {
    const base = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-all font-medium text-left';

    if (isActive) {
        return base + ' bg-purple-50 text-purple-700';
    } else {
        return base + ' text-gray-600 hover:bg-gray-50';
    }
}


// ─────────────────────────────────────────────
// HELPER: getUserStatusClasses
// Returns Tailwind classes for the user status badge pill.
// Green for active, red for suspended.
// ─────────────────────────────────────────────

function getUserStatusClasses(status) {
    const base = 'text-xs px-2.5 py-1 rounded-full font-semibold';

    if (status === 'active') {
        return base + ' bg-green-100 text-green-700';
    } else {
        return base + ' bg-red-100 text-red-600';
    }
}


// ─────────────────────────────────────────────
// HELPER: getUserStatusLabel
// Returns the Vietnamese label for a user status string.
// ─────────────────────────────────────────────

function getUserStatusLabel(status) {
    if (status === 'active') {
        return '✓ Hoạt động';
    } else {
        return '✗ Bị khoá';
    }
}


// ─────────────────────────────────────────────
// HELPER: getToggleButtonClasses
// Returns Tailwind classes for the lock/unlock button in the users table.
// Red style when locking an active user, green style when unlocking.
// ─────────────────────────────────────────────

function getToggleButtonClasses(status) {
    const base = 'text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors';

    if (status === 'active') {
        return base + ' border-red-200 text-red-600 hover:bg-red-50';
    } else {
        return base + ' border-green-200 text-green-600 hover:bg-green-50';
    }
}


// ─────────────────────────────────────────────
// HELPER: getToggleButtonLabel
// Returns the label for the lock/unlock button.
// ─────────────────────────────────────────────

function getToggleButtonLabel(status) {
    if (status === 'active') {
        return 'Khoá';
    } else {
        return 'Mở khoá';
    }
}


// ─────────────────────────────────────────────
// HELPER: getRowClasses
// Returns Tailwind classes for alternating table row background colors.
// Even rows are white, odd rows are very light gray.
// ─────────────────────────────────────────────

function getRowClasses(index) {
    const base = 'border-t border-gray-50';

    if (index % 2 === 0) {
        return base + ' bg-white';
    } else {
        return base + ' bg-gray-50/30';
    }
}


// ─────────────────────────────────────────────
// COMPONENT: StatCard
// A single summary card showing a label, a large number, and an icon.
// Used in the Overview tab's four-card grid.
// ─────────────────────────────────────────────

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


// ─────────────────────────────────────────────
// COMPONENT: RoleBadge
// A small colored pill showing a user's role.
// Falls back to "job_seeker" style if the role string is unrecognised.
// ─────────────────────────────────────────────

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


// ─────────────────────────────────────────────
// COMPONENT: JobStatusBadge
// A small colored pill showing a job's current status.
// Falls back to "closed" style if the status string is unrecognised.
// ─────────────────────────────────────────────

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


// ─────────────────────────────────────────────
// COMPONENT: OverviewTab
// The admin dashboard home screen.
// Shows four stat cards and two "recent items" panels (users and jobs).
//
// Props:
//   users - full users array from root state
//   jobs  - full jobs array from root state
// ─────────────────────────────────────────────

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


// ─────────────────────────────────────────────
// COMPONENT: UsersTab
// Lists all users with a search bar and role filter.
// Each row has a lock/unlock button (hidden for admin accounts).
//
// Props:
//   users    - the users array from root state
//   setUsers - setter to toggle a user's status
// ─────────────────────────────────────────────

function UsersTab({ users, setUsers }) {
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');


    // ── Filter the users list ──
    // Apply the role filter first, then apply the search keyword.

    const filteredUsers = users.filter(function (user) {
        // Role filter — "all" shows every user
        let roleMatch = true;

        if (filterRole !== 'all') {
            roleMatch = user.role === filterRole;
        }

        // Keyword filter — matches name or email, case-insensitive
        const keyword = search.toLowerCase();
        const nameMatch = user.name.toLowerCase().includes(keyword);
        const emailMatch = user.email.toLowerCase().includes(keyword);
        const keywordMatch = nameMatch || emailMatch;

        return roleMatch && keywordMatch;
    });


    // ── toggleStatus ──
    // Flips a single user between "active" and "suspended".
    // Rebuilds each user object manually (no spread).

    function toggleStatus(id) {
        const updated = users.map(function (user) {
            if (user.id !== id) {
                return user;
            }

            let newStatus;

            if (user.status === 'active') {
                newStatus = 'suspended';
            } else {
                newStatus = 'active';
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                joined: user.joined,
                status: newStatus,
            };
        });

        setUsers(updated);
    }


    // ── Render ──

    const columnHeaders = ['Người dùng', 'Vai trò', 'Ngày tham gia', 'Trạng thái', 'Hành động'];

    return (
        <div className="p-6">

            {/* Tab header */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">Quản lý người dùng</h2>
                <span className="text-sm text-gray-500">{filteredUsers.length} người dùng</span>
            </div>

            {/* Search + role filter row */}
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

            {/* Users table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                        <tr>
                            {columnHeaders.map(function (header) {
                                return (
                                    <th key={header} className="px-4 py-3 text-left font-semibold">
                                        {header}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(function (user, index) {
                            return (
                                <tr key={user.id} className={getRowClasses(index)}>

                                    {/* Name + email + avatar */}
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

                                    {/* Role badge */}
                                    <td className="px-4 py-3">
                                        <RoleBadge role={user.role} />
                                    </td>

                                    {/* Join date */}
                                    <td className="px-4 py-3 text-gray-500 text-xs">
                                        {formatDate(user.joined)}
                                    </td>

                                    {/* Status badge */}
                                    <td className="px-4 py-3">
                                        <span className={getUserStatusClasses(user.status)}>
                                            {getUserStatusLabel(user.status)}
                                        </span>
                                    </td>

                                    {/* Lock / unlock action button */}
                                    {/* Admin accounts cannot be locked, so the button is hidden for them */}
                                    <td className="px-4 py-3">
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={function () { toggleStatus(user.id); }}
                                                className={getToggleButtonClasses(user.status)}
                                            >
                                                {getToggleButtonLabel(user.status)}
                                            </button>
                                        )}
                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


// ─────────────────────────────────────────────
// COMPONENT: JobsTab
// Lists all job postings. Pending jobs have an "Approve" button.
// All jobs have a "Delete" button.
//
// Props:
//   jobs    - the jobs array from root state
//   setJobs - setter to approve or remove a job
// ─────────────────────────────────────────────

function JobsTab({ jobs, setJobs }) {

    // ── approve ──
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


    // ── remove ──
    // Permanently removes a job from the list.

    function remove(id) {
        const updated = jobs.filter(function (job) { return job.id !== id; });
        setJobs(updated);
    }


    // ── Render ──

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


// ─────────────────────────────────────────────
// COMPONENT: AdminDashboard  (main / entry point)
// Holds the top-level state (users, jobs, active tab),
// renders the sidebar and the currently active tab panel.
// ─────────────────────────────────────────────

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState(MOCK_USERS);
    const [jobs, setJobs] = useState(MOCK_JOBS);

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
    ];


    // ── handleLogout ──
    // Removes all stored auth keys and redirects to the home page.

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('industry');
        navigate('/');
    }


    // ── getActiveTabLabel ──
    // Returns the Vietnamese label for the currently active tab.
    // Used in the top header bar.

    function getActiveTabLabel() {
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].id === activeTab) {
                return tabs[i].label;
            }
        }
        return '';
    }


    // ── Active job count ──
    // Shown in the top bar badge.

    const activeJobCount = jobs.filter(function (j) { return j.status === 'active'; }).length;


    // ── Render ──

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
                {activeTab === 'users' && <UsersTab users={users} setUsers={setUsers} />}
                {activeTab === 'jobs' && <JobsTab jobs={jobs} setJobs={setJobs} />}

            </main>
        </div>
    );
};

export default AdminDashboard;