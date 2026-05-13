import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');

    // Xóa toàn bộ thông tin người dùng khỏi localStorage rồi về trang chủ
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('industry');
        navigate('/');
    };

    // Xác định đường dẫn dashboard theo vai trò người dùng
    const getDashboardPath = () => {
        if (role === 'admin')
            return '/admin';
        if (role === 'employer')
            return '/employer';
        return '/user';
    };

    // Lấy chữ cái đầu của tên để hiển thị trong avatar
    let avatarLetter = 'U';
    if (name && name.length > 0) {
        avatarLetter = name.charAt(0).toUpperCase();
    }

    // Lấy tên ngắn (từ cuối) để hiển thị trên header
    let shortName = 'Tài khoản';
    if (name) {
        const nameParts = name.split(' ');
        shortName = nameParts[nameParts.length - 1];
    }

    return (
        <header className="bg-purple-600 w-full shadow-md">
            <div className="flex items-center px-8 py-4 max-w-7xl mx-auto">

                {/* Logo */}
                <Link to="/" className="text-white font-bold text-4xl mr-8 tracking-tight">
                    Job<span className="text-yellow-300">Hot</span>
                </Link>

                {/* Navigation */}
                <nav className="grow flex gap-1"></nav>

                {/* Khu vực bên phải: hiển thị theo trạng thái đăng nhập */}
                <div className="flex items-center gap-3">

                    {/* Đã đăng nhập: hiện avatar + tên + nút đăng xuất */}
                    {token && (
                        <>
                            <button
                                onClick={() => navigate(getDashboardPath())}
                                className="flex items-center gap-2 text-white/90 px-3 py-1.5 rounded-lg hover:bg-white/15 transition-colors text-sm"
                            >
                                <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-white text-xs font-bold">
                                    {avatarLetter}
                                </div>
                                <span className="font-medium">{shortName}</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-white/15 border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/25 transition-colors"
                            >
                                Đăng xuất
                            </button>
                        </>
                    )}

                    {/* Chưa đăng nhập: hiện nút đăng nhập và đăng ký */}
                    {!token && (
                        <>
                            <Link to="/login" className="bg-white text-purple-600 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors shadow-sm">
                                Đăng nhập
                            </Link>
                            <Link to="/register" className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition-colors shadow-sm">
                                Đăng ký
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;