import JobCard from './JobCard';

// ─────────────────────────────────────────────
// MOCK DATA
// Default job listings shown before any filter is applied.
// When the Sidebar sends filtered results via the onFilter prop in Home.jsx,
// those results are passed here as the "filteredJobs" prop and shown instead.
// ─────────────────────────────────────────────

const mockJobs = [
    { id: 1, title: 'Trưởng Phòng Đào Tạo - Tập Đoàn Giáo Dục Lớn', company: 'Công ty TNHH Giáo Dục ABC', salary: '15-20 triệu', location: 'Hà Nội', daysLeft: 30, logo: null },
    { id: 2, title: 'Kỹ Sư Xây Dựng Cầu Đường - Dự Án Long An', company: 'Công ty Xây Dựng XYZ', salary: '12-18 triệu', location: 'Hồ Chí Minh', daysLeft: 25, logo: null },
    { id: 3, title: 'Nhân Viên Kế Toán Tổng Hợp', company: 'Công ty Tài Chính DEF', salary: '8-12 triệu', location: 'Đà Nẵng', daysLeft: 5, logo: null },
    { id: 4, title: 'Nhân Viên Kinh Doanh Bất Động Sản', company: 'Công ty BĐS GHI', salary: '10-15 triệu + KPI', location: 'Hà Nội', daysLeft: 15, logo: null },
    { id: 5, title: 'Lập Trình Viên Full Stack - ReactJS & Node.js', company: 'Công ty Công Nghệ JKL', salary: '20-35 triệu', location: 'Hồ Chí Minh', daysLeft: 28, logo: null },
    { id: 6, title: 'Nhân Viên Marketing - Digital Marketing', company: 'Công ty Truyền Thông MNO', salary: '10-15 triệu', location: 'Hà Nội', daysLeft: 3, logo: null },
];


// ─────────────────────────────────────────────
// DATA: CATEGORIES
// Quick-access industry category buttons shown above the job grid.
// ─────────────────────────────────────────────

const categories = [
    { icon: '💻', label: 'IT / Tech', count: '5,200' },
    { icon: '📊', label: 'Kế toán', count: '3,100' },
    { icon: '🎨', label: 'Thiết kế', count: '1,800' },
    { icon: '📣', label: 'Marketing', count: '2,700' },
];


// ─────────────────────────────────────────────
// DATA: featuredJobs
// The first 3 jobs from the default list, shown in the "Việc làm hấp dẫn" section.
// ─────────────────────────────────────────────

const featuredJobs = [];
for (let i = 0; i < 3; i++) {
    featuredJobs.push(mockJobs[i]);
}


// ─────────────────────────────────────────────
// COMPONENT: SectionHeader
// A row with a colored bar + title on the left and a "Xem tất cả" link on the right.
// Used above each job grid section.
// ─────────────────────────────────────────────

function SectionHeader({ title, link }) {
    return (
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
}


// ─────────────────────────────────────────────
// COMPONENT: FilteredResults
// Shown when the Sidebar has sent back filtered results.
// Displays the number of matches and the job cards,
// or an empty state message if nothing matched.
//
// Props:
//   jobs - the filtered job array received from the backend via Home.jsx
// ─────────────────────────────────────────────

function FilteredResults({ jobs }) {
    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="text-5xl mb-4">🔍</div>
                <div className="text-base font-semibold text-gray-600 mb-2">
                    Không tìm thấy việc làm phù hợp
                </div>
                <div className="text-sm">Thử thay đổi bộ lọc để xem thêm kết quả</div>
            </div>
        );
    }

    return (
        <div>
            <p className="text-sm text-gray-500 mb-5">
                Tìm thấy <span className="font-semibold text-gray-800">{jobs.length}</span> việc làm phù hợp
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map(function (job) {
                    return <JobCard key={job.id} job={job} />;
                })}
            </div>
        </div>
    );
}


// ─────────────────────────────────────────────
// COMPONENT: DefaultResults
// Shown on first load before any filter is applied.
// Displays the ad banner, category quick-links, and two job grid sections.
// ─────────────────────────────────────────────

function DefaultResults() {
    return (
        <div>

            {/* Ad banner */}
            <div className="w-full h-44 rounded-xl bg-linear-to-r from-blue-600 to-indigo-700 mb-8 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-md">
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute -left-4 -bottom-6 w-28 h-28 bg-white/10 rounded-full" />
                <div className="text-4xl font-black tracking-tight relative">JobHot</div>
                <div className="text-blue-200 text-sm mt-1 relative">Tuyển dụng & tìm việc - Nhanh - Đúng - Chuẩn</div>
            </div>

            {/* Quick category buttons */}
            <div className="grid grid-cols-4 gap-3 mb-8">
                {categories.map(function (cat) {
                    return (
                        <button key={cat.label} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center gap-2 hover:border-purple-300 hover:shadow-sm transition-all group">
                            <span className="text-2xl">{cat.icon}</span>
                            <div className="text-xs font-semibold text-gray-700 group-hover:text-purple-700">{cat.label}</div>
                            <div className="text-xs text-gray-400">{cat.count} việc</div>
                        </button>
                    );
                })}
            </div>

            {/* Best jobs — full list */}
            <SectionHeader title="Việc làm tốt nhất" link="/jobs" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {mockJobs.map(function (job) {
                    return <JobCard key={job.id} job={job} />;
                })}
            </div>

            {/* Featured jobs — first 3 only */}
            <SectionHeader title="Việc làm hấp dẫn" link="/jobs/featured" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredJobs.map(function (job) {
                    return <JobCard key={job.id} job={job} />;
                })}
            </div>

        </div>
    );
}


// ─────────────────────────────────────────────
// COMPONENT: JobList
// The main content column on the Home page.
//
// Props:
//   filteredJobs - array of jobs returned by the backend after a filter is applied,
//                  or null when no filter has been applied yet.
//
// When filteredJobs is null  → show DefaultResults (ad banner + full mock list).
// When filteredJobs is array → show FilteredResults (filtered count + cards).
// ─────────────────────────────────────────────

const JobList = ({ filteredJobs }) => {

    // null means no filter has been applied yet → show the default home content.
    // An array (even an empty one) means the filter ran → show filtered results.

    let content;

    if (filteredJobs === null) {
        content = <DefaultResults />;
    } else {
        content = <FilteredResults jobs={filteredJobs} />;
    }

    return (
        <div className="flex-1">
            {content}
        </div>
    );
};

export default JobList;