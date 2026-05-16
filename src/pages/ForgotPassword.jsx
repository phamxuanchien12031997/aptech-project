import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/img/Logo.png';

// CONFIG
// The base URL for all API calls.
// Every fetch goes to /server/index.php with a different ?action= param.

const API = 'http://localhost:8888/aptech-project/server/index.php';

// COMPONENT: SpinnerIcon
// A small spinning SVG shown inside buttons while a request is in progress.

function SpinnerIcon() {
    return (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
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

// HELPER: getInputClasses
// Returns border + background classes for a text input.
// Red border when there is a validation error, purple focus otherwise.

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

// HELPER: getDotClasses
// Returns classes for each progress dot shown at the top of the card.
// The current step gets a wider purple dot.
// Past steps get a narrower purple dot.
// Future steps get a narrow gray dot.

function getDotClasses(dotIndex, currentStep) {
    if (dotIndex === currentStep) {
        return 'h-1.5 rounded-full transition-all w-6 bg-purple-600';   // active — wide purple
    }

    if (dotIndex < currentStep) {
        return 'h-1.5 rounded-full transition-all w-1.5 bg-purple-300'; // done — narrow purple
    }

    return 'h-1.5 rounded-full transition-all w-1.5 bg-gray-200';       // future — narrow gray
}


// COMPONENT: Email
// Asks the user for their email address and sends it to the PHP backend.
// If the email exists, the server sends a 6-digit OTP to that address.
// Calls onNext(email) when the server responds with success.
// Props:
//   onNext(email) - called with the submitted email on success

function Email({ onNext }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    //Submit handler
    // Validates the email locally first, then calls the backend.

    async function handleSubmit(event) {
        event.preventDefault();

        // Local validation — check before making a network call
        if (!email.trim()) {
            setError('Vui lòng nhập email.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email không hợp lệ.');
            return;
        }

        setLoading(true);

        try {
            await axios.post(API + '?action=forgot-password', { email: email });

            // Backend accepted the request — move to the OTP step
            onNext(email);

        } catch (err) {
            let message = 'Có lỗi xảy ra. Thử lại sau.';

            if (err.response && err.response.data && err.response.data.message) {
                message = err.response.data.message;
            }

            setError(message);

        } finally {
            setLoading(false);
        }
    }


    //Render

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {/* Email input field */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Địa chỉ email</label>
                <input
                    type="email"
                    placeholder="example@email.com"
                    className={getInputClasses(!!error)}
                    value={email}
                    onChange={function (e) { setEmail(e.target.value); setError(''); }}
                    autoComplete="email"
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            {/* Submit button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-purple-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
                {loading && <SpinnerIcon />}
                {loading && 'Đang gửi...'}
                {!loading && 'Gửi mã xác nhận'}
            </button>

        </form>
    );
}


// COMPONENT: OTP
// Shows six individual digit boxes for the user to type their OTP code.
// Supports paste, backspace navigation between boxes, and a resend button.
// Calls onNext() when the OTP is verified successfully.
// Props:
//   email     - the email address the OTP was sent to (shown in the hint text)
//   onNext()  - called with no arguments on successful verification

function OTP({ email, onNext }) {
    // "otp" is an array of 6 strings, one per digit box
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);   // seconds until resend is allowed
    const [resendLoading, setResendLoading] = useState(false);

    // "inputs" holds a ref to each of the 6 <input> DOM elements
    // so we can move focus between them programmatically.
    const inputs = useRef([]);


    //Countdown timer
    // Counts down from 60 to 0. When it reaches 0 the "Resend" button appears.
    // Each time countdown changes, a 1-second timeout is set to decrement it again.

    useEffect(function () {
        if (countdown <= 0) {
            return; // stop when we hit 0
        }

        const timer = setTimeout(function () {
            setCountdown(function (current) { return current - 1; });
        }, 1000);

        // Cleanup: cancel the timeout if the component unmounts before it fires
        return function () { clearTimeout(timer); };
    }, [countdown]);


    //handleChange
    // Called every time a digit box value changes.
    // Only accepts a single digit (0–9). Moves focus to the next box automatically.

    function handleChange(index, value) {
        // Reject anything that is not empty or a single digit
        if (!/^\d?$/.test(value)) {
            return;
        }

        // Build a new array with the updated digit at the right position.
        // We can't mutate the existing array directly in React state.
        const newOtp = [];
        for (let i = 0; i < otp.length; i++) {
            if (i === index) {
                newOtp.push(value);
            } else {
                newOtp.push(otp[i]);
            }
        }

        setOtp(newOtp);
        setError('');

        // If a digit was entered (not deleted) and this is not the last box,
        // move focus to the next box so the user can keep typing without clicking.
        if (value !== '' && index < 5) {
            inputs.current[index + 1].focus();
        }
    }


    // ── handleKeyDown ──
    // When the user presses Backspace on an empty box,
    // move focus back to the previous box so they can correct a mistake.

    function handleKeyDown(index, event) {
        if (event.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputs.current[index - 1].focus();
        }
    }


    //handlePaste
    // If the user pastes a 6-digit code, fill all boxes at once
    // and move focus to the last box.

    function handlePaste(event) {
        // Strip all non-digit characters and take only the first 6 digits
        const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

        if (digits.length === 6) {
            setOtp(digits.split(''));
            inputs.current[5].focus();
        }
    }


    //handleSubmit
    // Joins the 6 digit boxes into one string and sends it to the backend.

    async function handleSubmit(event) {
        event.preventDefault();

        const code = otp.join('');

        if (code.length < 6) {
            setError('Vui lòng nhập đủ 6 chữ số.');
            return;
        }

        setLoading(true);

        try {
            await axios.post(API + '?action=verify-otp', { email: email, otp: code });

            // OTP verified — move to the new password step
            onNext();

        } catch (err) {
            let message = 'Mã OTP không đúng hoặc đã hết hạn.';

            if (err.response && err.response.data && err.response.data.message) {
                message = err.response.data.message;
            }

            setError(message);

        } finally {
            setLoading(false);
        }
    }


    //handleResend
    // Sends a new OTP to the same email and resets the countdown.
    // The button that calls this is only visible when countdown reaches 0.

    async function handleResend() {
        if (countdown > 0) {
            return; // safety guard — button should already be hidden
        }

        setResendLoading(true);

        try {
            await axios.post(API + '?action=forgot-password', { email: email });

            // Reset everything for the new code
            setCountdown(60);
            setOtp(['', '', '', '', '', '']);
            setError('');

        } catch (err) {
            setError('Không thể gửi lại OTP. Thử lại sau.');

        } finally {
            setResendLoading(false);
        }
    }

    //Render

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {/* Hint text showing which email the code was sent to */}
            <p className="text-sm text-gray-500 text-center">
                Nhập mã 6 chữ số đã gửi đến{' '}
                <span className="font-medium text-gray-700">{email}</span>
            </p>

            {/* Six individual digit input boxes */}
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otp.map(function (digitValue, index) {
                    return (
                        <input
                            key={index}
                            ref={function (el) { inputs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digitValue}
                            onChange={function (e) { handleChange(index, e.target.value); }}
                            onKeyDown={function (e) { handleKeyDown(index, e); }}
                            className="w-11 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg outline-none focus:border-purple-500 transition-colors"
                        />
                    );
                })}
            </div>

            {/* Validation error message */}
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}

            {/* Countdown / Resend section */}
            {/* While countdown > 0: show "Gửi lại sau Xs"                     */}
            {/* When countdown hits 0: show "Không nhận được mã? Gửi lại" link */}
            <p className="text-center text-xs text-gray-400">
                {countdown > 0 && (
                    <>
                        Gửi lại sau{' '}
                        <span className="font-medium text-purple-600">{countdown}s</span>
                    </>
                )}
                {countdown <= 0 && (
                    <>
                        Không nhận được mã?{' '}
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resendLoading}
                            className="text-purple-600 hover:underline cursor-pointer disabled:opacity-60"
                        >
                            {resendLoading && 'Đang gửi...'}
                            {!resendLoading && 'Gửi lại'}
                        </button>
                    </>
                )}
            </p>

            {/* Submit button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-purple-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
                {loading && <SpinnerIcon />}
                {loading && 'Đang xác minh...'}
                {!loading && 'Xác nhận'}
            </button>

        </form>
    );
}

// COMPONENT: NewPassword 
// Lets the user set a new password after their OTP has been verified.
// Calls onDone() when the password has been saved successfully.
// Props:
//   email    - needed by the backend to know which account to update
//   onDone() - called with no arguments on success (moves to Step 3)

function NewPassword({ email, onDone }) {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');


    //Validation
    // Checks both fields and fills the errors object.
    // Returns true only when both fields pass.

    function validate() {
        const newErrors = {};

        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu mới.';
        } else if (password.length < 8) {
            newErrors.password = 'Mật khẩu tối thiểu 8 ký tự.';
        }

        if (!confirm) {
            newErrors.confirm = 'Vui lòng xác nhận mật khẩu.';
        } else if (confirm !== password) {
            newErrors.confirm = 'Mật khẩu không khớp.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    //Submit handler

    async function handleSubmit(event) {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);
        setServerError('');

        try {
            await axios.post(API + '?action=reset-password', { email: email, password: password });

            // Password saved — move to the success screen
            onDone();

        } catch (err) {
            let message = 'Có lỗi xảy ra. Thử lại sau.';

            if (err.response && err.response.data && err.response.data.message) {
                message = err.response.data.message;
            }

            setServerError(message);

        } finally {
            setLoading(false);
        }
    }


    //Field-level error clearing
    // Clears the error for one field as soon as the user starts typing,
    // without touching the errors for any other field.

    function clearError(fieldName) {
        const updatedErrors = {};

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

            <ServerErrorBox message={serverError} />

            {/* New password field */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
                <input
                    type="password"
                    placeholder="Tối thiểu 8 ký tự"
                    className={getInputClasses(!!errors.password)}
                    value={password}
                    onChange={function (e) { setPassword(e.target.value); clearError('password'); }}
                    autoComplete="new-password"
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm password field */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
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

            {/* Submit button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-purple-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
                {loading && <SpinnerIcon />}
                {loading && 'Đang lưu...'}
                {!loading && 'Đặt mật khẩu mới'}
            </button>

        </form>
    );
}

// COMPONENT: SuccessScreen
// Shown after the password has been reset successfully.
// Displays a green checkmark and a button to go to the login page.

function SuccessScreen({ onGoToLogin }) {
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

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt lại thành công!</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.
                    </p>

                    <button
                        onClick={onGoToLogin}
                        className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                        Đăng nhập
                    </button>

                </div>
            </div>
        </div>
    );
}

// COMPONENT: BackButton
// The "← Quay lại" button at the top of the form card.
// On Step 0 it navigates back to the login page.
// On Steps 1 and 2 it goes back one step inside the flow.

function BackButton({ step, onBack, onGoToLogin }) {
    let label;
    let handleClick;

    if (step === 0) {
        label = 'Quay lại đăng nhập';
        handleClick = onGoToLogin;
    } else {
        label = 'Quay lại';
        handleClick = onBack;
    }

    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mb-5"
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
            </svg>
            {label}
        </button>
    );
}

// COMPONENT: ForgotPasswordPage  (main / entry point)
// Manages the overall password-reset flow across four steps:
// "email" is stored here so it can be passed down to OTP and NewPassword,
// which both need it for their API calls.

const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');

    // Each step has its own heading and subtitle shown at the top of the card.
    const stepMeta = [
        { title: 'Quên mật khẩu', subtitle: 'Nhập email để nhận mã xác nhận' },
        { title: 'Xác minh email', subtitle: 'Nhập mã OTP đã gửi đến email' },
        { title: 'Mật khẩu mới', subtitle: 'Tạo mật khẩu mới cho tài khoản' },
    ];


    //Handler: email step done
    // Called by the Email component with the submitted address.
    // Stores the email and advances to the OTP step.

    function handleEmailDone(submittedEmail) {
        setEmail(submittedEmail);
        setStep(1);
    }

    //Handler: go back one step

    function handleBack() {
        setStep(step - 1);
    }

    // Rendered as a completely separate full-screen layout.

    if (step === 3) {
        return (
            <SuccessScreen onGoToLogin={function () { navigate('/login'); }} />
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-purple-600 to-purple-400">
            <div className="w-full max-w-md px-4">

                {/* Site logo + tagline above the card */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-flex flex-col items-center gap-2">
                        <img src={Logo} alt="JobHot Logo" className="h-28 w-auto" />
                    </Link>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-xl">

                    {/* Back button — goes to login on step 0, previous step otherwise */}
                    <BackButton
                        step={step}
                        onBack={handleBack}
                        onGoToLogin={function () { navigate('/login'); }}
                    />

                    {/* Progress dots — one dot per step (0, 1, 2) */}
                    {/* Active step: wide purple dot. Done: narrow purple. Future: narrow gray. */}
                    <div className="flex items-center gap-1.5 justify-center mb-6">
                        {[0, 1, 2].map(function (dotIndex) {
                            return (
                                <div key={dotIndex} className={getDotClasses(dotIndex, step)} />
                            );
                        })}
                    </div>

                    {/* Step heading and subtitle */}
                    <h1 className="text-2xl font-bold text-center mb-1 text-gray-800">
                        {stepMeta[step].title}
                    </h1>
                    <p className="text-center text-gray-500 text-sm mb-6">
                        {stepMeta[step].subtitle}
                    </p>

                    {/* Render the correct step component */}
                    {step === 0 && (
                        <Email onNext={handleEmailDone} />
                    )}
                    {step === 1 && (
                        <OTP email={email} onNext={function () { setStep(2); }} />
                    )}
                    {step === 2 && (
                        <NewPassword email={email} onDone={function () { setStep(3); }} />
                    )}

                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;