import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Home/Header';
import Footer from '../components/Home/Footer';

// ─────────────────────────────────────────────
// MOCK DATA
// Placeholder job detail objects keyed by job id.
// Replace with a real API call when the backend is ready.
// ─────────────────────────────────────────────

const mockJobDetails = {
    1: {
        id: 1,
        title: 'Trưởng Phòng Đào Tạo - Tập Đoàn Giáo Dục Lớn',
        company: 'Công ty TNHH Giáo Dục ABC',
        salary: '15-20 triệu',
        location: 'Hà Nội',
        daysLeft: 30,
        logo: null,
        type: 'Full-time',
        experience: '3-5 năm',
        level: 'Quản lý',
        quantity: 2,
        gender: 'Không yêu cầu',
        deadline: '15/06/2026',
        description: `
            <p>Chúng tôi đang tìm kiếm một Trưởng Phòng Đào Tạo có kinh nghiệm để lãnh đạo và phát triển các chương trình đào tạo chất lượng cao.</p>
            <p>Đây là cơ hội tuyệt vời để bạn phát triển sự nghiệp trong một môi trường năng động và chuyên nghiệp.</p>
        `,
        requirements: [
            'Tốt nghiệp Đại học chuyên ngành Sư phạm, Giáo dục hoặc liên quan',
            'Có ít nhất 3 năm kinh nghiệm ở vị trí tương đương',
            'Kỹ năng lãnh đạo và quản lý đội nhóm tốt',
            'Kỹ năng giao tiếp và thuyết trình xuất sắc',
            'Thành thạo tin học văn phòng và các công cụ đào tạo trực tuyến',
            'Có khả năng làm việc độc lập và chịu áp lực cao',
        ],
        benefits: [
            'Lương cạnh tranh từ 15-20 triệu + thưởng theo hiệu quả',
            'Bảo hiểm đầy đủ theo quy định',
            'Môi trường làm việc chuyên nghiệp, năng động',
            'Cơ hội thăng tiến rõ ràng',
            'Đào tạo và phát triển kỹ năng thường xuyên',
            'Team building, du lịch hàng năm',
        ],
        responsibilities: [
            'Xây dựng và triển khai các chương trình đào tạo',
            'Quản lý và phát triển đội ngũ giảng viên',
            'Đánh giá hiệu quả đào tạo và cải tiến liên tục',
            'Phối hợp với các phòng ban khác để đảm bảo chất lượng đào tạo',
            'Báo cáo định kỳ cho Ban Giám Đốc',
        ],
        companyInfo: {
            name: 'Công ty TNHH Giáo Dục ABC',
            size: '200-500 nhân viên',
            field: 'Giáo dục / Đào tạo',
            address: '123 Đường Láng, Đống Đa, Hà Nội',
            website: 'https://giaoduc-abc.vn',
            description: 'Công ty TNHH Giáo Dục ABC là một trong những tập đoàn giáo dục hàng đầu Việt Nam với hơn 15 năm kinh nghiệm trong lĩnh vực đào tạo và phát triển nguồn nhân lực.',
        },
    },
    2: {
        id: 2,
        title: 'Kỹ Sư Xây Dựng Cầu Đường - Dự Án Long An',
        company: 'Công ty Xây Dựng XYZ',
        salary: '12-18 triệu',
        location: 'Hồ Chí Minh',
        daysLeft: 25,
        logo: null,
        type: 'Full-time',
        experience: '2-4 năm',
        level: 'Nhân viên',
        quantity: 5,
        gender: 'Nam',
        deadline: '10/06/2026',
        description: `
            <p>Tuyển dụng Kỹ Sư Xây Dựng Cầu Đường cho dự án lớn tại Long An.</p>
            <p>Cơ hội làm việc với các dự án hạ tầng quy mô lớn và phát triển chuyên môn.</p>
        `,
        requirements: [
            'Tốt nghiệp Đại học chuyên ngành Xây dựng Cầu Đường',
            'Có 2-4 năm kinh nghiệm trong lĩnh vực xây dựng',
            'Thành thạo AutoCAD, Civil 3D',
            'Có khả năng đọc và hiểu bản vẽ kỹ thuật',
            'Chịu được áp lực công việc cao',
        ],
        benefits: [
            'Lương từ 12-18 triệu + phụ cấp công trình',
            'Bảo hiểm đầy đủ',
            'Hỗ trợ nhà ở tại công trường',
            'Thưởng theo tiến độ dự án',
            'Cơ hội thăng tiến',
        ],
        responsibilities: [
            'Giám sát thi công các hạng mục cầu đường',
            'Kiểm tra chất lượng công trình',
            'Lập báo cáo tiến độ',
            'Phối hợp với các bên liên quan',
        ],
        companyInfo: {
            name: 'Công ty Xây Dựng XYZ',
            size: '500-1000 nhân viên',
            field: 'Xây dựng / Hạ tầng',
            address: '456 Nguyễn Văn Linh, Quận 7, TP.HCM',
            website: 'https://xaydung-xyz.vn',
            description: 'Công ty Xây Dựng XYZ chuyên thực hiện các dự án hạ tầng giao thông lớn trên toàn quốc.',
        },
    },
    3: {
        id: 3,
        title: 'Nhân Viên Kế Toán Tổng Hợp',
        company: 'Công ty Tài Chính DEF',
        salary: '8-12 triệu',
        location: 'Đà Nẵng',
        daysLeft: 5,
        logo: null,
        type: 'Full-time',
        experience: '1-2 năm',
        level: 'Nhân viên',
        quantity: 1,
        gender: 'Không yêu cầu',
        deadline: '21/05/2026',
        description: `
            <p>Tuyển dụng Nhân Viên Kế Toán Tổng Hợp có kinh nghiệm.</p>
            <p>Môi trường làm việc chuyên nghiệp trong lĩnh vực tài chính.</p>
        `,
        requirements: [
            'Tốt nghiệp Đại học chuyên ngành Kế toán, Tài chính',
            'Có 1-2 năm kinh nghiệm kế toán tổng hợp',
            'Thành thạo Excel, phần mềm kế toán',
            'Cẩn thận, tỉ mỉ, trung thực',
            'Có chứng chỉ kế toán là một lợi thế',
        ],
        benefits: [
            'Lương 8-12 triệu + thưởng',
            'Bảo hiểm đầy đủ',
            'Làm việc giờ hành chính',
            'Môi trường chuyên nghiệp',
            'Đào tạo nghiệp vụ',
        ],
        responsibilities: [
            'Hạch toán các nghiệp vụ kế toán',
            'Lập báo cáo tài chính',
            'Kiểm tra chứng từ',
            'Quyết toán thuế',
        ],
        companyInfo: {
            name: 'Công ty Tài Chính DEF',
            size: '50-100 nhân viên',
            field: 'Tài chính / Ngân hàng',
            address: '789 Lê Duẩn, Hải Châu, Đà Nẵng',
            website: 'https://taichinh-def.vn',
            description: 'Công ty Tài Chính DEF cung cấp các dịch vụ tài chính và tư vấn đầu tư chuyên nghiệp.',
        },
    },
};


// ─────────────────────────────────────────────
// HELPER: getApplyButtonClasses
// Returns Tailwind classes for the "Ứng tuyển ngay" button.
// Gray and disabled when already applied, purple and clickable otherwise.
// ─────────────────────────────────────────────

function getApplyButtonClasses(applied) {
    const base = 'flex-1 py-3 rounded-lg font-semibold transition-all';

    if (applied) {
        return base + ' bg-gray-300 text-gray-600 cursor-not-allowed';
    } else {
        return base + ' bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg';
    }
}


// ─────────────────────────────────────────────
// HELPER: getStickyApplyButtonClasses
// Same logic as getApplyButtonClasses but full-width (used in the sticky sidebar).
// ─────────────────────────────────────────────

function getStickyApplyButtonClasses(applied) {
    const base = 'w-full mt-6 py-3 rounded-lg font-semibold transition-all';

    if (applied) {
        return base + ' bg-gray-300 text-gray-600 cursor-not-allowed';
    } else {
        return base + ' bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg';
    }
}


// ─────────────────────────────────────────────
// HELPER: getApplyButtonLabel
// Returns the label text for the apply button.
// ─────────────────────────────────────────────

function getApplyButtonLabel(applied) {
    if (applied) {
        return '✓ Đã ứng tuyển';
    } else {
        return 'Ứng tuyển ngay';
    }
}


// ─────────────────────────────────────────────
// HELPER: getSaveButtonClasses
// Returns Tailwind classes for the save/bookmark button.
// Red border when saved, gray border otherwise.
// ─────────────────────────────────────────────

function getSaveButtonClasses(saved) {
    const base = 'px-6 py-3 rounded-lg font-semibold border-2 transition-all';

    if (saved) {
        return base + ' border-red-500 text-red-500 bg-red-50';
    } else {
        return base + ' border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600';
    }
}


// ─────────────────────────────────────────────
// HELPER: getSaveButtonLabel
// Returns the label text for the save button.
// ─────────────────────────────────────────────

function getSaveButtonLabel(saved) {
    if (saved) {
        return '❤️ Đã lưu';
    } else {
        return '🤍 Lưu';
    }
}


// ─────────────────────────────────────────────
// HELPER: getUrgentIcon
// Returns the icon for the "time remaining" info card.
// Warning icon when the deadline is very close (≤ 7 days).
// ─────────────────────────────────────────────

function getUrgentIcon(daysLeft) {
    if (daysLeft <= 7) {
        return '⚠️';
    } else {
        return '⏳';
    }
}


// ─────────────────────────────────────────────
// COMPONENT: InfoItem
// A small card showing a single piece of job info (icon + label + value).
// Used in the sticky summary sidebar on the right.
// ─────────────────────────────────────────────

function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl">{icon}</span>
            <div>
                <div className="text-xs text-gray-500 mb-1">{label}</div>
                <div className="text-sm font-semibold text-gray-800">{value}</div>
            </div>
        </div>
    );
}


// ─────────────────────────────────────────────
// COMPONENT: Section
// A white card with a header (icon + title) and any children inside.
// Used to wrap each major section of the job detail page.
// ─────────────────────────────────────────────

function Section({ icon, title, children }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{icon}</span>
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            </div>
            {children}
        </div>
    );
}


// ─────────────────────────────────────────────
// COMPONENT: CompanyLogo
// Shows the company's logo image if one exists,
// or falls back to displaying the first letter of the company name.
// ─────────────────────────────────────────────

function CompanyLogo({ logo, companyName }) {
    if (logo) {
        return (
            <img src={logo} alt={companyName} className="w-full h-full object-cover rounded-xl" />
        );
    } else {
        return (
            <span className="text-3xl font-bold text-purple-600">
                {companyName.charAt(0)}
            </span>
        );
    }
}


// ─────────────────────────────────────────────
// PAGE: JobDetailPage
// Loads a job by id from the URL params, then renders the full detail view.
// Redirects to "/" if the id is not found in the mock data.
// ─────────────────────────────────────────────

const JobDetailPage = () => {
    const { id }   = useParams();
    const navigate = useNavigate();

    const [job,     setJob]     = useState(null);
    const [saved,   setSaved]   = useState(false);
    const [applied, setApplied] = useState(false);


    // ── Load job data on mount ──
    // Looks up the job by id. If not found, redirects to the home page.

    useEffect(function() {
        const jobData = mockJobDetails[id];

        if (jobData) {
            setJob(jobData);
        } else {
            navigate('/');
        }
    }, [id, navigate]);


    // ── Loading state ──
    // Shown while job data hasn't been set yet.

    if (!job) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <div className="text-gray-600">Đang tải...</div>
                </div>
            </div>
        );
    }


    // ── handleSave ──
    // Toggles the saved state on/off.

    function handleSave() {
        if (saved) {
            setSaved(false);
        } else {
            setSaved(true);
        }
    }


    // ── handleApply ──
    // Marks the job as applied. Shows an alert if already applied.

    function handleApply() {
        if (applied) {
            alert('Bạn đã ứng tuyển công việc này rồi!');
        } else {
            setApplied(true);
            alert('Ứng tuyển thành công! Nhà tuyển dụng sẽ liên hệ với bạn sớm.');
        }
    }


    // ── urgentIcon ──
    // Decides the icon for the time-remaining card based on days left.

    const urgentIcon = getUrgentIcon(job.daysLeft);

    // True when deadline is within 7 days — used to show the red warning banner.
    const isUrgent = job.daysLeft <= 7;


    // ── Render ──

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            {/* Red urgent banner — only shown when deadline is within 7 days */}
            {isUrgent && (
                <div className="bg-red-500 text-white text-center py-3 font-semibold">
                    ⚡ Công việc này sắp hết hạn - chỉ còn {job.daysLeft} ngày để ứng tuyển!
                </div>
            )}

            <div className="max-w-6xl mx-auto px-8 py-8 w-full flex-1">

                {/* Back button */}
                <button
                    onClick={function() { navigate(-1); }}
                    className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
                >
                    <span>←</span>
                    <span className="font-medium">Quay lại</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Left column: job detail sections ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Job header card */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex gap-4 mb-4">

                                {/* Company logo or initial letter */}
                                <div className="w-20 h-20 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 shrink-0">
                                    <CompanyLogo logo={job.logo} companyName={job.company} />
                                </div>

                                {/* Title + company + tags */}
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h1>
                                    <p className="text-gray-600 mb-3">{job.company}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1 text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium">
                                            💰 {job.salary}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                                            📍 {job.location}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-sm bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full font-medium">
                                            💼 {job.type}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Apply + Save buttons */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleApply}
                                    className={getApplyButtonClasses(applied)}
                                    disabled={applied}
                                >
                                    {getApplyButtonLabel(applied)}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className={getSaveButtonClasses(saved)}
                                >
                                    {getSaveButtonLabel(saved)}
                                </button>
                            </div>
                        </div>

                        {/* Job description */}
                        <Section icon="📋" title="Mô tả công việc">
                            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: job.description }} />
                        </Section>

                        {/* Responsibilities */}
                        <Section icon="✅" title="Trách nhiệm công việc">
                            <ul className="space-y-2">
                                {job.responsibilities.map(function(item, index) {
                                    return (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-purple-600 mt-1">•</span>
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Section>

                        {/* Requirements */}
                        <Section icon="📌" title="Yêu cầu công việc">
                            <ul className="space-y-2">
                                {job.requirements.map(function(item, index) {
                                    return (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-purple-600 mt-1">•</span>
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Section>

                        {/* Benefits */}
                        <Section icon="🎁" title="Quyền lợi">
                            <ul className="space-y-2">
                                {job.benefits.map(function(item, index) {
                                    return (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-green-600 mt-1">✓</span>
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Section>

                        {/* Company info */}
                        <Section icon="🏢" title="Thông tin công ty">
                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Tên công ty</div>
                                    <div className="font-semibold text-gray-800">{job.companyInfo.name}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Quy mô</div>
                                    <div className="text-gray-700">{job.companyInfo.size}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Lĩnh vực</div>
                                    <div className="text-gray-700">{job.companyInfo.field}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Địa chỉ</div>
                                    <div className="text-gray-700">{job.companyInfo.address}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Website</div>
                                    <a href={job.companyInfo.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                        {job.companyInfo.website}
                                    </a>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Giới thiệu</div>
                                    <div className="text-gray-700 leading-relaxed">{job.companyInfo.description}</div>
                                </div>
                            </div>
                        </Section>

                    </div>

                    {/* ── Right column: sticky summary + related jobs ── */}
                    <div className="space-y-6">

                        {/* Sticky info card */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm sticky top-6">
                            <h3 className="font-bold text-gray-800 mb-4">Thông tin chung</h3>
                            <div className="space-y-3">
                                <InfoItem icon="💼"  label="Cấp bậc"           value={job.level}                  />
                                <InfoItem icon="⏱️"  label="Kinh nghiệm"       value={job.experience}             />
                                <InfoItem icon="👥"  label="Số lượng"          value={job.quantity + ' người'}    />
                                <InfoItem icon="⚧️"  label="Giới tính"         value={job.gender}                 />
                                <InfoItem icon="📅"  label="Hạn nộp"           value={job.deadline}               />
                                <InfoItem icon={urgentIcon} label="Thời gian còn lại" value={job.daysLeft + ' ngày'} />
                            </div>

                            {/* Sticky apply button */}
                            <button
                                onClick={handleApply}
                                className={getStickyApplyButtonClasses(applied)}
                                disabled={applied}
                            >
                                {getApplyButtonLabel(applied)}
                            </button>
                        </div>

                        {/* Related jobs (static placeholders) */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4">Việc làm liên quan</h3>
                            <div className="space-y-3">
                                <div className="p-3 border border-gray-100 rounded-lg hover:border-purple-300 cursor-pointer transition-all">
                                    <div className="font-semibold text-sm text-gray-800 mb-1">Senior Developer</div>
                                    <div className="text-xs text-gray-500">Công ty ABC</div>
                                    <div className="text-xs text-green-600 font-medium mt-2">20-30 triệu</div>
                                </div>
                                <div className="p-3 border border-gray-100 rounded-lg hover:border-purple-300 cursor-pointer transition-all">
                                    <div className="font-semibold text-sm text-gray-800 mb-1">Project Manager</div>
                                    <div className="text-xs text-gray-500">Công ty XYZ</div>
                                    <div className="text-xs text-green-600 font-medium mt-2">25-35 triệu</div>
                                </div>
                                <div className="p-3 border border-gray-100 rounded-lg hover:border-purple-300 cursor-pointer transition-all">
                                    <div className="font-semibold text-sm text-gray-800 mb-1">Business Analyst</div>
                                    <div className="text-xs text-gray-500">Công ty DEF</div>
                                    <div className="text-xs text-green-600 font-medium mt-2">15-20 triệu</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default JobDetailPage;