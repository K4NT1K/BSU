import { memo } from 'react';
import './LearnPanel.css';
import { CardDisplay } from './CardDisplay';

export const LearnPanel = memo(function LearnPanel({
    currentCard,
    isFlipped,
    studyMode,
    isLoading,
    loadError,
    onStudyModeChange,
    onShuffle,
    onFlip,
    onPrevious,
    onNext,
    onCurrentLearned,
    onEditCurrent,
    onDeleteCurrent,
    onRetryLoad
}) {
    return (
        <section className="learn-panel">
            <header className="panel-header">
                <div className="mode-switch">
                    <label>
                        <input
                            type="radio"
                            name="studyMode"
                            value="all"
                            checked={studyMode === 'all'}
                            onChange={(event) => onStudyModeChange(event.target.value)}
                        />
                        All
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="studyMode"
                            value="unlearned"
                            checked={studyMode === 'unlearned'}
                            onChange={(event) => onStudyModeChange(event.target.value)}
                        />
                        Unlearned
                    </label>
                </div>
                <button type="button" className="ghost" onClick={onShuffle}>
                    Shuffle
                </button>
            </header>

            {isLoading && <div className="status">Loading cards from OpenTDB...</div>}
            {loadError && (
                <div className="status error">
                    <span>{loadError}</span>
                    <button type="button" onClick={onRetryLoad}>
                        Retry
                    </button>
                </div>
            )}

            {!isLoading && !loadError && (
                <CardDisplay
                    card={currentCard}
                    isFlipped={isFlipped}
                    onFlip={onFlip}
                    onLearned={onCurrentLearned}
                    onEdit={onEditCurrent}
                    onDelete={onDeleteCurrent}
                    onPrevious={onPrevious}
                    onNext={onNext}
                />
            )}
        </section>
    );
});

