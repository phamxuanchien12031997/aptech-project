import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = '/server/index.php';

const SpinnerIcon = () => (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
);

// ── Bước 1: Nhập email ────────────────────────────────────────────────────
const Email = ({ onNext }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) { setError('Vui lòng nhập email.'); return; }
        if (!/\S+@\S+\.\S+/.test(email)) { setError('Email không hợp lệ.'); return; }
        setLoading(true);
        try {
            await axios.post(`${API}?action=forgot-password`, { email });
            onNext(email);
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra. Thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const inputCls = `w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-purple-500'}`;

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Địa chỉ email</label>
                <input type="email" placeholder="example@email.com" className={inputCls}
                    value={email} onChange={e => { setEmail(e.target.value); setError(''); }} autoComplete="email" />
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
            <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-purple-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <SpinnerIcon />}
                {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
            </button>
        </form>
    );
};

// ── Bước 2: Nhập OTP ─────────────────────────────────────────────────────
const OTP = ({ email, onNext }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [resendLoading, setResendLoading] = useState(false);
    const inputs = useRef([]);

    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const n = otp.slice(); n[index] = value; setOtp(n); setError('');
        if (value && index < 5) inputs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) inputs.current[index - 1]?.focus();
    };

    const handlePaste = (e) => {
        const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (digits.length === 6) { setOtp(digits.split('')); inputs.current[5]?.focus(); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) { setError('Vui lòng nhập đủ 6 chữ số.'); return; }
        setLoading(true);
        try {
            await axios.post(`${API}?action=verify-otp`, { email, otp: code });
            onNext();
        } catch (err) {
            setError(err.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setResendLoading(true);
        try {
            await axios.post(`${API}?action=forgot-password`, { email });
            setCountdown(60);
            setOtp(['', '', '', '', '', '']);
            setError('');
        } catch (err) {
            setError('Không thể gửi lại OTP. Thử lại sau.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <p className="text-sm text-gray-500 text-center">
                Nhập mã 6 chữ số đã gửi đến <span className="font-medium text-gray-700">{email}</span>
            </p>
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otp.map((v, i) => (
                    <input key={i} ref={el => { inputs.current[i] = el; }} type="text" inputMode="numeric"
                        maxLength={1} value={v}
                        onChange={e => handleChange(i, e.target.value)}
                        onKeyDown={e => handleKeyDown(i, e)}
                        className="w-11 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg outline-none focus:border-purple-500 transition-colors" />
                ))}
            </div>
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            <p className="text-center text-xs text-gray-400">
                {countdown > 0
                    ? <>Gửi lại sau <span className="font-medium text-purple-600">{countdown}s</span></>
                    : <>Không nhận được mã?{' '}
                        <button type="button" onClick={handleResend} disabled={resendLoading}
                            className="text-purple-600 hover:underline cursor-pointer disabled:opacity-60">
                            {resendLoading ? 'Đang gửi...' : 'Gửi lại'}
                        </button></>
                }
            </p>
            <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-purple-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <SpinnerIcon />}
                {loading ? 'Đang xác minh...' : 'Xác nhận'}
            </button>
        </form>
    );
};

// ── Bước 3: Mật khẩu mới ─────────────────────────────────────────────────
const NewPassword = ({ email, onDone }) => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const validate = () => {
        const e = {};
        if (!password) e.password = 'Vui lòng nhập mật khẩu mới.';
        else if (password.length < 8) e.password = 'Mật khẩu tối thiểu 8 ký tự.';
        if (!confirm) e.confirm = 'Vui lòng xác nhận mật khẩu.';
        else if (confirm !== password) e.confirm = 'Mật khẩu không khớp.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true); setServerError('');
        try {
            await axios.post(`${API}?action=reset-password`, { email, password });
            onDone();
        } catch (err) {
            setServerError(err.response?.data?.message || 'Có lỗi xảy ra. Thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const pwCls = `w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-purple-500'}`;
    const cfmCls = `w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors ${errors.confirm ? 'border-red-400 bg-red-50' : confirm && confirm === password ? 'border-green-400' : 'border-gray-300 focus:border-purple-500'}`;

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {serverError && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{serverError}</div>}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
                <input type="password" placeholder="Tối thiểu 8 ký tự" className={pwCls}
                    value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }} autoComplete="new-password" />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                <input type="password" placeholder="Nhập lại mật khẩu" className={cfmCls}
                    value={confirm} onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: '' })); }} autoComplete="new-password" />
                {errors.confirm && <p className="text-xs text-red-500">{errors.confirm}</p>}
                {!errors.confirm && confirm && confirm === password && <p className="text-xs text-green-500">✓ Mật khẩu khớp</p>}
            </div>
            <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-purple-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <SpinnerIcon />}
                {loading ? 'Đang lưu...' : 'Đặt mật khẩu mới'}
            </button>
        </form>
    );
};

// ── Main ForgotPasswordPage ───────────────────────────────────────────────
const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');

    const stepMeta = [
        { title: 'Quên mật khẩu', subtitle: 'Nhập email để nhận mã xác nhận' },
        { title: 'Xác minh email', subtitle: 'Nhập mã OTP đã gửi đến email' },
        { title: 'Mật khẩu mới', subtitle: 'Tạo mật khẩu mới cho tài khoản' },
    ];

    if (step === 3) return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-purple-600 to-purple-400">
            <div className="w-full max-w-md px-4">
                <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt lại thành công!</h2>
                    <p className="text-gray-500 text-sm mb-6">Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.</p>
                    <button onClick={() => navigate('/login')}
                        className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors cursor-pointer">
                        Đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-purple-600 to-purple-400">
            <div className="w-full max-w-md px-4">
                <div className="text-center mb-6">
                    <Link to="/" className="text-white font-bold text-3xl tracking-tight">JobHot</Link>
                    <p className="text-purple-100 text-sm mt-1">Tìm việc làm dễ dàng hơn</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <button onClick={() => step === 0 ? navigate('/login') : setStep(s => s - 1)}
                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mb-5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                        {step === 0 ? 'Quay lại đăng nhập' : 'Quay lại'}
                    </button>

                    {/* Progress dots */}
                    <div className="flex items-center gap-1.5 justify-center mb-6">
                        {[0, 1, 2].map(i => (
                            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-purple-600' : i < step ? 'w-1.5 bg-purple-300' : 'w-1.5 bg-gray-200'}`} />
                        ))}
                    </div>

                    <h1 className="text-2xl font-bold text-center mb-1 text-gray-800">{stepMeta[step].title}</h1>
                    <p className="text-center text-gray-500 text-sm mb-6">{stepMeta[step].subtitle}</p>

                    {step === 0 && <Email onNext={e => { setEmail(e); setStep(1); }} />}
                    {step === 1 && <OTP email={email} onNext={() => setStep(2)} />}
                    {step === 2 && <NewPassword email={email} onDone={() => setStep(3)} />}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;