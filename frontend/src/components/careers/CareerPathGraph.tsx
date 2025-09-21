import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CareerPathGraphProps {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
        }[];
    };
}

const CareerPathGraph: React.FC<CareerPathGraphProps> = ({ data }) => {
    return (
        <div>
            <h2>Career Path Visualization</h2>
            <Bar data={data} options={{
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top' as const,
                    },
                    title: {
                        display: true,
                        text: 'Career Opportunities by Degree',
                    },
                },
            }} />
        </div>
    );
};

export default CareerPathGraph;