import { useState } from 'react';

const JobCard = ({ job }) => {
    const [saved, setSaved] = useState(false);
    const urgent = job.daysLeft <= 7;

    return (
        <div className="group h-full cursor-pointer bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
            {urgent && (
                <div className="bg-red-500 text-white text-xs font-semibold text-center py-1">
                    ⚡ Sắp hết hạn - còn {job.daysLeft} ngày
                </div>
            )}
            <div className="p-4 flex flex-col flex-1">
                {/* Bookmark */}
                <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center overflow-hidden border border-purple-100 shrink-0">
                        {job.logo
                            ? <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                            : <span className="text-xl font-bold text-purple-600">{job.company.charAt(0)}</span>
                        }
                    </div>
                    <button onClick={e => { e.stopPropagation(); setSaved(v => !v); }}
                        className={`transition-colors text-lg leading-none ${saved ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}>
                        {saved ? '❤️' : '🤍'}
                    </button>
                </div>

                <h3 className="font-bold text-sm mb-1 text-gray-800 line-clamp-2 leading-snug group-hover:text-purple-700 transition-colors">
                    {job.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{job.company}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
                        💰 {job.salary}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        📍 {job.location}
                    </span>
                </div>

                <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${urgent ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                        Còn {job.daysLeft} ngày
                    </span>
                    <button className="text-xs text-purple-600 font-semibold hover:underline">Xem →</button>
                </div>
            </div>
        </div>
    );
};

export default JobCard;