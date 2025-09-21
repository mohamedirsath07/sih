import React, { useState } from 'react';
import QuizForm from '../components/quiz/QuizForm';
import ResultsView from '../components/quiz/ResultsView';
import './QuizRoute.css';

const Quiz = () => {
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [results, setResults] = useState<any>(null);

    const handleQuizCompletion = (res: any) => {
        setResults(res);
        setQuizCompleted(true);
    };

    return (
        <div className="quiz-container">
            <div className="quiz-card">
                <h1>Aptitude &amp; Interest Quiz</h1>
                {!quizCompleted ? (
                    <QuizForm onComplete={handleQuizCompletion} />
                ) : (
                    <>
                        <h2>Your Results</h2>
                        <ResultsView data={results || {}} />
                    </>
                )}
            </div>
        </div>
    );
};

export default Quiz;