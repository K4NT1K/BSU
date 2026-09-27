import { memo } from 'react';
import './CardsTable.css';
import { CardRow } from './CardRow';

export const CardsTable = memo(function CardsTable({
    cards,
    isHidden,
    onToggleHidden,
    onEdit,
    onDelete,
    onToggleLearned
}) {
    return (
        <section className="cards-panel">
            <header className="panel-header">
                <h2>All cards</h2>
                <button type="button" className="ghost" onClick={onToggleHidden}>
                    {isHidden ? 'Show' : 'Hide'} table
                </button>
            </header>

            {!isHidden && (
                <div className="cards-table">
                    {cards.length === 0 ? (
                        <p className="empty">No cards yet. Add your first card above.</p>
                    ) : (
                        cards.map((card) => (
                            <CardRow
                                key={card.id}
                                card={card}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onToggleLearned={onToggleLearned}
                            />
                        ))
                    )}
                </div>
            )}
        </section>
    );
});

