import { memo } from 'react';
import './CardDisplay.css';

export const CardDisplay = memo(function CardDisplay({
    card,
    isFlipped,
    onFlip,
    onLearned,
    onEdit,
    onDelete,
    onPrevious,
    onNext
}) {
    if (!card) {
        return <div className="card-display empty">There are no cards to study</div>;
    }

    return (
        <div className="card-display-wrapper">
            <button type="button" className="card-display" onClick={onFlip}>
                <span className="label">{isFlipped ? 'Answer' : 'Question'}</span>
                <span className="content">{isFlipped ? card.back : card.front}</span>
            </button>
            <div className="current-card-actions">
                <label className="learn-toggle">
                    <input
                        type="checkbox"
                        checked={card.isLearned}
                        onChange={(event) => onLearned(event.target.checked)}
                    />
                    <span>Learned</span>
                </label>
                <div className="action-buttons">
                    <button type="button" onClick={onEdit} className="ghost">
                        Edit
                    </button>
                    <button type="button" onClick={onDelete} className="danger">
                        Delete
                    </button>
                </div>
            </div>
            <div className="card-nav">
                <button type="button" onClick={onPrevious} className="ghost">
                    Previous
                </button>
                <button type="button" onClick={onFlip} className="primary">
                    Flip
                </button>
                <button type="button" onClick={onNext} className="ghost">
                    Next
                </button>
            </div>
        </div>
    );
});

