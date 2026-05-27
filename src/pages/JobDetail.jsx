import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Home/Header';
import Footer from '../components/Home/Footer';



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

const API = '/server/index.php';

const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [saved, setSaved] = useState(false);
    const [applied, setApplied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // ── Load job data on mount ──
    // Fetches job details from the backend API

    useEffect(function () {
        const fetchJob = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(API + `?action=get-job&id=${id}`);
                const data = await response.json();

                if (data.success && data.data) {
                    setJob(data.data);
                } else {
                    setError('Job not found');
                    setTimeout(() => navigate('/'), 2000);
                }
            } catch (error) {
                console.error('Error fetching job:', error);
                setError('Failed to load job details');
                setTimeout(() => navigate('/'), 2000);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJob();
        }
    }, [id, navigate]);


    // ── Loading state ──
    // Shown while job data is being fetched

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <div className="text-gray-600">Đang tải thông tin công việc...</div>
                </div>
            </div>
        );
    }

    // ── Error state ──
    // Shown if job fails to load

    if (error || !job) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-4xl mb-4">❌</div>
                    <div className="text-gray-600 mb-2">{error || 'Không tìm thấy công việc'}</div>
                    <div className="text-sm text-gray-500">Đang chuyển hướng về trang chủ...</div>
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
                    onClick={function () { navigate(-1); }}
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
                                {job.responsibilities.map(function (item, index) {
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
                                {job.requirements.map(function (item, index) {
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
                                {job.benefits.map(function (item, index) {
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
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm top-6">
                            <h3 className="font-bold text-gray-800 mb-4">Thông tin chung</h3>
                            <div className="space-y-3">
                                <InfoItem icon="💼" label="Cấp bậc" value={job.level} />
                                <InfoItem icon="⏱️" label="Kinh nghiệm" value={job.experience} />
                                <InfoItem icon="👥" label="Số lượng" value={job.quantity + ' người'} />
                                <InfoItem icon="⚧️" label="Giới tính" value={job.gender} />
                                <InfoItem icon="📅" label="Hạn nộp" value={job.deadline} />
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