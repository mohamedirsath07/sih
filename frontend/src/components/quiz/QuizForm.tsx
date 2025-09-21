import React, { useMemo, useState } from 'react';
import './Quiz.css';
import { recommendationsFromQuiz } from '@/utils/api';

type Choice = { value: string; label: string; tags: string[] };
type Q = { id: number; text: string; options: Choice[] };

const QUESTION_BANK: Q[] = [
    { id: 1, text: 'Which activity sounds most exciting to you?', options: [
        { value: 'lab-experiments', label: 'Doing lab experiments', tags: ['science','stem'] },
        { value: 'business-fair', label: 'Running a stall at a business fair', tags: ['commerce','business'] },
        { value: 'theatre', label: 'Acting in a theatre play', tags: ['arts','creativity'] },
        { value: 'repairing', label: 'Repairing a gadget or bike', tags: ['vocational','hands-on'] },
    ]},
    { id: 2, text: 'Which subject do you enjoy the most?', options: [
        { value: 'physics', label: 'Physics', tags: ['science','stem'] },
        { value: 'accounts', label: 'Accounting', tags: ['commerce'] },
        { value: 'history', label: 'History', tags: ['arts'] },
        { value: 'it', label: 'Information Technology', tags: ['vocational','tech'] },
    ]},
    { id: 3, text: 'Pick a club you would join:', options: [
        { value: 'robotics', label: 'Robotics/Science Club', tags: ['science','stem'] },
        { value: 'entrepreneur', label: 'Entrepreneurship Club', tags: ['commerce','business'] },
        { value: 'literary', label: 'Literary/Drama Club', tags: ['arts','creativity'] },
        { value: 'automobile', label: 'Automobile/Workshop Club', tags: ['vocational','hands-on'] },
    ]},
    { id: 4, text: 'How do you prefer solving problems?', options: [
        { value: 'experiment', label: 'By experimenting and testing', tags: ['science'] },
        { value: 'analyze-trends', label: 'By analyzing trends and numbers', tags: ['commerce'] },
        { value: 'brainstorm', label: 'By brainstorming creative ideas', tags: ['arts'] },
        { value: 'try-fix', label: 'By trying fixes with tools', tags: ['vocational'] },
    ]},
    { id: 5, text: 'Which task would you volunteer for?', options: [
        { value: 'science-fair', label: 'Organize a science fair demo', tags: ['science'] },
        { value: 'budget', label: 'Create a budget for an event', tags: ['commerce'] },
        { value: 'poster', label: 'Design posters and stage setup', tags: ['arts'] },
        { value: 'setup-sound', label: 'Set up sound/electrical equipment', tags: ['vocational'] },
    ]},
    { id: 6, text: 'Pick a career that appeals to you:', options: [
        { value: 'doctor', label: 'Doctor/Engineer', tags: ['science','stem'] },
        { value: 'ca', label: 'Chartered Accountant/Analyst', tags: ['commerce'] },
        { value: 'journalist', label: 'Journalist/Designer', tags: ['arts'] },
        { value: 'technician', label: 'Technician/Operator', tags: ['vocational'] },
    ]},
    { id: 7, text: 'What type of content do you consume most?', options: [
        { value: 'science-videos', label: 'Science/tech experiments', tags: ['science','stem'] },
        { value: 'finance-news', label: 'Finance/business news', tags: ['commerce'] },
        { value: 'art-music', label: 'Art, music, films', tags: ['arts'] },
        { value: 'how-to', label: 'How-to repair/build videos', tags: ['vocational'] },
    ]},
    { id: 8, text: 'Which project sounds fun?', options: [
        { value: 'app', label: 'Build a simple mobile app', tags: ['science','stem'] },
        { value: 'market-survey', label: 'Do a market survey', tags: ['commerce'] },
        { value: 'short-film', label: 'Make a short film', tags: ['arts'] },
        { value: 'garden', label: 'Create a small kitchen garden', tags: ['vocational','agri'] },
    ]},
    { id: 9, text: 'How do you like working?', options: [
        { value: 'data', label: 'With data and logic', tags: ['science','commerce'] },
        { value: 'people', label: 'With people and teams', tags: ['commerce','arts'] },
        { value: 'ideas', label: 'With ideas and stories', tags: ['arts'] },
        { value: 'tools', label: 'With tools and machines', tags: ['vocational'] },
    ]},
    { id: 10, text: 'Pick a school subject you’d add extra time for:', options: [
        { value: 'math', label: 'Mathematics', tags: ['science','commerce'] },
        { value: 'economics', label: 'Economics', tags: ['commerce'] },
        { value: 'fine-arts', label: 'Fine Arts', tags: ['arts'] },
        { value: 'electronics', label: 'Electronics', tags: ['vocational'] },
    ]},
    { id: 11, text: 'Which internship would you choose?', options: [
        { value: 'lab-intern', label: 'Assist in a science lab', tags: ['science'] },
        { value: 'store-intern', label: 'Work in a local store accounting', tags: ['commerce'] },
        { value: 'media-intern', label: 'Help at a local newspaper', tags: ['arts'] },
        { value: 'workshop-intern', label: 'Assist at a repair workshop', tags: ['vocational'] },
    ]},
    { id: 12, text: 'How do you feel about numbers?', options: [
        { value: 'love', label: 'I enjoy solving numerical problems', tags: ['science','commerce'] },
        { value: 'ok', label: 'I can handle them', tags: ['commerce'] },
        { value: 'prefer-words', label: 'I prefer words and visuals', tags: ['arts'] },
        { value: 'measurements', label: 'I prefer measurements with tools', tags: ['vocational'] },
    ]},
    { id: 13, text: 'What motivates you most?', options: [
        { value: 'discover', label: 'Discovering how things work', tags: ['science'] },
        { value: 'profit', label: 'Creating value/profit', tags: ['commerce'] },
        { value: 'express', label: 'Expressing myself creatively', tags: ['arts'] },
        { value: 'build', label: 'Building practical solutions', tags: ['vocational'] },
    ]},
    { id: 14, text: 'Which tool set would you pick?', options: [
        { value: 'microscope', label: 'Microscope & lab kit', tags: ['science'] },
        { value: 'spreadsheet', label: 'Spreadsheet & calculator', tags: ['commerce'] },
        { value: 'camera', label: 'Camera & sketchbook', tags: ['arts'] },
        { value: 'toolbox', label: 'Screwdriver & multimeter', tags: ['vocational'] },
    ]},
    { id: 15, text: 'How do you approach assignments?', options: [
        { value: 'research', label: 'Research thoroughly and test', tags: ['science'] },
        { value: 'plan', label: 'Plan, budget and execute', tags: ['commerce'] },
        { value: 'story', label: 'Tell a story with visuals', tags: ['arts'] },
        { value: 'prototype', label: 'Build a working prototype', tags: ['vocational'] },
    ]},
    { id: 16, text: 'Which elective would you choose?', options: [
        { value: 'bio', label: 'Biology', tags: ['science'] },
        { value: 'accounts-adv', label: 'Advanced Accounting', tags: ['commerce'] },
        { value: 'psych', label: 'Psychology', tags: ['arts'] },
        { value: 'graphics', label: 'Computer Graphics/IT', tags: ['vocational'] },
    ]},
    { id: 17, text: 'What kind of problems do you enjoy discussing?', options: [
        { value: 'health-env', label: 'Health/Environmental issues', tags: ['science'] },
        { value: 'market', label: 'Markets & startups', tags: ['commerce'] },
        { value: 'culture', label: 'Culture & society', tags: ['arts'] },
        { value: 'infrastructure', label: 'Infrastructure & utilities', tags: ['vocational'] },
    ]},
    { id: 18, text: 'Your weekend activity?', options: [
        { value: 'tinkering', label: 'Tinkering with kits/computers', tags: ['science','vocational'] },
        { value: 'sell', label: 'Selling items online', tags: ['commerce'] },
        { value: 'create', label: 'Creating art/music/videos', tags: ['arts'] },
        { value: 'fix', label: 'Fixing or building something', tags: ['vocational'] },
    ]},
    { id: 19, text: 'Which field trip would you prefer?', options: [
        { value: 'research-centre', label: 'Research center/planetarium', tags: ['science'] },
        { value: 'stock-exchange', label: 'Stock exchange/industry visit', tags: ['commerce'] },
        { value: 'museum', label: 'Museum/art gallery', tags: ['arts'] },
        { value: 'plant', label: 'Manufacturing/utility plant', tags: ['vocational'] },
    ]},
    { id: 20, text: 'What would you like to master in the next year?', options: [
        { value: 'coding', label: 'Coding and problem solving', tags: ['science'] },
        { value: 'finance', label: 'Personal finance & markets', tags: ['commerce'] },
        { value: 'storytelling', label: 'Storytelling & design', tags: ['arts'] },
        { value: 'technical-skill', label: 'A practical technical skill', tags: ['vocational'] },
    ]},
];

interface QuizFormProps { onComplete?: (r: any) => void }
const QuizForm: React.FC<QuizFormProps> = ({ onComplete }: QuizFormProps) => {
    const [answers, setAnswers] = useState<(string | null)[]>(Array(QUESTION_BANK.length).fill(null));
    const [current, setCurrent] = useState(0);
    const q = QUESTION_BANK[current];

    const progress = useMemo(() => {
        const answered = answers.filter(Boolean).length;
        return Math.round((answered / answers.length) * 100);
    }, [answers]);

    const choose = (val: string) => {
        const copy = [...answers];
        copy[current] = val;
        setAnswers(copy);
    };

        const next = () => setCurrent((c: number) => Math.min(c + 1, answers.length - 1));
        const prev = () => setCurrent((c: number) => Math.max(c - 1, 0));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            answers: QUESTION_BANK.map((qq, i) => ({ id: qq.id, choice: answers[i] || '' })),
        };
        try {
            const result = await recommendationsFromQuiz(payload);
            onComplete?.(result);
        } catch (err) {
            onComplete?.({ error: 'Failed to fetch recommendations', raw: payload });
        }
    };

        return (
            <form onSubmit={submit} className="quiz-form">
            <h2>Quiz: Aptitude & Interest Test</h2>
            <p>Question {current + 1} of {answers.length} · {progress}% completed</p>
            <progress className="quiz-progressbar" value={progress} max={100} aria-label="Quiz progress"></progress>
                <div className="quiz-block">
                    <p className="quiz-question">{q.text}</p>
                    <div className="quiz-options">
                    {q.options.map((opt) => (
                            <label key={opt.value} className="quiz-option">
                            <input
                                type="radio"
                                name={`q-${q.id}`}
                                value={opt.value}
                                checked={answers[current] === opt.value}
                                onChange={() => choose(opt.value)}
                            />
                            <span>{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>
                <div className="quiz-actions">
                <button type="button" onClick={prev} disabled={current === 0}>Previous</button>
                {current < answers.length - 1 && (
                    <button type="button" onClick={next} disabled={!answers[current]}>Next</button>
                )}
                {current === answers.length - 1 && (
                      <button type="submit" disabled={answers.some((a: string | null) => !a)}>Submit</button>
                )}
            </div>
        </form>
    );
};

export default QuizForm;