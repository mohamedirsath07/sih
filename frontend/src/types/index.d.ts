interface UserProfile {
    age: number;
    gender: 'male' | 'female' | 'other';
    academicInterests: string[];
}

interface Course {
    id: string;
    name: string;
    description: string;
    duration: string;
    averageSalary: number;
    higherStudies: string[];
    jobs: string[];
}

interface College {
    id: string;
    name: string;
    coursesOffered: string[];
    facilities: string[];
    location: string;
}

interface Scholarship {
    id: string;
    name: string;
    eligibilityCriteria: string;
    amount: number;
    applicationDeadline: string;
}

interface CareerPath {
    courseId: string;
    possibleJobs: string[];
    higherStudies: string[];
}

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
}

interface QuizResult {
    stream: 'Science' | 'Commerce' | 'Arts' | 'Vocational';
    score: number;
}

interface Notification {
    id: string;
    message: string;
    date: Date;
    type: 'admission' | 'scholarship' | 'event';
}