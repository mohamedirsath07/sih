import React from 'react';
import { useLocation } from 'react-router-dom';

const Results: React.FC = () => {
    const location = useLocation();
    const { results } = location.state || { results: [] };

    return (
        <div className="results-container">
            <h1>Your Results</h1>
            {results.length > 0 ? (
                <ul>
                    {results.map((result, index) => (
                        <li key={index}>
                            <h2>{result.degree}</h2>
                            <p>Possible Jobs: {result.jobs.join(', ')}</p>
                            <p>Higher Studies: {result.higherStudies.join(', ')}</p>
                            <p>Average Salary: {result.averageSalary}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results available. Please complete the quiz.</p>
            )}
        </div>
    );
};

export default Results;