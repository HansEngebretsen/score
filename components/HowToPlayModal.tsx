import React from 'react';

interface HowToPlayModalProps {
    onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center p-6 bg-black/60 backdrop-blur-md overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-magical-surface border border-magical-border rounded-[2rem] p-6 w-full max-w-lg shadow-2xl pop-in my-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Title and Close Button */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-magical-border">
                    <div>
                        <h3 className="text-2xl font-bold text-magical-text mb-1">THIRTEEN</h3>
                        <p className="text-xs text-[#6b6b66] italic">Also known as: Countdown, Crazy Rummy</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-magical-surface transition-colors flex items-center justify-center text-[#6b6b66] shrink-0 ml-4"
                        style={{ backgroundColor: 'var(--bg-app)' }}
                    >
                        <span className="material-symbols-rounded text-xl">close</span>
                    </button>
                </div>

                <div className="space-y-5 text-magical-text">
                    {/* The Goal */}
                    <div>
                        <h4 className="text-sm font-bold text-magical-text mb-0 flex items-center gap-1">
                            <span className="material-symbols-rounded text-lg">emoji_events</span>
                            Goal
                        </h4>
                        <p className="text-sm leading-relaxed text-[#6b6b66] ml-9">
                            Empty your hand. <strong className="text-magical-text">Lowest score after 13 rounds wins.</strong>
                        </p>
                    </div>

                    {/* The Setup */}
                    <div>
                        <h4 className="text-sm font-bold text-magical-text mb-0 flex items-center gap-1">
                            <span className="material-symbols-rounded text-lg">playing_cards</span>
                            Setup
                        </h4>
                        <div className="space-y-3 ml-9">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider mb-1 text-magical-text">Deal</p>
                                <p className="text-sm text-magical-text">7 cards to each player.</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider mb-1 text-magical-text">The Wilds</p>
                                <p className="text-sm text-magical-text mb-2">The wild card changes every round, counting down from Kings to Aces, 13 total rounds.</p>

                            </div>
                        </div>
                    </div>

                    {/* The Turn */}
                    <div>
                        <h4 className="text-sm font-bold text-magical-text mb-0 flex items-center gap-1">
                            <span className="material-symbols-rounded text-lg">refresh</span>
                            The Turn
                        </h4>
                        <div className="space-y-3 ml-9">
                            <div>
                                <p className="text-sm font-bold text-magical-text mb-1">1. Draw</p>
                                <p className="text-sm text-[#6b6b66]">Take 1 card from the Deck or Discard pile.</p>
                                <div className="mt-2 p-2 border-l-2 border-magical-border rounded text-xs text-[#6b6b66]" style={{ backgroundColor: 'var(--bg-app)' }}>
                                    <strong>Note:</strong> Dealer goes first. Since there is no discard pile yet, they must draw from the deck to start.
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-magical-text mb-1">2. Meld (Optional)</p>
                                <p className="text-sm text-[#6b6b66] mb-2">Lay down valid groups or play on existing piles:</p>
                                <ul className="space-y-1 text-sm text-magical-text ml-4">
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span><strong>Sets:</strong> 3+ of a kind (e.g., 7-7-7)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span><strong>Runs:</strong> 3+ in a row, same suit (e.g., 4-5-6 of Hearts)</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-magical-text mb-1">3. Discard</p>
                                <p className="text-sm text-[#6b6b66]">You always must discard 1 card to end your turn.</p>
                            </div>
                        </div>
                    </div>

                    {/* The Score */}
                    <div>
                        <h4 className="text-sm font-bold text-magical-text mb-0 flex items-center gap-1">
                            <span className="material-symbols-rounded text-lg">calculate</span>
                            Score
                        </h4>
                        <p className="text-sm text-[#6b6b66] mb-3 ml-9">
                            Play ends when one person discards their last card. Everyone else adds up the value of the cards they have in their hand. Royals are worth 10 points, and aces are worth 20.
                        </p>

                    </div>
                </div>

                {/* Close Button */}
                <button
                    className="w-full mt-6 py-3 rounded-xl text-white font-bold text-sm tracking-wide shadow-xl active:scale-[0.98] transition-transform"
                    style={{ backgroundColor: 'var(--border)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    onClick={onClose}
                >
                    GOT IT!
                </button>
            </div>
        </div>
    );
};

export default HowToPlayModal;
