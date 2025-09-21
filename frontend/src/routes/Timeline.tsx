import React, { useEffect, useMemo, useState } from 'react';
import { fetchTimelines } from '../utils/api';
import { readCollection } from '@/hooks/useSync';
import './Timeline.css';

const Timeline = () => {
    const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [q, setQ] = useState('');
    const [type, setType] = useState('');
    const [upcomingOnly, setUpcomingOnly] = useState(true);

    useEffect(() => {
        const fetchTimelineData = async () => {
            try {
                const data = await fetchTimelines();
                setTimelineEvents(data);
            } catch (err) {
                const cached = (await readCollection<any[]>('timelines')) || [];
                setTimelineEvents(cached);
                setError(cached.length ? null : 'Failed to fetch timeline data');
            }
        };

        fetchTimelineData();
    }, []);

    const filtered = useMemo(() => {
        const now = new Date();
        const t = q.toLowerCase();
        return timelineEvents.filter((e: any) => {
            if (type && String(e.type || '').toLowerCase() !== type.toLowerCase()) return false;
            if (upcomingOnly) {
                const d = new Date(e.date);
                if (!isNaN(d.getTime()) && d < now) return false;
            }
            const text = `${e.title || ''} ${e.description || ''}`.toLowerCase();
            if (t && !text.includes(t)) return false;
            return true;
        }).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [timelineEvents, q, type, upcomingOnly]);

    const fmt = (s?: string) => {
        if (!s) return '—';
        const d = new Date(s);
        return isNaN(d.getTime()) ? s : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="tl-container">
            <div className="tl-header">
                <h1>Important Dates & Notifications</h1>
                <div className="tl-filters">
                    <input type="search" placeholder="Search titles/descriptions" value={q} onChange={(e) => setQ(e.target.value)} />
                    <select aria-label="Type" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">All types</option>
                        <option value="admission">Admission</option>
                        <option value="exam">Exam</option>
                        <option value="scholarship">Scholarship</option>
                        <option value="counseling">Counseling</option>
                    </select>
                    <label className="chk">
                        <input type="checkbox" checked={upcomingOnly} onChange={(e) => setUpcomingOnly(e.target.checked)} />
                        Upcoming only
                    </label>
                </div>
            </div>
            {error && <div className="error">{error}</div>}
            <div className="tl-grid">
                {filtered.map((ev: any, idx: number) => (
                    <article className="tl-card" key={ev.id || `${ev.title}-${idx}`}>
                        <div className="date">
                            <span className="d">{fmt(ev.date)}</span>
                            {ev.type && <span className="chip">{String(ev.type).toUpperCase()}</span>}
                        </div>
                        <h3 className="title">{ev.title}</h3>
                        {ev.description && <p className="desc">{ev.description}</p>}
                        <div className="actions">
                            {ev.link ? <a className="btn" href={ev.link} target="_blank" rel="noreferrer">View</a> : <span className="muted">No link</span>}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Timeline;