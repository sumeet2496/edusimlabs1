
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SimulationGrid from './components/SimulationGrid';
import ValueProposition from './components/ValueProposition';
import WhyEduSimLabs from './components/WhyEduSimLabs';
import PlatformCapabilities from './components/PlatformCapabilities';
import SampleSimulations from './components/SampleSimulations';
import WhoItsFor from './components/WhoItsFor';
import Footer from './components/Footer';

// Page Components
import SimulationsPage from './components/SimulationsPage';
import CapabilitiesPage from './components/CapabilitiesPage';
import EnterprisePage from './components/EnterprisePage';
import ContactPage from './components/ContactPage';
import ModuleDetailPage from './components/ModuleDetailPage';
import AuthPage from './components/AuthPage';
import GenericContentPage from './components/GenericContentPage';

// Simulation Apps
import FXForwardApp from './simulations/fx-forward/FXForwardApp';
import BoardroomApp from './simulations/boardroom/BoardroomApp';
import FICCTrademasterApp from './simulations/ficc-trademaster/FICCTrademasterApp';

import { SIMULATION_CATEGORIES } from './constants';
import { FileText, ShieldAlert, Cpu, Award, BookOpen, Settings } from 'lucide-react';

const MainSite: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Derive current page from URL path
  const path = location.pathname.substring(1) || 'home';
  const currentPage = selectedModuleId ? 'module-detail' : path;

  const handleNavigate = (href: string) => {
    setSelectedModuleId(null);
    navigate(`/${href === 'home' ? '' : href}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (selectedModuleId) {
      const category = SIMULATION_CATEGORIES.find(c => c.id === selectedModuleId);
      if (category) {
        return <ModuleDetailPage category={category} onBack={() => setSelectedModuleId(null)} />;
      }
    }

    if (currentPage === 'portal' || currentPage === 'login') {
      return (
        <AuthPage
          onAuthSuccess={() => { setIsAuthenticated(true); handleNavigate('simulations'); }}
          onNavigateToContact={() => handleNavigate('contact')}
        />
      );
    }

    // Dynamic Generic Pages based on Footer Links
    const genericPages: Record<string, any> = {
      'lab-catalog': {
        category: 'Solutions',
        title: 'Full Simulation Catalog',
        subtitle: 'Our repository spans the entire spectrum of capital markets, from fundamental accounting to exotic derivatives.',
        sections: [
          { title: 'The Technical Standard', content: 'EduSimLabs simulations are built on a proprietary math engine that mirrors actual institutional order books and ledger systems.', icon: <Cpu className="w-5 h-5" /> },
          { title: 'Institutional Grading', content: 'Each lab includes auto-scoring capabilities mapped to CFA, ACCA, and professional banking benchmarks.' }
        ]
      },
      'university-tier': {
        category: 'Solutions',
        title: 'Academic Partnerships',
        subtitle: 'Transforming MBA and Undergraduate Finance labs into high-fidelity technical training centers.',
        sections: [
          { title: 'LMS Integration', content: 'Seamlessly deploy simulations within Canvas, Blackboard, or Moodle environments with automated gradebook syncing.', icon: <BookOpen className="w-5 h-5" /> },
          { title: 'Faculty Oversight', content: 'Grant instructors the ability to monitor real-time decision paths and inject "Black Swan" market events into live sessions.' }
        ]
      },
      'bank-training': {
        category: 'Solutions',
        title: 'Enterprise Onboarding',
        subtitle: 'The standard technical benchmark for incoming global analyst classes at bulge-bracket institutions.',
        sections: [
          { title: 'Analyst Readiness', content: 'Drill core valuation and modeling skills until they reach the level of desk-ready proficiency.', icon: <Award className="w-5 h-5" /> }
        ]
      },
      'whitepapers': {
        category: 'Intelligence',
        title: 'Technical Whitepapers',
        subtitle: 'Deep dives into the simulation logic, mathematical engines, and pedagogical research behind EduSimLabs.',
        sections: [
          { title: 'Proprietary Engine Logic', content: 'Our 2024 whitepaper explores the move from static spreadsheets to dynamic multi-variable financial environments.', icon: <FileText className="w-5 h-5" /> }
        ]
      },
      'api-integration': {
        category: 'Support',
        title: 'API Documentation',
        subtitle: 'Build custom extensions and report pipelines using the EduSimLabs Institutional API.',
        sections: [
          { title: 'Data Streaming', content: 'Connect your organization\'s internal learning dashboard to our real-time simulation output nodes.', icon: <Settings className="w-5 h-5" /> }
        ]
      }
    };

    if (genericPages[currentPage]) {
      return (
        <GenericContentPage
          {...genericPages[currentPage]}
          cta={{ label: "Request Technical Briefing", action: () => handleNavigate('contact') }}
        />
      );
    }

    switch (currentPage) {
      case 'simulations':
        return <SimulationsPage onExploreModule={handleExploreModule} />;
      case 'capabilities':
        return <CapabilitiesPage onRequestDemo={() => handleNavigate('contact')} />;
      case 'enterprise':
        return <EnterprisePage />;
      case 'contact':
        return <ContactPage />;
      default:
        return (
          <>
            <Hero
              onExplore={() => handleNavigate('simulations')}
              onRequestDemo={() => handleNavigate('contact')}
            />

            <SimulationGrid onExplore={() => handleNavigate('simulations')} />
            <ValueProposition />
            <WhyEduSimLabs />
            <PlatformCapabilities />
            <SampleSimulations />
            <WhoItsFor />

            {/* CTA Section */}
            <section className="py-32 bg-white relative">
              <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
                <div className="bg-[#0B1F3A] p-16 lg:p-32 text-center rounded-[4px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1F4E79]/20 -skew-x-12 translate-x-1/2" />
                  <div className="relative z-10">
                    <h2 className="text-5xl lg:text-7xl font-bold text-white mb-10 tracking-tight">Build Real Finance Skills.</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
                      Join 500+ institutions deploying institutional-grade practical assessments and immersive learning labs.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                      <button
                        onClick={() => handleNavigate('contact')}
                        className="bg-[#4DA3FF] text-[#0B1F3A] px-14 py-6 rounded-[2px] font-bold text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-[#4DA3FF]/20"
                      >
                        Request Demo
                      </button>
                      <button
                        onClick={() => handleNavigate('capabilities')}
                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-14 py-6 rounded-[2px] font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-[#0B1F3A] transition-all"
                      >
                        Technical Specifications
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={handleNavigate} currentPage={path} isAuthenticated={isAuthenticated} />
      <main>
        {renderContent()}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Simulation Routes */}
        <Route path="/sim/fx-forward" element={<FXForwardApp />} />
        <Route path="/sim/boardroom" element={<BoardroomApp />} />
        <Route path="/sim/ficc-trademaster" element={<FICCTrademasterApp />} />

        {/* Main Site Routes */}
        <Route path="*" element={<MainSite />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
