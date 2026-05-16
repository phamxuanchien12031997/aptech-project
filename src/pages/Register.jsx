import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// CONFIG
// The base URL for all API calls.
// Every fetch goes to /server/index.php with a different ?action= param.

const API = '/server/index.php';

// DATA: INDUSTRIES
// The dropdown options shown to job-seekers in Step 2.

const INDUSTRIES = [
    'Công nghệ thông tin',
    'Marketing / PR',
    'Thiết kế',
    'Kế toán / Kiểm toán',
    'Kinh doanh / Bán hàng',
    'Nhân sự',
    'Dịch vụ khách hàng',
    'Xây dựng',
    'Giáo dục / Đào tạo',
    'Y tế / Dược',
    'Logistics / Vận tải',
    'Khác',
];


// DATA: STRENGTH CONFIG
// Maps a password strength score (0–4) to a label and bar color.
// Score is calculated by getPasswordStrength() below.

const strengthConfig = [
    { label: '', color: 'bg-gray-200' },   // 0 - nothing typed yet
    { label: 'Yếu', color: 'bg-red-400' },   // 1 - very weak
    { label: 'Trung bình', color: 'bg-yellow-400' },   // 2 - medium
    { label: 'Tốt', color: 'bg-blue-400' },   // 3 - good
    { label: 'Mạnh', color: 'bg-green-500' },   // 4 - strong
];


// HELPER: getPasswordStrength
// Returns a score from 0 to 4 based on how complex the password is.
// Each rule that passes adds 1 point:
//   1. At least 8 characters
//   2. Contains an uppercase letter
//   3. Contains a number
//   4. Contains a special character (not a letter or digit)

function getPasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score = score + 1;
    if (/[A-Z]/.test(password)) score = score + 1;
    if (/[0-9]/.test(password)) score = score + 1;
    if (/[^A-Za-z0-9]/.test(password)) score = score + 1;

    return score;
}

// HELPER: getInputClasses
// Returns the border + background classes for a text input.
// Red border when there is a validation error for that field,
// purple focus border otherwise.

function getInputClasses(hasError) {
    const base = 'w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors';

    if (hasError) {
        return base + ' border-red-400 bg-red-50';
    } else {
        return base + ' border-gray-300 focus:border-purple-500';
    }
}

// HELPER: getConfirmInputClasses
// The confirm-password field has three visual states:
//   - Error  → red border
//   - Match  → green border (passwords are identical)
//   - Normal → gray border with purple focus

function getConfirmInputClasses(hasError, confirmValue, passwordValue) {
    const base = 'w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors';

    if (hasError) {
        return base + ' border-red-400 bg-red-50';
    }

    if (confirmValue !== '' && confirmValue === passwordValue) {
        return base + ' border-green-400';
    }

    return base + ' border-gray-300 focus:border-purple-500';
}

// HELPER: getRoleCardClasses
// Returns the border + background classes for the role selection cards
// (Người tìm việc / Nhà tuyển dụng).
// Purple highlight when that role is selected, plain border otherwise.

function getRoleCardClasses(isSelected) {
    const base = 'flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all cursor-pointer';

    if (isSelected) {
        return base + ' border-purple-500 bg-purple-50';
    } else {
        return base + ' border-gray-200 hover:border-purple-300 hover:bg-gray-50';
    }
}

// HELPER: getRoleLabelClasses
// Returns the text color for the title inside a role card.
// Purple when selected, dark gray otherwise.

function getRoleLabelClasses(isSelected) {
    if (isSelected) {
        return 'font-semibold text-sm text-purple-700';
    } else {
        return 'font-semibold text-sm text-gray-800';
    }
}

// HELPER: getStepCircleClasses
// Returns classes for the numbered circle in the progress bar at the top.
//   - Done (step already passed) → green with a checkmark
//   - Active (current step)      → purple
//   - Future                     → gray

function getStepCircleClasses(isDone, isActive) {
    const base = 'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all';

    if (isDone) {
        return base + ' bg-green-500 text-white';
    }

    if (isActive) {
        return base + ' bg-purple-600 text-white';
    }

    return base + ' bg-gray-200 text-gray-500';
}

// HELPER: getStepLabelClasses
// Returns the text color for the label next to each step circle.
// Purple when it is the active step, gray otherwise.

function getStepLabelClasses(isActive) {
    if (isActive) {
        return 'text-xs text-purple-600 font-medium';
    } else {
        return 'text-xs text-gray-400';
    }
}

// HELPER: getConnectorClasses
// Returns the color of the horizontal line between two step circles.
// Green when the left step is already done, gray otherwise.

function getConnectorClasses(leftStepIsDone) {
    if (leftStepIsDone) {
        return 'w-8 h-px bg-green-400';
    } else {
        return 'w-8 h-px bg-gray-200';
    }
}

// COMPONENT: SpinnerIcon
// A small spinning SVG icon shown inside the submit button while loading.

function SpinnerIcon() {
    return (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
    );
}

// COMPONENT: StrengthBar
// The four colored bars shown below the password field.
// Each bar lights up in the strength color when the score reaches its index.

function StrengthBar({ password }) {
    // Don't render anything if the user hasn't typed a password yet
    if (!password) {
        return null;
    }

    const score = getPasswordStrength(password);

    return (
        <div className="mt-1.5">
            {/* Four bars side by side */}
            <div className="flex gap-1">
                {[1, 2, 3, 4].map(function (barIndex) {
                    let barColor;

                    if (barIndex <= score) {
                        barColor = strengthConfig[score].color;  // lit up in strength color
                    } else {
                        barColor = 'bg-gray-200';                // unlit
                    }

                    return (
                        <div key={barIndex} className={'h-1 flex-1 rounded-full transition-colors ' + barColor} />
                    );
                })}
            </div>

            {/* Label below the bars (only shown when score > 0) */}
            {score > 0 && (
                <p className="text-xs mt-1 text-gray-500">
                    Độ mạnh: <span className="font-medium">{strengthConfig[score].label}</span>
                </p>
            )}
        </div>
    );
}

// COMPONENT: ServerErrorBox
// Shows a red alert box with a server-side error message.
// Returns nothing if there is no error to show.

function ServerErrorBox({ message }) {
    if (!message) {
        return null;
    }

    return (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {message}
        </div>
    );
}

// COMPONENT: StepInfo  (Step 1 of 2)
// Collects the user's full name, email, password, and password confirmation.
// Validates everything locally before calling onNext() to move to Step 2.
//
// Props:
//   onNext(info) - called with { fullName, email, password } when valid

function StepInfo({ onNext }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errors, setErrors] = useState({});

    // ── Validation ──
    // Checks all four fields and fills the errors object.
    // Returns true only when every field is valid.

    function validate() {
        const newErrors = {};

        if (!fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên.';
        }

        if (!email.trim()) {
            newErrors.email = 'Vui lòng nhập email.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email không hợp lệ.';
        }

        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu.';
        } else if (password.length < 8) {
            newErrors.password = 'Mật khẩu tối thiểu 8 ký tự.';
        }

        if (!confirm) {
            newErrors.confirm = 'Vui lòng xác nhận mật khẩu.';
        } else if (confirm !== password) {
            newErrors.confirm = 'Mật khẩu không khớp.';
        }

        setErrors(newErrors);

        // If the errors object has no keys, every field passed
        return Object.keys(newErrors).length === 0;
    }

    // ── Submit handler ──
    // Prevents the default form submit, runs validation,
    // and if everything passes, hands the data up to the parent.

    function handleSubmit(event) {
        event.preventDefault();

        if (validate()) {
            onNext({ fullName: fullName, email: email, password: password });
        }
    }

    // ── Field-level error clearing ──
    // Each input clears its own error as soon as the user starts typing,
    // so the red border disappears immediately without waiting for re-submit.

    function clearError(fieldName) {
        const updatedErrors = {};

        // Copy every existing error except the one being cleared
        for (const key in errors) {
            if (key !== fieldName) {
                updatedErrors[key] = errors[key];
            }
        }

        setErrors(updatedErrors);
    }


    //Render

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            <ServerErrorBox message="" />

            {/* Full name field */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className={getInputClasses(!!errors.fullName)}
                    value={fullName}
                    onChange={function (e) { setFullName(e.target.value); clearError('fullName'); }}
                    autoComplete="name"
                />
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
            </div>

            {/* Email field */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    placeholder="example@email.com"
                    className={getInputClasses(!!errors.email)}
                    value={email}
                    onChange={function (e) { setEmail(e.target.value); clearError('email'); }}
                    autoComplete="email"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password field + strength bar */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                <input
                    type="password"
                    placeholder="Tối thiểu 8 ký tự"
                    className={getInputClasses(!!errors.password)}
                    value={password}
                    onChange={function (e) { setPassword(e.target.value); clearError('password'); }}
                    autoComplete="new-password"
                />
                <StrengthBar password={password} />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm password field */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    className={getConfirmInputClasses(!!errors.confirm, confirm, password)}
                    value={confirm}
                    onChange={function (e) { setConfirm(e.target.value); clearError('confirm'); }}
                    autoComplete="new-password"
                />
                {errors.confirm && (
                    <p className="text-xs text-red-500">{errors.confirm}</p>
                )}
                {!errors.confirm && confirm !== '' && confirm === password && (
                    <p className="text-xs text-green-500">✓ Mật khẩu khớp</p>
                )}
            </div>

            {/* Next button */}
            <button
                type="submit"
                className="w-full py-2.5 mt-1 bg-purple-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
                Tiếp theo →
            </button>

        </form>
    );
}


// COMPONENT: StepRole  (Step 2 of 2)
// Lets the user pick their account type (job-seeker or employer).
// If they pick job-seeker, a dropdown appears to choose their industry.
// Calls onSubmit({ role, industry }) when the form is submitted.
//
// Props:
//   onBack()                     - go back to Step 1
//   onSubmit({ role, industry }) - called when the form is valid
//   loading                      - true while the API call is in progress
//   serverError                  - error message string from the API, or ''

function StepRole({ onBack, onSubmit, loading, serverError }) {
    const [role, setRole] = useState('');
    const [industry, setIndustry] = useState('');
    const [error, setError] = useState('');


    //Submit handler
    // Prevents the default form submit, checks that a role was chosen,
    // then passes the data up to RegisterPage.

    function handleSubmit(event) {
        event.preventDefault();

        if (!role) {
            setError('Vui lòng chọn loại tài khoản.');
            return;
        }

        onSubmit({ role: role, industry: industry });
    }


    //Role card click handlers
    // Each card sets the role and clears any "please choose" error.

    function handleSelectUser() {
        setRole('user');
        setError('');
    }

    function handleSelectEmployer() {
        setRole('employer');
        setError('');
    }


    //Render

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <ServerErrorBox message={serverError} />

            {/* ── Role selection cards ── */}
            <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                    Bạn đang tìm kiếm gì trên JobHot?
                </p>

                <div className="grid grid-cols-2 gap-3">

                    {/* Job-seeker card */}
                    <button
                        type="button"
                        onClick={handleSelectUser}
                        className={getRoleCardClasses(role === 'user')}
                    >
                        <span className="text-4xl">🧑‍💼</span>
                        <div className="text-center">
                            <div className={getRoleLabelClasses(role === 'user')}>Người tìm việc</div>
                            <div className="text-xs text-gray-500 mt-1">Tìm kiếm cơ hội nghề nghiệp</div>
                        </div>
                        {role === 'user' && (
                            <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">✓</div>
                        )}
                    </button>

                    {/* Employer card */}
                    <button
                        type="button"
                        onClick={handleSelectEmployer}
                        className={getRoleCardClasses(role === 'employer')}
                    >
                        <span className="text-4xl">🏢</span>
                        <div className="text-center">
                            <div className={getRoleLabelClasses(role === 'employer')}>Nhà tuyển dụng</div>
                            <div className="text-xs text-gray-500 mt-1">Đăng tin và tìm ứng viên</div>
                        </div>
                        {role === 'employer' && (
                            <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">✓</div>
                        )}
                    </button>

                </div>

                {/* Shown when user hits submit without choosing a role */}
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            </div>

            {/* ── Industry dropdown ── */}
            {/* Only shown when the user picked "Người tìm việc" */}
            {role === 'user' && (
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Ngành nghề quan tâm{' '}
                        <span className="text-gray-400 font-normal">(để nhận gợi ý việc phù hợp)</span>
                    </label>
                    <select
                        value={industry}
                        onChange={function (e) { setIndustry(e.target.value); }}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500 bg-white text-gray-700"
                    >
                        <option value="">-- Chọn ngành nghề --</option>
                        {INDUSTRIES.map(function (item) {
                            return (
                                <option key={item} value={item}>{item}</option>
                            );
                        })}
                    </select>
                </div>
            )}

            {/* ── Back / Submit buttons ── */}
            <div className="flex gap-3 pt-1">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors"
                >
                    ← Quay lại
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading && <SpinnerIcon />}
                    {loading ? 'Đang tạo tài khoản...' : 'Hoàn tất đăng ký'}
                </button>
            </div>

        </form>
    );
}

// COMPONENT: ProgressBar
// The two-step progress indicator at the top of the form card.
// Shows a numbered circle + label for each step, connected by a line.
// Circles turn green with a checkmark once that step is passed.

function ProgressBar({ currentStep }) {
    const stepLabels = ['Thông tin', 'Loại tài khoản'];

    return (
        <div className="flex items-center justify-center gap-2 mb-6">
            {stepLabels.map(function (label, index) {
                const stepNumber = index + 1;
                const isDone = currentStep > stepNumber;
                const isActive = currentStep === stepNumber;
                const isLastStep = index === stepLabels.length - 1;

                return (
                    <div key={stepNumber} className="flex items-center gap-2">

                        {/* Circle + label */}
                        <div className="flex items-center gap-1.5">
                            <div className={getStepCircleClasses(isDone, isActive)}>
                                {isDone ? '✓' : stepNumber}
                            </div>
                            <span className={getStepLabelClasses(isActive)}>{label}</span>
                        </div>

                        {/* Connector line between this step and the next */}
                        {!isLastStep && (
                            <div className={getConnectorClasses(isDone)} />
                        )}

                    </div>
                );
            })}
        </div>
    );
}

// COMPONENT: SuccessScreen
// Shown after registration completes successfully (step === 3).
// Displays a green checkmark, a welcome message, and a login button.

function SuccessScreen({ fullName, onGoToLogin }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-purple-600 to-purple-400">
            <div className="w-full max-w-md px-4">
                <div className="bg-white rounded-2xl p-8 shadow-xl text-center">

                    {/* Green checkmark icon */}
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng ký thành công!</h2>

                    <p className="text-gray-500 text-sm mb-6">
                        Chào mừng <span className="font-medium text-gray-700">{fullName}</span> đến với JobHot!
                    </p>

                    <button
                        onClick={onGoToLogin}
                        className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                        Đăng nhập ngay
                    </button>

                </div>
            </div>
        </div>
    );
}

// COMPONENT: RegisterPage  (main / entry point)
// basicInfo holds the data from Step 1 so it can be sent
// together with the Step 2 data in the final API call.

const RegisterPage = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);    // which step is currently shown
    const [basicInfo, setBasicInfo] = useState(null); // data collected in Step 1
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    function handleStep1Done(info) {
        setBasicInfo(info);
        setStep(2);
    }

    // Called by StepRole when the user clicks "Hoàn tất đăng ký".
    // Combines the Step 1 info with the Step 2 role/industry
    // and posts everything to the PHP backend.

    async function handleFinalSubmit(roleData) {
        setLoading(true);
        setServerError('');

        try {
            await axios.post(API + '?action=register', {
                fullName: basicInfo.fullName,
                email: basicInfo.email,
                password: basicInfo.password,
                role: roleData.role,
                industry: roleData.industry,
            });

            // Registration succeeded — show the success screen
            setStep(3);

        } catch (err) {
            // The server returned an error response (e.g. 409 email already used)
            let message = 'Đăng ký thất bại. Vui lòng thử lại.';

            if (err.response && err.response.data && err.response.data.message) {
                message = err.response.data.message;
            }

            setServerError(message);

        } finally {
            // Always stop the spinner, whether success or failure
            setLoading(false);
        }
    }


    //success screen
    // Rendered instead of the card layout when registration is done.

    if (step === 3) {
        let fullNameToShow = '';

        if (basicInfo !== null) {
            fullNameToShow = basicInfo.fullName;
        }

        return (
            <SuccessScreen
                fullName={fullNameToShow}
                onGoToLogin={function () { navigate('/login'); }}
            />
        );
    }

    // Decide the heading and subtitle text based on the current step
    let headingText;
    let subtitleText;

    if (step === 1) {
        headingText = 'Tạo tài khoản';
        subtitleText = 'Miễn phí hoàn toàn, mãi mãi';
    } else {
        headingText = 'Bạn là ai?';
        subtitleText = 'Giúp chúng tôi cá nhân hoá trải nghiệm của bạn';
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-purple-600 to-purple-400 py-8">
            <div className="w-full max-w-md px-4">

                {/* Site logo + tagline above the card */}
                <div className="text-center mb-6">
                    <Link to="/" className="text-white font-bold text-3xl tracking-tight">JobHot</Link>
                    <p className="text-purple-100 text-sm mt-1">Tìm việc làm dễ dàng hơn</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-xl">

                    {/* Step progress indicator */}
                    <ProgressBar currentStep={step} />

                    {/* Card heading */}
                    <h1 className="text-2xl font-bold text-center mb-1 text-gray-800">
                        {headingText}
                    </h1>
                    <p className="text-center text-gray-500 text-sm mb-6">
                        {subtitleText}
                    </p>

                    {/* Render the correct step */}
                    {step === 1 && (
                        <StepInfo onNext={handleStep1Done} />
                    )}

                    {step === 2 && (
                        <StepRole
                            onBack={function () { setStep(1); }}
                            onSubmit={handleFinalSubmit}
                            loading={loading}
                            serverError={serverError}
                        />
                    )}

                    {/* Link to login for users who already have an account */}
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