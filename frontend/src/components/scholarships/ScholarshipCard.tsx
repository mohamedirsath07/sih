import React from 'react';

type Props = {
  data: any;
};

const formatAmount = (v: any) => {
  if (typeof v === 'number') return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
  if (!v) return '—';
  const n = Number(String(v).replace(/[^0-9.]/g, ''));
  return isNaN(n) ? String(v) : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
};

const formatDate = (s?: string) => {
  if (!s) return '—';
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' });
};

export default function ScholarshipCard({ data }: Props) {
  const title = data?.name || 'Scholarship';
  const amount = data?.amount;
  const deadline = data?.application_deadline || data?.applicationDeadline;
  const eligibility = data?.eligibility || data?.eligibilityCriteria;
  const category = data?.category || undefined;
  const gender = data?.gender || undefined;
  const states: string[] = data?.applicable_states || [];
  const applyUrl = data?.apply_url || data?.url || undefined;

  return (
    <article className="sch-card" role="article" aria-label={title}>
      <div className="sch-card__header">
        <h3 className="sch-card__title">{title}</h3>
        <div className="sch-card__pill">{formatAmount(amount)}</div>
      </div>
      {eligibility && <p className="sch-card__eligibility"><span>Eligibility:</span> {eligibility}</p>}

      <div className="sch-card__meta">
        <div className="meta"><span className="k">Deadline</span><span className="v">{formatDate(deadline)}</span></div>
        {category && <div className="chip">{category}</div>}
        {gender && <div className="chip">{gender}</div>}
        {states?.length ? <div className="chip" title={`States: ${states.join(', ')}`}>{states.length} states</div> : null}
      </div>

      {(data?.details || data?.description) && (
        <p className="sch-card__desc">{data.details || data.description}</p>
      )}

      <div className="sch-card__actions">
        {applyUrl ? (
          <a className="btn btn-primary" href={applyUrl} target="_blank" rel="noreferrer">Apply</a>
        ) : (
          <button className="btn" disabled title="Application link not available">Apply</button>
        )}
      </div>
    </article>
  );
}
