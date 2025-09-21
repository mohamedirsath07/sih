import React, { useEffect, useMemo, useState } from 'react';
import CollegeCard from '../components/colleges/CollegeCard';
import { fetchColleges } from '../utils/api';
import { readCollection } from '../hooks/useSync';
import './Colleges.css';

const Colleges = () => {
    const [colleges, setColleges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // Filters
    const [q, setQ] = useState('');
    const [stream, setStream] = useState('');
    const [district, setDistrict] = useState('');
    const [sort, setSort] = useState<'name' | 'courses'>('name');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchColleges();
                setColleges(data);
            } catch (e) {
                // fallback to cache
                const cached = (await readCollection<any[]>('colleges')) || [];
                setColleges(cached);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = useMemo(() => {
        const t = q.toLowerCase();
        let arr = [...colleges];
        if (stream) arr = arr.filter((c: any) => {
            const offered = c.courses_offered || c.coursesOffered || c.courses || [];
            return offered.some((co: string) => (co || '').toLowerCase().includes(stream.toLowerCase()));
        });
        if (district) arr = arr.filter((c: any) => (c.district || c.location || '').toLowerCase().includes(district.toLowerCase()));
        if (t) arr = arr.filter((c: any) => (c.name || '').toLowerCase().includes(t) || (c.location || '').toLowerCase().includes(t));
        if (sort === 'name') arr.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
        if (sort === 'courses') arr.sort((a, b) => (b.courses_offered?.length || 0) - (a.courses_offered?.length || 0));
        return arr;
    }, [colleges, q, stream, district, sort]);

    if (loading) return <div>Loading...</div>;

    const toCardCollege = (c: any) => ({
        name: c.name,
        location: c.location || [c.district, c.state].filter(Boolean).join(', '),
        courses: c.courses || c.coursesOffered || c.courses_offered || [],
        facilities: c.facilities || [],
    });

    return (
        <div className="col-container">
            <div className="col-header">
                <h1>Colleges in Jammu & Kashmir</h1>
                <div className="col-filters">
                    <input type="search" placeholder="Search by name/location" value={q} onChange={(e) => setQ(e.target.value)} />
                    <input type="text" placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
                    <select aria-label="Stream" value={stream} onChange={(e) => setStream(e.target.value)}>
                        <option value="">All streams</option>
                        <option value="B.Sc">B.Sc</option>
                        <option value="B.Com">B.Com</option>
                        <option value="B.A">B.A</option>
                        <option value="Engineering">Engineering</option>
                    </select>
                    <select aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as any)}>
                        <option value="name">Name A–Z</option>
                        <option value="courses">Most courses</option>
                    </select>
                </div>
            </div>

            <div className="col-grid">
                {filtered.map((college: any) => (
                    <CollegeCard key={college.id || college.name} college={toCardCollege(college)} />
                ))}
            </div>
        </div>
    );
};

export default Colleges;