import { memo } from 'react';

export const CardRow = memo(function CardRow({ card, onEdit, onDelete, onToggleLearned }) {
    return (
        <div className={`card-row ${card.isLearned ? 'learned' : ''}`}>
            <div className="card-text">
                <p className="front">{card.front}</p>
                <p className="back">{card.back}</p>
            </div>
            <label className="learned-toggle">
                <input
                    type="checkbox"
                    checked={card.isLearned}
                    onChange={(event) => onToggleLearned(card.id, event.target.checked)}
                />
                Learned
            </label>
            <div className="row-actions">
                <button type="button" className="ghost" onClick={() => onEdit(card.id)}>
                    Edit
                </button>
                <button type="button" className="danger" onClick={() => onDelete(card.id)}>
                    Delete
                </button>
            </div>
        </div>
    );
});

