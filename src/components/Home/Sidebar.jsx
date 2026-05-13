import { useState } from 'react';

const Sidebar = ({ onFilter }) => {
    const [selected, setSelected] = useState({ workType: null, level: null });

    const workTypes = [
        { id: 'fulltime', label: 'Nhân viên chính thức' },
        { id: 'parttime', label: 'Bán thời gian' },
        { id: 'seasonal', label: 'Nhân viên thời vụ' },
        { id: 'freelancer', label: 'Freelancer' },
        { id: 'intern', label: 'Thực tập sinh' },
    ];

    const levels = [
        { id: 'fresher', label: 'Mới tốt nghiệp' },
        { id: 'staff', label: 'Nhân viên' },
        { id: 'leader', label: 'Trưởng nhóm' },
        { id: 'manager', label: 'Trưởng phòng' },
        { id: 'director', label: 'Giám đốc' },
    ];

    const locations = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];

    const toggle = (group, id) => {
        setSelected(s => ({ ...s, [group]: s[group] === id ? null : id }));
    };

    return (
        <aside className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-purple-600 px-4 py-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
                    </svg>
                    Bộ lọc tìm kiếm
                </h3>
            </div>

            <div className="p-4 flex flex-col gap-5">
                {/* Hình thức làm việc */}
                <div>
                    <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-3">Hình thức làm việc</h4>
                    <ul className="flex flex-col gap-1">
                        {workTypes.map(t => (
                            <li key={t.id}>
                                <button onClick={() => toggle('workType', t.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${selected.workType === t.id ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${selected.workType === t.id ? 'bg-purple-600' : 'bg-gray-300'}`} />
                                    {t.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <hr className="border-gray-100" />

                {/* Cấp bậc */}
                <div>
                    <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-3">Cấp bậc</h4>
                    <ul className="flex flex-col gap-1">
                        {levels.map(l => (
                            <li key={l.id}>
                                <button onClick={() => toggle('level', l.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${selected.level === l.id ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${selected.level === l.id ? 'bg-purple-600' : 'bg-gray-300'}`} />
                                    {l.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <hr className="border-gray-100" />

                {/* Địa điểm */}
                <div>
                    <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-3">Địa điểm</h4>
                    <div className="flex flex-wrap gap-2">
                        {locations.map(loc => (
                            <button key={loc}
                                className="px-3 py-1.5 rounded-full text-xs border border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors">
                                {loc}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;