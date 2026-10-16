import React, { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CommandPalette } from './components/CommandPalette';
import { AskAssistantModal } from './components/AskAssistantModal';

import { ExactMatchView } from './pages/ExactMatchView';
import { MarketPage } from './pages/MarketPage';
import { CommunityPage } from './pages/CommunityPage';
import { RecommendPage } from './pages/RecommendPage';
import { ResultsPage } from './pages/ResultsPage';
import { ExpensePage } from './pages/ExpensePage';
import { ProfitPage } from './pages/ProfitPage';
import { WeatherPage } from './pages/WeatherPage';
import { HistoryPage } from './pages/HistoryPage';
import { SchemesPage } from './pages/SchemesPage';
import { RotationPage } from './pages/RotationPage';
import { ExplainerPage } from './pages/ExplainerPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';

export const App: React.FC = () => {
  const { currentTab, setTab, theme } = useAppStore();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const isMasterDashboard = currentTab === 'home' || currentTab === 'dashboard';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      (currentTab === 'market' || currentTab === 'community')
        ? 'bg-[#f4f7f4] text-zinc-800'
        : (theme === 'dark' ? 'bg-[#06170d] text-zinc-100' : 'bg-[#f4f7f4] text-zinc-800')
    }`}>
      {/* Show Navbar on subpages */}
      {!isMasterDashboard && (
        <Navbar
          onOpenCommand={() => setIsCommandOpen(true)}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />
      )}

      {/* Main Page Container */}
      <main className={`flex-1 w-full ${isMasterDashboard || currentTab === 'market' || currentTab === 'community' ? 'p-0 max-w-none' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
        {isMasterDashboard && (
          <ExactMatchView 
            onNavigateTab={(tab) => setTab(tab)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        )}
        {currentTab === 'market' && <MarketPage />}
        {currentTab === 'community' && <CommunityPage />}
        {currentTab === 'solutions' && <ExpensePage />}
        {currentTab === 'crops' && <RecommendPage />}
        {currentTab === 'about' && <ExplainerPage />}
        {currentTab === 'recommend' && <RecommendPage />}
        {currentTab === 'results' && <ResultsPage />}
        {currentTab === 'expenses' && <ExpensePage />}
        {currentTab === 'profit' && <ProfitPage />}
        {currentTab === 'weather' && <WeatherPage />}
        {currentTab === 'history' && <HistoryPage />}
        {currentTab === 'schemes' && <SchemesPage />}
        {currentTab === 'rotation' && <RotationPage />}
        {currentTab === 'explainer' && <ExplainerPage />}
        {currentTab === 'profile' && <ProfilePage />}
        {currentTab === 'auth' && <AuthPage />}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />

      {/* Ask AgriSmart AI Advisor */}
      <AskAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Footer */}
      {!isMasterDashboard && (
        <footer className="w-full border-t border-emerald-100/60 dark:border-emerald-950/60 py-6 text-center text-xs text-zinc-500 glass-panel mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-brand-forest dark:text-emerald-400">AgriSmart</span>
              <span>·</span>
              <span className="badge-verified">Smarter Farming • Brighter Tomorrow</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400">
              Kisan Call Centre Helpline: 1800-180-1551 (Toll Free) · All estimates intended for decision support
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
