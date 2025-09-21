import React from 'react';

interface CollegeCardProps {
    college: {
        name: string;
        courses: string[];
        facilities: string[];
        location: string;
    };
}

const CollegeCard: React.FC<CollegeCardProps> = ({ college }: { college: CollegeCardProps['college'] }) => {
    const courses: string[] = (college.courses || []).slice(0, 6);
    const facilities: string[] = (college.facilities || []).slice(0, 4);
    return (
        <div className="college-card">
            <div className="top">
                <h2 className="name">{college.name}</h2>
                {courses.length > 0 && <div className="badge">{courses.length} courses</div>}
            </div>
            <div className="meta-row">
                <span>📍 {college.location}</span>
            </div>
            {courses.length > 0 && (
                <div className="courses">
                    {courses.map((c: string, i: number) => (
                        <span className="chip" key={i}>{c}</span>
                    ))}
                </div>
            )}
            {facilities.length > 0 && (
                <div className="courses">
                    {facilities.map((f: string, i: number) => (
                        <span className="chip" key={i}>{f}</span>
                    ))}
                </div>
            )}
            <div className="actions">
                <button className="btn" title="View details">View</button>
            </div>
        </div>
    );
};

export default CollegeCard;