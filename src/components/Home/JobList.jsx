import JobCard from './JobCard';

const mockJobs = [
    { id: 1, title: 'Trưởng Phòng Đào Tạo – Tập Đoàn Giáo Dục Lớn', company: 'Công ty TNHH Giáo Dục ABC', salary: '15–20 triệu', location: 'Hà Nội', daysLeft: 30, logo: null },
    { id: 2, title: 'Kỹ Sư Xây Dựng Cầu Đường – Dự Án Long An', company: 'Công ty Xây Dựng XYZ', salary: '12–18 triệu', location: 'Hồ Chí Minh', daysLeft: 25, logo: null },
    { id: 3, title: 'Nhân Viên Kế Toán Tổng Hợp', company: 'Công ty Tài Chính DEF', salary: '8–12 triệu', location: 'Đà Nẵng', daysLeft: 5, logo: null },
    { id: 4, title: 'Nhân Viên Kinh Doanh Bất Động Sản', company: 'Công ty BĐS GHI', salary: '10–15 triệu + KPI', location: 'Hà Nội', daysLeft: 15, logo: null },
    { id: 5, title: 'Lập Trình Viên Full Stack – ReactJS & Node.js', company: 'Công ty Công Nghệ JKL', salary: '20–35 triệu', location: 'Hồ Chí Minh', daysLeft: 28, logo: null },
    { id: 6, title: 'Nhân Viên Marketing – Digital Marketing', company: 'Công ty Truyền Thông MNO', salary: '10–15 triệu', location: 'Hà Nội', daysLeft: 3, logo: null },
];

const SectionHeader = ({ title, link }) => (
    <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-600 rounded-full block" />
            <h2 className="font-bold text-lg text-gray-800">{title}</h2>
        </div>
        <a href={link} className="text-sm text-purple-600 hover:text-purple-700 font-medium hover:underline no-underline">
            Xem tất cả →
        </a>
    </div>
);

const JobList = () => (
    <div className="flex-1">
        {/* Banner */}
        <div className="w-full h-44 rounded-xl bg-linear-to-r from-blue-600 to-indigo-700 mb-8 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-md">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -left-4 -bottom-6 w-28 h-28 bg-white/10 rounded-full" />
            <div className="text-4xl font-black tracking-tight relative">JobHot</div>
            <div className="text-blue-200 text-sm mt-1 relative">Tuyển dụng & tìm việc – Nhanh – Đúng – Chuẩn</div>
        </div>

        {/* Danh mục nhanh */}
        <div className="grid grid-cols-4 gap-3 mb-8">
            {[
                { icon: '💻', label: 'IT / Tech', count: '5,200' },
                { icon: '📊', label: 'Kế toán', count: '3,100' },
                { icon: '🎨', label: 'Thiết kế', count: '1,800' },
                { icon: '📣', label: 'Marketing', count: '2,700' },
            ].map(cat => (
                <button key={cat.label} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center gap-2 hover:border-purple-300 hover:shadow-sm transition-all group">
                    <span className="text-2xl">{cat.icon}</span>
                    <div className="text-xs font-semibold text-gray-700 group-hover:text-purple-700">{cat.label}</div>
                    <div className="text-xs text-gray-400">{cat.count} việc</div>
                </button>
            ))}
        </div>

        {/* Việc làm tốt nhất */}
        <SectionHeader title="Việc làm tốt nhất" link="/jobs" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {mockJobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>

        {/* Việc làm hấp dẫn */}
        <SectionHeader title="Việc làm hấp dẫn" link="/jobs/featured" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockJobs.slice(0, 3).map(job => <JobCard key={job.id} job={job} />)}
        </div>
    </div>
);

export default JobList;