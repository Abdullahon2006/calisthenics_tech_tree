import React from 'react';
import { Archive, ListTree, Network, PlusCircle, Search, Settings } from 'lucide-react';
import { BranchId, UserStats } from '../types/techTree';
import { BRANCHES } from '../data/defaultExercises';
import { Page, pagePath } from '../utils/route';
import { BrandMark } from './BrandMark';

interface HeaderProps {
  stats: UserStats;
  page: Page;
  activeBranch: BranchId | 'all';
  archivedCount: number;
  onNavigate: (page: Page) => void;
  onSelectBranch: (branch: BranchId | 'all') => void;
  onOpenSearch: () => void;
  onOpenAddModal: () => void;
  onOpenArchive: () => void;
}

const NAV: { page: Page; label: string; Icon: typeof Network }[] = [
  { page: 'tree', label: 'Tree', Icon: Network },
  { page: 'roadmap', label: 'Roadmap', Icon: ListTree },
  { page: 'settings', label: 'Settings', Icon: Settings },
];

const iconButton = 'relative grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition-colors hover:bg-white/8 hover:text-white apple-press';

export const Header: React.FC<HeaderProps> = ({
  stats, page, activeBranch, archivedCount, onNavigate, onSelectBranch, onOpenSearch, onOpenAddModal, onOpenArchive,
}) => (
  <header className="relative z-30 w-full glass-chrome select-none">
    <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
      <a href={pagePath('tree')} onClick={(e) => { e.preventDefault(); onNavigate('tree'); }} className="flex items-center gap-2.5 rounded-xl" aria-label="Tech Tree home">
        <BrandMark className="h-8 w-8" />
        <span className="hidden text-[15px] font-semibold tracking-apple-title text-white sm:block">Tech Tree</span>
      </a>

      <nav aria-label="Main" className="ml-1 flex items-center gap-1 sm:ml-4">
        {NAV.map(({ page: target, label, Icon }) => {
          const active = page === target;
          return (
            <a
              key={target}
              href={pagePath(target)}
              onClick={(e) => { e.preventDefault(); onNavigate(target); }}
              aria-current={active ? 'page' : undefined}
              aria-label={label}
              className={`flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-sm font-medium transition-colors apple-press sm:px-3 ${
                active ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/6 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </a>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-1">
        <span className="mr-2 hidden text-xs text-slate-400 md:block">{stats.masteredCount} of {stats.totalCount} mastered</span>
        <button onClick={onOpenSearch} className="flex h-9 items-center gap-2 rounded-xl px-2.5 text-sm text-slate-400 transition-colors hover:bg-white/8 hover:text-white apple-press" aria-label="Search skills" title="Search skills (Ctrl or ⌘ + K)">
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Search</span>
        </button>
        <button onClick={onOpenAddModal} className={iconButton} aria-label="Add skill" title="Add skill"><PlusCircle className="h-[18px] w-[18px]" /></button>
        <button onClick={onOpenArchive} className={iconButton} aria-label="Archived skills" title="Archived skills">
          <Archive className="h-[18px] w-[18px]" />
          {archivedCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-yellow-300 px-1 text-[9px] font-bold text-(color:--on-accent)">{archivedCount}</span>}
        </button>
      </div>
    </div>

    {page !== 'settings' && (
      <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 pb-2.5 sm:px-6">
        <button
          onClick={() => onSelectBranch('all')}
          className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors apple-press ${
            activeBranch === 'all' ? 'bg-white text-black' : 'border border-white/10 bg-white/6 text-slate-300 hover:bg-white/10'
          }`}
        >
          All ({stats.totalCount})
        </button>
        {BRANCHES.map((b) => {
          const active = activeBranch === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onSelectBranch(b.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors apple-press ${
                active ? '' : 'border border-white/10 bg-white/6 text-slate-300 hover:bg-white/10'
              }`}
              style={active ? { backgroundColor: b.color, color: '#0B0C0E' } : undefined}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: active ? '#0B0C0E' : b.color }} />
              {b.label}
            </button>
          );
        })}
      </div>
    )}
  </header>
);
