import { useState, useRef } from 'react';

const CATEGORIES = [
    'Công nghệ thông tin',
    'Marketing / PR',
    'Thiết kế',
    'Kế toán / Kiểm toán',
    'Kinh doanh / Bán hàng',
    'Nhân sự',
    'Dịch vụ khách hàng',
];

const UserProfileModal = ({ isOpen, onClose, userName, userEmail }) => {
    const [profile, setProfile] = useState({
        name: userName || 'Người dùng',
        dob: '1999-05-15',
        gender: 'Nam',
        phone: '0987654321',
        address: 'Hà Nội',
        email: userEmail || 'user@email.com',
        position: 'Lập Trình Viên Full Stack',
        experience: '2-3 năm',
        skills: 'React, Node.js, Python, SQL',
        industry: 'Công nghệ thông tin',
        jobType: 'Full-time',
        bio: 'Lập trình viên đam mê công nghệ, có 2 năm kinh nghiệm phát triển web full stack.',
    });
    const [cvFile, setCvFile] = useState(null);
    const [saved, setSaved] = useState(false);
    const fileRef = useRef();

    // Cập nhật một trường trong profile
    const setField = (key, value) => {
        setProfile(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // TODO: Gửi dữ liệu lên server
        // const formData = new FormData();
        // formData.append('name', profile.name);
        // ... thêm các field khác

        // Hiển thị thông báo thành công
        setSaved(true);
        setCvFile(null);
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

    // Đóng modal khi click vào backdrop
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Lấy chữ cái đầu của tên để hiển thị avatar
    const getInitials = (name) => {
        const words = name.split(' ');
        const lastTwo = words.slice(-2);
        return lastTwo.map(w => w[0]).join('').toUpperCase();
    };

    if (!isOpen) return null;

    const inputStyle = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500';
    const textareaStyle = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500 resize-vertical font-sans';

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-[9999] p-6"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-600 to-purple-500">
                    <h2 className="text-xl font-bold text-white">Chỉnh sửa thông tin cá nhân</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6">

                    {/* Avatar và tên người dùng */}
                    <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
                        <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            {getInitials(profile.name)}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{profile.position} · {profile.experience}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="flex flex-col gap-5">

                        {/* Thông tin cá nhân */}
                        <div>
                            <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                                Thông tin cá nhân
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={e => setField('name', e.target.value)}
                                        className={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={e => setField('email', e.target.value)}
                                        className={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={e => setField('phone', e.target.value)}
                                        className={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày sinh</label>
                                    <input
                                        type="date"
                                        value={profile.dob}
                                        onChange={e => setField('dob', e.target.value)}
                                        className={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Giới tính</label>
                                    <select
                                        value={profile.gender}
                                        onChange={e => setField('gender', e.target.value)}
                                        className={inputStyle}
                                    >
                                        <option>Nam</option>
                                        <option>Nữ</option>
                                        <option>Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ</label>
                                    <input
                                        type="text"
                                        value={profile.address}
                                        onChange={e => setField('address', e.target.value)}
                                        className={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Thông tin nghề nghiệp */}
                        <div>
                            <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                                Thông tin nghề nghiệp
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Vị trí mong muốn</label>
                                    <input
                                        type="text"
                                        value={profile.position}
                                        onChange={e => setField('position', e.target.value)}
                                        className={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Kinh nghiệm</label>
                                    <select
                                        value={profile.experience}
                                        onChange={e => setField('experience', e.target.value)}
                                        className={inputStyle}
                                    >
                                        <option>Không yêu cầu</option>
                                        <option>Dưới 1 năm</option>
                                        <option>1-2 năm</option>
                                        <option>2-3 năm</option>
                                        <option>3-5 năm</option>
                                        <option>Trên 5 năm</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngành nghề</label>
                                    <select
                                        value={profile.industry}
                                        onChange={e => setField('industry', e.target.value)}
                                        className={inputStyle}
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại công việc mong muốn</label>
                                    <select
                                        value={profile.jobType}
                                        onChange={e => setField('jobType', e.target.value)}
                                        className={inputStyle}
                                    >
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Freelancer</option>
                                        <option>Thực tập</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Kỹ năng */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Kỹ năng <span className="text-gray-400 font-normal">(phân cách bằng dấu phẩy)</span>
                            </label>
                            <input
                                value={profile.skills}
                                onChange={e => setField('skills', e.target.value)}
                                placeholder="React, Node.js, Python..."
                                className={inputStyle}
                            />
                            {/* Hiển thị kỹ năng dạng tag */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {profile.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                                    <span key={s} className="text-xs px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-medium">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Giới thiệu bản thân */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Giới thiệu bản thân</label>
                            <textarea
                                value={profile.bio}
                                onChange={e => setField('bio', e.target.value)}
                                rows={4}
                                className={textareaStyle}
                            />
                        </div>

                        {/* Upload CV */}
                        <div>
                            <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                                Upload CV
                            </h3>
                            <div
                                onClick={handleClickUpload}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                            >
                                {cvFile ? (
                                    <div className="text-purple-600 font-medium text-sm">📄 {cvFile.name}</div>
                                ) : (
                                    <>
                                        <div className="text-4xl mb-2">📤</div>
                                        <div className="text-sm font-medium text-gray-700 mb-1">Tải CV lên</div>
                                        <div className="text-xs text-gray-400">PDF, DOC, DOCX - tối đa 5MB</div>
                                    </>
                                )}
                            </div>
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Nút lưu */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                            >
                                {saved ? '✓ Đã lưu!' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
