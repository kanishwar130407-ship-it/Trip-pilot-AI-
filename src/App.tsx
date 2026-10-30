import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useTripStore } from './store/useTripStore';
import { Header } from './components/common/Header';
import { TopStepper } from './components/common/TopStepper';
import { BottomNav } from './components/common/BottomNav';
import { AIAssistantDrawer } from './components/common/AIAssistantDrawer';
import { Sidebar } from './components/layout/Sidebar';
import { FirstTimeTourModal } from './components/layout/FirstTimeTourModal';
import { SmartHelpModal } from './components/layout/SmartHelpModal';
import { ToastNotification } from './components/layout/ToastNotification';
import { CinematicSplash } from './components/3d/CinematicSplash';
import { PlannerPage } from './pages/PlannerPage';
import { PackagePage } from './pages/PackagePage';
import { VerificationPage } from './pages/VerificationPage';
import { CompanionPage } from './pages/CompanionPage';
import { ReplanningPage } from './pages/ReplanningPage';
import { DossierPage } from './pages/DossierPage';
import { TrackViewerPage } from './pages/TrackViewerPage';

// Inner component that handles route synchronization with store currentStep
const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentStep = useTripStore((s) => s.currentStep);
  const setStep = useTripStore((s) => s.setStep);
  const darkMode = useTripStore((s) => s.darkMode);
  const sidebarOpen = useTripStore((s) => s.sidebarOpen);
  const setSidebarOpen = useTripStore((s) => s.setSidebarOpen);

  const isTrackPage = location.pathname.startsWith('/track');

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync store step to route
  useEffect(() => {
    if (isTrackPage) return;
    const stepRoutes: Record<number, string> = {
      1: '/planner',
      2: '/package',
      3: '/verification',
      4: '/companion',
      5: '/replanning',
      6: '/dossier',
    };
    const targetRoute = stepRoutes[currentStep];
    if (targetRoute && location.pathname !== targetRoute) {
      navigate(targetRoute, { replace: true });
    }
  }, [currentStep, isTrackPage]);

  // Sync route changes back to store step
  useEffect(() => {
    if (isTrackPage) return;
    const pathToStep: Record<string, number> = {
      '/planner': 1,
      '/': 1,
      '/package': 2,
      '/verification': 3,
      '/companion': 4,
      '/replanning': 5,
      '/dossier': 6,
    };
    const mapped = pathToStep[location.pathname];
    if (mapped && mapped !== currentStep) {
      setStep(mapped);
    }
  }, [location.pathname, isTrackPage]);

  return (
    <div className="min-h-screen flex bg-[#F5F8FC] dark:bg-[#071427] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Persistent Left Sidebar Navigation on Desktop */}
      {!isTrackPage && (
        <div className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 z-30">
          <Sidebar />
        </div>
      )}

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {!isTrackPage && sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 h-full"
            >
              <Sidebar isMobileDrawer onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {!isTrackPage && <Header />}
        {!isTrackPage && <TopStepper />}

        {/* Main Page Area with slide+fade Framer Motion transition */}
        <main className="flex-1 pb-24 md:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Routes location={location}>
                <Route path="/" element={<PlannerPage />} />
                <Route path="/planner" element={<PlannerPage />} />
                <Route path="/package" element={<PackagePage />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/companion" element={<CompanionPage />} />
                <Route path="/replanning" element={<ReplanningPage />} />
                <Route path="/dossier" element={<DossierPage />} />
                <Route path="/track/:id" element={<TrackViewerPage />} />
                <Route path="*" element={<Navigate to="/planner" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        {!isTrackPage && <AIAssistantDrawer />}
        {!isTrackPage && <BottomNav />}
      </div>

      {/* Global First-Time Product Tour, Smart Help bottom sheet, and Toasts */}
      <FirstTimeTourModal />
      <SmartHelpModal />
      <ToastNotification />
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash once per session
    const shown = sessionStorage.getItem('trippilot_splash_shown');
    return !shown;
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('trippilot_splash_shown', 'true');
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <CinematicSplash onComplete={handleSplashComplete} />}
      <HashRouter>
        <AppContent />
      </HashRouter>
    </>
  );
}
