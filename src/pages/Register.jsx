import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = '/server/index.php';

const SpinnerIcon = () => (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
);

const getStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
};
const strengthConfig = [
    { label: '', color: 'bg-gray-200' },
    { label: 'Yếu', color: 'bg-red-400' },
    { label: 'Trung bình', color: 'bg-yellow-400' },
    { label: 'Tốt', color: 'bg-blue-400' },
    { label: 'Mạnh', color: 'bg-green-500' },
];

const INDUSTRIES = [
    'Công nghệ thông tin', 'Marketing / PR', 'Thiết kế', 'Kế toán / Kiểm toán',
    'Kinh doanh / Bán hàng', 'Nhân sự', 'Dịch vụ khách hàng', 'Xây dựng',
    'Giáo dục / Đào tạo', 'Y tế / Dược', 'Logistics / Vận tải', 'Khác',
];

// ── Bước 1: Thông tin cơ bản ───────────────────────────────────────────────
const StepInfo = ({ onNext }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const validate = () => {
        const e = {};
        if (!fullName.trim()) e.fullName = 'Vui lòng nhập họ và tên.';
        if (!email.trim()) e.email = 'Vui lòng nhập email.';
        else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email không hợp lệ.';
        if (!password) e.password = 'Vui lòng nhập mật khẩu.';
        else if (password.length < 8) e.password = 'Mật khẩu tối thiểu 8 ký tự.';
        if (!confirm) e.confirm = 'Vui lòng xác nhận mật khẩu.';
        else if (confirm !== password) e.confirm = 'Mật khẩu không khớp.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setServerError('');
        if (validate()) onNext({ fullName, email, password });
    };

    const inp = (field) => `w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-purple-500'}`;
    const strength = password ? getStrength(password) : 0;

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {serverError && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{serverError}</div>}

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                <input type="text" placeholder="Nguyễn Văn A" className={inp('fullName')}
                    value={fullName} onChange={e => { setFullName(e.target.value); setErrors(p => ({ ...p, fullName: '' })); }} autoComplete="name" />
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" placeholder="example@email.com" className={inp('email')}
                    value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }} autoComplete="email" />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                <input type="password" placeholder="Tối thiểu 8 ký tự" className={inp('password')}
                    value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }} autoComplete="new-password" />
                {password && (
                    <div className="mt-1.5">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthConfig[strength].color : 'bg-gray-200'}`} />
                            ))}
                        </div>
                        {strength > 0 && <p className="text-xs mt-1 text-gray-500">Độ mạnh: <span className="font-medium">{strengthConfig[strength].label}</span></p>}
                    </div>
                )}
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                <input type="password" placeholder="Nhập lại mật khẩu"
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors ${errors.confirm ? 'border-red-400 bg-red-50' : confirm && confirm === password ? 'border-green-400' : 'border-gray-300 focus:border-purple-500'}`}
                    value={confirm} onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: '' })); }} autoComplete="new-password" />
                {errors.confirm && <p className="text-xs text-red-500">{errors.confirm}</p>}
                {!errors.confirm && confirm && confirm === password && <p className="text-xs text-green-500">✓ Mật khẩu khớp</p>}
            </div>

            <button type="submit"
                className="w-full py-2.5 mt-1 bg-purple-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                Tiếp theo →
            </button>
        </form>
    );
};

// ── Bước 2: Chọn loại tài khoản + ngành nghề ──────────────────────────────
const StepRole = ({ onBack, onSubmit, loading, serverError }) => {
    const [role, setRole] = useState('');
    const [industry, setIndustry] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!role) { setError('Vui lòng chọn loại tài khoản.'); return; }
        onSubmit({ role, industry });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {serverError && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{serverError}</div>}

            <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Bạn đang tìm kiếm gì trên JobHot?</p>
                <div className="grid grid-cols-2 gap-3">
                    {/* Người tìm việc */}
                    <button type="button" onClick={() => { setRole('user'); setError(''); }}
                        className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all cursor-pointer ${role === 'user' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'}`}>
                        <span className="text-4xl">🧑‍💼</span>
                        <div className="text-center">
                            <div className={`font-semibold text-sm ${role === 'user' ? 'text-purple-700' : 'text-gray-800'}`}>Người tìm việc</div>
                            <div className="text-xs text-gray-500 mt-1">Tìm kiếm cơ hội nghề nghiệp</div>
                        </div>
                        {role === 'user' && <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">✓</div>}
                    </button>

                    {/* Nhà tuyển dụng */}
                    <button type="button" onClick={() => { setRole('employer'); setError(''); }}
                        className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all cursor-pointer ${role === 'employer' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'}`}>
                        <span className="text-4xl">🏢</span>
                        <div className="text-center">
                            <div className={`font-semibold text-sm ${role === 'employer' ? 'text-purple-700' : 'text-gray-800'}`}>Nhà tuyển dụng</div>
                            <div className="text-xs text-gray-500 mt-1">Đăng tin và tìm ứng viên</div>
                        </div>
                        {role === 'employer' && <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">✓</div>}
                    </button>
                </div>
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            </div>

            {/* Ngành nghề — chỉ hiện cho người tìm việc */}
            {role === 'user' && (
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Ngành nghề quan tâm <span className="text-gray-400 font-normal">(để nhận gợi ý việc phù hợp)</span>
                    </label>
                    <select value={industry} onChange={e => setIndustry(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500 bg-white text-gray-700">
                        <option value="">-- Chọn ngành nghề --</option>
                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                </div>
            )}

            <div className="flex gap-3 pt-1">
                <button type="button" onClick={onBack}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors">
                    ← Quay lại
                </button>
                <button type="submit" disabled={loading}
                    className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading && <SpinnerIcon />}
                    {loading ? 'Đang tạo tài khoản...' : 'Hoàn tất đăng ký'}
                </button>
            </div>
        </form>
    );
};

// ── Main RegisterPage ──────────────────────────────────────────────────────
const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: thông tin, 2: role, 3: thành công
    const [basicInfo, setBasicInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleStep1Done = (info) => {
        setBasicInfo(info);
        setStep(2);
    };

    const handleFinalSubmit = async ({ role, industry }) => {
        setLoading(true);
        setServerError('');
        try {
            await axios.post(`${API}?action=register`, {
                fullName: basicInfo.fullName,
                email: basicInfo.email,
                password: basicInfo.password,
                role,
                industry,
            });
            setStep(3);
        } catch (err) {
            const msg = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
            setServerError(msg);
        } finally {
            setLoading(false);
        }
    };

    const stepLabels = ['Thông tin', 'Loại tài khoản'];

    // Màn hình thành công
    if (step === 3) return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-purple-600 to-purple-400">
            <div className="w-full max-w-md px-4">
                <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng ký thành công!</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Chào mừng <span className="font-medium text-gray-700">{basicInfo?.fullName}</span> đến với JobHot!
                    </p>
                    <button onClick={() => navigate('/login')}
                        className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors cursor-pointer">
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-purple-600 to-purple-400 py-8">
            <div className="w-full max-w-md px-4">
                <div className="text-center mb-6">
                    <Link to="/" className="text-white font-bold text-3xl tracking-tight">JobHot</Link>
                    <p className="text-purple-100 text-sm mt-1">Tìm việc làm dễ dàng hơn</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-xl">
                    {/* Progress steps */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {stepLabels.map((label, idx) => {
                            const i = idx + 1;
                            const active = step === i;
                            const done = step > i;
                            return (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? 'bg-green-500 text-white' : active ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            {done ? '✓' : i}
                                        </div>
                                        <span className={`text-xs ${active ? 'text-purple-600 font-medium' : 'text-gray-400'}`}>{label}</span>
                                    </div>
                                    {idx < stepLabels.length - 1 && <div className={`w-8 h-px ${step > i ? 'bg-green-400' : 'bg-gray-200'}`} />}
                                </div>
                            );
                        })}
                    </div>

                    <h1 className="text-2xl font-bold text-center mb-1 text-gray-800">
                        {step === 1 ? 'Tạo tài khoản' : 'Bạn là ai?'}
                    </h1>
                    <p className="text-center text-gray-500 text-sm mb-6">
                        {step === 1 ? 'Miễn phí hoàn toàn, mãi mãi' : 'Giúp chúng tôi cá nhân hoá trải nghiệm của bạn'}
                    </p>

                    {step === 1 && <StepInfo onNext={handleStep1Done} />}
                    {step === 2 && (
                        <StepRole
                            onBack={() => setStep(1)}
                            onSubmit={handleFinalSubmit}
                            loading={loading}
                            serverError={serverError}
                        />
                    )}

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-purple-600 font-medium hover:underline">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;