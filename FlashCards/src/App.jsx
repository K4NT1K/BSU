import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { CreateForm } from './components/CreateForm';
import { LearnPanel } from './components/LearnPanel';
import { CardsTable } from './components/CardsTable';

const STORAGE_KEY = 'flashcards_functional_v1';

const decodeHtml = (value) => {
    if (!value) return '';
    const doc = new DOMParser().parseFromString(value, 'text/html');
    return doc.documentElement.textContent || '';
};

const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const shuffleArray = (items) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

function App() {
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [studyMode, setStudyMode] = useState('all');
    const [isTableHidden, setIsTableHidden] = useState(false);
    const [questionValue, setQuestionValue] = useState('');
    const [answerValue, setAnswerValue] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const isHydratedRef = useRef(false);

    const studyCards = useMemo(() => {
        if (studyMode === 'unlearned') {
            return cards.filter((card) => !card.isLearned);
        }
        return cards;
    }, [cards, studyMode]);

    const currentCard = useMemo(() => {
        if (studyCards.length === 0) return null;
        return studyCards[currentIndex] || null;
    }, [studyCards, currentIndex]);

    const hydrateFromStorage = useCallback(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return false;
        try {
            const parsed = JSON.parse(stored);
            if (!parsed || !Array.isArray(parsed.cards)) return false;
            setCards(parsed.cards);
            setCurrentIndex(Math.min(parsed.currentIndex || 0, Math.max(parsed.cards.length - 1, 0)));
            setStudyMode(parsed.studyMode === 'unlearned' ? 'unlearned' : 'all');
            setIsTableHidden(Boolean(parsed.isTableHidden));
            setIsFlipped(false);
            isHydratedRef.current = true;
            setIsLoading(false);
            return true;
        } catch {
            return false;
        }
    }, []);

    const fetchInitialCards = useCallback(async () => {
        setIsLoading(true);
        setLoadError('');
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=50');
            if (!response.ok) {
                throw new Error('Failed to load cards from OpenTDB.');
            }
            const data = await response.json();
            const apiCards = Array.isArray(data.results) ? data.results : [];
            const mapped = apiCards.map((item) => ({
                id: generateId(),
                front: decodeHtml(item.question),
                back: decodeHtml(item.correct_answer),
                isLearned: false
            }));
            setCards(mapped);
            setCurrentIndex(0);
            setStudyMode('all');
            setIsFlipped(false);
            setIsTableHidden(false);
        } catch (error) {
            setLoadError(error instanceof Error ? error.message : 'Failed to load cards.');
        } finally {
            isHydratedRef.current = true;
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const hydrated = hydrateFromStorage();
        if (!hydrated) {
            fetchInitialCards();
        }
    }, [hydrateFromStorage, fetchInitialCards]);

    useEffect(() => {
        if (!isHydratedRef.current) return;
        const payload = {
            cards,
            currentIndex,
            studyMode,
            isTableHidden
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }, [cards, currentIndex, studyMode, isTableHidden]);

    useEffect(() => {
        if (currentIndex > studyCards.length - 1) {
            setCurrentIndex(Math.max(studyCards.length - 1, 0));
        }
    }, [currentIndex, studyCards.length]);

    const handleCreateOrUpdate = useCallback(() => {
        const front = questionValue.trim();
        const back = answerValue.trim();
        if (!front || !back) return;
        if (editingId) {
            setCards((prev) =>
                prev.map((card) => (card.id === editingId ? { ...card, front, back } : card))
            );
            setEditingId(null);
        } else {
            const newCard = {
                id: generateId(),
                front,
                back,
                isLearned: false
            };
            setCards((prev) => [...prev, newCard]);
        }
        setQuestionValue('');
        setAnswerValue('');
    }, [answerValue, editingId, questionValue]);

    const handleEdit = useCallback(
        (cardId) => {
            const card = cards.find((item) => item.id === cardId);
            if (!card) return;
            setQuestionValue(card.front);
            setAnswerValue(card.back);
            setEditingId(cardId);
        },
        [cards]
    );

    const handleCancelEdit = useCallback(() => {
        setEditingId(null);
        setQuestionValue('');
        setAnswerValue('');
    }, []);

    const handleDelete = useCallback(
        (cardId) => {
            setCards((prev) => prev.filter((card) => card.id !== cardId));
            if (editingId === cardId) {
                handleCancelEdit();
            }
        },
        [editingId, handleCancelEdit]
    );

    const handleToggleLearned = useCallback((cardId, isLearned) => {
        setCards((prev) =>
            prev.map((card) => (card.id === cardId ? { ...card, isLearned } : card))
        );
    }, []);

    const handleStudyModeChange = useCallback((value) => {
        setStudyMode(value === 'unlearned' ? 'unlearned' : 'all');
        setCurrentIndex(0);
        setIsFlipped(false);
    }, []);

    const handleShuffle = useCallback(() => {
        setCards((prev) => shuffleArray(prev));
        setCurrentIndex(0);
        setIsFlipped(false);
    }, []);

    const handleFlip = useCallback(() => {
        setIsFlipped((prev) => !prev);
    }, []);

    const handleNext = useCallback(() => {
        if (studyCards.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % studyCards.length);
        setIsFlipped(false);
    }, [studyCards.length]);

    const handlePrevious = useCallback(() => {
        if (studyCards.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + studyCards.length) % studyCards.length);
        setIsFlipped(false);
    }, [studyCards.length]);

    const handleToggleTable = useCallback(() => {
        setIsTableHidden((prev) => !prev);
    }, []);

    const handleRetryLoad = useCallback(() => {
        fetchInitialCards();
    }, [fetchInitialCards]);

    const handleCurrentLearned = useCallback(
        (isLearned) => {
            if (!currentCard) return;
            handleToggleLearned(currentCard.id, isLearned);
        },
        [currentCard, handleToggleLearned]
    );

    const handleEditCurrent = useCallback(() => {
        if (!currentCard) return;
        handleEdit(currentCard.id);
    }, [currentCard, handleEdit]);

    const handleDeleteCurrent = useCallback(() => {
        if (!currentCard) return;
        handleDelete(currentCard.id);
    }, [currentCard, handleDelete]);

    return (
        <div className="app">
            <header className="app-header">
                <h1>Flashcards</h1>
                <p className="subtitle">OpenTDB bootstrap + local edits</p>
            </header>

            <section className="top-panel">
                <CreateForm
                    questionValue={questionValue}
                    answerValue={answerValue}
                    onQuestionChange={setQuestionValue}
                    onAnswerChange={setAnswerValue}
                    onSubmit={handleCreateOrUpdate}
                    onCancelEdit={handleCancelEdit}
                    isEditing={Boolean(editingId)}
                />
            </section>

            <section className="workspace">
                <LearnPanel
                    currentCard={currentCard}
                    isFlipped={isFlipped}
                    studyMode={studyMode}
                    isLoading={isLoading}
                    loadError={loadError}
                    onStudyModeChange={handleStudyModeChange}
                    onShuffle={handleShuffle}
                    onFlip={handleFlip}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onCurrentLearned={handleCurrentLearned}
                    onEditCurrent={handleEditCurrent}
                    onDeleteCurrent={handleDeleteCurrent}
                    onRetryLoad={handleRetryLoad}
                />

                <CardsTable
                    cards={cards}
                    isHidden={isTableHidden}
                    onToggleHidden={handleToggleTable}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleLearned={handleToggleLearned}
                />
            </section>
        </div>
    );
}

export default App;
