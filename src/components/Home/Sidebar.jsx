import { useState } from 'react';

// ─────────────────────────────────────────────
// DATA
// These are the filter options shown in the sidebar.
// Each item has an "id" (used internally) and a "label" (shown to the user).
// ─────────────────────────────────────────────

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


// ─────────────────────────────────────────────
// HELPER: sendFiltersToBackend
//
// Builds a URL with action=get-jobs plus all three filter params,
// calls the PHP endpoint, and passes the result to onFilter.
//
// Any filter that is null (not selected) is simply left out of the URL.
//
// Example URL:
//   /server/index.php?action=get-jobs&workType=fulltime&level=staff&location=H%C3%A0+N%E1%BB%99i
//
// ─────────────────────────────────────────────

async function sendFiltersToBackend(workType, level, locationName, onFilter) {
    // FIX: always start with action=get-jobs so the PHP router picks the right handler.
    // Previously the URL was built without this param, causing every filter request
    // to fall through to the "action not found" catch-all and return a 404 JSON error.
    let queryString = 'action=get-jobs';

    if (workType !== null) {
        queryString = queryString + '&workType=' + encodeURIComponent(workType);
    }

    if (level !== null) {
        queryString = queryString + '&level=' + encodeURIComponent(level);
    }

    if (locationName !== null) {
        queryString = queryString + '&location=' + encodeURIComponent(locationName);
    }

    const url = '/server/index.php?' + queryString;

    try {
        const response = await fetch(url);
        const data = await response.json();
        // The PHP handler wraps results in { success, data: [...] }
        // Fall back to the raw array if the response is already an array (legacy shape).
        const jobs = Array.isArray(data) ? data : (data.data || []);
        onFilter(jobs);
    } catch (error) {
        console.error('Failed to fetch jobs from backend:', error);
    }
}


// ─────────────────────────────────────────────
// HELPER: getButtonClasses
// Returns the correct Tailwind classes for a filter button.
// Active (selected) buttons get a purple highlight.
// ─────────────────────────────────────────────

function getButtonClasses(isSelected) {
    const base = 'w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2';

    if (isSelected) {
        return base + ' bg-purple-50 text-purple-700 font-medium';
    } else {
        return base + ' text-gray-600 hover:bg-gray-50';
    }
}


// ─────────────────────────────────────────────
// HELPER: getDotClasses
// ─────────────────────────────────────────────

function getDotClasses(isSelected) {
    const base = 'w-2 h-2 rounded-full shrink-0';

    if (isSelected) {
        return base + ' bg-purple-600';
    } else {
        return base + ' bg-gray-300';
    }
}


// ─────────────────────────────────────────────
// HELPER: getLocationPillClasses
// ─────────────────────────────────────────────

function getLocationPillClasses(isSelected) {
    const base = 'px-3 py-1.5 rounded-full text-xs border transition-colors';

    if (isSelected) {
        return base + ' border-purple-400 text-purple-600 bg-purple-50';
    } else {
        return base + ' border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600';
    }
}


// ─────────────────────────────────────────────
// COMPONENT: FilterButton
// ─────────────────────────────────────────────

function FilterButton({ label, isSelected, onClick }) {
    return (
        <button onClick={onClick} className={getButtonClasses(isSelected)}>
            <span className={getDotClasses(isSelected)} />
            {label}
        </button>
    );
}


// ─────────────────────────────────────────────
// COMPONENT: Sidebar
// ─────────────────────────────────────────────

const Sidebar = ({ onFilter }) => {

    const [selectedWorkType, setSelectedWorkType] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedLocationName, setSelectedLocationName] = useState(null);

    // Count how many filters are currently active (for the "Reset" button)
    const activeCount = [selectedWorkType, selectedLevel, selectedLocationName].filter(Boolean).length;

    function handleWorkTypeClick(id) {
        const newWorkType = selectedWorkType === id ? null : id;
        setSelectedWorkType(newWorkType);
        sendFiltersToBackend(newWorkType, selectedLevel, selectedLocationName, onFilter);
    }

    function handleLevelClick(id) {
        const newLevel = selectedLevel === id ? null : id;
        setSelectedLevel(newLevel);
        sendFiltersToBackend(selectedWorkType, newLevel, selectedLocationName, onFilter);
    }

    function handleLocationClick(locationName) {
        const newLocationName = selectedLocationName === locationName ? null : locationName;
        setSelectedLocationName(newLocationName);
        sendFiltersToBackend(selectedWorkType, selectedLevel, newLocationName, onFilter);
    }

    // Reset all three filters at once and reload the default job list
    function handleResetFilters() {
        setSelectedWorkType(null);
        setSelectedLevel(null);
        setSelectedLocationName(null);
        onFilter(null); // null tells JobList to show its default view
    }

    return (
        <aside className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden self-start sticky top-4">

            {/* ── Sidebar header bar ── */}
            <div className="bg-purple-600 px-4 py-3 flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="8" y1="12" x2="20" y2="12" />
                        <line x1="12" y1="18" x2="20" y2="18" />
                    </svg>
                    Bộ lọc tìm kiếm
                </h3>
                {/* Reset button — only visible when at least one filter is active */}
                {activeCount > 0 && (
                    <button
                        onClick={handleResetFilters}
                        className="text-xs text-white/80 hover:text-white underline transition-colors"
                    >
                        Xóa ({activeCount})
                    </button>
                )}
            </div>

            <div className="p-4 flex flex-col gap-5">

                {/* ── Section: Work Type ── */}
                <div>
                    <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-3">
                        Hình thức làm việc
                    </h4>
                    <ul className="flex flex-col gap-1">
                        {workTypes.map(function (item) {
                            return (
                                <li key={item.id}>
                                    <FilterButton
                                        label={item.label}
                                        isSelected={selectedWorkType === item.id}
                                        onClick={function () { handleWorkTypeClick(item.id); }}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <hr className="border-gray-100" />

                {/* ── Section: Level ── */}
                <div>
                    <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-3">
                        Cấp bậc
                    </h4>
                    <ul className="flex flex-col gap-1">
                        {levels.map(function (item) {
                            return (
                                <li key={item.id}>
                                    <FilterButton
                                        label={item.label}
                                        isSelected={selectedLevel === item.id}
                                        onClick={function () { handleLevelClick(item.id); }}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <hr className="border-gray-100" />

                {/* ── Section: Location ── */}
                <div>
                    <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-3">
                        Địa điểm
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {locations.map(function (locationName) {
                            return (
                                <button
                                    key={locationName}
                                    onClick={function () { handleLocationClick(locationName); }}
                                    className={getLocationPillClasses(selectedLocationName === locationName)}
                                >
                                    {locationName}
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>
        </aside>
    );
};

export default Sidebar;