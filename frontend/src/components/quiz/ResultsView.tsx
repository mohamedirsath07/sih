import React from 'react';
import './Results.css';

type RecResult = {
  recommended_stream?: string;
  recommended_courses?: string[];
  career_mapping?: Record<string, string[]>;
  top_colleges?: Array<{ name?: string; location?: string; district?: string; state?: string; courses_offered?: string[]; facilities?: string[] }>; 
};

const ResultsView: React.FC<{ data: RecResult }> = ({ data }) => {
  const stream = data.recommended_stream || '—';
  const courses = data.recommended_courses || [];
  const careers = data.career_mapping || {};
  const colleges = data.top_colleges || [];

  return (
    <div className="results">
      <section className="results__hero">
        <h2>Your recommended stream</h2>
        <div className="badge">{stream}</div>
      </section>

      <section className="results__cards">
        <div className="card">
          <h3>Suggested Courses</h3>
          {courses.length ? (
            <ul>
              {courses.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          ) : (
            <p>No course suggestions available.</p>
          )}
        </div>

        <div className="card">
          <h3>Careers you could explore</h3>
          {Object.keys(careers).length ? (
            <ul>
              {Object.entries(careers).map(([course, opts]) => (
                <li key={course}>
                  <strong>{course}:</strong> {opts.length ? opts.join(', ') : '—'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No career mapping available.</p>
          )}
        </div>
      </section>

      <section className="results__colleges">
        <h3>Top Colleges</h3>
        <div className="grid">
          {colleges.length ? (
            colleges.map((c, i) => {
              const location = c.location || [c.district, c.state].filter(Boolean).join(', ');
              return (
                <div key={`${c.name || 'college'}-${i}`} className="college">
                  <div className="college__title">{c.name || 'College'}</div>
                  {location && <div className="college__sub">{location}</div>}
                  {c.courses_offered?.length ? (
                    <div className="chips">
                      {c.courses_offered.slice(0, 3).map((co) => (
                        <span key={co} className="chip">{co}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <p>No colleges found for this stream.</p>)
          }
        </div>
        <div className="results__cta">
          <a className="btn" href="/colleges">Browse all colleges</a>
          <a className="btn btn--secondary" href="/scholarships">Find scholarships</a>
        </div>
      </section>
    </div>
  );
};

export default ResultsView;
