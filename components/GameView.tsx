
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Game, Player } from '../types';
import { LOGO_URL, getRandomEmoji, THIRTEEN_LABELS, THIRTEEN_LOGO_SMALL } from '../constants';
import SettingsModal from './SettingsModal';

interface GameViewProps {
  game: Game;
  onGoBack: () => void;
  onUpdate: (game: Game) => void;
  onPromptDelete: (type: 'player', id: string, name: string) => void;
}

const GameView: React.FC<GameViewProps> = ({ game, onGoBack, onUpdate, onPromptDelete }) => {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [focusedCell, setFocusedCell] = useState<{ pId: string; r: number } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const prevPlayerCount = useRef(game.players.length);

  const isThirteen = game.type === 'thirteen';
  const isCrowded = game.players.length > 4;

  // Auto-scroll to the end when a new player is added
  useEffect(() => {
    if (game.players.length > prevPlayerCount.current) {
      setTimeout(() => {
        window.scrollTo({ left: document.body.scrollWidth, behavior: 'smooth' });
      }, 100);
    }
    prevPlayerCount.current = game.players.length;
  }, [game.players.length]);

  const nextActiveRow = useMemo(() => {
      // Find the first row where ANY player has a null score
      const idx = Array.from({ length: game.roundCount }).findIndex((_, r) => 
          game.players.some(p => p.scores[r] === null)
      );
      return idx === -1 ? null : idx;
  }, [game.players, game.roundCount]);

  const playerStats = useMemo(() => {
    const meta = game.players.map(p => ({ total: p.scores.reduce((a, b) => a + (b || 0), 0) }));
    
    // Check if the FIRST ROW (index 0) is fully complete for ALL players
    const firstRowComplete = game.players.every(p => p.scores[0] !== null);

    let bestTotal = -1;
    let nextBestTotal = -1;

    const totals = meta.map(m => m.total);
    
    if (isThirteen) {
        // Low score wins
        bestTotal = Math.min(...totals);
        const sorted = [...totals].sort((a, b) => a - b);
        nextBestTotal = sorted[1] ?? bestTotal;
    } else {
        // High score wins
        bestTotal = Math.max(...totals);
    }

    return game.players.map((p, idx) => {
        const total = meta[idx].total;
        
        // For Thirteen, require first row completion. For Flip 7, require > 0 total (existing logic).
        const isLeader = isThirteen 
            ? (firstRowComplete && total === bestTotal)
            : (total === bestTotal && total > 0);
        
        let statusText = "";
        let isWinning = false;

        if (isThirteen) {
            if (isLeader) {
                const diff = nextBestTotal - total;
                statusText = diff > 0 ? `-${diff}` : "LEADER";
                isWinning = true;
            } else {
                const diff = total - bestTotal;
                statusText = `+${diff}`;
            }
        } else {
            // Flip 7 Logic
            const rem = (game.targetScore || 200) - total;
            if (rem <= 0) {
                statusText = "WINNER!";
                isWinning = true;
            } else {
                statusText = `${rem} LEFT`;
            }
        }

        return {
            ...p,
            total,
            played: p.scores.filter(s => s !== null).length,
            scored: p.scores.filter(s => s !== null && s > 0).length,
            isLeader,
            statusText,
            isWinning
        };
    });
  }, [game, isThirteen]);

  const sortPlayersByLeader = (players: Player[]) => [...players].sort((a, b) => {
    const totalA = a.scores.reduce((acc, v) => acc + (v || 0), 0);
    const totalB = b.scores.reduce((acc, v) => acc + (v || 0), 0);
    return isThirteen ? totalA - totalB : totalB - totalA;
  });

  const handleScoreInput = (pId: string, rowIndex: number, value: string) => {
    const val = value === "" ? null : parseInt(value);
    const updatedPlayers = game.players.map(p => {
      if (p.id === pId) {
        const newScores = [...p.scores];
        newScores[rowIndex] = val;
        return { ...p, scores: newScores };
      }
      return p;
    });

    let newRoundCount = game.roundCount;
    if (!isThirteen && val !== null && rowIndex === game.roundCount - 1) {
      newRoundCount++;
      updatedPlayers.forEach(p => p.scores.push(null));
    }
    onUpdate({ ...game, players: updatedPlayers, roundCount: newRoundCount });
  };

  const onCellBlur = (rowIndex: number) => {
    setActiveRow(null);
    setFocusedCell(null);
    if (game.reorderEnabled) {
      const isRowComplete = game.players.every(p => p.scores[rowIndex] !== null);
      if (isRowComplete) {
        setTimeout(() => {
          const sorted = sortPlayersByLeader(game.players);
          if (JSON.stringify(sorted.map(p => p.id)) !== JSON.stringify(game.players.map(p => p.id))) {
            onUpdate({ ...game, players: sorted });
          }
        }, 50);
      }
    }
  };

  const addPlayer = () => {
    onUpdate({ 
      ...game, 
      players: [...game.players, { id: `p${Date.now()}`, name: `P${game.players.length + 1}`, icon: getRandomEmoji(), scores: new Array(game.roundCount).fill(null) }] 
    });
  };

  return (
    <div className="flex flex-col z-10 transition-opacity duration-300">
      {/* Fixed Primary Header */}
      <header 
        className="fixed top-0 left-0 right-0 bg-magical-bg/95 backdrop-blur-xl border-b border-magical-border z-[100] shadow-sm pt-[var(--safe-top)] transition-all duration-300"
        style={{ height: 'var(--nav-height)' }}
      >
        <div className="flex items-center justify-between px-3 h-full relative max-w-[100vw]">
          <div className="flex items-center gap-1 min-w-[3rem] z-10">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-magical-surface transition-colors active:scale-90 text-magical-muted" onClick={onGoBack}>
              <span className="material-symbols-rounded text-2xl">arrow_back_ios_new</span>
            </button>
          </div>
          
          {/* Logo Area */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 z-[101] mt-[6px] pointer-events-none">
            <img src={isThirteen ? THIRTEEN_LOGO_SMALL : LOGO_URL} alt="Flip 7" className="w-auto object-contain drop-shadow-2xl" style={{ maxHeight: '55px' }} />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 min-w-[3rem] justify-end z-10">
            <button 
                className="w-9 h-9 flex items-center justify-center rounded-full bg-magical-surface text-magical-accent border border-magical-border shadow-sm active:scale-90 transition-transform" 
                onClick={addPlayer}
                style={isThirteen ? { color: 'var(--icon-add)' } : {}}
            >
               <span className="material-symbols-rounded text-xl">person_add</span>
            </button>
            {!isThirteen && (
                <button className="w-9 h-9 flex items-center justify-center rounded-full text-magical-muted hover:bg-magical-surface transition-colors" onClick={() => setShowSettings(true)}>
                  <span className="material-symbols-rounded text-xl">tune</span>
                </button>
            )}
            {/* Spacer for Thirteen to balance logo */}
            {isThirteen && <div className="w-9 h-9"></div>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full pb-[calc(6rem+var(--safe-bottom))] mt-[var(--nav-height)]">
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: `3.5rem repeat(${game.players.length}, minmax(63px, 1fr))`, 
            gridTemplateRows: 'minmax(var(--header-height), auto)', // Dynamic height for desktop
            gridAutoRows: 'var(--row-height)',
            width: 'fit-content',
            minWidth: '100%', 
          } as any} 
          className={`px-[var(--safe-left)] pr-[var(--safe-right)] ${isThirteen ? 'no-overscroll' : ''}`}
        >
          {/* Sticky Corner Cell */}
          <div 
                              className="sticky left-0 z-[60] border-b border-r-2 border-magical-border bg-magical-bg flex items-center justify-center"            style={{ top: 'var(--nav-height)' }}
          >
            <span className="text-xs font-mono text-magical-muted font-bold">#</span>
          </div>

          {/* Player Columns Headers */}
          {playerStats.map(p => {
             return (
               <div 
                  key={p.id} 
                  className={`sticky z-[50] border-b border-r border-magical-border p-1.5 transition-all duration-300 group player-header-cell ${p.isLeader ? 'is-leader-header-alt' : 'bg-magical-bg'}`}
                  style={{ top: 'var(--nav-height)' }}
               >
                  {/* Delete Button */}
                  <div className="absolute top-0 right-0 z-[70] p-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                    <button 
                      className={`w-8 h-8 flex items-center justify-center hover:scale-110 active:scale-90 transition-transform ${isThirteen ? 'text-[#444441]' : 'text-magical-accent dark:text-white'}`}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (p.scores.some(s => s !== null)) {
                          onPromptDelete('player', p.id, p.name); 
                        } else {
                          onUpdate({ ...game, players: game.players.filter(pl => pl.id !== p.id) });
                        }
                      }}
                      tabIndex={-1}
                    >
                      <span className="material-symbols-rounded text-xl font-bold">close</span>
                    </button>
                  </div>

                  <div className="flex flex-col justify-between h-full py-0.5 relative overflow-hidden">
                    {p.isLeader && !isThirteen && <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400/20 rounded-full blur-lg animate-pulse"></div>}
                    <div className="flex flex-col items-start gap-0 cursor-pointer z-10 pl-1" onClick={() => onUpdate({ ...game, players: game.players.map(pl => pl.id === p.id ? { ...pl, icon: getRandomEmoji() } : pl) })}>
                      <div className="text-xl sm:text-2xl emoji-font leading-none group-hover:scale-110 transition-transform origin-left drop-shadow-sm mb-0.5">{p.icon}</div>
                      <input 
                        className={`bg-transparent w-full min-w-0 font-bold outline-none p-0 text-left truncate tracking-tight transition-colors ${isCrowded ? 'text-xs' : 'text-sm'} ${
                            isThirteen 
                                ? (p.isLeader ? 'text-white' : 'text-[#444441]') 
                                : (p.isLeader ? 'text-magical-text' : 'text-magical-muted focus:text-magical-text')
                        }`} 
                        value={p.name} 
                        onChange={(e) => onUpdate({ ...game, players: game.players.map(pl => pl.id === p.id ? { ...pl, name: e.target.value } : pl) })} 
                        onFocus={(e) => e.target.select()} 
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="text-center z-10 mt-0.5">
                      <div className={`font-bold tracking-tighter leading-none ${isCrowded ? 'text-xl sm:text-3xl' : 'text-2xl sm:text-3xl'} ${
                          isThirteen 
                            ? (p.isLeader ? 'text-white' : 'text-[#444441]')
                            : (p.isLeader ? 'text-magical-accent' : 'text-magical-text')
                      }`}>{p.total}</div>
                    </div>
                    <div className="text-center z-10 px-0.5 w-full header-footer-container">
                      <div className={`text-[0.65rem] md:text-xs font-bold font-mono tracking-tight uppercase ${
                          isThirteen
                            ? (p.isLeader ? 'text-white' : 'text-[#712b3f]')
                            : (p.isWinning ? 'text-magical-text animate-pulse' : 'text-magical-muted')
                      } flex justify-center w-full gap-x-1 whitespace-nowrap overflow-hidden`}>
                         <span>{p.statusText}</span>
                         {/* Show stats only for Flip 7 */}
                         {!isThirteen && !p.isWinning && <span className="extra-info opacity-60">| {p.scored}/{p.played}</span>}
                      </div>
                    </div>
                  </div>
               </div>
             );
          })}

          {/* Grid Scores */}
          {Array.from({ length: game.roundCount }).map((_, r) => (
            <React.Fragment key={r}>
              <div 
                className={`sticky left-0 z-[40] border-r-2 border-b border-magical-border bg-magical-bg flex items-center justify-center font-bold font-mono transition-colors duration-300
                    ${isCrowded ? 'text-[0.65rem]' : 'text-xs'}
                    ${activeRow === r ? (isThirteen ? 'text-magical-muted' : 'text-magical-accent') : 'text-magical-muted'}
                    ${isThirteen && r === nextActiveRow ? 'bg-[#e3d6b2]' : ''}
                `}
              >
                {isThirteen ? THIRTEEN_LABELS[r] || (r + 1) : (r + 1)}
              </div>
              {game.players.map(p => {
                const isFocused = focusedCell?.pId === p.id && focusedCell?.r === r;
                return (
                  <div key={`${p.id}-${r}`} className={`border-r border-b border-magical-border h-[var(--row-height)] transition-all ${isFocused ? (isThirteen ? 'bg-magical-surface/80 ring-2 ring-inset ring-[color:var(--highlight-winner)] z-[30]' : 'bg-magical-surface/80 ring-2 ring-inset ring-magical-accent z-[30]') : ''} ${activeRow === r && !isFocused ? 'bg-magical-surface/40' : 'bg-transparent'} ${isThirteen && p.scores[r] === 0 ? 'bg-[#e3d6b2]' : ''}`}>
                    <input 
                      type="number" 
                      inputMode="numeric" 
                      className={`w-full h-full bg-transparent text-center font-mono font-bold outline-none border-none focus:ring-0 transition-opacity ${isCrowded ? 'text-base' : 'text-lg'} ${!isThirteen && p.scores[r] === 0 ? 'opacity-30' : ''}`} 
                      value={p.scores[r] ?? ''} 
                      placeholder="-" 
                      onFocus={() => { setActiveRow(r); setFocusedCell({ pId: p.id, r }); }} 
                      onBlur={() => onCellBlur(r)} 
                      onChange={(e) => handleScoreInput(p.id, r, e.target.value)} 
                    />
                  </div>
                );
              })}
            </React.Fragment>
          ))}
          <div style={{ gridColumn: '1 / -1', height: '12rem' }}></div>
        </div>
      </main>
      
      {showSettings && (
        <SettingsModal 
          targetScore={game.targetScore || 200} 
          reorderEnabled={game.reorderEnabled ?? true} 
          onSave={(targetScore, reorderEnabled) => { 
            onUpdate({ ...game, targetScore: isThirteen ? null : targetScore, reorderEnabled, players: reorderEnabled ? sortPlayersByLeader(game.players) : game.players }); 
            setShowSettings(false); 
          }} 
          onClose={() => setShowSettings(false)} 
        />
      )}

      <style>{`
        .player-header-cell {
          container-type: inline-size;
        }
        @container (max-width: 120px) {
          .extra-info {
            display: none;
          }
        }
        .is-leader-header-alt {
            background-color: var(--bg-surface) !important;
            background-image: linear-gradient(180deg, rgba(244, 114, 182, 0.2) 0%, rgba(244, 114, 182, 0.08) 100%) !important;
            border-bottom-color: var(--border) !important;
        }
        /* Border separator for adjacent winners in Thirteen */
        .thirteen-mode .is-leader-header-alt + .is-leader-header-alt {
            border-left: 1px solid white !important;
        }
        .thirteen-mode .is-leader-header-alt {
             border-right: 1px solid white !important; /* Ensure visibility */
        }

        .dark .is-leader-header-alt { 
          background-image: linear-gradient(180deg, rgba(244, 114, 182, 0.15) 0%, rgba(244, 114, 182, 0.05) 100%) !important; 
        }
        .is-leader-header-alt input { color: var(--text-main) !important; }

        .thirteen-mode .is-leader-header-alt {
             background-image: none !important;
             background-color: var(--highlight-winner) !important;
        }
        .thirteen-mode .is-leader-header-alt input,
        .thirteen-mode .is-leader-header-alt .text-magical-text,
        .thirteen-mode .is-leader-header-alt .text-magical-accent,
        .thirteen-mode .is-leader-header-alt .text-2xl,
        .thirteen-mode .is-leader-header-alt .text-xl,
        .thirteen-mode .is-leader-header-alt .text-[0.65rem] {
             color: #ffffff !important;
        }
        /* Override specifically for the winner header to ensure everything is white */
        .thirteen-mode .is-leader-header-alt input { color: white !important; }
      `}</style>
    </div>
  );
};

export default GameView;
