import React, { useState } from 'react';

const Filters = ({ colleges, onFilterChange }) => {
    const [selectedStream, setSelectedStream] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleStreamChange = (event) => {
        const stream = event.target.value;
        setSelectedStream(stream);
        onFilterChange(stream, searchTerm);
    };

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        onFilterChange(selectedStream, term);
    };

    const uniqueStreams = [...new Set(colleges.map(college => college.stream))];

    return (
        <div className="filters">
            <select value={selectedStream} onChange={handleStreamChange}>
                <option value="">All Streams</option>
                {uniqueStreams.map((stream, index) => (
                    <option key={index} value={stream}>{stream}</option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Search colleges..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </div>
    );
};

export default Filters;