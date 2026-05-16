import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Home/Header';
import Footer from '../components/Home/Footer';

// Dữ liệu giả chi tiết công việc
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
            'Có khả năng làm việc độc lập và chịu áp lực cao'
        ],
        benefits: [
            'Lương cạnh tranh từ 15-20 triệu + thưởng theo hiệu quả',
            'Bảo hiểm đầy đủ theo quy định',
            'Môi trường làm việc chuyên nghiệp, năng động',
            'Cơ hội thăng tiến rõ ràng',
            'Đào tạo và phát triển kỹ năng thường xuyên',
            'Team building, du lịch hàng năm'
        ],
        responsibilities: [
            'Xây dựng và triển khai các chương trình đào tạo',
            'Quản lý và phát triển đội ngũ giảng viên',
            'Đánh giá hiệu quả đào tạo và cải tiến liên tục',
            'Phối hợp với các phòng ban khác để đảm bảo chất lượng đào tạo',
            'Báo cáo định kỳ cho Ban Giám Đốc'
        ],
        companyInfo: {
            name: 'Công ty TNHH Giáo Dục ABC',
            size: '200-500 nhân viên',
            field: 'Giáo dục / Đào tạo',
            address: '123 Đường Láng, Đống Đa, Hà Nội',
            website: 'https://giaoduc-abc.vn',
            description: 'Công ty TNHH Giáo Dục ABC là một trong những tập đoàn giáo dục hàng đầu Việt Nam với hơn 15 năm kinh nghiệm trong lĩnh vực đào tạo và phát triển nguồn nhân lực.'
        }
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
            'Chịu được áp lực công việc cao'
        ],
        benefits: [
            'Lương từ 12-18 triệu + phụ cấp công trình',
            'Bảo hiểm đầy đủ',
            'Hỗ trợ nhà ở tại công trường',
            'Thưởng theo tiến độ dự án',
            'Cơ hội thăng tiến'
        ],
        responsibilities: [
            'Giám sát thi công các hạng mục cầu đường',
            'Kiểm tra chất lượng công trình',
            'Lập báo cáo tiến độ',
            'Phối hợp với các bên liên quan'
        ],
        companyInfo: {
            name: 'Công ty Xây Dựng XYZ',
            size: '500-1000 nhân viên',
            field: 'Xây dựng / Hạ tầng',
            address: '456 Nguyễn Văn Linh, Quận 7, TP.HCM',
            website: 'https://xaydung-xyz.vn',
            description: 'Công ty Xây Dựng XYZ chuyên thực hiện các dự án hạ tầng giao thông lớn trên toàn quốc.'
        }
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
            'Có chứng chỉ kế toán là một lợi thế'
        ],
        benefits: [
            'Lương 8-12 triệu + thưởng',
            'Bảo hiểm đầy đủ',
            'Làm việc giờ hành chính',
            'Môi trường chuyên nghiệp',
            'Đào tạo nghiệp vụ'
        ],
        responsibilities: [
            'Hạch toán các nghiệp vụ kế toán',
            'Lập báo cáo tài chính',
            'Kiểm tra chứng từ',
            'Quyết toán thuế'
        ],
        companyInfo: {
            name: 'Công ty Tài Chính DEF',
            size: '50-100 nhân viên',
            field: 'Tài chính / Ngân hàng',
            address: '789 Lê Duẩn, Hải Châu, Đà Nẵng',
            website: 'https://taichinh-def.vn',
            description: 'Công ty Tài Chính DEF cung cấp các dịch vụ tài chính và tư vấn đầu tư chuyên nghiệp.'
        }
    }
};

// Component hiển thị thông tin cơ bản
const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        <span className="text-2xl">{icon}</span>
        <div>
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="text-sm font-semibold text-gray-800">{value}</div>
        </div>
    </div>
);

// Component section với tiêu đề
const Section = ({ icon, title, children }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{icon}</span>
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
        {children}
    </div>
);

const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [saved, setSaved] = useState(false);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        // Lấy thông tin công việc từ mock data
        const jobData = mockJobDetails[id];
        if (jobData) {
            setJob(jobData);
        } else {
            // Nếu không tìm thấy, chuyển về trang chủ
            navigate('/');
        }
    }, [id, navigate]);

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

    const handleSave = () => {
        setSaved(!saved);
    };

    const handleApply = () => {
        if (applied) {
            alert('Bạn đã ứng tuyển công việc này rồi!');
        } else {
            setApplied(true);
            alert('Ứng tuyển thành công! Nhà tuyển dụng sẽ liên hệ với bạn sớm.');
        }
    };

    const urgent = job.daysLeft <= 7;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            {/* Banner cảnh báo gấp */}
            {urgent && (
                <div className="bg-red-500 text-white text-center py-3 font-semibold">
                    ⚡ Công việc này sắp hết hạn - chỉ còn {job.daysLeft} ngày để ứng tuyển!
                </div>
            )}

            <div className="max-w-6xl mx-auto px-8 py-8 w-full flex-1">
                {/* Nút quay lại */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
                >
                    <span>←</span>
                    <span className="font-medium">Quay lại</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cột chính - Thông tin chi tiết */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header công việc */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex gap-4 mb-4">
                                {/* Logo công ty */}
                                <div className="w-20 h-20 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 shrink-0">
                                    {job.logo ? (
                                        <img src={job.logo} alt={job.company} className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <span className="text-3xl font-bold text-purple-600">{job.company.charAt(0)}</span>
                                    )}
                                </div>

                                {/* Tiêu đề và công ty */}
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

                            {/* Nút hành động */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleApply}
                                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${applied
                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                                        }`}
                                    disabled={applied}
                                >
                                    {applied ? '✓ Đã ứng tuyển' : 'Ứng tuyển ngay'}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className={`px-6 py-3 rounded-lg font-semibold border-2 transition-all ${saved
                                            ? 'border-red-500 text-red-500 bg-red-50'
                                            : 'border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600'
                                        }`}
                                >
                                    {saved ? '❤️ Đã lưu' : '🤍 Lưu'}
                                </button>
                            </div>
                        </div>

                        {/* Mô tả công việc */}
                        <Section icon="📋" title="Mô tả công việc">
                            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: job.description }} />
                        </Section>

                        {/* Trách nhiệm công việc */}
                        <Section icon="✅" title="Trách nhiệm công việc">
                            <ul className="space-y-2">
                                {job.responsibilities.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-purple-600 mt-1">•</span>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </Section>

                        {/* Yêu cầu công việc */}
                        <Section icon="📌" title="Yêu cầu công việc">
                            <ul className="space-y-2">
                                {job.requirements.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-purple-600 mt-1">•</span>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </Section>

                        {/* Quyền lợi */}
                        <Section icon="🎁" title="Quyền lợi">
                            <ul className="space-y-2">
                                {job.benefits.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-green-600 mt-1">✓</span>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </Section>

                        {/* Thông tin công ty */}
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

                    {/* Cột sidebar - Thông tin tóm tắt */}
                    <div className="space-y-6">
                        {/* Thông tin cơ bản */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm sticky top-6">
                            <h3 className="font-bold text-gray-800 mb-4">Thông tin chung</h3>
                            <div className="space-y-3">
                                <InfoItem icon="💼" label="Cấp bậc" value={job.level} />
                                <InfoItem icon="⏱️" label="Kinh nghiệm" value={job.experience} />
                                <InfoItem icon="👥" label="Số lượng" value={`${job.quantity} người`} />
                                <InfoItem icon="⚧️" label="Giới tính" value={job.gender} />
                                <InfoItem icon="📅" label="Hạn nộp" value={job.deadline} />
                                <InfoItem
                                    icon={urgent ? "⚠️" : "⏳"}
                                    label="Thời gian còn lại"
                                    value={`${job.daysLeft} ngày`}
                                />
                            </div>

                            {/* Nút ứng tuyển sticky */}
                            <button
                                onClick={handleApply}
                                className={`w-full mt-6 py-3 rounded-lg font-semibold transition-all ${applied
                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                                    }`}
                                disabled={applied}
                            >
                                {applied ? '✓ Đã ứng tuyển' : 'Ứng tuyển ngay'}
                            </button>
                        </div>

                        {/* Việc làm liên quan */}
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
