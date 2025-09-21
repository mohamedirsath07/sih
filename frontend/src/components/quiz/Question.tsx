import React from 'react';

interface QuestionProps {
    question: string;
    options: string[];
    selectedOption: string | null;
    onOptionSelect: (option: string) => void;
}

const Question: React.FC<QuestionProps> = ({ question, options, selectedOption, onOptionSelect }) => {
    return (
        <div className="question-container">
            <h3>{question}</h3>
            <div className="options">
                {options.map((option, index) => (
                    <label key={index} className="option">
                        <input
                            type="radio"
                            name="quiz-option"
                            value={option}
                            checked={selectedOption === option}
                            onChange={() => onOptionSelect(option)}
                        />
                        {option}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default Question;