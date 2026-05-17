import { useState, useRef, useEffect } from "react";
import Logo from '../assets/img/Logo.png';

const MOCK_JOBS = [
    {
        id: "JP001",
        title: "Lập Trình Viên Full Stack - ReactJS & Node.js",
        description: "Phát triển và duy trì các ứng dụng web sử dụng ReactJS ở frontend và Node.js ở backend. Tham gia thiết kế kiến trúc hệ thống, review code và mentor junior developer.",
        requirements: "Tối thiểu 2 năm kinh nghiệm React, Node.js\nThành thạo TypeScript, REST API, Git\nCó kinh nghiệm với PostgreSQL hoặc MongoDB",
        salary: "20-35 triệu",
        location: "Hà Nội",
        category: "Công nghệ thông tin",
        type: "Full-time",
        deadline: "2026-06-15",
        posted: "2026-05-01",
        status: "active",
        applicants: 14,
    },
    {
        id: "JP002",
        title: "Nhân Viên Marketing Digital",
        description: "Lên kế hoạch và triển khai chiến dịch marketing đa kênh. Phân tích hiệu quả và tối ưu ngân sách.",
        requirements: "Có kinh nghiệm chạy quảng cáo Facebook/Google Ads\nHiểu biết về SEO, Content Marketing",
        salary: "10-15 triệu",
        location: "Hồ Chí Minh",
        category: "Marketing / PR",
        type: "Full-time",
        deadline: "2026-05-30",
        posted: "2026-05-02",
        status: "active",
        applicants: 7,
    },
    {
        id: "JP003",
        title: "Thiết Kế UX/UI - Mobile App",
        description: "Nghiên cứu người dùng, tạo wireframe và prototype cho ứng dụng mobile.",
        requirements: "Thành thạo Figma, Adobe XD\nCó portfolio thể hiện kinh nghiệm thiết kế mobile",
        salary: "18-28 triệu",
        location: "Hà Nội",
        category: "Thiết kế",
        type: "Full-time",
        deadline: "2026-06-25",
        posted: "2026-05-06",
        status: "closed",
        applicants: 22,
    },
];

const MOCK_CANDIDATES = [
    {
        id: "C001",
        name: "Nguyễn Thị Bình",
        position: "Frontend Developer",
        experience: "2-3 năm",
        skills: ["React", "TypeScript", "CSS"],
        location: "Hà Nội",
        email: "binh@email.com",
        phone: "0901234567",
        appliedJob: "JP001",
        appliedDate: "2026-05-03",
        status: "reviewing",
        bio: "Lập trình viên frontend với 2 năm kinh nghiệm làm việc với React ecosystem. Đam mê tạo ra UI đẹp và hiệu suất cao.",
        education: "Đại học Bách Khoa Hà Nội - Công nghệ thông tin"
    },
    {
        id: "C002",
        name: "Trần Văn Cường",
        position: "Full Stack Developer",
        experience: "3-5 năm",
        skills: ["Node.js", "React", "PostgreSQL", "Docker"],
        location: "Hà Nội",
        email: "cuong@email.com",
        phone: "0912345678",
        appliedJob: "JP001",
        appliedDate: "2026-05-04",
        status: "shortlisted",
        bio: "Senior developer với 4 năm kinh nghiệm xây dựng hệ thống web quy mô lớn. Có kinh nghiệm dẫn dắt team nhỏ.",
        education: "Đại học Quốc gia Hà Nội - Khoa học máy tính"
    },
    {
        id: "C003",
        name: "Lê Minh Dũng",
        position: "Backend Developer",
        experience: "1-2 năm",
        skills: ["Python", "Django", "MySQL"],
        location: "Hồ Chí Minh",
        email: "dung@email.com",
        phone: "0923456789",
        appliedJob: "JP001",
        appliedDate: "2026-05-05",
        status: "new",
        bio: "Junior developer mới tốt nghiệp, nhiệt huyết học hỏi và sẵn sàng thử thách mới.",
        education: "Đại học Công nghệ TP.HCM - CNTT"
    },
    {
        id: "C004",
        name: "Phạm Thị Hoa",
        position: "Digital Marketing Specialist",
        experience: "2-3 năm",
        skills: ["Facebook Ads", "Google Ads", "SEO", "Analytics"],
        location: "Hồ Chí Minh",
        email: "hoa@email.com",
        phone: "0934567890",
        appliedJob: "JP002",
        appliedDate: "2026-05-03",
        status: "shortlisted",
        bio: "Chuyên viên marketing với kinh nghiệm quản lý ngân sách quảng cáo trên 200 triệu/tháng.",
        education: "Đại học Kinh tế TP.HCM - Marketing"
    },
    {
        id: "C005",
        name: "Hoàng Văn Em",
        position: "UI/UX Designer",
        experience: "2-3 năm",
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
        location: "Hà Nội",
        email: "em@email.com",
        phone: "0945678901",
        appliedJob: "JP003",
        appliedDate: "2026-05-07",
        status: "new",
        bio: "Designer với niềm đam mê tạo ra trải nghiệm người dùng tuyệt vời. Portfolio đa dạng từ mobile đến web.",
        education: "Đại học Mỹ thuật Công nghiệp Hà Nội"
    },
    {
        id: "C006",
        name: "Vũ Thị Phương",
        position: "Senior UX Designer",
        experience: "3-5 năm",
        skills: ["Figma", "User Research", "Design System", "Motion Design"],
        location: "Hà Nội",
        email: "phuong@email.com",
        phone: "0956789012",
        appliedJob: "JP003",
        appliedDate: "2026-05-08",
        status: "reviewing",
        bio: "Senior designer với 4 năm kinh nghiệm, từng làm tại các startup công nghệ lớn tại Việt Nam.",
        education: "RMIT Việt Nam - Đa phương tiện"
    },
];

const MOCK_TALENT_POOL = [
    {
        id: "T001",
        name: "Đinh Quốc Huy",
        position: "Data Engineer",
        experience: "3-5 năm",
        skills: ["Python", "Spark", "Airflow", "SQL"],
        location: "Hà Nội",
        email: "huy@email.com"
    },
    {
        id: "T002",
        name: "Bùi Thị Lan",
        position: "Product Manager",
        experience: "2-3 năm",
        skills: ["Agile", "Jira", "Figma", "SQL"],
        location: "Hồ Chí Minh",
        email: "lan@email.com"
    },
    {
        id: "T003",
        name: "Ngô Văn Minh",
        position: "DevOps Engineer",
        experience: "3-5 năm",
        skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
        location: "Hà Nội",
        email: "minh@email.com"
    },
    {
        id: "T004",
        name: "Trịnh Thị Nga",
        position: "React Developer",
        experience: "1-2 năm",
        skills: ["React", "JavaScript", "CSS", "Redux"],
        location: "Đà Nẵng",
        email: "nga@email.com"
    },
    {
        id: "T005",
        name: "Cao Minh Phát",
        position: "iOS Developer",
        experience: "2-3 năm",
        skills: ["Swift", "Xcode", "UIKit", "CoreData"],
        location: "Hồ Chí Minh",
        email: "phat@email.com"
    },
    {
        id: "T006",
        name: "Lý Thị Quyên",
        position: "Content Marketing",
        experience: "1-2 năm",
        skills: ["Copywriting", "SEO", "Social Media", "Canva"],
        location: "Hà Nội",
        email: "quyen@email.com"
    },
];

//Dropdown options
const CATEGORIES = ["Công nghệ thông tin", "Marketing / PR", "Thiết kế", "Kế toán / Kiểm toán", "Kinh doanh / Bán hàng", "Nhân sự", "Dịch vụ khách hàng"];
const JOB_TYPES = ["Full-time", "Part-time", "Freelancer", "Thực tập"];
const LOCATIONS = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];
const EXPERIENCES = ["Không yêu cầu", "Dưới 1 năm", "1-2 năm", "2-3 năm", "3-5 năm", "Trên 5 năm"];
const COMPANY_SIZES = ["1-10 nhân viên", "10-50 nhân viên", "50-100 nhân viên", "100-500 nhân viên", "Trên 500 nhân viên"];

//  Candidate status config
// Maps a candidate status string to its display label and badge colors.
const STATUS_CONFIG = {
    new: { label: "Mới", bg: "#eff6ff", color: "#1d4ed8" },
    reviewing: { label: "Đang xem xét", bg: "#fefce8", color: "#854d0e" },
    shortlisted: { label: "Tiềm năng", bg: "#f0fdf4", color: "#15803d" },
    rejected: { label: "Từ chối", bg: "#fff1f2", color: "#be123c" },
};

//  Shared inline styles 
// Base style for all text inputs and selects
const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: "1px solid #e5e7eb", fontSize: 13, outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", color: "#111827",
};

// Same as inputStyle but with resize for textareas
const textareaStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: "1px solid #e5e7eb", fontSize: 13, outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", color: "#111827",
    resize: "vertical",
};

// Same as inputStyle but width:auto for inline selects (filter dropdowns)
const autoSelectStyle = {
    width: "auto", padding: "9px 12px", borderRadius: 8,
    border: "1px solid #e5e7eb", fontSize: 13, outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", color: "#111827",
};

// Smaller version of autoSelectStyle used for the status dropdown inside candidate rows
const smallSelectStyle = {
    width: "auto", padding: "6px 10px", borderRadius: 8,
    border: "1px solid #e5e7eb", fontSize: 12, outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", color: "#111827",
};

//  Helpers

// Returns the first letter of the last two words of a name, uppercased.
// Example: "Nguyễn Thị Bình" → "TB"
function getInitials(name) {
    const words = name.split(" ");
    const lastTwo = words.slice(-2);
    const letters = lastTwo.map(function (word) { return word[0]; });
    return letters.join("").toUpperCase();
}

// Returns how many days remain until the given date string (minimum 0).
function getDaysLeft(dateString) {
    const deadline = new Date(dateString);
    const now = new Date();
    const diff = deadline - now;
    const days = Math.ceil(diff / 86400000); // 86400000 ms = 1 day
    if (days < 0) {
        return 0;
    }
    return days;
}

// Formats a date string into Vietnamese locale format (DD/MM/YYYY).
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("vi-VN");
}

// Picks a consistent avatar color based on the first character of a name.
const AVATAR_COLORS = ["#7c3aed", "#0369a1", "#0f766e", "#b45309", "#be185d", "#6d28d9"];

function getAvatarColor(name) {
    const index = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
}

// Returns a styled <h3> section heading element.
function getSectionTitle(text) {
    return (
        <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 0.5, paddingBottom: 8, borderBottom: "1px solid #f3f4f6" }}>
            {text}
        </h3>
    );
}

// Returns a styled <label> element used above form inputs.
function getFieldLabel(text) {
    return (
        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
            {text}
        </label>
    );
}

// Returns the inline style object for a job status badge pill.
function getJobStatusStyle(status) {
    const base = { fontSize: 11, padding: "3px 8px", borderRadius: 20, fontWeight: 600 };

    if (status === "active") {
        base.background = "#f0fdf4";
        base.color = "#15803d";
    } else {
        base.background = "#f3f4f6";
        base.color = "#6b7280";
    }

    return base;
}

// Returns the display label for a job status string.
function getJobStatusLabel(status) {
    if (status === "active") {
        return "Đang tuyển";
    }
    return "Đã đóng";
}

// Returns the label for the open/close toggle button on a job card.
function getToggleButtonLabel(status) {
    if (status === "active") {
        return "Đóng tin";
    }
    return "Mở lại";
}

// Returns the inline style for a sidebar navigation button.
function getSidebarTabStyle(isActive) {
    const style = {
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
        textAlign: "left", fontSize: 13.5, marginBottom: 3, transition: "all 0.15s",
    };

    if (isActive) {
        style.fontWeight = 600;
        style.background = "#f5f3ff";
        style.color = "#7c3aed";
    } else {
        style.fontWeight = 400;
        style.background = "transparent";
        style.color = "#374151";
    }

    return style;
}

// Returns the inline style for the filter pill buttons (e.g. "Tất cả / Đang tuyển / Đã đóng").
function getFilterButtonStyle(isActive) {
    const style = { padding: "7px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer" };

    if (isActive) {
        style.border = "1px solid #7c3aed";
        style.background = "#f5f3ff";
        style.color = "#7c3aed";
        style.fontWeight = 600;
    } else {
        style.border = "1px solid #e5e7eb";
        style.background = "#fff";
        style.color = "#6b7280";
        style.fontWeight = 400;
    }

    return style;
}

// Returns the inline style for the primary save/submit button inside a modal.
function getSubmitButtonStyle(isLoading) {
    const style = {
        flex: 1, padding: "11px", borderRadius: 10, border: "none",
        color: "#fff", fontSize: 14, fontWeight: 600,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    };

    if (isLoading) {
        style.background = "#c4b5fd";
        style.cursor = "not-allowed";
    } else {
        style.background = "#7c3aed";
        style.cursor = "pointer";
    }

    return style;
}

// Returns the inline style for the user menu button at the bottom of the sidebar.
function getMenuToggleButtonStyle(isOpen) {
    const style = {
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "8px 10px", borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
    };

    if (isOpen) {
        style.border = "1px solid #e5e7eb";
        style.background = "#f9fafb";
    } else {
        style.border = "1px solid transparent";
        style.background = "transparent";
    }

    return style;
}

// Returns the style for the small triangle arrow on the user menu button.
function getChevronStyle(isOpen) {
    const style = { fontSize: 10, color: "#9ca3af", transition: "transform 0.2s", flexShrink: 0 };

    if (isOpen) {
        style.transform = "rotate(180deg)";
    } else {
        style.transform = "rotate(0deg)";
    }

    return style;
}

//  Shared components

// A small colored pill showing a candidate's current status.
function Badge({ status }) {
    let config = STATUS_CONFIG[status];

    // Fall back to "new" style if the status string is unrecognised
    if (!config) {
        config = STATUS_CONFIG.new;
    }

    const style = {
        fontSize: 11, padding: "3px 10px", borderRadius: 20,
        background: config.bg, color: config.color, fontWeight: 600,
    };

    return <span style={style}>{config.label}</span>;
}

// Shown in the center of a tab when there is no data to display.
function EmptyState({ icon, title, sub }) {
    return (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>{icon}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{title}</div>
            {sub && <div style={{ fontSize: 13 }}>{sub}</div>}
        </div>
    );
}

// A small CSS-animated spinning circle shown inside buttons while saving.
function SpinnerDot() {
    return (
        <span style={{
            display: "inline-block", width: 14, height: 14,
            border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff",
            borderRadius: "50%", animation: "spin 0.7s linear infinite",
        }} />
    );
}


//  Sidebar
// The left navigation panel. Shows the app logo, nav tabs, and a user menu.
//
// Props:
//   activeTab    - id string of the currently shown tab
//   setActiveTab - function to switch to a different tab
//   onLogout     - function called when the user clicks "Đăng xuất"

function Sidebar({ activeTab, setActiveTab, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);

    // menuRef is attached to the wrapper div so we can detect
    // clicks outside the menu and close it automatically.
    const menuRef = useRef();

    // Close the dropdown menu when the user clicks anywhere outside it
    useEffect(function () {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const tabs = [
        { id: "overview", icon: "📊", label: "Tổng quan" },
        { id: "jobs", icon: "📋", label: "Quản lý tin đăng" },
        { id: "candidates", icon: "👥", label: "Quản lý ứng viên" },
        { id: "talent", icon: "🔍", label: "Tìm ứng viên" },
        { id: "company", icon: "🏢", label: "Thông tin công ty" },
    ];

    // Bật/tắt dropdown menu người dùng
    function handleMenuToggle() {
        if (menuOpen) {
            setMenuOpen(false);
        } else {
            setMenuOpen(true);
        }
    }

    // Đi đến tab thông tin công ty từ menu người dùng
    function handleGoToCompany() {
        setActiveTab("company");
        setMenuOpen(false);
    }

    // Đăng xuất từ menu người dùng
    function handleLogout() {
        setMenuOpen(false);
        onLogout();
    }

    return (
        <aside style={{ width: 224, flexShrink: 0, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", minHeight: "100vh" }}>

            {/* Logo + subtitle */}
            <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <img src={Logo} alt="JobHot Logo" style={{ height: 32, width: "auto" }} />
                    <div style={{ fontWeight: 700, fontSize: 20, color: "#7c3aed", letterSpacing: -0.5 }}>JobHot</div>
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Trang nhà tuyển dụng</div>
            </div>

            {/* Navigation tabs */}
            <nav style={{ flex: 1, padding: "12px 12px" }}>
                {tabs.map(function (tab) {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={function () { setActiveTab(tab.id); }}
                            style={getSidebarTabStyle(isActive)}
                        >
                            <span style={{ fontSize: 15 }}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    );
                })}
            </nav>

            {/* User menu at the bottom of the sidebar */}
            <div style={{ padding: "12px 12px", borderTop: "1px solid #f3f4f6", position: "relative" }} ref={menuRef}>

                {/* Menu toggle button */}
                <button onClick={handleMenuToggle} style={getMenuToggleButtonStyle(menuOpen)}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                        CT
                    </div>
                    <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            Công ty JobHot
                        </div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>Nhà tuyển dụng</div>
                    </div>
                    <span style={getChevronStyle(menuOpen)}>▲</span>
                </button>

                {/* Dropdown menu — only rendered when menuOpen is true */}
                {menuOpen && (
                    <div style={{ position: "absolute", bottom: "calc(100% - 8px)", left: 12, right: 12, background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)", overflow: "hidden", zIndex: 50 }}>

                        {/* Account info row */}
                        <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid #f3f4f6" }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Công ty JobHot</div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>hr@jobhot.vn</div>
                        </div>

                        {/* Menu action buttons */}
                        <div style={{ padding: "6px" }}>
                            <button
                                onClick={handleGoToCompany}
                                style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 7, border: "none", background: "transparent", cursor: "pointer", fontSize: 13, color: "#374151", textAlign: "left" }}
                                onMouseEnter={function (e) { e.currentTarget.style.background = "#f5f3ff"; }}
                                onMouseLeave={function (e) { e.currentTarget.style.background = "transparent"; }}
                            >
                                <span>🏢</span> Thông tin công ty
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 7, border: "none", background: "transparent", cursor: "pointer", fontSize: 13, color: "#ef4444", textAlign: "left" }}
                                onMouseEnter={function (e) { e.currentTarget.style.background = "#fff1f2"; }}
                                onMouseLeave={function (e) { e.currentTarget.style.background = "transparent"; }}
                            >
                                <span>🚪</span> Đăng xuất
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </aside>
    );
}

//  OverviewTab 
// The dashboard home screen. Shows four stat cards and two recent-items panels.
//
// Props:
//   jobs         - full jobs array from root state
//   candidates   - full candidates array from root state
//   setActiveTab - lets the "Xem tất cả" buttons jump to another tab

function OverviewTab({ jobs, candidates, setActiveTab }) {

    // Calculate summary numbers for the four stat cards
    const activeJobCount = jobs.filter(function (j) { return j.status === "active"; }).length;
    const totalCandidates = candidates.length;
    const newCandidates = candidates.filter(function (c) { return c.status === "new"; }).length;
    const shortlistedCount = candidates.filter(function (c) { return c.status === "shortlisted"; }).length;

    const stats = [
        { label: "Tin đang tuyển", value: activeJobCount, icon: "📋", color: "#7c3aed", bg: "#f5f3ff" },
        { label: "Tổng ứng viên", value: totalCandidates, icon: "👥", color: "#0369a1", bg: "#eff6ff" },
        { label: "Ứng viên mới", value: newCandidates, icon: "🆕", color: "#b45309", bg: "#fefce8" },
        { label: "Tiềm năng", value: shortlistedCount, icon: "⭐", color: "#15803d", bg: "#f0fdf4" },
    ];

    // Lấy 3 tin gần nhất để hiển thị
    const recentJobs = [];
    for (let i = 0; i < 3 && i < jobs.length; i++) {
        recentJobs.push(jobs[i]);
    }

    // Lấy 4 ứng viên gần nhất để hiển thị
    const recentCandidates = [];
    for (let i = 0; i < 4 && i < candidates.length; i++) {
        recentCandidates.push(candidates[i]);
    }

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Tổng quan</h2>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "#6b7280" }}>Chào mừng trở lại! Đây là tình hình tuyển dụng hôm nay.</p>

            {/* Four stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
                {stats.map(function (stat) {
                    return (
                        <div key={stat.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "18px 20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, fontWeight: 500 }}>{stat.label}</div>
                                    <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                                </div>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Two recent-items panels side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                {/* Recent jobs panel */}
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>Tin tuyển dụng gần đây</h3>
                        <button onClick={function () { setActiveTab("jobs"); }} style={{ fontSize: 12, color: "#7c3aed", border: "none", background: "none", cursor: "pointer", fontWeight: 500 }}>
                            Xem tất cả →
                        </button>
                    </div>
                    {recentJobs.map(function (job) {
                        return (
                            <div key={job.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f9fafb" }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{job.title}</div>
                                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{job.applicants} ứng viên · {formatDate(job.posted)}</div>
                                </div>
                                <span style={getJobStatusStyle(job.status)}>
                                    {getJobStatusLabel(job.status)}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Recent candidates panel */}
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>Ứng viên mới nhất</h3>
                        <button onClick={function () { setActiveTab("candidates"); }} style={{ fontSize: 12, color: "#7c3aed", border: "none", background: "none", cursor: "pointer", fontWeight: 500 }}>
                            Xem tất cả →
                        </button>
                    </div>
                    {recentCandidates.map(function (candidate) {
                        return (
                            <div key={candidate.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #f9fafb" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: getAvatarColor(candidate.name), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                        {getInitials(candidate.name)}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{candidate.name}</div>
                                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{candidate.position}</div>
                                    </div>
                                </div>
                                <Badge status={candidate.status} />
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}


//  JobFormModal 
// A modal for creating or editing a job listing.
// Clicking the dark backdrop also closes the modal.
// Props:
//   job     - the job object to edit, or null when creating a new one
//   onClose - called when the modal should be dismissed
//   onSave  - called with the finished job object when the form is saved

function JobFormModal({ job, onClose, onSave }) {

    // If a job was passed in, start with its values; otherwise use empty strings.
    let initialTitle = "";
    let initialDescription = "";
    let initialRequirements = "";
    let initialSalary = "";
    let initialLocation = "Hà Nội";
    let initialCategory = "Công nghệ thông tin";
    let initialType = "Full-time";
    let initialDeadline = "";

    if (job) {
        initialTitle = job.title;
        initialDescription = job.description;
        initialRequirements = job.requirements;
        initialSalary = job.salary;
        initialLocation = job.location;
        initialCategory = job.category;
        initialType = job.type;
        initialDeadline = job.deadline;
    }

    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [requirements, setRequirements] = useState(initialRequirements);
    const [salary, setSalary] = useState(initialSalary);
    const [location, setLocation] = useState(initialLocation);
    const [category, setCategory] = useState(initialCategory);
    const [type, setType] = useState(initialType);
    const [deadline, setDeadline] = useState(initialDeadline);
    const [loading, setLoading] = useState(false);

    // Simulate a save delay then call onSave with the complete job object.
    // For editing: keeps the existing id, status, applicants, posted date.
    // For creating: generates a new id and sets defaults.
    async function handleSave(event) {
        event.preventDefault();
        setLoading(true);

        // Simulate network delay (remove when connected to a real backend)
        await new Promise(function (resolve) { setTimeout(resolve, 900); });

        let savedJob;

        if (job) {
            // Editing an existing job — preserve its metadata fields
            savedJob = {
                id: job.id, status: job.status,
                applicants: job.applicants, posted: job.posted,
                title: title, description: description,
                requirements: requirements, salary: salary,
                location: location, category: category,
                type: type, deadline: deadline,
            };
        } else {
            // Creating a new job — generate id and set defaults
            savedJob = {
                id: "JP" + Date.now(), status: "active",
                applicants: 0, posted: new Date().toISOString().slice(0, 10),
                title: title, description: description,
                requirements: requirements, salary: salary,
                location: location, category: category,
                type: type, deadline: deadline,
            };
        }

        onSave(savedJob);
        setLoading(false);
        onClose();
    }

    // Closes the modal when the user clicks the dark background area,
    // but not when they click inside the white dialog box.
    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    // Xác định tiêu đề modal theo chế độ tạo mới hay chỉnh sửa
    let modalTitle;
    if (job) {
        modalTitle = "Chỉnh sửa tin tuyển dụng";
    } else {
        modalTitle = "Tạo tin tuyển dụng mới";
    }

    // Xác định chữ nút lưu theo trạng thái loading và chế độ
    let saveButtonLabel;
    if (loading) {
        saveButtonLabel = "Đang lưu...";
    } else if (job) {
        saveButtonLabel = "Lưu thay đổi";
    } else {
        saveButtonLabel = "Đăng tuyển dụng";
    }

    return (
        <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={handleBackdropClick}
        >
            <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 640, maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

                {/* Modal header */}
                <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>{modalTitle}</h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
                </div>

                {/* Form body */}
                <form onSubmit={handleSave} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

                    {/* Job title */}
                    <div>
                        {getFieldLabel("Tiêu đề công việc *")}
                        <input value={title} onChange={function (e) { setTitle(e.target.value); }} required placeholder="VD: Lập Trình Viên Full Stack" style={inputStyle} />
                    </div>

                    {/* Salary + Location + Category + Type grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div>
                            {getFieldLabel("Mức lương")}
                            <input value={salary} onChange={function (e) { setSalary(e.target.value); }} placeholder="VD: 20-35 triệu" style={inputStyle} />
                        </div>
                        <div>
                            {getFieldLabel("Địa điểm")}
                            <select value={location} onChange={function (e) { setLocation(e.target.value); }} style={inputStyle}>
                                {LOCATIONS.map(function (loc) { return <option key={loc}>{loc}</option>; })}
                            </select>
                        </div>
                        <div>
                            {getFieldLabel("Danh mục (tuỳ chọn)")}
                            <select value={category} onChange={function (e) { setCategory(e.target.value); }} style={inputStyle}>
                                {CATEGORIES.map(function (cat) { return <option key={cat}>{cat}</option>; })}
                            </select>
                        </div>
                        <div>
                            {getFieldLabel("Loại công việc")}
                            <select value={type} onChange={function (e) { setType(e.target.value); }} style={inputStyle}>
                                {JOB_TYPES.map(function (t) { return <option key={t}>{t}</option>; })}
                            </select>
                        </div>
                    </div>

                    {/* Deadline */}
                    <div>
                        {getFieldLabel("Deadline")}
                        <input type="date" value={deadline} onChange={function (e) { setDeadline(e.target.value); }} style={inputStyle} />
                    </div>

                    {/* Description */}
                    <div>
                        {getFieldLabel("Mô tả công việc *")}
                        <textarea value={description} onChange={function (e) { setDescription(e.target.value); }} required rows={5} placeholder="Mô tả chi tiết về công việc, trách nhiệm..." style={textareaStyle} />
                    </div>

                    {/* Requirements */}
                    <div>
                        {getFieldLabel("Yêu cầu kỹ năng *")}
                        <textarea value={requirements} onChange={function (e) { setRequirements(e.target.value); }} required rows={4} placeholder="Liệt kê các yêu cầu (mỗi yêu cầu một dòng)..." style={textareaStyle} />
                    </div>

                    {/* Save + Cancel buttons */}
                    <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
                        <button type="submit" disabled={loading} style={getSubmitButtonStyle(loading)}>
                            {loading && <SpinnerDot />}
                            {saveButtonLabel}
                        </button>
                        <button type="button" onClick={onClose} style={{ padding: "11px 20px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, cursor: "pointer" }}>
                            Huỷ
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

//  DeleteModal 
// A confirmation dialog shown before permanently deleting a job.
// Props:
//   job       - the job about to be deleted (used to show its title)
//   onConfirm - called when the user clicks the red "Xoá" button
//   onClose   - called when the user cancels

function DeleteModal({ job, onConfirm, onClose }) {

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    // Show "N/A" if somehow no job is passed
    let jobTitle = "N/A";
    if (job && job.title) {
        jobTitle = job.title;
    }

    return (
        <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={handleBackdropClick}
        >
            <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 420, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", textAlign: "center" }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>🗑️</div>
                <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#111827" }}>Xoá tin tuyển dụng?</h2>
                <p style={{ margin: "0 0 24px", fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
                    Bạn sắp xoá <strong>"{jobTitle}"</strong>. Hành động này không thể hoàn tác.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, cursor: "pointer" }}>Huỷ</button>
                    <button onClick={onConfirm} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Xoá</button>
                </div>
            </div>
        </div>
    );
}

//  JobsTab 
// Lists all job postings with filter buttons and per-job action buttons.
// Props:
//   jobs    - the jobs array from root state
//   setJobs - setter to update the jobs array

function JobsTab({ jobs, setJobs }) {
    const [showForm, setShowForm] = useState(false);
    const [editJob, setEditJob] = useState(null);   // null = create new
    const [deleteJob, setDeleteJob] = useState(null);   // null = no pending delete
    const [filter, setFilter] = useState("all");  // "all" | "active" | "closed"

    // Filter the jobs list
    const filteredJobs = [];
    for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];

        if (filter === "all") {
            filteredJobs.push(job);
        } else if (job.status === filter) {
            filteredJobs.push(job);
        }
    }

    // Called by JobFormModal when the user saves.
    // If the job already exists (matched by id), replace it; otherwise prepend it.
    function handleSave(savedJob) {
        let exists = false;
        for (let i = 0; i < jobs.length; i++) {
            if (jobs[i].id === savedJob.id) {
                exists = true;
                break;
            }
        }

        if (exists) {
            // Replace the existing job
            const updated = [];
            for (let i = 0; i < jobs.length; i++) {
                if (jobs[i].id === savedJob.id) {
                    updated.push(savedJob);
                } else {
                    updated.push(jobs[i]);
                }
            }
            setJobs(updated);
        } else {
            // Prepend the new job
            const updated = [savedJob];
            for (let i = 0; i < jobs.length; i++) {
                updated.push(jobs[i]);
            }
            setJobs(updated);
        }
    }

    // Removes the job currently stored in deleteJob from the list.
    function handleDelete() {
        const updated = [];
        for (let i = 0; i < jobs.length; i++) {
            if (jobs[i].id !== deleteJob.id) {
                updated.push(jobs[i]);
            }
        }
        setJobs(updated);
        setDeleteJob(null);
    }

    // Flips a job between "active" and "closed".
    function handleToggleStatus(id) {
        const updated = [];

        for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];

            if (job.id !== id) {
                updated.push(job);
            } else {
                // Determine the new status
                let newStatus;
                if (job.status === "active") {
                    newStatus = "closed";
                } else {
                    newStatus = "active";
                }

                // Build updated job object field by field (no spread)
                updated.push({
                    id: job.id, title: job.title, description: job.description,
                    requirements: job.requirements, salary: job.salary,
                    location: job.location, category: job.category, type: job.type,
                    deadline: job.deadline, posted: job.posted, applicants: job.applicants,
                    status: newStatus,
                });
            }
        }

        setJobs(updated);
    }

    // Opens the form modal in "create new" mode.
    function handleOpenCreate() {
        setEditJob(null);
        setShowForm(true);
    }

    // Opens the form modal in "edit" mode for the given job.
    function handleOpenEdit(job) {
        setEditJob(job);
        setShowForm(true);
    }

    const filterOptions = [
        { value: "all", label: "Tất cả" },
        { value: "active", label: "Đang tuyển" },
        { value: "closed", label: "Đã đóng" },
    ];

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>

            {/* Tab header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                    <h2 style={{ margin: "0 0 2px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Quản lý tin đăng</h2>
                    <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>{jobs.length} tin tuyển dụng</p>
                </div>
                <button onClick={handleOpenCreate} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, border: "none", background: "#7c3aed", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    + Tạo tin mới
                </button>
            </div>

            {/* Status filter pills */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {filterOptions.map(function (option) {
                    return (
                        <button key={option.value} onClick={function () { setFilter(option.value); }} style={getFilterButtonStyle(filter === option.value)}>
                            {option.label}
                        </button>
                    );
                })}
            </div>

            {/* Job cards list or empty state */}
            {filteredJobs.length === 0 && (
                <EmptyState icon="📋" title="Chưa có tin tuyển dụng" sub="Nhấn 'Tạo tin mới' để bắt đầu tuyển dụng" />
            )}

            {filteredJobs.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {filteredJobs.map(function (job) {

                        // Cắt ngắn mô tả để hiển thị trên card
                        const shortDescription = job.description.slice(0, 120) + "…";

                        // Xác định ngày deadline hiển thị
                        let deadlineDisplay = "-";
                        if (job.deadline) {
                            deadlineDisplay = formatDate(job.deadline);
                        }

                        return (
                            <div key={job.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "18px 20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>

                                    {/* Job info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                                            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>{job.title}</h3>
                                            <span style={getJobStatusStyle(job.status)}>
                                                {getJobStatusLabel(job.status)}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                                            <span style={{ fontSize: 12, color: "#6b7280" }}>💰 {job.salary}</span>
                                            <span style={{ fontSize: 12, color: "#6b7280" }}>📍 {job.location}</span>
                                            <span style={{ fontSize: 12, color: "#6b7280" }}>💼 {job.type}</span>
                                            <span style={{ fontSize: 12, color: "#6b7280" }}>📅 Deadline: {deadlineDisplay}</span>
                                            <span style={{ fontSize: 12, color: "#6b7280" }}>👥 {job.applicants} ứng viên</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>{shortDescription}</p>
                                    </div>

                                    {/* Action buttons */}
                                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                                        <button onClick={function () { handleToggleStatus(job.id); }} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 12, cursor: "pointer" }}>
                                            {getToggleButtonLabel(job.status)}
                                        </button>
                                        <button onClick={function () { handleOpenEdit(job); }} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #7c3aed", background: "#f5f3ff", color: "#7c3aed", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                                            ✏️ Sửa
                                        </button>
                                        <button onClick={function () { setDeleteJob(job); }} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #fecaca", background: "#fff1f2", color: "#ef4444", fontSize: 12, cursor: "pointer" }}>
                                            🗑️
                                        </button>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals — only rendered when their trigger state is set */}
            {showForm && (
                <JobFormModal
                    job={editJob}
                    onClose={function () { setShowForm(false); }}
                    onSave={handleSave}
                />
            )}
            {deleteJob && (
                <DeleteModal
                    job={deleteJob}
                    onConfirm={handleDelete}
                    onClose={function () { setDeleteJob(null); }}
                />
            )}

        </div>
    );
}

//  CVModal 
// A modal showing a candidate's full profile.
// Props:
//   candidate - the candidate object to display
//   onClose   - called when the modal should be dismissed

function CVModal({ candidate, onClose }) {

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    // Tạo tên file CV từ tên ứng viên (thay dấu cách bằng gạch dưới)
    const cvFileName = "CV_" + candidate.name.replace(/ /g, "_") + ".pdf";

    // Lấy tối đa 3 kỹ năng đầu để hiển thị trên card
    const displaySkills = [];
    for (let i = 0; i < candidate.skills.length && i < 3; i++) {
        displaySkills.push(candidate.skills[i]);
    }

    return (
        <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={handleBackdropClick}
        >
            <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

                {/* Modal header */}
                <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Hồ sơ ứng viên</h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
                </div>

                {/* Modal body */}
                <div style={{ padding: "24px" }}>

                    {/* Avatar + name + position */}
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 24 }}>
                        <div style={{ width: 60, height: 60, borderRadius: "50%", background: getAvatarColor(candidate.name), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
                            {getInitials(candidate.name)}
                        </div>
                        <div>
                            <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#111827" }}>{candidate.name}</h3>
                            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 6 }}>{candidate.position}</div>
                            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#9ca3af" }}>
                                <span>📍 {candidate.location}</span>
                                <span>⏱ {candidate.experience}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact section */}
                    <div style={{ marginBottom: 20 }}>
                        {getSectionTitle("Liên hệ")}
                        <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
                            <span style={{ color: "#374151" }}>📧 {candidate.email}</span>
                            <span style={{ color: "#374151" }}>📱 {candidate.phone}</span>
                        </div>
                    </div>

                    {/* Bio section */}
                    <div style={{ marginBottom: 20 }}>
                        {getSectionTitle("Giới thiệu")}
                        <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{candidate.bio}</p>
                    </div>

                    {/* Education section */}
                    <div style={{ marginBottom: 20 }}>
                        {getSectionTitle("Học vấn")}
                        <p style={{ margin: 0, fontSize: 13, color: "#374151" }}>🎓 {candidate.education}</p>
                    </div>

                    {/* Skills section */}
                    <div style={{ marginBottom: 24 }}>
                        {getSectionTitle("Kỹ năng")}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {candidate.skills.map(function (skill) {
                                return (
                                    <span key={skill} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "#f5f3ff", color: "#7c3aed", fontWeight: 500 }}>
                                        {skill}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    {/* CV download row */}
                    <div style={{ background: "#f9fafb", borderRadius: 10, padding: "14px 16px", fontSize: 12, color: "#6b7280" }}>
                        📄 CV đính kèm:{' '}
                        <span style={{ color: "#7c3aed", fontWeight: 500, cursor: "pointer" }}>{cvFileName}</span>
                        <span style={{ marginLeft: 8, color: "#9ca3af" }}>(Demo - chưa tích hợp backend)</span>
                    </div>

                </div>
            </div>
        </div>
    );
}

//  CandidatesTab 
// Lists all candidates with filters by job and by status.
// Props:
//   candidates    - the candidates array from root state
//   setCandidates - setter to update a candidate's status
//   jobs          - used to resolve the job title for each candidate row

function CandidatesTab({ candidates, setCandidates, jobs }) {
    const [viewCV, setViewCV] = useState(null);    // candidate to show in CVModal, or null
    const [filterJob, setFilterJob] = useState("all");   // "all" or a job id like "JP001"
    const [filterStatus, setFilterStatus] = useState("all");   // "all" or a status key

    // Filter the candidates list
    const filteredCandidates = [];
    for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];

        let jobMatch = true;
        if (filterJob !== "all") {
            jobMatch = candidate.appliedJob === filterJob;
        }

        let statusMatch = true;
        if (filterStatus !== "all") {
            statusMatch = candidate.status === filterStatus;
        }

        if (jobMatch && statusMatch) {
            filteredCandidates.push(candidate);
        }
    }

    // Changes a single candidate's status without touching the others.
    function updateStatus(id, newStatus) {
        const updated = [];

        for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];

            if (candidate.id !== id) {
                updated.push(candidate);
            } else {
                // Build a new candidate object with the updated status (no spread)
                updated.push({
                    id: candidate.id, name: candidate.name,
                    position: candidate.position, experience: candidate.experience,
                    skills: candidate.skills, location: candidate.location,
                    email: candidate.email, phone: candidate.phone,
                    appliedJob: candidate.appliedJob, appliedDate: candidate.appliedDate,
                    bio: candidate.bio, education: candidate.education,
                    status: newStatus,
                });
            }
        }

        setCandidates(updated);
    }

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>

            {/* Tab header */}
            <div style={{ marginBottom: 20 }}>
                <h2 style={{ margin: "0 0 2px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Quản lý ứng viên</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>{filteredCandidates.length} ứng viên</p>
            </div>

            {/* Filter dropdowns */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>

                {/* Filter by which job the candidate applied to */}
                <select value={filterJob} onChange={function (e) { setFilterJob(e.target.value); }} style={autoSelectStyle}>
                    <option value="all">Tất cả tin đăng</option>
                    {jobs.map(function (job) {
                        return (
                            <option key={job.id} value={job.id}>
                                {job.title.slice(0, 40)}…
                            </option>
                        );
                    })}
                </select>

                {/* Filter by candidate status */}
                <select value={filterStatus} onChange={function (e) { setFilterStatus(e.target.value); }} style={autoSelectStyle}>
                    <option value="all">Tất cả trạng thái</option>
                    {Object.entries(STATUS_CONFIG).map(function (entry) {
                        const key = entry[0];
                        const value = entry[1];
                        return <option key={key} value={key}>{value.label}</option>;
                    })}
                </select>

            </div>

            {/* Candidates list or empty state */}
            {filteredCandidates.length === 0 && (
                <EmptyState icon="👥" title="Chưa có ứng viên" sub="Ứng viên sẽ xuất hiện ở đây khi họ nộp hồ sơ" />
            )}

            {filteredCandidates.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {filteredCandidates.map(function (candidate) {

                        // Tìm tên tin tuyển dụng mà ứng viên này đã nộp
                        let jobTitle = "N/A";
                        for (let i = 0; i < jobs.length; i++) {
                            if (jobs[i].id === candidate.appliedJob) {
                                jobTitle = jobs[i].title.slice(0, 35) + "…";
                                break;
                            }
                        }

                        // Lấy tối đa 3 kỹ năng đầu để hiển thị
                        const topSkills = [];
                        for (let i = 0; i < candidate.skills.length && i < 3; i++) {
                            topSkills.push(candidate.skills[i]);
                        }

                        return (
                            <div key={candidate.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>

                                    {/* Avatar + info */}
                                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: getAvatarColor(candidate.name), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                                            {getInitials(candidate.name)}
                                        </div>
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                                                <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{candidate.name}</span>
                                                <Badge status={candidate.status} />
                                            </div>
                                            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{candidate.position} · {candidate.experience}</div>
                                            <div style={{ fontSize: 12, color: "#9ca3af" }}>
                                                Ứng tuyển: <span style={{ color: "#374151" }}>{jobTitle}</span> · {formatDate(candidate.appliedDate)}
                                            </div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                                                {topSkills.map(function (skill) {
                                                    return (
                                                        <span key={skill} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#f5f3ff", color: "#7c3aed" }}>
                                                            {skill}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status dropdown + CV button */}
                                    <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center", flexWrap: "wrap" }}>
                                        <select value={candidate.status} onChange={function (e) { updateStatus(candidate.id, e.target.value); }} style={smallSelectStyle}>
                                            {Object.entries(STATUS_CONFIG).map(function (entry) {
                                                const key = entry[0];
                                                const value = entry[1];
                                                return <option key={key} value={key}>{value.label}</option>;
                                            })}
                                        </select>
                                        <button onClick={function () { setViewCV(candidate); }} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #7c3aed", background: "#f5f3ff", color: "#7c3aed", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                                            Xem CV
                                        </button>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* CV modal — only shown when a candidate is selected */}
            {viewCV && (
                <CVModal candidate={viewCV} onClose={function () { setViewCV(null); }} />
            )}

        </div>
    );
}

//  TalentTab 
// A search panel that filters the talent pool by skill, experience, and location.

function TalentTab() {
    const [searchSkill, setSearchSkill] = useState("");
    const [searchExperience, setSearchExperience] = useState("Tất cả");
    const [searchLocation, setSearchLocation] = useState("Tất cả");
    const [results, setResults] = useState(MOCK_TALENT_POOL);
    const [hasSearched, setHasSearched] = useState(false);

    // Filters the talent pool and updates the results state.
    function handleSearch() {
        const keyword = searchSkill.toLowerCase();
        const filtered = [];

        for (let i = 0; i < MOCK_TALENT_POOL.length; i++) {
            const talent = MOCK_TALENT_POOL[i];

            // Skill/position match — true if no keyword was typed
            let skillMatch = true;
            if (keyword !== "") {
                const positionMatch = talent.position.toLowerCase().includes(keyword);

                let hasSkill = false;
                for (let j = 0; j < talent.skills.length; j++) {
                    if (talent.skills[j].toLowerCase().includes(keyword)) {
                        hasSkill = true;
                        break;
                    }
                }

                skillMatch = positionMatch || hasSkill;
            }

            // Experience match — true if "Tất cả" is selected
            let experienceMatch = true;
            if (searchExperience !== "Tất cả") {
                experienceMatch = talent.experience === searchExperience;
            }

            // Location match — true if "Tất cả" is selected
            let locationMatch = true;
            if (searchLocation !== "Tất cả") {
                locationMatch = talent.location === searchLocation;
            }

            if (skillMatch && experienceMatch && locationMatch) {
                filtered.push(talent);
            }
        }

        setResults(filtered);
        setHasSearched(true);
    }

    // Triggers the search when Enter is pressed in the skill input.
    function handleKeyDown(event) {
        if (event.key === "Enter") {
            handleSearch();
        }
    }

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Tìm kiếm ứng viên</h2>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "#6b7280" }}>Tìm kiếm trong cơ sở dữ liệu ứng viên của JobHot</p>

            {/* Search filter bar */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "20px 24px", marginBottom: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "flex-end" }}>

                    {/* Skill / position keyword input */}
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Kỹ năng / Vị trí</label>
                        <input value={searchSkill} onChange={function (e) { setSearchSkill(e.target.value); }} placeholder="React, Python, Designer..." style={inputStyle} onKeyDown={handleKeyDown} />
                    </div>

                    {/* Experience dropdown */}
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Kinh nghiệm</label>
                        <select value={searchExperience} onChange={function (e) { setSearchExperience(e.target.value); }} style={inputStyle}>
                            <option>Tất cả</option>
                            {EXPERIENCES.map(function (exp) { return <option key={exp}>{exp}</option>; })}
                        </select>
                    </div>

                    {/* Location dropdown */}
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Địa điểm</label>
                        <select value={searchLocation} onChange={function (e) { setSearchLocation(e.target.value); }} style={inputStyle}>
                            <option>Tất cả</option>
                            {LOCATIONS.map(function (loc) { return <option key={loc}>{loc}</option>; })}
                        </select>
                    </div>

                    {/* Search button */}
                    <button onClick={handleSearch} style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: "#7c3aed", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                        🔍 Tìm kiếm
                    </button>

                </div>
            </div>

            {/* Result count — only shown after at least one search */}
            {hasSearched && (
                <p style={{ margin: "0 0 16px", fontSize: 13, color: "#6b7280" }}>
                    Tìm thấy <strong style={{ color: "#111827" }}>{results.length}</strong> ứng viên phù hợp
                </p>
            )}

            {/* No results state */}
            {results.length === 0 && hasSearched && (
                <EmptyState icon="🔍" title="Không tìm thấy ứng viên" sub="Thử thay đổi từ khóa hoặc bộ lọc tìm kiếm" />
            )}

            {/* Talent cards grid */}
            {results.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                    {results.map(function (talent) {
                        return (
                            <div
                                key={talent.id}
                                style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "18px 18px", transition: "box-shadow 0.15s" }}
                                onMouseEnter={function (e) { e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.10)"; }}
                                onMouseLeave={function (e) { e.currentTarget.style.boxShadow = "none"; }}
                            >
                                {/* Avatar + name */}
                                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: getAvatarColor(talent.name), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                                        {getInitials(talent.name)}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{talent.name}</div>
                                        <div style={{ fontSize: 12, color: "#6b7280" }}>{talent.position}</div>
                                    </div>
                                </div>

                                {/* Location + experience */}
                                <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>
                                    <span>📍 {talent.location}</span>
                                    <span>⏱ {talent.experience}</span>
                                </div>

                                {/* Skills */}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                                    {talent.skills.map(function (skill) {
                                        return (
                                            <span key={skill} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, background: "#f5f3ff", color: "#7c3aed", fontWeight: 500 }}>
                                                {skill}
                                            </span>
                                        );
                                    })}
                                </div>

                                {/* Contact link */}
                                <a
                                    href={"mailto:" + talent.email}
                                    style={{ display: "block", textAlign: "center", padding: "8px", borderRadius: 8, border: "1px solid #7c3aed", color: "#7c3aed", fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}
                                    onMouseEnter={function (e) { e.currentTarget.style.background = "#7c3aed"; e.currentTarget.style.color = "#fff"; }}
                                    onMouseLeave={function (e) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7c3aed"; }}
                                >
                                    ✉️ Liên hệ ứng viên
                                </a>

                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
}

//  CompanyTab 
// A form for editing the employer's company profile.

function CompanyTab() {
    const [name, setName] = useState("Công ty JobHot");
    const [description, setDescription] = useState("Nền tảng tuyển dụng hàng đầu Việt Nam, kết nối hàng triệu ứng viên với các nhà tuyển dụng uy tín trên cả nước.");
    const [address, setAddress] = useState("Tòa nhà FLC, 18 Phạm Hùng, Nam Từ Liêm, Hà Nội");
    const [website, setWebsite] = useState("https://jobhot.vn");
    const [size, setSize] = useState("50-100 nhân viên");
    const [industry, setIndustry] = useState("Công nghệ thông tin");
    const [email, setEmail] = useState("hr@jobhot.vn");
    const [phone, setPhone] = useState("024 1234 5678");
    const [saved, setSaved] = useState(false); // true for 2.5s after saving

    // Hiển thị "Đã lưu!" trong 2.5 giây sau khi lưu thành công
    function handleSave(event) {
        event.preventDefault();
        setSaved(true);
        setTimeout(function () { setSaved(false); }, 2500);
    }

    // Xác định chữ nút lưu
    let saveButtonLabel;
    if (saved) {
        saveButtonLabel = "✓ Đã lưu!";
    } else {
        saveButtonLabel = "Lưu thay đổi";
    }

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 24, maxWidth: 720 }}>

            {/* Company logo + name header */}
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
                <div style={{ width: 68, height: 68, borderRadius: 16, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700 }}>
                    CT
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>{name}</h2>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>{industry} · {size}</div>
                </div>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                {getSectionTitle("Thông tin cơ bản")}

                {/* Two-column grid of basic fields */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                        {getFieldLabel("Tên công ty *")}
                        <input value={name} onChange={function (e) { setName(e.target.value); }} required style={inputStyle} />
                    </div>
                    <div>
                        {getFieldLabel("Website")}
                        <input value={website} onChange={function (e) { setWebsite(e.target.value); }} placeholder="https://..." style={inputStyle} />
                    </div>
                    <div>
                        {getFieldLabel("Email liên hệ")}
                        <input type="email" value={email} onChange={function (e) { setEmail(e.target.value); }} style={inputStyle} />
                    </div>
                    <div>
                        {getFieldLabel("Số điện thoại")}
                        <input value={phone} onChange={function (e) { setPhone(e.target.value); }} style={inputStyle} />
                    </div>
                    <div>
                        {getFieldLabel("Ngành nghề")}
                        <select value={industry} onChange={function (e) { setIndustry(e.target.value); }} style={inputStyle}>
                            {CATEGORIES.map(function (cat) { return <option key={cat}>{cat}</option>; })}
                        </select>
                    </div>
                    <div>
                        {getFieldLabel("Quy mô")}
                        <select value={size} onChange={function (e) { setSize(e.target.value); }} style={inputStyle}>
                            {COMPANY_SIZES.map(function (s) { return <option key={s}>{s}</option>; })}
                        </select>
                    </div>
                </div>

                {/* Address */}
                <div>
                    {getFieldLabel("Địa chỉ *")}
                    <input value={address} onChange={function (e) { setAddress(e.target.value); }} required style={inputStyle} />
                </div>

                {/* Description */}
                <div>
                    {getFieldLabel("Mô tả công ty *")}
                    <textarea value={description} onChange={function (e) { setDescription(e.target.value); }} required rows={5} placeholder="Mô tả về công ty, văn hóa, sứ mệnh..." style={textareaStyle} />
                </div>

                {/* Save button */}
                <button
                    type="submit"
                    style={{ padding: "11px 24px", borderRadius: 10, border: "none", background: "#7c3aed", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "fit-content", transition: "background 0.15s" }}
                    onMouseEnter={function (e) { e.currentTarget.style.background = "#6d28d9"; }}
                    onMouseLeave={function (e) { e.currentTarget.style.background = "#7c3aed"; }}
                >
                    {saveButtonLabel}
                </button>

            </form>
        </div>
    );
}

//  EmployerDashboard (root entry point) 
// Holds the top-level state (jobs, candidates, active tab)
// and renders the sidebar + the currently active tab panel.

export default function EmployerDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [jobs, setJobs] = useState(MOCK_JOBS);
    const [candidates, setCandidates] = useState(MOCK_CANDIDATES);

    // Maps tab ids to the header title shown in the top bar
    const TAB_TITLES = {
        overview: "Tổng quan",
        jobs: "Quản lý tin đăng",
        candidates: "Quản lý ứng viên",
        talent: "Tìm kiếm ứng viên",
        company: "Thông tin công ty",
    };

    // Xóa token và chuyển về trang đăng nhập
    function handleLogout() {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    // Đếm số tin đang tuyển để hiển thị trên top bar
    const activeJobCount = jobs.filter(function (j) { return j.status === "active"; }).length;

    return (
        <>
            {/* Global CSS: spin animation and box-sizing reset */}
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                * { box-sizing: border-box; }
                body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            `}</style>

            <div style={{ display: "flex", height: "100vh", background: "#f9fafb", overflow: "hidden" }}>

                {/* Left sidebar navigation */}
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

                {/* Main content area */}
                <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

                    {/* Top header bar */}
                    <div style={{ padding: "14px 24px", borderBottom: "1px solid #f3f4f6", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>{TAB_TITLES[activeTab]}</h1>
                            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>JobHot - Nhà tuyển dụng</div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <div style={{ fontSize: 12, background: "#f0fdf4", color: "#15803d", padding: "4px 12px", borderRadius: 20, fontWeight: 500 }}>
                                {activeJobCount} tin đang tuyển
                            </div>
                            <div style={{ fontSize: 12, background: "#f5f3ff", color: "#7c3aed", padding: "4px 12px", borderRadius: 20, fontWeight: 500 }}>
                                {candidates.length} ứng viên
                            </div>
                        </div>
                    </div>

                    {/* Tab content panel */}
                    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                        {activeTab === "overview" && <OverviewTab jobs={jobs} candidates={candidates} setActiveTab={setActiveTab} />}
                        {activeTab === "jobs" && <JobsTab jobs={jobs} setJobs={setJobs} />}
                        {activeTab === "candidates" && <CandidatesTab candidates={candidates} setCandidates={setCandidates} jobs={jobs} />}
                        {activeTab === "talent" && <TalentTab />}
                        {activeTab === "company" && <CompanyTab />}
                    </div>

                </main>
            </div>
        </>
    );
}