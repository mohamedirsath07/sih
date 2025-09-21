import React, { useEffect, useMemo, useState } from 'react';
import { fetchScholarships } from '../utils/api';
import { readCollection } from '@/hooks/useSync';
import ScholarshipCard from '@/components/scholarships/ScholarshipCard';
import './Scholarships.css';

const Scholarships = () => {
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [q, setQ] = useState('');
    const [category, setCategory] = useState('');
    const [minAmount, setMinAmount] = useState<number | ''>('');
    const [deadlineBefore, setDeadlineBefore] = useState('');
    const [sort, setSort] = useState<'deadline' | 'amount' | 'title'>('deadline');

    useEffect(() => {
        const loadScholarships = async (initial = false) => {
            try {
                const data = await fetchScholarships({ q, category: category || undefined, minAmount: typeof minAmount === 'number' ? minAmount : undefined, deadlineBefore: deadlineBefore || undefined });
                setScholarships(data);
            } catch (err) {
                const cached = (await readCollection<any[]>('scholarships')) || [];
                // Simple client-side filtering when offline
                const filtered = cached.filter((s: any) => {
                    const text = `${s.name || ''} ${s.details || ''} ${(s.eligibility || s.eligibilityCriteria || '')}`.toLowerCase();
                    if (q && !text.includes(q.toLowerCase())) return false;
                    if (category && !text.includes(category.toLowerCase())) return false;
                    if (typeof minAmount === 'number' && typeof s.amount === 'number' && s.amount < minAmount) return false;
                    if (deadlineBefore && s.application_deadline) {
                        const d = new Date(s.application_deadline);
                        if (!isNaN(d.getTime()) && d > new Date(deadlineBefore)) return false;
                    }
                    return true;
                });
                setScholarships(filtered);
                if (!initial) setError(null);
            } finally {
                setLoading(false);
            }
        };

        loadScholarships(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Refetch when filters change (debounced query)
    useEffect(() => {
        const t = setTimeout(() => {
            setLoading(true);
            fetchScholarships({ q, category: category || undefined, minAmount: typeof minAmount === 'number' ? minAmount : undefined, deadlineBefore: deadlineBefore || undefined })
                .then(setScholarships)
                .catch(async () => {
                    const cached = (await readCollection<any[]>('scholarships')) || [];
                    setScholarships(cached);
                })
                .finally(() => setLoading(false));
        }, 250);
        return () => clearTimeout(t);
    }, [q, category, minAmount, deadlineBefore]);

    const sorted = useMemo(() => {
        const arr = [...scholarships];
        if (sort === 'title') return arr.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
        if (sort === 'amount') return arr.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        // deadline
        return arr.sort((a, b) => {
            const da = new Date(a.application_deadline || a.applicationDeadline || 0).getTime();
            const db = new Date(b.application_deadline || b.applicationDeadline || 0).getTime();
            return da - db;
        });
    }, [scholarships, sort]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="sch-container">
            <div className="sch-header">
                <h1>Available Scholarships</h1>
                <div className="sch-filters" role="search">
                    <input
                        type="search"
                        placeholder="Search by name or eligibility"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        aria-label="Search scholarships"
                    />
                    <input
                        type="number"
                        min={0}
                        placeholder="Min amount (INR)"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value === '' ? '' : Number(e.target.value))}
                        aria-label="Minimum amount"
                    />
                    <input
                        type="date"
                        value={deadlineBefore}
                        onChange={(e) => setDeadlineBefore(e.target.value)}
                        aria-label="Apply before date"
                    />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
                        <option value="">All categories</option>
                        <option value="merit">Merit</option>
                        <option value="need">Need-based</option>
                        <option value="sports">Sports</option>
                        <option value="minority">Minority</option>
                        <option value="girl">Girls/Women</option>
                    </select>
                    <select value={sort} onChange={(e) => setSort(e.target.value as any)} aria-label="Sort by">
                        <option value="deadline">Soonest deadline</option>
                        <option value="amount">Highest amount</option>
                        <option value="title">Title A–Z</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="sch-loading">Loading…</div>
            ) : (
                <div className="sch-grid">
                    {sorted.map((s: any, idx: number) => (
                        <ScholarshipCard key={s.id || `${s.name}-${idx}`} data={s} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Scholarships;