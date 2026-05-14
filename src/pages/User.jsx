import { useState, useRef, useEffect } from "react";

const MOCK_JOBS = [
    {
        id: "JB001",
        title: "Lập Trình Viên Full Stack - ReactJS & Node.js",
        company: "Công ty Công Nghệ FPT",
        salary: "20-35 triệu",
        location: "Hà Nội",
        type: "Full-time",
        category: "Công nghệ thông tin",
        experience: "2-3 năm",
        remote: false,
        deadline: "2026-06-15",
        logo: null,
        description: "Phát triển và duy trì các ứng dụng web sử dụng ReactJS ở frontend và Node.js ở backend. Tham gia thiết kế kiến trúc hệ thống, review code và mentor junior developer.",
        requirements: "• Tối thiểu 2 năm kinh nghiệm với React, Node.js\n• Thành thạo TypeScript, REST API, Git\n• Có kinh nghiệm với PostgreSQL hoặc MongoDB\n• Kỹ năng giao tiếp tốt, làm việc nhóm hiệu quả",
        posted: "2026-05-01"
    },
    {
        id: "JB002",
        title: "Nhân Viên Kế Toán Tổng Hợp",
        company: "Tập Đoàn Vingroup",
        salary: "12-18 triệu",
        location: "Hồ Chí Minh",
        type: "Full-time",
        category: "Kế toán / Kiểm toán",
        experience: "1-2 năm",
        remote: false,
        deadline: "2026-06-10",
        logo: null,
        description: "Thực hiện các nghiệp vụ kế toán tổng hợp, lập báo cáo tài chính định kỳ, kiểm soát chi phí và doanh thu theo quy định.",
        requirements: "• Tốt nghiệp chuyên ngành Kế toán, Tài chính\n• Thành thạo Excel, phần mềm kế toán MISA/Fast\n• Hiểu biết về thuế GTGT, thuế TNDN\n• Cẩn thận, trung thực, chịu áp lực tốt",
        posted: "2026-05-03"
    },
    {
        id: "JB003",
        title: "Kỹ Sư Dữ Liệu (Data Engineer)",
        company: "Công ty TNHH Samsung Vina",
        salary: "30-50 triệu",
        location: "Hà Nội",
        type: "Full-time",
        category: "Công nghệ thông tin",
        experience: "3-5 năm",
        remote: true,
        deadline: "2026-06-20",
        logo: null,
        description: "Xây dựng và vận hành pipeline dữ liệu quy mô lớn. Thiết kế data warehouse, tối ưu hóa truy vấn và đảm bảo chất lượng dữ liệu.",
        requirements: "• Trên 3 năm kinh nghiệm với Spark, Airflow, Kafka\n• Thành thạo SQL và Python\n• Kinh nghiệm với cloud (AWS/GCP/Azure)\n• Tư duy phân tích, giải quyết vấn đề tốt",
        posted: "2026-05-05"
    },
    {
        id: "JB004",
        title: "Nhân Viên Marketing Digital",
        company: "Công ty Truyền Thông Admicro",
        salary: "10-15 triệu",
        location: "Đà Nẵng",
        type: "Full-time",
        category: "Marketing / PR",
        experience: "1-2 năm",
        remote: true,
        deadline: "2026-05-30",
        logo: null,
        description: "Lên kế hoạch và triển khai chiến dịch marketing đa kênh (Facebook, Google, TikTok). Phân tích hiệu quả chiến dịch và tối ưu ngân sách quảng cáo.",
        requirements: "• Có kinh nghiệm chạy quảng cáo Facebook/Google Ads\n• Hiểu biết về SEO, Content Marketing\n• Kỹ năng phân tích số liệu, sử dụng Google Analytics\n• Sáng tạo, năng động, chủ động trong công việc",
        posted: "2026-05-02"
    },
    {
        id: "JB005",
        title: "Thiết Kế UX/UI - Mobile App",
        company: "Công ty Cổ Phần MOMO",
        salary: "18-28 triệu",
        location: "Hồ Chí Minh",
        type: "Full-time",
        category: "Thiết kế",
        experience: "2-3 năm",
        remote: false,
        deadline: "2026-06-25",
        logo: null,
        description: "Nghiên cứu người dùng, tạo wireframe và prototype cho ứng dụng mobile. Làm việc chặt chẽ với team product và developer để đảm bảo trải nghiệm người dùng tốt nhất.",
        requirements: "• Thành thạo Figma, Adobe XD\n• Có portfolio thể hiện kinh nghiệm thiết kế mobile\n• Hiểu biết về design system, component library\n• Kỹ năng tư duy người dùng, empathy tốt",
        posted: "2026-05-06"
    },
    {
        id: "JB006",
        title: "Nhân Viên Kinh Doanh Bất Động Sản",
        company: "Vinhomes JSC",
        salary: "10-40 triệu (thưởng KPI)",
        location: "Hà Nội",
        type: "Full-time",
        category: "Kinh doanh / Bán hàng",
        experience: "Không yêu cầu",
        remote: false,
        deadline: "2026-06-01",
        logo: null,
        description: "Tư vấn, tiếp thị và bán các sản phẩm bất động sản của Vinhomes. Xây dựng và duy trì mối quan hệ khách hàng, đạt chỉ tiêu doanh số hàng tháng.",
        requirements: "• Ưu tiên có kinh nghiệm kinh doanh BĐS\n• Kỹ năng giao tiếp, thuyết phục xuất sắc\n• Ngoại hình ưa nhìn, phong cách chuyên nghiệp\n• Có xe máy, điện thoại cá nhân",
        posted: "2026-05-04"
    },
    {
        id: "JB007",
        title: "Lập Trình Viên Backend - Python/Django",
        company: "Topdev Vietnam",
        salary: "22-38 triệu",
        location: "Hà Nội",
        type: "Full-time",
        category: "Công nghệ thông tin",
        experience: "2-3 năm",
        remote: true,
        deadline: "2026-07-01",
        logo: null,
        description: "Phát triển API và microservices sử dụng Python/Django. Tham gia thiết kế database, tối ưu performance và đảm bảo bảo mật hệ thống.",
        requirements: "• Tối thiểu 2 năm kinh nghiệm Python/Django hoặc FastAPI\n• Kinh nghiệm với PostgreSQL, Redis\n• Hiểu biết về Docker, Kubernetes\n• Có kinh nghiệm viết unit test",
        posted: "2026-05-07"
    },
    {
        id: "JB008",
        title: "Nhân Viên Chăm Sóc Khách Hàng (Part-time)",
        company: "Shopee Vietnam",
        salary: "6-9 triệu",
        location: "Hồ Chí Minh",
        type: "Part-time",
        category: "Dịch vụ khách hàng",
        experience: "Không yêu cầu",
        remote: true,
        deadline: "2026-05-28",
        logo: null,
        description: "Hỗ trợ và giải đáp thắc mắc của khách hàng qua chat và email. Ca làm việc linh hoạt, phù hợp sinh viên.",
        requirements: "• Giao tiếp tốt, kiên nhẫn, thân thiện\n• Biết sử dụng máy tính cơ bản\n• Không yêu cầu kinh nghiệm, có đào tạo\n• Có thể làm cuối tuần",
        posted: "2026-05-08"
    },
    {
        id: "JB009",
        title: "Chuyên Viên Nhân Sự (HR Specialist)",
        company: "Tập Đoàn TH True Milk",
        salary: "12-20 triệu",
        location: "Hà Nội",
        type: "Full-time",
        category: "Nhân sự",
        experience: "2-3 năm",
        remote: false,
        deadline: "2026-06-18",
        logo: null,
        description: "Triển khai các hoạt động tuyển dụng, onboarding, đào tạo và đánh giá hiệu suất nhân viên. Hỗ trợ xây dựng văn hóa doanh nghiệp.",
        requirements: "• Tốt nghiệp chuyên ngành Quản trị Nhân lực, Luật lao động\n• Có kinh nghiệm sử dụng phần mềm HRM\n• Hiểu biết Luật lao động Việt Nam\n• Kỹ năng giao tiếp, tổ chức tốt",
        posted: "2026-05-03"
    },
];

const CATEGORIES = ["Tất cả", "Công nghệ thông tin", "Kế toán / Kiểm toán", "Marketing / PR", "Thiết kế", "Kinh doanh / Bán hàng", "Dịch vụ khách hàng", "Nhân sự"];
const EXPERIENCES = ["Tất cả", "Không yêu cầu", "1-2 năm", "2-3 năm", "3- năm"];
const JOB_TYPES = ["Tất cả", "Full-time", "Part-time", "Freelancer", "Thực tập"];
const LOCATIONS = ["Tất cả", "Hà Nội", "Hồ Chí Minh", "Đà Nẵng"];


//Helper: Lấy 2 chữ cái đầu của 2 từ cuối trong tên
const initials = (name) => {
    const words = name.split(" ");
    const lastTwo = words.slice(-2);
    let result = '';
    for (let i = 0; i < lastTwo.length; i++) {
        result = result + lastTwo[i][0];
    }
    return result.toUpperCase();
};


//Helper: Tính số ngày còn lại đến deadline
const daysLeft = (deadline) => {
    const diff = new Date(deadline) - new Date();
    const days = Math.ceil(diff / 86400000);
    if (days > 0) {
        return days;
    }
    return 0;
};


//Sidebar
const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();

    // Đóng dropdown khi click ra ngoài vùng menu
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const tabs = [
        { id: "jobs", icon: "💼", label: "Tìm việc làm" },
        { id: "saved", icon: "🔖", label: "Việc đã lưu" },
        { id: "profile", icon: "👤", label: "Hồ sơ cá nhân" },
    ];

    // Bật/tắt dropdown menu người dùng
    const toggleMenu = () => {
        if (menuOpen) {
            setMenuOpen(false);
        } else {
            setMenuOpen(true);
        }
    };

    const handleGoToProfile = () => {
        setActiveTab("profile");
        setMenuOpen(false);
    };

    const handleLogoutClick = () => {
        setMenuOpen(false);
        onLogout();
    };

    // Xác định style border và background của nút user theo trạng thái menuOpen
    let userButtonBorder = "1px solid transparent";
    let userButtonBackground = "transparent";
    if (menuOpen) {
        userButtonBorder = "1px solid #e5e7eb";
        userButtonBackground = "#f9fafb";
    }

    // Xác định hướng xoay của mũi tên dropdown
    let arrowTransform = "rotate(0deg)";
    if (menuOpen) {
        arrowTransform = "rotate(180deg)";
    }

    return (
        <aside style={{ width: 220, flexShrink: 0, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ fontWeight: 700, fontSize: 20, color: "#7c3aed", letterSpacing: -0.5 }}>JobHot</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Trang người tìm việc</div>
            </div>

            {/* Các tab điều hướng */}
            <nav style={{ flex: 1, padding: "12px 12px" }}>
                {tabs.map((t) => {
                    // Xác định style của từng tab dựa theo tab đang active
                    let tabFontWeight = 400;
                    let tabBackground = "transparent";
                    let tabColor = "#374151";
                    if (activeTab === t.id) {
                        tabFontWeight = 600;
                        tabBackground = "#f5f3ff";
                        tabColor = "#7c3aed";
                    }

                    return (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            style={{
                                width: "100%", display: "flex", alignItems: "center", gap: 10,
                                padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                                textAlign: "left", fontSize: 14, marginBottom: 4, transition: "all 0.15s",
                                fontWeight: tabFontWeight,
                                background: tabBackground,
                                color: tabColor,
                            }}
                        >
                            <span style={{ fontSize: 16 }}>{t.icon}</span>
                            {t.label}
                        </button>
                    );
                })}
            </nav>

            {/* Khu vực người dùng với dropdown */}
            <div style={{ padding: "12px 12px", borderTop: "1px solid #f3f4f6", position: "relative" }} ref={menuRef}>
                <button
                    onClick={toggleMenu}
                    style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 10px", borderRadius: 8, cursor: "pointer",
                        textAlign: "left", transition: "all 0.15s",
                        border: userButtonBorder,
                        background: userButtonBackground,
                    }}
                >
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>NV</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Nguyễn Văn A</div>
                        <div style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>ngvana@email.com</div>
                    </div>
                    <span style={{ fontSize: 10, color: "#9ca3af", transition: "transform 0.2s", transform: arrowTransform, flexShrink: 0 }}>▲</span>
                </button>

                {menuOpen && (
                    <div style={{ position: "absolute", bottom: "calc(100% - 8px)", left: 12, right: 12, background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)", overflow: "hidden", zIndex: 50 }}>
                        <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid #f3f4f6" }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Nguyễn Văn A</div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>ngvana@email.com</div>
                        </div>
                        <div style={{ padding: "6px" }}>
                            <button
                                onClick={handleGoToProfile}
                                style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 7, border: "none", background: "transparent", cursor: "pointer", fontSize: 13, color: "#374151", textAlign: "left", transition: "background 0.12s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                <span style={{ fontSize: 15 }}>👤</span> Hồ sơ cá nhân
                            </button>
                            <button
                                onClick={handleLogoutClick}
                                style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 7, border: "none", background: "transparent", cursor: "pointer", fontSize: 13, color: "#ef4444", textAlign: "left", transition: "background 0.12s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#fff1f2"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                <span style={{ fontSize: 15 }}>🚪</span> Đăng xuất
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};


//JobCard
const JobCard = ({ job, saved, onSave, onView }) => {
    const days = daysLeft(job.deadline);

    // Xác định màu và độ đậm của chữ "Còn X ngày" theo mức độ gấp
    let daysColor = "#9ca3af";
    let daysWeight = 400;
    if (days <= 7) {
        daysColor = "#ef4444";
        daysWeight = 600;
    }

    // Xác định icon và màu cho nút lưu
    let saveIcon = "🤍";
    let saveColor = "#d1d5db";
    if (saved) {
        saveIcon = "❤️";
        saveColor = "#ef4444";
    }

    const handleMouseEnterCard = (e) => {
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.10)";
        e.currentTarget.style.transform = "translateY(-2px)";
    };

    const handleMouseLeaveCard = (e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
    };

    const handleMouseEnterViewBtn = (e) => {
        e.currentTarget.style.background = "#7c3aed";
        e.currentTarget.style.color = "#fff";
    };

    const handleMouseLeaveViewBtn = (e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "#7c3aed";
    };

    const handleSaveClick = (e) => {
        e.stopPropagation();
        onSave(job.id);
    };

    return (
        <div
            style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18, display: "flex", flexDirection: "column", gap: 10, transition: "box-shadow 0.15s, transform 0.15s", cursor: "pointer" }}
            onMouseEnter={handleMouseEnterCard}
            onMouseLeave={handleMouseLeaveCard}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#7c3aed", flexShrink: 0 }}>
                        {initials(job.company)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#111827", lineHeight: 1.35, marginBottom: 3 }} onClick={() => onView(job)}>
                            {job.title}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{job.company}</div>
                    </div>
                </div>

                {/* Nút lưu / bỏ lưu việc làm */}
                <button
                    onClick={handleSaveClick}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: saveColor, flexShrink: 0, padding: 0, transition: "color 0.15s" }}
                >
                    {saveIcon}
                </button>
            </div>

            {/* Nhãn: lương, địa điểm, loại việc, remote */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: "#f0fdf4", color: "#15803d", fontWeight: 500 }}>💰 {job.salary}</span>
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: "#eff6ff", color: "#1d4ed8", fontWeight: 500 }}>📍 {job.location}</span>
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: "#faf5ff", color: "#7e22ce", fontWeight: 500 }}>{job.type}</span>
                {job.remote && <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: "#ecfdf5", color: "#047857", fontWeight: 500 }}>🌐 Remote</span>}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>Kinh nghiệm: {job.experience}</span>
                <span style={{ fontSize: 11, color: daysColor, fontWeight: daysWeight }}>Còn {days} ngày</span>
            </div>

            <button
                onClick={() => onView(job)}
                style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #7c3aed", background: "transparent", color: "#7c3aed", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={handleMouseEnterViewBtn}
                onMouseLeave={handleMouseLeaveViewBtn}
            >
                Xem chi tiết
            </button>
        </div>
    );
};


//Jobs Tab
const JobsTab = ({ savedIds, onSave, onView }) => {
    const [keyword, setKeyword] = useState("");
    const [sort, setSort] = useState("newest");
    const [showFilters, setShowFilters] = useState(true);
    const [filters, setFilters] = useState({
        category: "Tất cả",
        experience: "Tất cả",
        type: "Tất cả",
        location: "Tất cả",
        remote: false,
    });

    // Cập nhật một trường trong bộ lọc mà không dùng spread
    const updateFilter = (key, value) => {
        const newFilters = {
            category: filters.category,
            experience: filters.experience,
            type: filters.type,
            location: filters.location,
            remote: filters.remote,
        };
        newFilters[key] = value;
        setFilters(newFilters);
    };

    // Xóa toàn bộ bộ lọc về mặc định
    const clearFilters = () => {
        setFilters({
            category: "Tất cả",
            experience: "Tất cả",
            type: "Tất cả",
            location: "Tất cả",
            remote: false,
        });
    };

    // Bật/tắt hiển thị bảng bộ lọc
    const toggleFilters = () => {
        if (showFilters) {
            setShowFilters(false);
        } else {
            setShowFilters(true);
        }
    };

    // Lọc danh sách việc làm theo từ khóa và bộ lọc
    const filteredJobs = [];
    for (let i = 0; i < MOCK_JOBS.length; i++) {
        const job = MOCK_JOBS[i];
        const keywordLower = keyword.toLowerCase();

        // Kiểm tra từ khóa (khớp tiêu đề, tên công ty, hoặc Job ID)
        let matchKeyword = true;
        if (keywordLower) {
            const matchTitle = job.title.toLowerCase().includes(keywordLower);
            const matchCompany = job.company.toLowerCase().includes(keywordLower);
            const matchId = job.id.toLowerCase().includes(keywordLower);
            matchKeyword = matchTitle || matchCompany || matchId;
        }

        // Kiểm tra danh mục
        let matchCategory = true;
        if (filters.category !== "Tất cả") {
            matchCategory = job.category === filters.category;
        }

        // Kiểm tra kinh nghiệm
        let matchExperience = true;
        if (filters.experience !== "Tất cả") {
            matchExperience = job.experience === filters.experience;
        }

        // Kiểm tra loại công việc
        let matchType = true;
        if (filters.type !== "Tất cả") {
            matchType = job.type === filters.type;
        }

        // Kiểm tra địa điểm
        let matchLocation = true;
        if (filters.location !== "Tất cả") {
            matchLocation = job.location === filters.location;
        }

        // Kiểm tra remote
        let matchRemote = true;
        if (filters.remote) {
            matchRemote = job.remote;
        }

        const allMatch = matchKeyword && matchCategory && matchExperience && matchType && matchLocation && matchRemote;
        if (allMatch) {
            filteredJobs.push(job);
        }
    }

    // Sắp xếp kết quả
    if (sort === "newest") {
        filteredJobs.sort((a, b) => new Date(b.posted) - new Date(a.posted));
    } else {
        // Sắp xếp theo lương cao → thấp
        filteredJobs.sort((a, b) => {
            const getSalary = (s) => parseInt(s.replace(/[^\d]/g, "")) || 0;
            return getSalary(b.salary) - getSalary(a.salary);
        });
    }

    // Style chung cho các dropdown bộ lọc
    const selectStyle = { fontSize: 13, padding: "7px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", cursor: "pointer", width: "100%" };

    // Style riêng cho dropdown sắp xếp (không full width)
    const sortSelectStyle = { fontSize: 13, padding: "7px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", cursor: "pointer", width: "auto" };

    // Xác định chữ và màu nút bật/tắt bộ lọc
    let filterButtonText = "⚙ Bộ lọc";
    let filterButtonBackground = "#fff";
    let filterButtonColor = "#374151";
    if (showFilters) {
        filterButtonText = "✕ Ẩn lọc";
        filterButtonBackground = "#f5f3ff";
        filterButtonColor = "#7c3aed";
    }

    return (
        <div style={{ display: "flex", gap: 0, flex: 1, minHeight: 0 }}>

            {/* Bảng bộ lọc bên trái */}
            {showFilters && (
                <div style={{ width: 220, flexShrink: 0, padding: "20px 16px", borderRight: "1px solid #f3f4f6", overflowY: "auto" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>Bộ lọc</div>

                    {/* Bộ lọc: Danh mục */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>Danh mục</div>
                        <select value={filters.category} onChange={e => updateFilter("category", e.target.value)} style={selectStyle}>
                            {CATEGORIES.map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>

                    {/* Bộ lọc: Kinh nghiệm */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>Kinh nghiệm</div>
                        <select value={filters.experience} onChange={e => updateFilter("experience", e.target.value)} style={selectStyle}>
                            {EXPERIENCES.map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>

                    {/* Bộ lọc: Loại công việc */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>Loại công việc</div>
                        <select value={filters.type} onChange={e => updateFilter("type", e.target.value)} style={selectStyle}>
                            {JOB_TYPES.map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>

                    {/* Bộ lọc: Địa điểm */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>Địa điểm</div>
                        <select value={filters.location} onChange={e => updateFilter("location", e.target.value)} style={selectStyle}>
                            {LOCATIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>

                    {/* Checkbox: Chỉ hiện việc Remote */}
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#374151" }}>
                        <input type="checkbox" checked={filters.remote} onChange={e => updateFilter("remote", e.target.checked)} />
                        Chỉ Remote
                    </label>

                    <button onClick={clearFilters} style={{ marginTop: 16, width: "100%", padding: "7px", borderRadius: 8, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", fontSize: 12, cursor: "pointer" }}>
                        Xóa bộ lọc
                    </button>
                </div>
            )}

            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

                {/* Thanh tìm kiếm, sắp xếp và nút bộ lọc */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#9ca3af" }}>🔍</span>
                        <input
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            placeholder="Tìm theo từ khóa, công ty, Job ID..."
                            style={{ width: "100%", padding: "8px 10px 8px 34px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                        />
                    </div>
                    <select value={sort} onChange={e => setSort(e.target.value)} style={sortSelectStyle}>
                        <option value="newest">Mới nhất</option>
                        <option value="salary">Lương cao → thấp</option>
                    </select>
                    <button onClick={toggleFilters} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12, cursor: "pointer", background: filterButtonBackground, color: filterButtonColor }}>
                        {filterButtonText}
                    </button>
                </div>

                <div style={{ padding: "12px 20px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>Tìm thấy <strong style={{ color: "#111827" }}>{filteredJobs.length}</strong> việc làm</span>
                </div>

                {/* Danh sách việc làm hoặc thông báo không tìm thấy */}
                <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 20px" }}>
                    {filteredJobs.length === 0 && (
                        <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🔎</div>
                            <div style={{ fontSize: 15, fontWeight: 500 }}>Không tìm thấy việc làm phù hợp</div>
                            <div style={{ fontSize: 13, marginTop: 6 }}>Thử thay đổi từ khóa hoặc bộ lọc</div>
                        </div>
                    )}
                    {filteredJobs.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                            {filteredJobs.map(j => <JobCard key={j.id} job={j} saved={savedIds.has(j.id)} onSave={onSave} onView={onView} />)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


//Job Detail Modal
const JobDetailModal = ({ job, saved, onSave, onClose, onApply }) => {
    if (!job) return null;

    const days = daysLeft(job.deadline);

    // Xác định icon cảnh báo cho card "Còn lại" khi gần deadline
    let daysIcon = "⏰";
    if (days <= 7) {
        daysIcon = "⚠️";
    }

    // Xác định icon và màu cho nút lưu
    let saveIcon = "🤍";
    let saveColor = "#9ca3af";
    if (saved) {
        saveIcon = "❤️";
        saveColor = "#ef4444";
    }

    // Đóng modal khi click vào vùng tối bên ngoài
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const cardStyle = { background: "#f9fafb", borderRadius: 10, padding: "12px 14px", textAlign: "center" };

    return (
        <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={handleBackdropClick}
        >
            <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 640, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

                {/* Header modal */}
                <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: 14, flex: 1 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 12, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "#7c3aed", flexShrink: 0 }}>
                            {initials(job.company)}
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>{job.title}</h2>
                            <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{job.company}</div>
                            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "#f0fdf4", color: "#15803d", fontWeight: 500 }}>💰 {job.salary}</span>
                                <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "#eff6ff", color: "#1d4ed8" }}>📍 {job.location}</span>
                                <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "#faf5ff", color: "#7e22ce" }}>{job.type}</span>
                                {job.remote && <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "#ecfdf5", color: "#047857" }}>🌐 Remote</span>}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af", marginLeft: 8 }}>✕</button>
                </div>

                <div style={{ padding: "20px 24px" }}>
                    {/* 3 card thông tin: kinh nghiệm, deadline, còn lại */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                        <div style={cardStyle}>
                            <div style={{ fontSize: 18, marginBottom: 4 }}>🎯</div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Kinh nghiệm</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{job.experience}</div>
                        </div>
                        <div style={cardStyle}>
                            <div style={{ fontSize: 18, marginBottom: 4 }}>📅</div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Deadline</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{new Date(job.deadline).toLocaleDateString("vi-VN")}</div>
                        </div>
                        <div style={cardStyle}>
                            <div style={{ fontSize: 18, marginBottom: 4 }}>{daysIcon}</div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Còn lại</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{days} ngày</div>
                        </div>
                    </div>

                    <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: "#111827" }}>Mô tả công việc</h3>
                    <p style={{ margin: "0 0 20px", fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{job.description}</p>

                    <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: "#111827" }}>Yêu cầu</h3>
                    <p style={{ margin: "0 0 24px", fontSize: 13, color: "#374151", lineHeight: 1.9, whiteSpace: "pre-line" }}>{job.requirements}</p>

                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => onApply(job)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: "#7c3aed", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                            Ứng tuyển ngay
                        </button>
                        <button onClick={() => onSave(job.id)} style={{ padding: "11px 16px", borderRadius: 10, border: "1px solid #e5e7eb", background: "transparent", fontSize: 18, cursor: "pointer", color: saveColor }}>
                            {saveIcon}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


//Apply Modal
const ApplyModal = ({ job, onClose }) => {
    const [name, setName] = useState("Nguyễn Văn A");
    const [email, setEmail] = useState("ngvana@email.com");
    const [cover, setCover] = useState("");
    const [cvFile, setCvFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileRef = useRef();

    const handleClickUpload = () => {
        if (fileRef.current) {
            fileRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        setCvFile(e.target.files[0]);
    };

    // Đóng modal khi click vào vùng tối bên ngoài
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // TODO: Gửi hồ sơ ứng tuyển lên server PHP
        // Cách làm:
        //   1. Tạo FormData để có thể đính kèm file CV cùng với các trường text
        //   2. Gửi POST request đến file PHP (ví dụ: /api/apply.php)
        //   3. PHP lưu thông tin ứng tuyển (tên, email, jobId, cover letter) vào database
        //   4. Nếu có file CV thì PHP lưu file vào thư mục trên server
        //   5. PHP gửi email thông báo cho nhà tuyển dụng bằng PHPMailer
        //   6. Nếu thành công thì gọi setSubmitted(true) để hiện màn hình thành công
        //   7. Nếu thất bại thì hiện lỗi và tắt loading
        //
    };

    // Xác định chữ, màu nền và cursor của nút submit theo trạng thái loading
    let buttonText = "Gửi hồ sơ ứng tuyển";
    let buttonBackground = "#7c3aed";
    let buttonCursor = "pointer";
    if (loading) {
        buttonText = "Đang gửi...";
        buttonBackground = "#c4b5fd";
        buttonCursor = "not-allowed";
    }

    return (
        <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={handleBackdropClick}
        >
            <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 500, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>

                {/* Màn hình thành công sau khi gửi hồ sơ */}
                {submitted && (
                    <div style={{ padding: 40, textAlign: "center" }}>
                        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                        <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Ứng tuyển thành công!</h2>
                        <p style={{ margin: "0 0 24px", fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>Hồ sơ của bạn đã được gửi đến <strong>{job.company}</strong>. Chúng tôi sẽ liên hệ sớm nhất có thể.</p>
                        <button onClick={onClose} style={{ padding: "10px 32px", borderRadius: 10, border: "none", background: "#7c3aed", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                            Đóng
                        </button>
                    </div>
                )}

                {/* Form ứng tuyển */}
                {!submitted && (
                    <>
                        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Ứng tuyển</h2>
                                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{job.title} · {job.company}</div>
                            </div>
                            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                            {/* Trường họ và tên */}
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 5 }}>Họ và tên</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Nguyễn Văn A"
                                    required
                                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                                />
                            </div>

                            {/* Trường email */}
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 5 }}>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    required
                                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                                />
                            </div>

                            {/* Trường upload CV */}
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 5 }}>CV (PDF/DOC)</label>
                                <div
                                    onClick={handleClickUpload}
                                    style={{ border: "2px dashed #e5e7eb", borderRadius: 8, padding: "16px", textAlign: "center", cursor: "pointer", color: "#6b7280", fontSize: 13, transition: "border-color 0.15s" }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = "#7c3aed"}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                                >
                                    {cvFile && <span style={{ color: "#7c3aed", fontWeight: 500 }}>📎 {cvFile.name}</span>}
                                    {!cvFile && <span>📤 Nhấn để tải CV lên</span>}
                                </div>
                                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={handleFileChange} />
                            </div>

                            {/* Trường cover letter */}
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 5 }}>
                                    Cover Letter <span style={{ color: "#9ca3af", fontWeight: 400 }}>(tuỳ chọn)</span>
                                </label>
                                <textarea
                                    value={cover}
                                    onChange={e => setCover(e.target.value)}
                                    rows={4}
                                    placeholder="Giới thiệu bản thân và lý do bạn phù hợp với vị trí này..."
                                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{ padding: "11px", borderRadius: 10, border: "none", color: "#fff", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: buttonBackground, cursor: buttonCursor }}
                            >
                                {loading && <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />}
                                {buttonText}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};


//Saved Tab
const SavedTab = ({ savedIds, onSave, onView }) => {
    // Lọc ra chỉ những việc làm đã được lưu
    const savedJobs = MOCK_JOBS.filter(j => savedIds.has(j.id));

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Việc đã lưu</h2>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6b7280" }}>{savedJobs.length} việc làm</p>

            {/* Hiển thị khi chưa có việc nào được lưu */}
            {savedJobs.length === 0 && (
                <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
                    <div style={{ fontSize: 48, marginBottom: 14 }}>🔖</div>
                    <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>Chưa có việc làm nào được lưu</div>
                    <div style={{ fontSize: 13 }}>Nhấn vào ❤️ để lưu việc làm yêu thích</div>
                </div>
            )}

            {/* Hiển thị danh sách việc đã lưu */}
            {savedJobs.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                    {savedJobs.map(j => <JobCard key={j.id} job={j} saved={true} onSave={onSave} onView={onView} />)}
                </div>
            )}
        </div>
    );
};


//Profile Tab
const ProfileTab = () => {
    const [profile, setProfile] = useState({
        name: "Nguyễn Văn A",
        dob: "1999-05-15",
        gender: "Nam",
        phone: "0987654321",
        address: "Hà Nội",
        email: "ngvana@email.com",
        position: "Lập Trình Viên Full Stack",
        experience: "2-3 năm",
        skills: "React, Node.js, Python, SQL",
        industry: "Công nghệ thông tin",
        jobType: "Full-time",
        bio: "Lập trình viên đam mê công nghệ, có 2 năm kinh nghiệm phát triển web full stack.",
    });
    const [cvFile, setCvFile] = useState(null);
    const [saved, setSaved] = useState(false);
    const fileRef = useRef();

    // Cập nhật một trường trong profile mà không dùng spread
    const setField = (key, value) => {
        const newProfile = {
            name: profile.name,
            dob: profile.dob,
            gender: profile.gender,
            phone: profile.phone,
            address: profile.address,
            email: profile.email,
            position: profile.position,
            experience: profile.experience,
            skills: profile.skills,
            industry: profile.industry,
            jobType: profile.jobType,
            bio: profile.bio,
        };
        newProfile[key] = value;
        setProfile(newProfile);
    };

    const handleSave = (e) => {
        e.preventDefault();

        // TODO: Gửi thông tin hồ sơ lên server PHP để lưu
        // Cách làm:
        //   1. Tạo FormData để có thể đính kèm file CV (nếu có)
        //   2. Gửi POST request đến file PHP (ví dụ: /api/update-profile.php)
        //   3. PHP cập nhật thông tin người dùng trong database theo email/ID
        //   4. Nếu có file CV mới thì PHP lưu file vào thư mục trên server
        //   5. Nếu thành công thì hiện thông báo "Đã lưu" trong 2.5 giây
        //
        // const formData = new FormData();
        // formData.append('name', profile.name);
        // formData.append('email', profile.email);
        // formData.append('phone', profile.phone);
        // formData.append('dob', profile.dob);
        // ... (các trường còn lại)
        // if (cvFile) { formData.append('cv', cvFile); }
        // const response = await fetch('/api/update-profile.php', { method: 'POST', body: formData });
        // const data = await response.json();
        // if (data.success) {
        //     setSaved(true);
        //     setTimeout(() => setSaved(false), 2500);
        // }

        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleClickUpload = () => {
        if (fileRef.current) {
            fileRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        setCvFile(e.target.files[0]);
    };

    // Style chung cho tất cả ô input, select trong form
    const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };

    // Style cho textarea (thêm resize so với inputStyle)
    const textareaStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" };

    // Hàm render nhãn cho từng trường
    const renderLabel = (text, sub) => (
        <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 5 }}>
            {text}
            {sub && <span style={{ color: "#9ca3af", fontWeight: 400 }}> ({sub})</span>}
        </label>
    );

    // Hàm render tiêu đề từng section
    const renderSection = (title) => (
        <h3 style={{ margin: "24px 0 14px", fontSize: 14, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 0.5, paddingBottom: 8, borderBottom: "1px solid #f3f4f6" }}>
            {title}
        </h3>
    );

    // Xác định chữ trên nút lưu
    let saveButtonText = "Lưu thay đổi";
    if (saved) {
        saveButtonText = "✓ Đã lưu!";
    }

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 24, maxWidth: 720 }}>

            {/* Avatar và tên người dùng */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, fontWeight: 700, flexShrink: 0 }}>
                    {initials(profile.name)}
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>{profile.name}</h2>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>{profile.position} · {profile.experience}</div>
                </div>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {renderSection("Thông tin cá nhân")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {/* Họ và tên */}
                    <div>
                        {renderLabel("Họ và tên")}
                        <input type="text" value={profile.name} onChange={e => setField("name", e.target.value)} style={inputStyle} />
                    </div>
                    {/* Email */}
                    <div>
                        {renderLabel("Email")}
                        <input type="email" value={profile.email} onChange={e => setField("email", e.target.value)} style={inputStyle} />
                    </div>
                    {/* Số điện thoại */}
                    <div>
                        {renderLabel("Số điện thoại")}
                        <input type="tel" value={profile.phone} onChange={e => setField("phone", e.target.value)} style={inputStyle} />
                    </div>
                    {/* Ngày sinh */}
                    <div>
                        {renderLabel("Ngày sinh")}
                        <input type="date" value={profile.dob} onChange={e => setField("dob", e.target.value)} style={inputStyle} />
                    </div>
                    {/* Giới tính */}
                    <div>
                        {renderLabel("Giới tính")}
                        <select value={profile.gender} onChange={e => setField("gender", e.target.value)} style={inputStyle}>
                            <option>Nam</option>
                            <option>Nữ</option>
                            <option>Khác</option>
                        </select>
                    </div>
                    {/* Địa chỉ */}
                    <div>
                        {renderLabel("Địa chỉ")}
                        <input type="text" value={profile.address} onChange={e => setField("address", e.target.value)} style={inputStyle} />
                    </div>
                </div>

                {renderSection("Thông tin nghề nghiệp")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {/* Vị trí mong muốn */}
                    <div>
                        {renderLabel("Vị trí mong muốn")}
                        <input type="text" value={profile.position} onChange={e => setField("position", e.target.value)} style={inputStyle} />
                    </div>
                    {/* Kinh nghiệm */}
                    <div>
                        {renderLabel("Kinh nghiệm")}
                        <select value={profile.experience} onChange={e => setField("experience", e.target.value)} style={inputStyle}>
                            <option>Không yêu cầu</option>
                            <option>Dưới 1 năm</option>
                            <option>1-2 năm</option>
                            <option>2-3 năm</option>
                            <option>3-5 năm</option>
                            <option>Trên 5 năm</option>
                        </select>
                    </div>
                    {/* Ngành nghề */}
                    <div>
                        {renderLabel("Ngành nghề")}
                        <select value={profile.industry} onChange={e => setField("industry", e.target.value)} style={inputStyle}>
                            {CATEGORIES.slice(1).map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                    {/* Loại công việc mong muốn */}
                    <div>
                        {renderLabel("Loại công việc mong muốn")}
                        <select value={profile.jobType} onChange={e => setField("jobType", e.target.value)} style={inputStyle}>
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Freelancer</option>
                            <option>Thực tập</option>
                        </select>
                    </div>
                </div>

                {/* Trường kỹ năng */}
                <div>
                    {renderLabel("Kỹ năng", "phân cách bằng dấu phẩy")}
                    <input value={profile.skills} onChange={e => setField("skills", e.target.value)} placeholder="React, Node.js, Python..." style={inputStyle} />
                    {/* Hiển thị kỹ năng dạng tag */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                        {profile.skills.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                            <span key={s} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "#f5f3ff", color: "#7c3aed", fontWeight: 500 }}>{s}</span>
                        ))}
                    </div>
                </div>

                {/* Trường giới thiệu bản thân */}
                <div>
                    {renderLabel("Giới thiệu bản thân")}
                    <textarea value={profile.bio} onChange={e => setField("bio", e.target.value)} rows={4} style={textareaStyle} />
                </div>

                {renderSection("Upload CV")}

                {/* Khu vực upload CV */}
                <div>
                    <div
                        onClick={handleClickUpload}
                        style={{ border: "2px dashed #e5e7eb", borderRadius: 10, padding: "20px", textAlign: "center", cursor: "pointer", transition: "border-color 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#7c3aed"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                    >
                        {cvFile && (
                            <div style={{ color: "#7c3aed", fontWeight: 500, fontSize: 14 }}>📎 {cvFile.name}</div>
                        )}
                        {!cvFile && (
                            <>
                                <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                                <div style={{ fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 4 }}>Tải CV lên</div>
                                <div style={{ fontSize: 12, color: "#9ca3af" }}>PDF, DOC, DOCX - tối đa 5MB</div>
                            </>
                        )}
                    </div>
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={handleFileChange} />
                </div>

                <button
                    type="submit"
                    style={{ padding: "11px 24px", borderRadius: 10, border: "none", background: "#7c3aed", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, width: "fit-content", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#6d28d9"}
                    onMouseLeave={e => e.currentTarget.style.background = "#7c3aed"}
                >
                    {saveButtonText}
                </button>
            </form>
        </div>
    );
};


//App Root
export default function JobSeekerDashboard() {
    const [activeTab, setActiveTab] = useState("jobs");
    const [savedIds, setSavedIds] = useState(new Set());
    const [viewJob, setViewJob] = useState(null);
    const [applyJob, setApplyJob] = useState(null);

    // Bật/tắt trạng thái lưu của một việc làm theo ID
    const toggleSave = (id) => {
        const newSavedIds = new Set(savedIds);
        if (newSavedIds.has(id)) {
            newSavedIds.delete(id);
        } else {
            newSavedIds.add(id);
        }
        setSavedIds(newSavedIds);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        // Dùng useNavigate nếu dùng trong react-router, hoặc navigate trực tiếp:
        window.location.href = "/login";
    };

    // Đóng modal chi tiết rồi mở modal ứng tuyển
    const handleApply = (job) => {
        setViewJob(null);
        setApplyJob(job);
    };

    const handleCloseViewJob = () => {
        setViewJob(null);
    };

    const handleCloseApplyJob = () => {
        setApplyJob(null);
    };

    // Xác định tiêu đề trang theo tab đang active
    let pageTitle = "Tìm việc làm";
    if (activeTab === "saved") {
        pageTitle = "Việc đã lưu";
    }
    if (activeTab === "profile") {
        pageTitle = "Hồ sơ cá nhân";
    }

    return (
        <>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; } body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }`}</style>
            <div style={{ display: "flex", height: "100vh", background: "#f9fafb", overflow: "hidden" }}>
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
                <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

                    {/* Header */}
                    <div style={{ padding: "16px 24px", borderBottom: "1px solid #f3f4f6", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>{pageTitle}</h1>
                            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>JobHot - Trang dành cho người tìm việc</div>
                        </div>
                        <div style={{ fontSize: 12, background: "#f5f3ff", color: "#7c3aed", padding: "4px 12px", borderRadius: 20, fontWeight: 500 }}>
                            {savedIds.size} việc đã lưu
                        </div>
                    </div>

                    {/* Nội dung từng tab */}
                    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                        {activeTab === "jobs" && <JobsTab savedIds={savedIds} onSave={toggleSave} onView={setViewJob} />}
                        {activeTab === "saved" && <SavedTab savedIds={savedIds} onSave={toggleSave} onView={setViewJob} />}
                        {activeTab === "profile" && <ProfileTab />}
                    </div>
                </main>
            </div>

            {/* Modal xem chi tiết việc làm */}
            {viewJob && (
                <JobDetailModal
                    job={viewJob}
                    saved={savedIds.has(viewJob.id)}
                    onSave={toggleSave}
                    onClose={handleCloseViewJob}
                    onApply={handleApply}
                />
            )}

            {/* Modal ứng tuyển */}
            {applyJob && <ApplyModal job={applyJob} onClose={handleCloseApplyJob} />}
        </>
    );
}