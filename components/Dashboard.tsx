
import React, { useMemo, useState } from 'react';
import { Game, LeaderboardMetric, Theme, GameType } from '../types';
import { LOGO_URL, THIRTEEN_LOGO_LARGE } from '../constants';
import HowToPlayModal from './HowToPlayModal';

interface DashboardProps {
  games: Game[];
  activeGameType: GameType;
  metric: LeaderboardMetric;
  setMetric: (metric: LeaderboardMetric) => void;
  onNewGame: () => void;
  onLoadGame: (id: number) => void;
  onPromptDelete: (type: 'game' | 'player', id: string | number, name: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogoClick: () => void;
  onShowHowToPlay: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  games,
  activeGameType,
  metric,
  setMetric,
  onNewGame,
  onLoadGame,
  onPromptDelete,
  theme,
  onToggleTheme,
  onLogoClick,
  onShowHowToPlay
}) => {
  const isThirteen = activeGameType === 'thirteen';
  const isLowScoreWins = isThirteen;

  // Calculate Leaderboard
  const leaderboard = useMemo(() => {
    const stats: Record<string, { wins: number; totalScore: number; gamesPlayed: number; icon: string; name: string }> = {};

    games.forEach(game => {
      if (game.roundCount === 0) return; // Skip empty games

      // Find winner
      let winnerId: string | null = null;
      let bestScore = isLowScoreWins ? Infinity : -Infinity;

      game.players.forEach(p => {
        const total = p.scores.reduce((a, b) => a + (b || 0), 0);
        if (isLowScoreWins ? total < bestScore : total > bestScore) {
          bestScore = total;
          winnerId = p.id;
        }
      });

      // Update stats
      game.players.forEach(p => {
        if (!stats[p.id]) {
          stats[p.id] = { wins: 0, totalScore: 0, gamesPlayed: 0, icon: p.icon, name: p.name };
        }
        stats[p.id].totalScore += p.scores.reduce((a, b) => a + (b || 0), 0);
        stats[p.id].gamesPlayed += 1;
        if (p.id === winnerId) {
          stats[p.id].wins += 1;
        }
      });
    });

    return Object.entries(stats)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => metric === 'wins' ? b.wins - a.wins : b.totalScore - a.totalScore)
      .slice(0, 5);
  }, [games, metric, isLowScoreWins]);

  const hasCompletedGame = useMemo(() => {
    return games.some(g => {
      if (g.type === 'thirteen') {
        return g.players.some(p => p.scores.filter(s => s !== null).length === 13);
      }
      return g.players.some(p => p.scores.reduce((a, b) => a + (b || 0), 0) >= (g.targetScore || 200));
    });
  }, [games]);

  const maxVal = useMemo(() => {
    if (leaderboard.length === 0) return 1;
    // Ensure maxVal is at least 1 to avoid division by zero
    return Math.max(1, ...leaderboard.map(p => metric === 'wins' ? p.wins : p.totalScore));
  }, [leaderboard, metric]);

  return (
    <div className="flex flex-col z-10 fade-in pb-[calc(4rem+var(--safe-bottom))] pt-[var(--safe-top)]">
      {/* Header */}
      <header className="px-2 pt-2 pb-6 flex justify-between items-center z-20 transition-all duration-300">
        <div className="flex flex-col">
        </div>
        {!isThirteen && (
          <button
            onClick={onToggleTheme}
            className="w-12 h-12 rounded-full bg-magical-surface shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
          >
            <span className="material-symbols-rounded text-2xl transition-transform duration-500 rotate-0 dark:-rotate-180">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        )}
      </header>

      {/* Hero / CTA */}
      {/* Hero / Logo Section */}
      <div className="flex flex-col items-center justify-center px-2 -mt-8">
        <div className="relative group cursor-pointer" onClick={onLogoClick}>
          {!isLowScoreWins && <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-3xl blur-[40px] opacity-40 animate-pulse"></div>}
          <div
            className={`relative ${isLowScoreWins ? 'w-[480px] h-[240px] max-w-[90vw]' : 'w-96 h-48'} bg-transparent flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500`}
            style={isLowScoreWins ? { marginTop: '25px' } : {}}
          >
            <img
              src={isLowScoreWins ? THIRTEEN_LOGO_LARGE : LOGO_URL}
              alt="Flip 7 Logo"
              className={`w-full h-full object-contain ${isLowScoreWins ? '' : 'drop-shadow-2xl'}`}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mt-8">
          <p className="text-[10px] font-bold text-magical-muted uppercase tracking-[0.2em] ">
            {isLowScoreWins ? "Kings to Aces, shifting wilds, race to zero." : "Claim the throne of glory by flipping all 7"}
          </p>
          {isLowScoreWins && (
            <button
              onClick={onShowHowToPlay}
              className="text-[10px] font-bold text-magical-muted uppercase tracking-[0.2em] hover:opacity-100 hover:text-magical-accent transition-all underline"
            >
              how to play
            </button>
          )}
        </div>
      </div>

      {/* Leaderboard Section */}
      {hasCompletedGame && leaderboard.length > 0 && (
        <div className="bg-magical-surface/40 backdrop-blur-md rounded-[2.5rem] p-6 shadow-none">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xs font-bold text-magical-muted uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-rounded text-base">trophy</span> Top Players
            </h2>
            <div className="bg-magical-bg p-1 rounded-xl border border-magical-border flex text-[10px] font-bold">
              <button className={`px-3 py-1.5 rounded-lg transition-all ${metric === 'wins' ? `bg-magical-surface2 ${isLowScoreWins ? 'text-white' : 'text-magical-text'} shadow-sm` : 'text-magical-muted'}`} onClick={() => setMetric('wins')}>Wins</button>
              <button className={`px-3 py-1.5 rounded-lg transition-all ${metric === 'score' ? `bg-magical-surface2 ${isLowScoreWins ? 'text-white' : 'text-magical-text'} shadow-sm` : 'text-magical-muted'}`} onClick={() => setMetric('score')}>Score</button>
            </div>
          </div>

          {/* Adaptive Bar Chart */}
          <div className="flex w-full gap-2 h-48 overflow-x-auto no-scrollbar pb-2 items-end">
            {leaderboard.map((p, idx) => {
              const val = metric === 'wins' ? p.wins : p.totalScore;
              const height = (val / maxVal) * 100;
              const colors = isLowScoreWins
                ? ['bg-[#a88b51]', 'bg-[#b12b4b]', 'bg-[#712b3f]', 'bg-[#444441]', 'bg-[#a3895a]']
                : ['bg-pink-400', 'bg-violet-400', 'bg-indigo-400', 'bg-blue-400', 'bg-cyan-400'];
              return (
                <div key={p.name} className="flex flex-col h-full min-w-[44px] flex-1 group">
                  <div className="flex-1 w-full flex flex-col justify-end items-center">
                    <div className="text-[10px] font-bold text-magical-accent mb-1 opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">{val}</div>
                    <div
                      className={`w-full rounded-t-xl ${colors[idx % colors.length]} opacity-80 group-hover:opacity-100 transition-all`}
                      style={{ height: `${Math.max(6, height)}%` }}
                    ></div>
                  </div>
                  <div className="h-6 w-full flex items-center justify-center mt-2">
                    <div className="text-[10px] font-bold text-magical-muted truncate w-full text-center">{p.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History Section */}
      <div class="p-4 space-y-10 px-[calc(1rem+var(--safe-left))] pr-[calc(1rem+var(--safe-right))]">
        <h2 className="text-xs font-bold text-magical-muted uppercase tracking-widest mb-4 px-2 pl-0 flex items-center gap-2">
          <span className="material-symbols-rounded text-base">history</span> History
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {/* New Game Button */}
          <button
            className="relative flex flex-col items-center justify-center h-40 border-2 border-dashed border-magical-border rounded-[1.5rem] transition-all group overflow-hidden active:scale-95 hover:bg-magical-surface/20"
            onClick={onNewGame}
          >
            <div className={`w-14 h-14 rounded-full text-white group-hover:scale-110 flex items-center justify-center shadow-lg mb-3 z-10 transition-all duration-300 ${!isLowScoreWins && theme === 'light' ? 'bg-purple-900' : 'bg-[var(--border)]'
              }`}>
              <span className="material-symbols-rounded text-2xl font-bold">add</span>
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider z-10 ${!isLowScoreWins
              ? (theme === 'dark' ? 'text-white' : (theme === 'light' ? 'text-purple-900' : 'text-white'))
              : 'text-[var(--border)]'
              }`}>New Game</span>
          </button>
          {/* History Cards */}
          {games.map(g => {
            const d = new Date(g.id);
            const totals = g.players.map(p => ({
              n: p.name,
              s: p.scores.reduce((acc, val) => acc + (val || 0), 0),
              icon: p.icon,
              rounds: p.scores.filter(s => s !== null).length
            }));

            if (isLowScoreWins) {
              totals.sort((a, b) => a.s - b.s);
            } else {
              totals.sort((a, b) => b.s - a.s);
            }

            const leader = totals[0];
            const isOver = isLowScoreWins
              ? leader.rounds === 13
              : leader.s >= (g.targetScore || 200);

            const progress = isLowScoreWins
              ? (leader.rounds / 13) * 100
              : (leader.s / (g.targetScore || 200)) * 100;

            const labelRight = isLowScoreWins
              ? `${leader.rounds}/13`
              : `${leader.s}/${g.targetScore || 200}`;

            return (
              <div key={g.id} onClick={() => onLoadGame(g.id)} className={`bg-magical-surface border rounded-[1.5rem] p-4 flex flex-col justify-between h-40 cursor-pointer relative overflow-hidden group shadow-sm hover:shadow-xl ${isLowScoreWins ? 'border-[var(--border)]' : 'border-[#7c3aed]'} transition-all`}>

                {/* Delete Icon */}
                <button
                  className={`absolute top-2 right-2 w-8 h-8 rounded-full text-magical-muted z-20 transition-opacity flex items-center justify-center ${isLowScoreWins ? 'hover:scale-110' : 'bg-magical-bg/90 backdrop-blur-sm hover:text-rose-500 hover:bg-white shadow-sm'}`}
                  onClick={(e) => { e.stopPropagation(); onPromptDelete('game', g.id, `Game on ${d.toLocaleDateString()}`); }}
                >
                  <span className="material-symbols-rounded text-lg">close</span>
                </button>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  {isOver ? (
                    <span className="text-5xl filter-none drop-shadow-md transition-transform group-hover:scale-110">{leader.icon}</span>
                  ) : (
                    <span className="text-2xl font-bold text-magical-muted/20 tracking-widest">...</span>
                  )}
                </div>

                <div className="flex justify-between items-start z-10 relative">
                  <span className="text-[10px] font-bold text-magical-muted bg-magical-bg px-2 py-1 rounded-lg z-10">
                    {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="z-10 mt-2 relative">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold truncate max-w-[100px]">{leader.n}</span>
                    <span className="text-[10px] font-mono text-magical-muted">{labelRight}</span>
                  </div>
                  <div className="w-full bg-magical-bg h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${isLowScoreWins ? 'bg-[#b18c58]' : 'bg-gradient-to-r from-pink-500 to-violet-500'} h-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
