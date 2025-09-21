import { Degree, Stream, Career } from '../types'; // Importing types for better type safety

// Sample data for aptitude rules
const aptitudeRules = {
    Science: {
        interests: ['Math', 'Physics', 'Biology'],
        strengths: ['Analytical', 'Problem-solving'],
    },
    Commerce: {
        interests: ['Business', 'Economics', 'Finance'],
        strengths: ['Analytical', 'Communication'],
    },
    Arts: {
        interests: ['Literature', 'History', 'Fine Arts'],
        strengths: ['Creative', 'Critical Thinking'],
    },
    Vocational: {
        interests: ['Hands-on Skills', 'Technical'],
        strengths: ['Practical', 'Detail-oriented'],
    },
};

// Function to categorize students based on their responses
export const categorizeStudent = (responses: string[]): Stream => {
    const scores = {
        Science: 0,
        Commerce: 0,
        Arts: 0,
        Vocational: 0,
    };

    responses.forEach((response) => {
        if (aptitudeRules.Science.interests.includes(response)) {
            scores.Science++;
        } else if (aptitudeRules.Commerce.interests.includes(response)) {
            scores.Commerce++;
        } else if (aptitudeRules.Arts.interests.includes(response)) {
            scores.Arts++;
        } else if (aptitudeRules.Vocational.interests.includes(response)) {
            scores.Vocational++;
        }
    });

    const maxScore = Math.max(...Object.values(scores));
    return Object.keys(scores).find((key) => scores[key] === maxScore) as Stream;
};

// Function to map streams to degrees and careers
export const mapStreamToDegreesAndCareers = (stream: Stream): { degrees: Degree[]; careers: Career[] } => {
    const mapping = {
        Science: {
            degrees: ['B.Sc.', 'B.Tech.', 'B.Pharma'],
            careers: ['Engineer', 'Doctor', 'Researcher'],
        },
        Commerce: {
            degrees: ['B.Com.', 'BBA', 'CA'],
            careers: ['Accountant', 'Business Analyst', 'Financial Consultant'],
        },
        Arts: {
            degrees: ['B.A.', 'BFA', 'B.Des.'],
            careers: ['Teacher', 'Artist', 'Historian'],
        },
        Vocational: {
            degrees: ['Diploma in Engineering', 'Certificate in IT'],
            careers: ['Technician', 'Craftsman'],
        },
    };

    return mapping[stream];
};