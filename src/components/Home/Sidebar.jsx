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
// Builds a URL with all three filters as query parameters,
// calls the PHP endpoint, and passes the result to onFilter.
//
// Any filter that is null (not selected) is simply left out of the URL.
//
// Example URL it might build:
//   /server/index.php?workType=fulltime&level=staff&location=H%C3%A0+N%E1%BB%99i
//
// Your PHP file at /server/index.php should:
//   1. Read the filters:  $_GET['workType'], $_GET['level'], $_GET['location']
//   2. Query the database using those values (skip a filter if it's not set)
//   3. Output the results as JSON:  echo json_encode($jobs);
//
// Parameters:
//   workType     - string like "fulltime", or null if not selected
//   level        - string like "staff", or null if not selected
//   locationName - string like "Hà Nội", or null if not selected
//   onFilter     - the callback prop from the parent; receives the job list
// ─────────────────────────────────────────────

async function sendFiltersToBackend(workType, level, locationName, onFilter) {
    // Start with an empty query string and add each filter one by one.
    // encodeURIComponent makes values safe to put in a URL
    // (e.g. "Hà Nội" becomes "H%C3%A0+N%E1%BB%99i").
    let queryString = '';

    if (workType !== null) {
        queryString = queryString + 'workType=' + encodeURIComponent(workType);
    }

    if (level !== null) {
        // Add a "&" separator if something was already added before this
        if (queryString !== '') {
            queryString = queryString + '&';
        }
        queryString = queryString + 'level=' + encodeURIComponent(level);
    }

    if (locationName !== null) {
        if (queryString !== '') {
            queryString = queryString + '&';
        }
        queryString = queryString + 'location=' + encodeURIComponent(locationName);
    }

    // Build the final URL.
    // If no filters are active at all, just call the base URL with no parameters.
    let url;
    if (queryString === '') {
        url = 'http://localhost:8888/aptech-project/server/index.php';
    } else {
        url = 'http://localhost:8888/aptech-project/server/index.php?' + queryString;
    }

    // Call the PHP endpoint and wait for the response.
    // We wrap it in try/catch so a network error doesn't crash the page.
    try {
        const response = await fetch(url);

        // Convert the raw HTTP response body into a JavaScript value.
        // This works because PHP echoes JSON (echo json_encode($jobs)).
        const data = await response.json();

        // Hand the job list up to the parent component so it can
        // re-render the job listing grid with the filtered results.
        onFilter(data);

    } catch (error) {
        // Something went wrong — network failure, PHP error, invalid JSON, etc.
        // Log it so it shows up in the browser developer console (F12 → Console).
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
// Returns classes for the small dot indicator beside each button label.
// Purple when selected, gray otherwise.
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
// Returns classes for a city pill button.
// Stays highlighted (purple border) when that city is selected.
// ─────────────────────────────────────────────

function getLocationPillClasses(isSelected) {
    const base = 'px-3 py-1.5 rounded-full text-xs border transition-colors';

    if (isSelected) {
        return base + ' border-purple-400 text-purple-600';
    } else {
        return base + ' border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600';
    }
}


// ─────────────────────────────────────────────
// COMPONENT: FilterButton
// A single clickable row inside Work Type or Level sections.
// Shows a colored dot + label. Highlights when selected.
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
// The main filter sidebar. Receives an "onFilter" prop
// that gets called with the new job list whenever the user changes a filter.
// ─────────────────────────────────────────────

const Sidebar = ({ onFilter }) => {

    // These track which filter button is currently selected in each group.
    // null means nothing is selected in that group.
    const [selectedWorkType, setSelectedWorkType] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedLocationName, setSelectedLocationName] = useState(null);


    // ─────────────────────────────────────────
    // HANDLER: handleWorkTypeClick
    //
    // Called when the user clicks a Work Type button.
    // Clicking the already-selected button deselects it (sets to null).
    // Clicking a different button selects the new one.
    // Then sends ALL current filter values to the PHP backend.
    // ─────────────────────────────────────────

    function handleWorkTypeClick(id) {
        let newWorkType;

        if (selectedWorkType === id) {
            newWorkType = null; // clicking the same button again deselects it
        } else {
            newWorkType = id;   // clicking a new button selects it
        }

        // Save the new value so the UI re-renders with the correct highlight
        setSelectedWorkType(newWorkType);

        // IMPORTANT: we pass newWorkType directly instead of selectedWorkType
        // because React state updates are delayed — selectedWorkType still holds
        // the OLD value at this point in the code.
        sendFiltersToBackend(newWorkType, selectedLevel, selectedLocationName, onFilter);
    }


    // ─────────────────────────────────────────
    // HANDLER: handleLevelClick
    //
    // Same pattern as handleWorkTypeClick but for the Level group.
    // ─────────────────────────────────────────

    function handleLevelClick(id) {
        let newLevel;

        if (selectedLevel === id) {
            newLevel = null;
        } else {
            newLevel = id;
        }

        setSelectedLevel(newLevel);

        // Pass the fresh newLevel value, not the stale selectedLevel state
        sendFiltersToBackend(selectedWorkType, newLevel, selectedLocationName, onFilter);
    }


    // ─────────────────────────────────────────
    // HANDLER: handleLocationClick
    //
    // Called when the user clicks a city pill.
    // Clicking the already-selected city deselects it.
    // Clicking a different city selects it.
    // Then sends all current filters to PHP.
    // ─────────────────────────────────────────

    function handleLocationClick(locationName) {
        let newLocationName;

        if (selectedLocationName === locationName) {
            newLocationName = null; // clicking the same city deselects it
        } else {
            newLocationName = locationName;
        }

        setSelectedLocationName(newLocationName);

        // Pass the fresh newLocationName value, not the stale selectedLocationName state
        sendFiltersToBackend(selectedWorkType, selectedLevel, newLocationName, onFilter);
    }


    // ─────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────

    return (
        <aside className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

            {/* ── Sidebar header bar ── */}
            <div className="bg-purple-600 px-4 py-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="8" y1="12" x2="20" y2="12" />
                        <line x1="12" y1="18" x2="20" y2="18" />
                    </svg>
                    Bộ lọc tìm kiếm
                </h3>
            </div>

            <div className="p-4 flex flex-col gap-5">

                {/* ── Section: Work Type ── */}
                <div>
                    <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-3">
                        Hình thức làm việc
                    </h4>
                    <ul className="flex flex-col gap-1">
                        {workTypes.map(function (item) {
                            const isSelected = selectedWorkType === item.id;

                            return (
                                <li key={item.id}>
                                    <FilterButton
                                        label={item.label}
                                        isSelected={isSelected}
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
                            const isSelected = selectedLevel === item.id;

                            return (
                                <li key={item.id}>
                                    <FilterButton
                                        label={item.label}
                                        isSelected={isSelected}
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
                            const isSelected = selectedLocationName === locationName;

                            return (
                                <button
                                    key={locationName}
                                    onClick={function () { handleLocationClick(locationName); }}
                                    className={getLocationPillClasses(isSelected)}
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