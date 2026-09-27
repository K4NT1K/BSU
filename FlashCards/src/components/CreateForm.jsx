import { memo } from 'react';
import './CreateForm.css';

export const CreateForm = memo(function CreateForm({
    questionValue,
    answerValue,
    onQuestionChange,
    onAnswerChange,
    onSubmit,
    onCancelEdit,
    isEditing
}) {
    return (
        <form className="create-form" onSubmit={(event) => event.preventDefault()}>
            <div className="field">
                <label htmlFor="question">Question</label>
                <textarea
                    id="question"
                    placeholder="Enter a question"
                    rows="3"
                    maxLength="200"
                    value={questionValue}
                    onChange={(event) => onQuestionChange(event.target.value)}
                ></textarea>
            </div>
            <div className="field">
                <label htmlFor="answer">Answer</label>
                <textarea
                    id="answer"
                    placeholder="Enter the answer"
                    rows="3"
                    maxLength="200"
                    value={answerValue}
                    onChange={(event) => onAnswerChange(event.target.value)}
                ></textarea>
            </div>
            <div className="actions">
                <button type="button" onClick={onSubmit} className="primary">
                    {isEditing ? 'Update card' : 'Add card'}
                </button>
                {isEditing && (
                    <button type="button" onClick={onCancelEdit} className="ghost">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
});

