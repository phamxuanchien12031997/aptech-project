import { useState, useRef, useEffect } from "react";

const MOCK_JOBS = [
    { id: "JP001", title: "Lập Trình Viên Full Stack - ReactJS & Node.js", description: "Phát triển và duy trì các ứng dụng web sử dụng ReactJS ở frontend và Node.js ở backend. Tham gia thiết kế kiến trúc hệ thống, review code và mentor junior developer.", requirements: "Tối thiểu 2 năm kinh nghiệm React, Node.js\nThành thạo TypeScript, REST API, Git\nCó kinh nghiệm với PostgreSQL hoặc MongoDB", salary: "20-35 triệu", location: "Hà Nội", category: "Công nghệ thông tin", type: "Full-time", deadline: "2026-06-15", posted: "2026-05-01", status: "active", applicants: 14 },
    { id: "JP002", title: "Nhân Viên Marketing Digital", description: "Lên kế hoạch và triển khai chiến dịch marketing đa kênh. Phân tích hiệu quả và tối ưu ngân sách.", requirements: "Có kinh nghiệm chạy quảng cáo Facebook/Google Ads\nHiểu biết về SEO, Content Marketing", salary: "10-15 triệu", location: "Hồ Chí Minh", category: "Marketing / PR", type: "Full-time", deadline: "2026-05-30", posted: "2026-05-02", status: "active", applicants: 7 },
    { id: "JP003", title: "Thiết Kế UX/UI - Mobile App", description: "Nghiên cứu người dùng, tạo wireframe và prototype cho ứng dụng mobile.", requirements: "Thành thạo Figma, Adobe XD\nCó portfolio thể hiện kinh nghiệm thiết kế mobile", salary: "18-28 triệu", location: "Hà Nội", category: "Thiết kế", type: "Full-time", deadline: "2026-06-25", posted: "2026-05-06", status: "closed", applicants: 22 },
];

const MOCK_CANDIDATES = [
    { id: "C001", name: "Nguyễn Thị Bình", position: "Frontend Developer", experience: "2-3 năm", skills: ["React", "TypeScript", "CSS"], location: "Hà Nội", email: "binh@email.com", phone: "0901234567", appliedJob: "JP001", appliedDate: "2026-05-03", status: "reviewing", bio: "Lập trình viên frontend với 2 năm kinh nghiệm làm việc với React ecosystem. Đam mê tạo ra UI đẹp và hiệu suất cao.", education: "Đại học Bách Khoa Hà Nội - Công nghệ thông tin" },
    { id: "C002", name: "Trần Văn Cường", position: "Full Stack Developer", experience: "3-5 năm", skills: ["Node.js", "React", "PostgreSQL", "Docker"], location: "Hà Nội", email: "cuong@email.com", phone: "0912345678", appliedJob: "JP001", appliedDate: "2026-05-04", status: "shortlisted", bio: "Senior developer với 4 năm kinh nghiệm xây dựng hệ thống web quy mô lớn. Có kinh nghiệm dẫn dắt team nhỏ.", education: "Đại học Quốc gia Hà Nội - Khoa học máy tính" },
    { id: "C003", name: "Lê Minh Dũng", position: "Backend Developer", experience: "1-2 năm", skills: ["Python", "Django", "MySQL"], location: "Hồ Chí Minh", email: "dung@email.com", phone: "0923456789", appliedJob: "JP001", appliedDate: "2026-05-05", status: "new", bio: "Junior developer mới tốt nghiệp, nhiệt huyết học hỏi và sẵn sàng thử thách mới.", education: "Đại học Công nghệ TP.HCM - CNTT" },
    { id: "C004", name: "Phạm Thị Hoa", position: "Digital Marketing Specialist", experience: "2-3 năm", skills: ["Facebook Ads", "Google Ads", "SEO", "Analytics"], location: "Hồ Chí Minh", email: "hoa@email.com", phone: "0934567890", appliedJob: "JP002", appliedDate: "2026-05-03", status: "shortlisted", bio: "Chuyên viên marketing với kinh nghiệm quản lý ngân sách quảng cáo trên 200 triệu/tháng.", education: "Đại học Kinh tế TP.HCM - Marketing" },
    { id: "C005", name: "Hoàng Văn Em", position: "UI/UX Designer", experience: "2-3 năm", skills: ["Figma", "Adobe XD", "Prototyping", "User Research"], location: "Hà Nội", email: "em@email.com", phone: "0945678901", appliedJob: "JP003", appliedDate: "2026-05-07", status: "new", bio: "Designer với niềm đam mê tạo ra trải nghiệm người dùng tuyệt vời. Portfolio đa dạng từ mobile đến web.", education: "Đại học Mỹ thuật Công nghiệp Hà Nội" },
    { id: "C006", name: "Vũ Thị Phương", position: "Senior UX Designer", experience: "3-5 năm", skills: ["Figma", "User Research", "Design System", "Motion Design"], location: "Hà Nội", email: "phuong@email.com", phone: "0956789012", appliedJob: "JP003", appliedDate: "2026-05-08", status: "reviewing", bio: "Senior designer với 4 năm kinh nghiệm, từng làm tại các startup công nghệ lớn tại Việt Nam.", education: "RMIT Việt Nam - Đa phương tiện" },
];

const MOCK_TALENT_POOL = [
    { id: "T001", name: "Đinh Quốc Huy", position: "Data Engineer", experience: "3-5 năm", skills: ["Python", "Spark", "Airflow", "SQL"], location: "Hà Nội", email: "huy@email.com" },
    { id: "T002", name: "Bùi Thị Lan", position: "Product Manager", experience: "2-3 năm", skills: ["Agile", "Jira", "Figma", "SQL"], location: "Hồ Chí Minh", email: "lan@email.com" },
    { id: "T003", name: "Ngô Văn Minh", position: "DevOps Engineer", experience: "3-5 năm", skills: ["Docker", "Kubernetes", "AWS", "Terraform"], location: "Hà Nội", email: "minh@email.com" },
    { id: "T004", name: "Trịnh Thị Nga", position: "React Developer", experience: "1-2 năm", skills: ["React", "JavaScript", "CSS", "Redux"], location: "Đà Nẵng", email: "nga@email.com" },
    { id: "T005", name: "Cao Minh Phát", position: "iOS Developer", experience: "2-3 năm", skills: ["Swift", "Xcode", "UIKit", "CoreData"], location: "Hồ Chí Minh", email: "phat@email.com" },
    { id: "T006", name: "Lý Thị Quyên", position: "Content Marketing", experience: "1-2 năm", skills: ["Copywriting", "SEO", "Social Media", "Canva"], location: "Hà Nội", email: "quyen@email.com" },
];

const CATEGORIES = ["Công nghệ thông tin", "Marketing / PR", "Thiết kế", "Kế toán / Kiểm toán", "Kinh doanh / Bán hàng", "Nhân sự", "Dịch vụ khách hàng"];
const JOB_TYPES = ["Full-time", "Part-time", "Freelancer", "Thực tập"];
const LOCATIONS = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];
const EXPERIENCES = ["Không yêu cầu", "Dưới 1 năm", "1-2 năm", "2-3 năm", "3-5 năm", "Trên 5 năm"];

const STATUS_CONFIG = {
    new: { label: "Mới", bg: "#eff6ff", color: "#1d4ed8" },
    reviewing: { label: "Đang xem xét", bg: "#fefce8", color: "#854d0e" },
    shortlisted: { label: "Tiềm năng", bg: "#f0fdf4", color: "#15803d" },
    rejected: { label: "Từ chối", bg: "#fff1f2", color: "#be123c" },
};

//Helpers
const initials = (name) => name.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase();
const daysLeft = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));
const fmtDate = (d) => new Date(d).toLocaleDateString("vi-VN");

const AVATAR_COLORS = ["#7c3aed", "#0369a1", "#0f766e", "#b45309", "#be185d", "#6d28d9"];
const avatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

//Shared UI
const Badge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
    return <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: cfg.bg, color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>;
};

const EmptyState = ({ icon, title, sub }) => (
    <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>{icon}</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{title}</div>
        {sub && <div style={{ fontSize: 13 }}>{sub}</div>}
    </div>
);

const inp = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#111827" };
const sectionTitle = (t) => <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 0.5, paddingBottom: 8, borderBottom: "1px solid #f3f4f6" }}>{t}</h3>;

//Sidebar
const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    const tabs = [
        { id: "overview", icon: "📊", label: "Tổng quan" },
        { id: "jobs", icon: "📋", label: "Quản lý tin đăng" },
        { id: "candidates", icon: "👥", label: "Quản lý ứng viên" },
        { id: "talent", icon: "🔍", label: "Tìm ứng viên" },
        { id: "company", icon: "🏢", label: "Thông tin công ty" },
    ];

    return (
        <aside style={{ width: 224, flexShrink: 0, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ fontWeight: 700, fontSize: 20, color: "#7c3aed", letterSpacing: -0.5 }}>JobHot</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Trang nhà tuyển dụng</div>
            </div>
            <nav style={{ flex: 1, padding: "12px 12px" }}>
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                        borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left", fontSize: 13.5,
                        fontWeight: activeTab === t.id ? 600 : 400,
                        background: activeTab === t.id ? "#f5f3ff" : "transparent",
                        color: activeTab === t.id ? "#7c3aed" : "#374151",
                        marginBottom: 3, transition: "all 0.15s"
                    }}>
                        <span style={{ fontSize: 15 }}>{t.icon}</span>
                        {t.label}
                    </button>
                ))}
            </nav>

            <div style={{ padding: "12px 12px", borderTop: "1px solid #f3f4f6", position: "relative" }} ref={menuRef}>
                <button onClick={() => setMenuOpen(v => !v)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                    borderRadius: 8, border: menuOpen ? "1px solid #e5e7eb" : "1px solid transparent",
                    background: menuOpen ? "#f9fafb" : "transparent", cursor: "pointer", transition: "all 0.15s"
                }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>CT</div>
                    <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Công ty JobHot</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>Nhà tuyển dụng</div>
                    </div>
                    <span style={{ fontSize: 10, color: "#9ca3af", transition: "transform 0.2s", transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>▲</span>
                </button>

                {menuOpen && (
                    <div style={{ position: "absolute", bottom: "calc(100% - 8px)", left: 12, right: 12, background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)", overflow: "hidden", zIndex: 50 }}>
                        <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid #f3f4f6" }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Công ty JobHot</div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>hr@jobhot.vn</div>
                        </div>
                        <div style={{ padding: "6px" }}>
                            <button onClick={() => { setActiveTab("company"); setMenuOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 7, border: "none", background: "transparent", cursor: "pointer", fontSize: 13, color: "#374151", textAlign: "left" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                <span>🏢</span> Thông tin công ty
                            </button>
                            <button onClick={() => { setMenuOpen(false); onLogout(); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 7, border: "none", background: "transparent", cursor: "pointer", fontSize: 13, color: "#ef4444", textAlign: "left" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#fff1f2"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                <span>🚪</span> Đăng xuất
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

//Overview Tab
const OverviewTab = ({ jobs, candidates, setActiveTab }) => {
    const activeJobs = jobs.filter(j => j.status === "active").length;
    const totalApplicants = candidates.length;
    const newApplicants = candidates.filter(c => c.status === "new").length;
    const shortlisted = candidates.filter(c => c.status === "shortlisted").length;

    const stats = [
        { label: "Tin đang tuyển", value: activeJobs, icon: "📋", color: "#7c3aed", bg: "#f5f3ff" },
        { label: "Tổng ứng viên", value: totalApplicants, icon: "👥", color: "#0369a1", bg: "#eff6ff" },
        { label: "Ứng viên mới", value: newApplicants, icon: "🆕", color: "#b45309", bg: "#fefce8" },
        { label: "Tiềm năng", value: shortlisted, icon: "⭐", color: "#15803d", bg: "#f0fdf4" },
    ];

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Tổng quan</h2>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "#6b7280" }}>Chào mừng trở lại! Đây là tình hình tuyển dụng hôm nay.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
                {stats.map(s => (
                    <div key={s.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "18px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, fontWeight: 500 }}>{s.label}</div>
                                <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                            </div>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{s.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>Tin tuyển dụng gần đây</h3>
                        <button onClick={() => setActiveTab("jobs")} style={{ fontSize: 12, color: "#7c3aed", border: "none", background: "none", cursor: "pointer", fontWeight: 500 }}>Xem tất cả →</button>
                    </div>
                    {jobs.slice(0, 3).map(j => (
                        <div key={j.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f9fafb" }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{j.title}</div>
                                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{j.applicants} ứng viên · {fmtDate(j.posted)}</div>
                            </div>
                            <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: j.status === "active" ? "#f0fdf4" : "#f3f4f6", color: j.status === "active" ? "#15803d" : "#6b7280", fontWeight: 600 }}>
                                {j.status === "active" ? "Đang tuyển" : "Đã đóng"}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>Ứng viên mới nhất</h3>
                        <button onClick={() => setActiveTab("candidates")} style={{ fontSize: 12, color: "#7c3aed", border: "none", background: "none", cursor: "pointer", fontWeight: 500 }}>Xem tất cả →</button>
                    </div>
                    {candidates.slice(0, 4).map(c => (
                        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #f9fafb" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 30, height: 30, borderRadius: "50%", background: avatarColor(c.name), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                    {initials(c.name)}
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{c.name}</div>
                                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{c.position}</div>
                                </div>
                            </div>
                            <Badge status={c.status} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

//Job Form Modal
const JobFormModal = ({ job, onClose, onSave }) => {
    const empty = { title: "", description: "", requirements: "", salary: "", location: "Hà Nội", category: "Công nghệ thông tin", type: "Full-time", deadline: "" };
    const [form, setForm] = useState(job ? { ...job } : empty);
    const [loading, setLoading] = useState(false);
    const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 900));
        onSave({ ...form, id: job?.id || `JP${Date.now()}`, status: job?.status || "active", applicants: job?.applicants || 0, posted: job?.posted || new Date().toISOString().slice(0, 10) });
        setLoading(false);
        onClose();
    };

    const fieldLabel = (t) => <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{t}</label>;
    const selStyle = { ...inp };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 640, maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>{job ? "Chỉnh sửa tin tuyển dụng" : "Tạo tin tuyển dụng mới"}</h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
                </div>
                <form onSubmit={handleSave} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                        {fieldLabel("Tiêu đề công việc *")}
                        <input value={form.title} onChange={e => setF("title", e.target.value)} required placeholder="VD: Lập Trình Viên Full Stack" style={inp} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div>
                            {fieldLabel("Mức lương")}
                            <input value={form.salary} onChange={e => setF("salary", e.target.value)} placeholder="VD: 20-35 triệu" style={inp} />
                        </div>
                        <div>
                            {fieldLabel("Địa điểm")}
                            <select value={form.location} onChange={e => setF("location", e.target.value)} style={selStyle}>
                                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            {fieldLabel("Danh mục (tuỳ chọn)")}
                            <select value={form.category} onChange={e => setF("category", e.target.value)} style={selStyle}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            {fieldLabel("Loại công việc")}
                            <select value={form.type} onChange={e => setF("type", e.target.value)} style={selStyle}>
                                {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        {fieldLabel("Deadline")}
                        <input type="date" value={form.deadline} onChange={e => setF("deadline", e.target.value)} style={inp} />
                    </div>

                    <div>
                        {fieldLabel("Mô tả công việc *")}
                        <textarea value={form.description} onChange={e => setF("description", e.target.value)} required rows={5} placeholder="Mô tả chi tiết về công việc, trách nhiệm..." style={{ ...inp, resize: "vertical" }} />
                    </div>

                    <div>
                        {fieldLabel("Yêu cầu kỹ năng *")}
                        <textarea value={form.requirements} onChange={e => setF("requirements", e.target.value)} required rows={4} placeholder="Liệt kê các yêu cầu (mỗi yêu cầu một dòng)..." style={{ ...inp, resize: "vertical" }} />
                    </div>

                    <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
                        <button type="submit" disabled={loading} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: loading ? "#c4b5fd" : "#7c3aed", color: "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            {loading && <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />}
                            {loading ? "Đang lưu..." : (job ? "Lưu thay đổi" : "Đăng tuyển dụng")}
                        </button>
                        <button type="button" onClick={onClose} style={{ padding: "11px 20px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, cursor: "pointer" }}>Huỷ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

//Delete Confirm Modal
const DeleteModal = ({ job, onConfirm, onClose }) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
        onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 420, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>🗑️</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#111827" }}>Xoá tin tuyển dụng?</h2>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>Bạn sắp xoá <strong>"{job?.title}"</strong>. Hành động này không thể hoàn tác.</p>
            <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, cursor: "pointer" }}>Huỷ</button>
                <button onClick={onConfirm} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Xoá</button>
            </div>
        </div>
    </div>
);

//Jobs Tab
const JobsTab = ({ jobs, setJobs }) => {
    const [showForm, setShowForm] = useState(false);
    const [editJob, setEditJob] = useState(null);
    const [deleteJob, setDeleteJob] = useState(null);
    const [filter, setFilter] = useState("all");

    const filtered = jobs.filter(j => filter === "all" || j.status === filter);

    const handleSave = (job) => {
        setJobs(prev => prev.find(j => j.id === job.id) ? prev.map(j => j.id === job.id ? job : j) : [job, ...prev]);
    };
    const handleDelete = () => {
        setJobs(prev => prev.filter(j => j.id !== deleteJob.id));
        setDeleteJob(null);
    };
    const handleToggleStatus = (id) => {
        setJobs(prev => prev.map(j => j.id === id ? { ...j, status: j.status === "active" ? "closed" : "active" } : j));
    };

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                    <h2 style={{ margin: "0 0 2px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Quản lý tin đăng</h2>
                    <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>{jobs.length} tin tuyển dụng</p>
                </div>
                <button onClick={() => { setEditJob(null); setShowForm(true); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, border: "none", background: "#7c3aed", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    + Tạo tin mới
                </button>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {[["all", "Tất cả"], ["active", "Đang tuyển"], ["closed", "Đã đóng"]].map(([val, label]) => (
                    <button key={val} onClick={() => setFilter(val)} style={{ padding: "7px 16px", borderRadius: 20, border: `1px solid ${filter === val ? "#7c3aed" : "#e5e7eb"}`, background: filter === val ? "#f5f3ff" : "#fff", color: filter === val ? "#7c3aed" : "#6b7280", fontSize: 13, fontWeight: filter === val ? 600 : 400, cursor: "pointer" }}>
                        {label}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? <EmptyState icon="📋" title="Chưa có tin tuyển dụng" sub="Nhấn 'Tạo tin mới' để bắt đầu tuyển dụng" /> : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {filtered.map(j => (
                        <div key={j.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "18px 20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>{j.title}</h3>
                                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: j.status === "active" ? "#f0fdf4" : "#f3f4f6", color: j.status === "active" ? "#15803d" : "#6b7280", fontWeight: 600 }}>
                                            {j.status === "active" ? "Đang tuyển" : "Đã đóng"}
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                                        {[["💰", j.salary], ["📍", j.location], ["💼", j.type], ["📅", `Deadline: ${j.deadline ? fmtDate(j.deadline) : "-"}`], ["👥", `${j.applicants} ứng viên`]].map(([icon, val]) => (
                                            <span key={val} style={{ fontSize: 12, color: "#6b7280" }}>{icon} {val}</span>
                                        ))}
                                    </div>
                                    <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>{j.description.slice(0, 120)}…</p>
                                </div>
                                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                                    <button onClick={() => handleToggleStatus(j.id)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 12, cursor: "pointer" }}>
                                        {j.status === "active" ? "Đóng tin" : "Mở lại"}
                                    </button>
                                    <button onClick={() => { setEditJob(j); setShowForm(true); }} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #7c3aed", background: "#f5f3ff", color: "#7c3aed", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                                        ✏️ Sửa
                                    </button>
                                    <button onClick={() => setDeleteJob(j)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #fecaca", background: "#fff1f2", color: "#ef4444", fontSize: 12, cursor: "pointer" }}>
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && <JobFormModal job={editJob} onClose={() => setShowForm(false)} onSave={handleSave} />}
            {deleteJob && <DeleteModal job={deleteJob} onConfirm={handleDelete} onClose={() => setDeleteJob(null)} />}
        </div>
    );
};

//CV View Modal
const CVModal = ({ candidate, onClose }) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
        onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Hồ sơ ứng viên</h2>
                <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>
            <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 24 }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: avatarColor(candidate.name), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
                        {initials(candidate.name)}
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

                <div style={{ marginBottom: 20 }}>
                    {sectionTitle("Liên hệ")}
                    <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
                        <span style={{ color: "#374151" }}>📧 {candidate.email}</span>
                        <span style={{ color: "#374151" }}>📱 {candidate.phone}</span>
                    </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                    {sectionTitle("Giới thiệu")}
                    <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{candidate.bio}</p>
                </div>

                <div style={{ marginBottom: 20 }}>
                    {sectionTitle("Học vấn")}
                    <p style={{ margin: 0, fontSize: 13, color: "#374151" }}>🎓 {candidate.education}</p>
                </div>

                <div style={{ marginBottom: 24 }}>
                    {sectionTitle("Kỹ năng")}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {candidate.skills.map(s => <span key={s} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "#f5f3ff", color: "#7c3aed", fontWeight: 500 }}>{s}</span>)}
                    </div>
                </div>

                <div style={{ background: "#f9fafb", borderRadius: 10, padding: "14px 16px", fontSize: 12, color: "#6b7280" }}>
                    📄 CV đính kèm: <span style={{ color: "#7c3aed", fontWeight: 500, cursor: "pointer" }}>CV_{candidate.name.replace(/ /g, "_")}.pdf</span>
                    <span style={{ marginLeft: 8, color: "#9ca3af" }}>(Demo - chưa tích hợp backend)</span>
                </div>
            </div>
        </div>
    </div>
);

// Candidates Tab
const CandidatesTab = ({ candidates, setCandidates, jobs }) => {
    const [viewCV, setViewCV] = useState(null);
    const [filterJob, setFilterJob] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    const filtered = candidates.filter(c =>
        (filterJob === "all" || c.appliedJob === filterJob) &&
        (filterStatus === "all" || c.status === filterStatus)
    );

    const updateStatus = (id, status) => setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
                <h2 style={{ margin: "0 0 2px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Quản lý ứng viên</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>{filtered.length} ứng viên</p>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                <select value={filterJob} onChange={e => setFilterJob(e.target.value)} style={{ ...inp, width: "auto", fontSize: 13 }}>
                    <option value="all">Tất cả tin đăng</option>
                    {jobs.map(j => <option key={j.id} value={j.id}>{j.title.slice(0, 40)}…</option>)}
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inp, width: "auto", fontSize: 13 }}>
                    <option value="all">Tất cả trạng thái</option>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
            </div>

            {filtered.length === 0 ? <EmptyState icon="👥" title="Chưa có ứng viên" sub="Ứng viên sẽ xuất hiện ở đây khi họ nộp hồ sơ" /> : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {filtered.map(c => {
                        const job = jobs.find(j => j.id === c.appliedJob);
                        return (
                            <div key={c.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: avatarColor(c.name), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                                            {initials(c.name)}
                                        </div>
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                                                <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{c.name}</span>
                                                <Badge status={c.status} />
                                            </div>
                                            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{c.position} · {c.experience}</div>
                                            <div style={{ fontSize: 12, color: "#9ca3af" }}>
                                                Ứng tuyển: <span style={{ color: "#374151" }}>{job?.title?.slice(0, 35) || "N/A"}…</span> · {fmtDate(c.appliedDate)}
                                            </div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                                                {c.skills.slice(0, 3).map(s => <span key={s} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#f5f3ff", color: "#7c3aed" }}>{s}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center", flexWrap: "wrap" }}>
                                        <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)} style={{ ...inp, width: "auto", fontSize: 12, padding: "6px 10px" }}>
                                            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                        </select>
                                        <button onClick={() => setViewCV(c)} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #7c3aed", background: "#f5f3ff", color: "#7c3aed", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                                            Xem CV
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {viewCV && <CVModal candidate={viewCV} onClose={() => setViewCV(null)} />}
        </div>
    );
};

//Talent Search Tab
const TalentTab = () => {
    const [search, setSearch] = useState({ skill: "", experience: "Tất cả", location: "Tất cả" });
    const [results, setResults] = useState(MOCK_TALENT_POOL);
    const [searched, setSearched] = useState(false);

    const handleSearch = () => {
        const kw = search.skill.toLowerCase();
        const res = MOCK_TALENT_POOL.filter(t =>
            (!kw || t.skills.some(s => s.toLowerCase().includes(kw)) || t.position.toLowerCase().includes(kw)) &&
            (search.experience === "Tất cả" || t.experience === search.experience) &&
            (search.location === "Tất cả" || t.location === search.location)
        );
        setResults(res);
        setSearched(true);
    };

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Tìm kiếm ứng viên</h2>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "#6b7280" }}>Tìm kiếm trong cơ sở dữ liệu ứng viên của JobHot</p>

            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "20px 24px", marginBottom: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "flex-end" }}>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Kỹ năng / Vị trí</label>
                        <input value={search.skill} onChange={e => setSearch(s => ({ ...s, skill: e.target.value }))} placeholder="React, Python, Designer..." style={inp}
                            onKeyDown={e => e.key === "Enter" && handleSearch()} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Kinh nghiệm</label>
                        <select value={search.experience} onChange={e => setSearch(s => ({ ...s, experience: e.target.value }))} style={inp}>
                            <option>Tất cả</option>
                            {EXPERIENCES.map(e => <option key={e}>{e}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Địa điểm</label>
                        <select value={search.location} onChange={e => setSearch(s => ({ ...s, location: e.target.value }))} style={inp}>
                            <option>Tất cả</option>
                            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                        </select>
                    </div>
                    <button onClick={handleSearch} style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: "#7c3aed", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                        🔍 Tìm kiếm
                    </button>
                </div>
            </div>

            {searched && (
                <p style={{ margin: "0 0 16px", fontSize: 13, color: "#6b7280" }}>Tìm thấy <strong style={{ color: "#111827" }}>{results.length}</strong> ứng viên phù hợp</p>
            )}

            {results.length === 0 && searched ? (
                <EmptyState icon="🔍" title="Không tìm thấy ứng viên" sub="Thử thay đổi từ khóa hoặc bộ lọc tìm kiếm" />
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                    {results.map(t => (
                        <div key={t.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "18px 18px", transition: "box-shadow 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.10)"}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                                <div style={{ width: 44, height: 44, borderRadius: "50%", background: avatarColor(t.name), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                                    {initials(t.name)}
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{t.name}</div>
                                    <div style={{ fontSize: 12, color: "#6b7280" }}>{t.position}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>
                                <span>📍 {t.location}</span>
                                <span>⏱ {t.experience}</span>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                                {t.skills.map(s => <span key={s} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, background: "#f5f3ff", color: "#7c3aed", fontWeight: 500 }}>{s}</span>)}
                            </div>
                            <a href={`mailto:${t.email}`} style={{ display: "block", textAlign: "center", padding: "8px", borderRadius: 8, border: "1px solid #7c3aed", color: "#7c3aed", fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#7c3aed"; e.currentTarget.style.color = "#fff"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7c3aed"; }}>
                                ✉️ Liên hệ ứng viên
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

//Company Tab
const CompanyTab = () => {
    const [company, setCompany] = useState({ name: "Công ty JobHot", description: "Nền tảng tuyển dụng hàng đầu Việt Nam, kết nối hàng triệu ứng viên với các nhà tuyển dụng uy tín trên cả nước.", address: "Tòa nhà FLC, 18 Phạm Hùng, Nam Từ Liêm, Hà Nội", website: "https://jobhot.vn", size: "50-100 nhân viên", industry: "Công nghệ thông tin", email: "hr@jobhot.vn", phone: "024 1234 5678" });
    const [saved, setSaved] = useState(false);
    const setF = (k, v) => setCompany(c => ({ ...c, [k]: v }));

    const handleSave = (e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2500); };
    const fieldLabel = (t) => <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{t}</label>;

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: 24, maxWidth: 720 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
                <div style={{ width: 68, height: 68, borderRadius: 16, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700 }}>CT</div>
                <div>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>{company.name}</h2>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>{company.industry} · {company.size}</div>
                </div>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {sectionTitle("Thông tin cơ bản")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                        {fieldLabel("Tên công ty *")}
                        <input value={company.name} onChange={e => setF("name", e.target.value)} required style={inp} />
                    </div>
                    <div>
                        {fieldLabel("Website")}
                        <input value={company.website} onChange={e => setF("website", e.target.value)} placeholder="https://..." style={inp} />
                    </div>
                    <div>
                        {fieldLabel("Email liên hệ")}
                        <input type="email" value={company.email} onChange={e => setF("email", e.target.value)} style={inp} />
                    </div>
                    <div>
                        {fieldLabel("Số điện thoại")}
                        <input value={company.phone} onChange={e => setF("phone", e.target.value)} style={inp} />
                    </div>
                    <div>
                        {fieldLabel("Ngành nghề")}
                        <select value={company.industry} onChange={e => setF("industry", e.target.value)} style={inp}>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        {fieldLabel("Quy mô")}
                        <select value={company.size} onChange={e => setF("size", e.target.value)} style={inp}>
                            {["1-10 nhân viên", "10-50 nhân viên", "50-100 nhân viên", "100-500 nhân viên", "Trên 500 nhân viên"].map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    {fieldLabel("Địa chỉ *")}
                    <input value={company.address} onChange={e => setF("address", e.target.value)} required style={inp} />
                </div>

                <div>
                    {fieldLabel("Mô tả công ty *")}
                    <textarea value={company.description} onChange={e => setF("description", e.target.value)} required rows={5}
                        placeholder="Mô tả về công ty, văn hóa, sứ mệnh..." style={{ ...inp, resize: "vertical" }} />
                </div>

                <button type="submit" style={{ padding: "11px 24px", borderRadius: 10, border: "none", background: "#7c3aed", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "fit-content", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#6d28d9"}
                    onMouseLeave={e => e.currentTarget.style.background = "#7c3aed"}>
                    {saved ? "✓ Đã lưu!" : "Lưu thay đổi"}
                </button>
            </form>
        </div>
    );
};

//App Root
export default function EmployerDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [jobs, setJobs] = useState(MOCK_JOBS);
    const [candidates, setCandidates] = useState(MOCK_CANDIDATES);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const TAB_TITLES = { overview: "Tổng quan", jobs: "Quản lý tin đăng", candidates: "Quản lý ứng viên", talent: "Tìm kiếm ứng viên", company: "Thông tin công ty" };

    return (
        <>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; } body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }`}</style>
            <div style={{ display: "flex", height: "100vh", background: "#f9fafb", overflow: "hidden" }}>
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
                <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                    <div style={{ padding: "14px 24px", borderBottom: "1px solid #f3f4f6", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>{TAB_TITLES[activeTab]}</h1>
                            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>JobHot - Nhà tuyển dụng</div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <div style={{ fontSize: 12, background: "#f0fdf4", color: "#15803d", padding: "4px 12px", borderRadius: 20, fontWeight: 500 }}>
                                {jobs.filter(j => j.status === "active").length} tin đang tuyển
                            </div>
                            <div style={{ fontSize: 12, background: "#f5f3ff", color: "#7c3aed", padding: "4px 12px", borderRadius: 20, fontWeight: 500 }}>
                                {candidates.length} ứng viên
                            </div>
                        </div>
                    </div>

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