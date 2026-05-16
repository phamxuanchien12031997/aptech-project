import { useState, useRef, useEffect } from "react";

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
        applicants: 14
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
        applicants: 7
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
        applicants: 22
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
        location: "Đà Nẵng", email: "nga@email.com"
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

// DATA: DROPDOWN OPTIONS
// Used in the job form and talent search filters.

const CATEGORIES = ["Công nghệ thông tin", "Marketing / PR", "Thiết kế", "Kế toán / Kiểm toán", "Kinh doanh / Bán hàng", "Nhân sự", "Dịch vụ khách hàng"];
const JOB_TYPES = ["Full-time", "Part-time", "Freelancer", "Thực tập"];
const LOCATIONS = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];
const EXPERIENCES = ["Không yêu cầu", "Dưới 1 năm", "1-2 năm", "2-3 năm", "3-5 năm", "Trên 5 năm"];
const COMPANY_SIZES = ["1-10 nhân viên", "10-50 nhân viên", "50-100 nhân viên", "100-500 nhân viên", "Trên 500 nhân viên"];

// DATA: STATUS CONFIG
// Maps a candidate status string to its display label and badge colors.
// Used by the Badge component and status dropdowns.

const STATUS_CONFIG = {
    new: { label: "Mới", bg: "#eff6ff", color: "#1d4ed8" },
    reviewing: { label: "Đang xem xét", bg: "#fefce8", color: "#854d0e" },
    shortlisted: { label: "Tiềm năng", bg: "#f0fdf4", color: "#15803d" },
    rejected: { label: "Từ chối", bg: "#fff1f2", color: "#be123c" },
};

// DATA: SHARED INLINE STYLES
// Reused style objects so the same input/label style is not
// copy-pasted on every field.

// Base style for all text inputs and selects
const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    color: "#111827",
};

// HELPER: getInitials
// Returns the first letter of the last two words of a name, uppercased.
// Example: "Nguyễn Thị Bình" → "TB"
// Used for avatar placeholders.

function getInitials(name) {
    const words = name.split(" ");
    const lastTwo = words.slice(-2);
    const letters = lastTwo.map(function (word) { return word[0]; });
    return letters.join("").toUpperCase();
}

// HELPER: getDaysLeft
// Returns how many days remain until the given date string.
// Returns 0 if the deadline has already passed.

function getDaysLeft(dateString) {
    const deadline = new Date(dateString);
    const now = new Date();
    const diff = deadline - now;
    const days = Math.ceil(diff / 86400000);  // 86400000 ms = 1 day

    if (days < 0) {
        return 0;
    }

    return days;
}

// HELPER: formatDate
// Formats a date string into Vietnamese locale format (DD/MM/YYYY).

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("vi-VN");
}

// HELPER: getAvatarColor
// Picks a consistent color for an avatar based on the first character
// of the person's name. Same name always gets the same color.

const AVATAR_COLORS = ["#7c3aed", "#0369a1", "#0f766e", "#b45309", "#be185d", "#6d28d9"];

function getAvatarColor(name) {
    const index = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
}

// HELPER: getSectionTitle
// Returns a styled <h3> element used as a section heading inside panels.

function getSectionTitle(text) {
    return (
        <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 0.5, paddingBottom: 8, borderBottom: "1px solid #f3f4f6" }}>
            {text}
        </h3>
    );
}

// HELPER: getFieldLabel
// Returns a styled <label> element used above form inputs.

function getFieldLabel(text) {
    return (
        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
            {text}
        </label>
    );
}

// HELPER: getJobStatusStyle
// Returns the inline style object for a job status badge pill.
// Active jobs get a green pill, closed jobs get a gray pill.

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

// HELPER: getJobStatusLabel
// Returns display label for a job status string.

function getJobStatusLabel(status) {
    if (status === "active") {
        return "Đang tuyển";
    } else {
        return "Đã đóng";
    }
}

// HELPER: getToggleButtonLabel
// Returns the label for the open/close toggle button on a job card.

function getToggleButtonLabel(status) {
    if (status === "active") {
        return "Đóng tin";
    } else {
        return "Mở lại";
    }
}

// HELPER: getSidebarTabStyle
// Returns the inline style object for a sidebar navigation button.
// Active tab gets a purple highlight background, others are transparent.

function getSidebarTabStyle(isActive) {
    return {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        fontSize: 13.5,
        fontWeight: isActive ? 600 : 400,
        background: isActive ? "#f5f3ff" : "transparent",
        color: isActive ? "#7c3aed" : "#374151",
        marginBottom: 3,
        transition: "all 0.15s",
    };
}

// HELPER: getFilterButtonStyle
// Returns the inline style object for the filter pill buttons
// (e.g. "Tất cả / Đang tuyển / Đã đóng" in the Jobs tab).

function getFilterButtonStyle(isActive) {
    return {
        padding: "7px 16px",
        borderRadius: 20,
        border: isActive ? "1px solid #7c3aed" : "1px solid #e5e7eb",
        background: isActive ? "#f5f3ff" : "#fff",
        color: isActive ? "#7c3aed" : "#6b7280",
        fontSize: 13,
        fontWeight: isActive ? 600 : 400,
        cursor: "pointer",
    };
}

// HELPER: getSubmitButtonStyle
// Returns the inline style for the primary save/submit button inside a modal.
// Gray when loading (disabled), purple when ready.

function getSubmitButtonStyle(isLoading) {
    return {
        flex: 1,
        padding: "11px",
        borderRadius: 10,
        border: "none",
        background: isLoading ? "#c4b5fd" : "#7c3aed",
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        cursor: isLoading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    };
}

// HELPER: getMenuToggleButtonStyle
// Returns the inline style for the user menu button at the bottom
// of the sidebar. Gets a border/background when the menu is open.

function getMenuToggleButtonStyle(isOpen) {
    return {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 8,
        border: isOpen ? "1px solid #e5e7eb" : "1px solid transparent",
        background: isOpen ? "#f9fafb" : "transparent",
        cursor: "pointer",
        transition: "all 0.15s",
    };
}

// HELPER: getChevronStyle
// Returns the style for the small triangle arrow on the user menu button.
// Rotates 180° when the menu is open (pointing down → pointing up).

function getChevronStyle(isOpen) {
    return {
        fontSize: 10,
        color: "#9ca3af",
        transition: "transform 0.2s",
        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        flexShrink: 0,
    };
}

// COMPONENT: Badge
// A small colored pill showing a candidate's current status.
// Looks up the label and colors from STATUS_CONFIG.

function Badge({ status }) {
    let config = STATUS_CONFIG[status];

    // Fall back to "new" style if the status string is unrecognised
    if (!config) {
        config = STATUS_CONFIG.new;
    }

    const style = {
        fontSize: 11,
        padding: "3px 10px",
        borderRadius: 20,
        background: config.bg,
        color: config.color,
        fontWeight: 600,
    };

    return <span style={style}>{config.label}</span>;
}

// COMPONENT: EmptyState
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

// COMPONENT: SpinnerDot
// A small CSS-animated spinning circle shown inside buttons while saving.

function SpinnerDot() {
    return (
        <span style={{
            display: "inline-block",
            width: 14,
            height: 14,
            border: "2px solid rgba(255,255,255,0.4)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
        }} />
    );
}

// COMPONENT: Sidebar
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


    //Toggle menu open/closed

    function handleMenuToggle() {
        if (menuOpen) {
            setMenuOpen(false);
        } else {
            setMenuOpen(true);
        }
    }

    //Go to company tab from the user menu 

    function handleGoToCompany() {
        setActiveTab("company");
        setMenuOpen(false);
    }

    //Logout from the user menu

    function handleLogout() {
        setMenuOpen(false);
        onLogout();
    }

    //Render

    return (
        <aside style={{ width: 224, flexShrink: 0, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", minHeight: "100vh" }}>

            {/* Logo + subtitle */}
            <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ fontWeight: 700, fontSize: 20, color: "#7c3aed", letterSpacing: -0.5 }}>JobHot</div>
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

// COMPONENT: OverviewTab
// The dashboard home screen. Shows four stat cards and two
// "recent items" panels (jobs and candidates).
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

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Tổng quan</h2>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "#6b7280" }}>Chào mừng trở lại! Đây là tình hình tuyển dụng hôm nay.</p>

            {/*  Four stat cards  */}
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

            {/*  Two recent-items panels side by side  */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                {/* Recent jobs panel */}
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>Tin tuyển dụng gần đây</h3>
                        <button onClick={function () { setActiveTab("jobs"); }} style={{ fontSize: 12, color: "#7c3aed", border: "none", background: "none", cursor: "pointer", fontWeight: 500 }}>
                            Xem tất cả →
                        </button>
                    </div>
                    {jobs.slice(0, 3).map(function (job) {
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
                    {candidates.slice(0, 4).map(function (candidate) {
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

// COMPONENT: JobFormModal
// A full-screen overlay modal for creating or editing a job listing.
// Clicking the dark backdrop also closes the modal.
//
// Props:
//   job     - the job object to edit, or null when creating a new one
//   onClose - called when the modal should be dismissed
//   onSave  - called with the finished job object when the form is saved

function JobFormModal({ job, onClose, onSave }) {

    // The empty template used when creating a brand-new job
    const emptyForm = {
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "Hà Nội",
        category: "Công nghệ thông tin",
        type: "Full-time",
        deadline: "",
    };

    // If a job was passed in, start with its values; otherwise use the empty template.
    // We can't use spread here, so we copy each field manually.
    let initialForm;

    if (job) {
        initialForm = {
            title: job.title,
            description: job.description,
            requirements: job.requirements,
            salary: job.salary,
            location: job.location,
            category: job.category,
            type: job.type,
            deadline: job.deadline,
        };
    } else {
        initialForm = emptyForm;
    }

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);


    //setField
    // Updates a single field in the form object without touching the others.
    // Because we can't use spread, we rebuild the object key by key.

    function setField(fieldName, value) {
        const updated = {
            title: form.title,
            description: form.description,
            requirements: form.requirements,
            salary: form.salary,
            location: form.location,
            category: form.category,
            type: form.type,
            deadline: form.deadline,
        };

        updated[fieldName] = value;
        setForm(updated);
    }


    //handleSave
    // Simulates a save delay, then calls onSave with the complete job object.
    // For editing: keeps the existing id, status, applicants, posted date.
    // For creating: generates a new id and sets defaults.

    async function handleSave(event) {
        event.preventDefault();
        setLoading(true);

        // Simulate network delay (remove this when connected to a real backend)
        await new Promise(function (resolve) { setTimeout(resolve, 900); });

        let savedJob;

        if (job) {
            // Editing an existing job — preserve its metadata fields
            savedJob = {
                title: form.title,
                description: form.description,
                requirements: form.requirements,
                salary: form.salary,
                location: form.location,
                category: form.category,
                type: form.type,
                deadline: form.deadline,
                id: job.id,
                status: job.status,
                applicants: job.applicants,
                posted: job.posted,
            };
        } else {
            // Creating a new job — generate id and set defaults
            savedJob = {
                title: form.title,
                description: form.description,
                requirements: form.requirements,
                salary: form.salary,
                location: form.location,
                category: form.category,
                type: form.type,
                deadline: form.deadline,
                id: "JP" + Date.now(),
                status: "active",
                applicants: 0,
                posted: new Date().toISOString().slice(0, 10),
            };
        }

        onSave(savedJob);
        setLoading(false);
        onClose();
    }

    //handleBackdropClick
    // Closes the modal when the user clicks the dark background area,
    // but not when they click inside the white dialog box.

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    //Modal title
    let modalTitle;

    if (job) {
        modalTitle = "Chỉnh sửa tin tuyển dụng";
    } else {
        modalTitle = "Tạo tin tuyển dụng mới";
    }


    //Save button label

    let saveButtonLabel;

    if (loading) {
        saveButtonLabel = "Đang lưu...";
    } else if (job) {
        saveButtonLabel = "Lưu thay đổi";
    } else {
        saveButtonLabel = "Đăng tuyển dụng";
    }

    //Render

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
                        <input value={form.title} onChange={function (e) { setField("title", e.target.value); }} required placeholder="VD: Lập Trình Viên Full Stack" style={inputStyle} />
                    </div>

                    {/* Salary + Location + Category + Type grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div>
                            {getFieldLabel("Mức lương")}
                            <input value={form.salary} onChange={function (e) { setField("salary", e.target.value); }} placeholder="VD: 20-35 triệu" style={inputStyle} />
                        </div>
                        <div>
                            {getFieldLabel("Địa điểm")}
                            <select value={form.location} onChange={function (e) { setField("location", e.target.value); }} style={inputStyle}>
                                {LOCATIONS.map(function (loc) { return <option key={loc}>{loc}</option>; })}
                            </select>
                        </div>
                        <div>
                            {getFieldLabel("Danh mục (tuỳ chọn)")}
                            <select value={form.category} onChange={function (e) { setField("category", e.target.value); }} style={inputStyle}>
                                {CATEGORIES.map(function (cat) { return <option key={cat}>{cat}</option>; })}
                            </select>
                        </div>
                        <div>
                            {getFieldLabel("Loại công việc")}
                            <select value={form.type} onChange={function (e) { setField("type", e.target.value); }} style={inputStyle}>
                                {JOB_TYPES.map(function (t) { return <option key={t}>{t}</option>; })}
                            </select>
                        </div>
                    </div>

                    {/* Deadline */}
                    <div>
                        {getFieldLabel("Deadline")}
                        <input type="date" value={form.deadline} onChange={function (e) { setField("deadline", e.target.value); }} style={inputStyle} />
                    </div>

                    {/* Description */}
                    <div>
                        {getFieldLabel("Mô tả công việc *")}
                        <textarea value={form.description} onChange={function (e) { setField("description", e.target.value); }} required rows={5} placeholder="Mô tả chi tiết về công việc, trách nhiệm..." style={{ ...inputStyle, resize: "vertical" }} />
                    </div>

                    {/* Requirements */}
                    <div>
                        {getFieldLabel("Yêu cầu kỹ năng *")}
                        <textarea value={form.requirements} onChange={function (e) { setField("requirements", e.target.value); }} required rows={4} placeholder="Liệt kê các yêu cầu (mỗi yêu cầu một dòng)..." style={{ ...inputStyle, resize: "vertical" }} />
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

// COMPONENT: DeleteModal
// A confirmation dialog shown before permanently deleting a job.
// Clicking the backdrop cancels the delete.
//
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

// COMPONENT: JobsTab
// Lists all job postings with filter buttons and per-job action buttons.
// Manages the create/edit form modal and the delete confirmation modal.
//
// Props:
//   jobs    - the jobs array from root state
//   setJobs - setter to update the jobs array

function JobsTab({ jobs, setJobs }) {
    const [showForm, setShowForm] = useState(false);
    const [editJob, setEditJob] = useState(null);    // null = create new
    const [deleteJob, setDeleteJob] = useState(null);    // null = no pending delete
    const [filter, setFilter] = useState("all");   // "all" | "active" | "closed"


    //Filter the jobs list
    // "all" shows everything, otherwise only jobs matching the status.

    let filteredJobs;

    if (filter === "all") {
        filteredJobs = jobs;
    } else {
        filteredJobs = jobs.filter(function (j) { return j.status === filter; });
    }


    //handleSave
    // Called by JobFormModal when the user saves.
    // If the job already exists (matched by id), replace it.
    // If it is new, prepend it to the list.

    function handleSave(savedJob) {
        const exists = jobs.find(function (j) { return j.id === savedJob.id; });

        if (exists) {
            // Replace the existing job
            const updated = jobs.map(function (j) {
                if (j.id === savedJob.id) {
                    return savedJob;
                }
                return j;
            });
            setJobs(updated);
        } else {
            // Prepend the new job
            const updated = [savedJob].concat(jobs);
            setJobs(updated);
        }
    }


    //handleDelete
    // Removes the job currently stored in deleteJob from the list.

    function handleDelete() {
        const updated = jobs.filter(function (j) { return j.id !== deleteJob.id; });
        setJobs(updated);
        setDeleteJob(null);
    }


    //handleToggleStatus
    // Flips a job between "active" and "closed".

    function handleToggleStatus(id) {
        const updated = jobs.map(function (j) {
            if (j.id !== id) {
                return j;
            }

            // Build the updated job object field by field (no spread)
            const toggled = {
                id: j.id,
                title: j.title,
                description: j.description,
                requirements: j.requirements,
                salary: j.salary,
                location: j.location,
                category: j.category,
                type: j.type,
                deadline: j.deadline,
                posted: j.posted,
                applicants: j.applicants,
                status: j.status === "active" ? "closed" : "active",
            };

            return toggled;
        });

        setJobs(updated);
    }


    //handleOpenCreate
    // Opens the form modal in "create new" mode.

    function handleOpenCreate() {
        setEditJob(null);
        setShowForm(true);
    }


    //handleOpenEdit
    // Opens the form modal in "edit" mode for the given job.

    function handleOpenEdit(job) {
        setEditJob(job);
        setShowForm(true);
    }


    //Render

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

                                        {/* Meta row: salary, location, type, deadline, applicants */}
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                                            <span style={{ fontSize: 12, color: "#6b7280" }}>💰 {job.salary}</span>
                                            <span style={{ fontSize: 12, color: "#6b7280" }}>📍 {job.location}</span>
                                            <span style={{ fontSize: 12, color: "#6b7280" }}>💼 {job.type}</span>
                                            <span style={{ fontSize: 12, color: "#6b7280" }}>📅 Deadline: {job.deadline ? formatDate(job.deadline) : "-"}</span>
                                            <span style={{ fontSize: 12, color: "#6b7280" }}>👥 {job.applicants} ứng viên</span>
                                        </div>

                                        <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>
                                            {job.description.slice(0, 120)}…
                                        </p>
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

// COMPONENT: CVModal
// A full-screen overlay showing a candidate's full profile.
//
// Props:
//   candidate - the candidate object to display
//   onClose   - called when the modal should be dismissed

function CVModal({ candidate, onClose }) {

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            onClose();
        }
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
                        <span style={{ color: "#7c3aed", fontWeight: 500, cursor: "pointer" }}>
                            CV_{candidate.name.replace(/ /g, "_")}.pdf
                        </span>
                        <span style={{ marginLeft: 8, color: "#9ca3af" }}>(Demo - chưa tích hợp backend)</span>
                    </div>

                </div>
            </div>
        </div>
    );
}

// COMPONENT: CandidatesTab
// Lists all candidates with filters by job and by status.
// Each row has a status dropdown and a "Xem CV" button.
//
// Props:
//   candidates    - the candidates array from root state
//   setCandidates - setter to update a candidate's status
//   jobs          - used to resolve the job title for each candidate row

function CandidatesTab({ candidates, setCandidates, jobs }) {
    const [viewCV, setViewCV] = useState(null);   // candidate to show in CVModal, or null
    const [filterJob, setFilterJob] = useState("all");  // "all" or a job id like "JP001"
    const [filterStatus, setFilterStatus] = useState("all");  // "all" or a status key

    //  Filter the candidates list

    const filteredCandidates = candidates.filter(function (candidate) {
        const jobMatch = filterJob === "all" || candidate.appliedJob === filterJob;
        const statusMatch = filterStatus === "all" || candidate.status === filterStatus;
        return jobMatch && statusMatch;
    });


    //  updateStatus 
    // Changes a single candidate's status without touching the others.

    function updateStatus(id, newStatus) {
        const updated = candidates.map(function (candidate) {
            if (candidate.id !== id) {
                return candidate;
            }

            // Build a new candidate object with the updated status
            return {
                id: candidate.id,
                name: candidate.name,
                position: candidate.position,
                experience: candidate.experience,
                skills: candidate.skills,
                location: candidate.location,
                email: candidate.email,
                phone: candidate.phone,
                appliedJob: candidate.appliedJob,
                appliedDate: candidate.appliedDate,
                bio: candidate.bio,
                education: candidate.education,
                status: newStatus,
            };
        });

        setCandidates(updated);
    }


    //  Render 

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
                <select value={filterJob} onChange={function (e) { setFilterJob(e.target.value); }} style={{ ...inputStyle, width: "auto", fontSize: 13 }}>
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
                <select value={filterStatus} onChange={function (e) { setFilterStatus(e.target.value); }} style={{ ...inputStyle, width: "auto", fontSize: 13 }}>
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

                        // Find the job this candidate applied to (to show its title)
                        let jobTitle = "N/A";
                        const appliedJob = jobs.find(function (j) { return j.id === candidate.appliedJob; });

                        if (appliedJob && appliedJob.title) {
                            jobTitle = appliedJob.title.slice(0, 35) + "…";
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
                                                {candidate.skills.slice(0, 3).map(function (skill) {
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
                                        <select value={candidate.status} onChange={function (e) { updateStatus(candidate.id, e.target.value); }} style={{ ...inputStyle, width: "auto", fontSize: 12, padding: "6px 10px" }}>
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


// COMPONENT: TalentTab
// A search panel that filters the talent pool by skill, experience, and location.

function TalentTab() {
    // search holds the three filter values
    const [searchSkill, setSearchSkill] = useState("");
    const [searchExperience, setSearchExperience] = useState("Tất cả");
    const [searchLocation, setSearchLocation] = useState("Tất cả");
    const [results, setResults] = useState(MOCK_TALENT_POOL);
    const [hasSearched, setHasSearched] = useState(false);


    //  handleSearch 
    // Filters the talent pool and updates the results state.

    function handleSearch() {
        const keyword = searchSkill.toLowerCase();

        const filtered = MOCK_TALENT_POOL.filter(function (talent) {
            // Skill/position match — true if no keyword was typed
            let skillMatch = true;

            if (keyword !== "") {
                const positionMatch = talent.position.toLowerCase().includes(keyword);
                const hasSkill = talent.skills.some(function (skill) {
                    return skill.toLowerCase().includes(keyword);
                });
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

            return skillMatch && experienceMatch && locationMatch;
        });

        setResults(filtered);
        setHasSearched(true);
    }


    //  handleKeyDown 
    // Triggers the search when Enter is pressed in the skill input.

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            handleSearch();
        }
    }

    //  Render 

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
                        <input
                            value={searchSkill}
                            onChange={function (e) { setSearchSkill(e.target.value); }}
                            placeholder="React, Python, Designer..."
                            style={inputStyle}
                            onKeyDown={handleKeyDown}
                        />
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

// COMPONENT: CompanyTab
// A form for editing the employer's company profile.
// Shows a toast-style "Đã lưu!" confirmation after saving.

function CompanyTab() {
    const [company, setCompany] = useState({
        name: "Công ty JobHot",
        description: "Nền tảng tuyển dụng hàng đầu Việt Nam, kết nối hàng triệu ứng viên với các nhà tuyển dụng uy tín trên cả nước.",
        address: "Tòa nhà FLC, 18 Phạm Hùng, Nam Từ Liêm, Hà Nội",
        website: "https://jobhot.vn",
        size: "50-100 nhân viên",
        industry: "Công nghệ thông tin",
        email: "hr@jobhot.vn",
        phone: "024 1234 5678",
    });

    const [saved, setSaved] = useState(false);  // true for 2.5s after saving

    //  setField 
    // Updates a single field in the company object.
    // Rebuilds the whole object manually (no spread).

    function setField(fieldName, value) {
        const updated = {
            name: company.name,
            description: company.description,
            address: company.address,
            website: company.website,
            size: company.size,
            industry: company.industry,
            email: company.email,
            phone: company.phone,
        };

        updated[fieldName] = value;
        setCompany(updated);
    }


    //  handleSave 
    // Shows the "Đã lưu!" confirmation for 2.5 seconds.

    function handleSave(event) {
        event.preventDefault();
        setSaved(true);
        setTimeout(function () { setSaved(false); }, 2500);
    }

    //  Save button label

    let saveButtonLabel;

    if (saved) {
        saveButtonLabel = "✓ Đã lưu!";
    } else {
        saveButtonLabel = "Lưu thay đổi";
    }

    //  Render 

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 24, maxWidth: 720 }}>

            {/* Company logo + name header */}
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
                <div style={{ width: 68, height: 68, borderRadius: 16, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700 }}>
                    CT
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>{company.name}</h2>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>{company.industry} · {company.size}</div>
                </div>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                {getSectionTitle("Thông tin cơ bản")}

                {/* Two-column grid of basic fields */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                        {getFieldLabel("Tên công ty *")}
                        <input value={company.name} onChange={function (e) { setField("name", e.target.value); }} required style={inputStyle} />
                    </div>
                    <div>
                        {getFieldLabel("Website")}
                        <input value={company.website} onChange={function (e) { setField("website", e.target.value); }} placeholder="https://..." style={inputStyle} />
                    </div>
                    <div>
                        {getFieldLabel("Email liên hệ")}
                        <input type="email" value={company.email} onChange={function (e) { setField("email", e.target.value); }} style={inputStyle} />
                    </div>
                    <div>
                        {getFieldLabel("Số điện thoại")}
                        <input value={company.phone} onChange={function (e) { setField("phone", e.target.value); }} style={inputStyle} />
                    </div>
                    <div>
                        {getFieldLabel("Ngành nghề")}
                        <select value={company.industry} onChange={function (e) { setField("industry", e.target.value); }} style={inputStyle}>
                            {CATEGORIES.map(function (cat) { return <option key={cat}>{cat}</option>; })}
                        </select>
                    </div>
                    <div>
                        {getFieldLabel("Quy mô")}
                        <select value={company.size} onChange={function (e) { setField("size", e.target.value); }} style={inputStyle}>
                            {COMPANY_SIZES.map(function (size) { return <option key={size}>{size}</option>; })}
                        </select>
                    </div>
                </div>

                {/* Address */}
                <div>
                    {getFieldLabel("Địa chỉ *")}
                    <input value={company.address} onChange={function (e) { setField("address", e.target.value); }} required style={inputStyle} />
                </div>

                {/* Description */}
                <div>
                    {getFieldLabel("Mô tả công ty *")}
                    <textarea
                        value={company.description}
                        onChange={function (e) { setField("description", e.target.value); }}
                        required
                        rows={5}
                        placeholder="Mô tả về công ty, văn hóa, sứ mệnh..."
                        style={{ ...inputStyle, resize: "vertical" }}
                    />
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

// COMPONENT: EmployerDashboard  (root / entry point)
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


    //  handleLogout 
    // Clears the stored token and redirects to the login page.

    function handleLogout() {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }


    //  Active job count 
    // Shown in the top bar badge.

    const activeJobCount = jobs.filter(function (j) { return j.status === "active"; }).length;


    //  Render 

    return (
        <>
            {/* Global CSS: the spin animation and box-sizing reset */}
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