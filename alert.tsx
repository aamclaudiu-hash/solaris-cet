/**
 * SOLARIS CET - Main Application
 * Platformă completă cu AI cuantic, token-gating și monetizare
 */

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Atom, Brain, Coins, Code, Globe, Zap, 
  TrendingUp, Users, Cpu, Sparkles,
  ChevronRight, Wallet, Menu, X, Server, Shield
} from 'lucide-react';
import { quantumEngine } from '@/quantum/QuantumEngine';
import { quantumAI } from '@/ai/QuantumAI';
import { tokenGate } from '@/blockchain/TokenGate';
import { createAgentBridge } from '@/agents/AgentBridge';
import { t, availableLanguages } from '@/i18n/translations';
import { seoOptimizer } from '@/seo/SEOOptimizer';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// Initialize systems
const agentBridge = createAgentBridge(quantumAI, tokenGate);

function App() {
  const [language, setLanguage] = useState('en');
  const [walletConnected, setWalletConnected] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [quantumMetrics, setQuantumMetrics] = useState({
    coherence: 0,
    entanglement: 0,
    qubits: 16
  });
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const quantumRef = useRef<HTMLDivElement>(null);
  const agentsRef = useRef<HTMLDivElement>(null);
  const tokenomicsRef = useRef<HTMLDivElement>(null);
  const developersRef = useRef<HTMLDivElement>(null);

  // Initialize animations
  useEffect(() => {
    // Update quantum metrics periodically
    const interval = setInterval(() => {
      setQuantumMetrics({
        coherence: quantumEngine.calculateCoherence(),
        entanglement: quantumEngine.calculateEntanglement(),
        qubits: quantumEngine.getQubits().length
      });
    }, 1000);

    // GSAP Animations
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo('.hero-title',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      gsap.fromTo('.hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
      );

      gsap.fromTo('.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power3.out' }
      );

      // Scroll animations
      gsap.utils.toArray<HTMLElement>('.section-animate').forEach((section: HTMLElement) => {
        gsap.fromTo(section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    });

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  // Handle AI query
  const handleAiQuery = async (prompt: string) => {
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    
    const response = await quantumAI.process({
      prompt,
      quantumEnhance: true,
      language
    });
    
    setAiResponse(response.result);
    setIsProcessing(false);
  };

  // Connect wallet
  const connectWallet = () => {
    // Simulate wallet connection
    setWalletConnected(true);
    setTokenBalance(1500); // Simulated balance
    tokenGate.registerHolder('wallet-123', 1500);
  };

  // Scroll to section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#05060B] text-white overflow-x-hidden">
      {/* SEO Meta Tags */}
      <div dangerouslySetInnerHTML={{ 
        __html: seoOptimizer.generateMetaTags(language) 
      }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#05060B]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Atom className="w-8 h-8 text-[#F2C94C] animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-xl font-bold">
                SOLARIS <span className="text-[#F2C94C]">CET</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection(heroRef)} className="text-sm text-white/70 hover:text-white transition-colors">
                {t('nav.home', language)}
              </button>
              <button onClick={() => scrollToSection(quantumRef)} className="text-sm text-white/70 hover:text-white transition-colors">
                {t('nav.quantum', language)}
              </button>
              <button onClick={() => scrollToSection(agentsRef)} className="text-sm text-white/70 hover:text-white transition-colors">
                {t('nav.agents', language)}
              </button>
              <button onClick={() => scrollToSection(tokenomicsRef)} className="text-sm text-white/70 hover:text-white transition-colors">
                {t('nav.tokenomics', language)}
              </button>
              <button onClick={() => scrollToSection(developersRef)} className="text-sm text-white/70 hover:text-white transition-colors">
                {t('nav.developers', language)}
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#F2C94C]/50"
              >
                {availableLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>

              {/* Wallet Button */}
              <button
                onClick={connectWallet}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  walletConnected
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#F2C94C] text-[#05060B] hover:bg-[#F2C94C]/90'
                }`}
              >
                <Wallet className="w-4 h-4" />
                {walletConnected ? `${tokenBalance} CET` : t('nav.connect', language)}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#05060B]/95 backdrop-blur-xl border-t border-white/5">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection(heroRef)} className="block w-full text-left py-2 text-white/70">
                {t('nav.home', language)}
              </button>
              <button onClick={() => scrollToSection(quantumRef)} className="block w-full text-left py-2 text-white/70">
                {t('nav.quantum', language)}
              </button>
              <button onClick={() => scrollToSection(agentsRef)} className="block w-full text-left py-2 text-white/70">
                {t('nav.agents', language)}
              </button>
              <button onClick={() => scrollToSection(tokenomicsRef)} className="block w-full text-left py-2 text-white/70">
                {t('nav.tokenomics', language)}
              </button>
              <button onClick={() => scrollToSection(developersRef)} className="block w-full text-left py-2 text-white/70">
                {t('nav.developers', language)}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center relative pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F2C94C]/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00f5ff]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="hero-title">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#F2C94C] via-[#ffec8b] to-[#b8860b] bg-clip-text text-transparent">
                {t('hero.title', language)}
              </span>
            </h1>
          </div>

          <div className="hero-subtitle">
            <p className="text-2xl sm:text-3xl lg:text-4xl text-white/90 mb-4">
              {t('hero.subtitle', language)}
            </p>
            <p className="text-lg text-white/60 max-w-3xl mx-auto mb-8">
              {t('hero.description', language)}
            </p>
          </div>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => scrollToSection(developersRef)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#F2C94C] text-[#05060B] rounded-xl font-semibold hover:bg-[#F2C94C]/90 transition-all hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              {t('hero.cta.start', language)}
            </button>
            <button 
              onClick={() => scrollToSection(quantumRef)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              {t('hero.cta.learn', language)}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: t('hero.stats.agents', language), value: '10,420+', icon: Brain },
              { label: t('hero.stats.queries', language), value: '2.4M+', icon: Server },
              { label: t('hero.stats.tps', language), value: '100K+', icon: Zap },
              { label: t('hero.stats.finality', language), value: '~2.0s', icon: TrendingUp }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <stat.icon className="w-6 h-6 text-[#F2C94C] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quantum AI Section */}
      <section ref={quantumRef} className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-animate text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F2C94C]/10 border border-[#F2C94C]/30 rounded-full mb-6">
              <Atom className="w-5 h-5 text-[#F2C94C]" />
              <span className="text-sm text-[#F2C94C]">Quantum Powered</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">{t('quantum.title', language)}</h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">{t('quantum.description', language)}</p>
          </div>

          {/* Quantum Metrics */}
          <div className="section-animate grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60">{t('quantum.metric.coherence', language)}</span>
                <Sparkles className="w-5 h-5 text-[#00f5ff]" />
              </div>
              <div className="text-4xl font-bold text-[#00f5ff]">{(quantumMetrics.coherence * 100).toFixed(2)}%</div>
              <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00f5ff] rounded-full transition-all duration-500"
                  style={{ width: `${quantumMetrics.coherence * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60">{t('quantum.metric.entanglement', language)}</span>
                <Atom className="w-5 h-5 text-[#F2C94C]" />
              </div>
              <div className="text-4xl font-bold text-[#F2C94C]">{(quantumMetrics.entanglement * 100).toFixed(2)}%</div>
              <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#F2C94C] rounded-full transition-all duration-500"
                  style={{ width: `${quantumMetrics.entanglement * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60">{t('quantum.metric.qubits', language)}</span>
                <Cpu className="w-5 h-5 text-[#a855f7]" />
              </div>
              <div className="text-4xl font-bold text-[#a855f7]">{quantumMetrics.qubits}</div>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-3 h-3 rounded-full ${i < quantumMetrics.qubits / 2 ? 'bg-[#a855f7]' : 'bg-white/10'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* AI Interface */}
          <div className="section-animate bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-[#F2C94C]" />
              <span className="font-semibold">Quantum AI Interface</span>
              <span className="ml-auto text-xs px-2 py-1 bg-[#F2C94C]/10 text-[#F2C94C] rounded-full">
                {t('ai.quantum', language)}
              </span>
            </div>
            
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder={t('ai.placeholder', language)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#F2C94C]/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAiQuery((e.target as HTMLInputElement).value);
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input') as HTMLInputElement;
                  handleAiQuery(input?.value || '');
                }}
                disabled={isProcessing}
                className="px-6 py-3 bg-[#F2C94C] text-[#05060B] rounded-xl font-semibold hover:bg-[#F2C94C]/90 transition-all disabled:opacity-50"
              >
                {isProcessing ? t('ai.processing', language) : t('ai.send', language)}
              </button>
            </div>

            {aiResponse && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#F2C94C]" />
                  <span className="text-sm text-white/60">AI Response</span>
                </div>
                <p className="text-white/80">{aiResponse}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section ref={agentsRef} className="py-24 relative bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-animate text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f5ff]/10 border border-[#00f5ff]/30 rounded-full mb-6">
              <Brain className="w-5 h-5 text-[#00f5ff]" />
              <span className="text-sm text-[#00f5ff]">AI Ecosystem</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">{t('agents.title', language)}</h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">{t('agents.description', language)}</p>
          </div>

          <div className="section-animate grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: 'reasoning', icon: Brain, color: '#F2C94C', features: ['Logical Reasoning', 'Problem Solving', 'Decision Making'] },
              { type: 'creative', icon: Sparkles, color: '#00f5ff', features: ['Content Generation', 'Design', 'Innovation'] },
              { type: 'analytical', icon: TrendingUp, color: '#a855f7', features: ['Data Analysis', 'Statistics', 'Insights'] },
              { type: 'predictive', icon: Globe, color: '#10b981', features: ['Forecasting', 'Trend Analysis', 'Optimization'] }
            ].map((agent, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${agent.color}20` }}
                >
                  <agent.icon className="w-7 h-7" style={{ color: agent.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t(`agents.type.${agent.type}`, language)}</h3>
                <ul className="space-y-2">
                  {agent.features.map((feature, j) => (
                    <li key={j} className="text-sm text-white/50 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: agent.color }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* High Intelligence Agents */}
          <div className="section-animate mt-12 bg-gradient-to-r from-[#F2C94C]/10 via-[#00f5ff]/10 to-[#a855f7]/10 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">High Intelligence Agents</h3>
                <p className="text-white/60">Self-evolving AI agents with quantum entanglement</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm text-emerald-400">{agentBridge.getActiveConnections().length} Active</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {agentBridge.getHighIntelligenceAgents().map((agent, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F2C94C]/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-[#F2C94C]" />
                    </div>
                    <div>
                      <div className="font-medium">{agent.connection.name}</div>
                      <div className="text-xs text-white/50">{agent.connection.type}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Entanglement</span>
                      <span className="text-[#F2C94C]">{(agent.config.entanglementLevel * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Coherence</span>
                      <span className="text-[#00f5ff]">{(agent.config.coherenceThreshold * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section ref={tokenomicsRef} className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-animate text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#a855f7]/10 border border-[#a855f7]/30 rounded-full mb-6">
              <Coins className="w-5 h-5 text-[#a855f7]" />
              <span className="text-sm text-[#a855f7]">CET Token</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">{t('tokenomics.title', language)}</h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">{t('tokenomics.description', language)}</p>
          </div>

          {/* Token Stats */}
          <div className="section-animate grid md:grid-cols-4 gap-6 mb-12">
            {[
              { label: t('tokenomics.supply', language), value: '21,000,000', icon: Coins, color: '#F2C94C' },
              { label: t('tokenomics.mining', language), value: '66.66%', icon: Zap, color: '#00f5ff' },
              { label: t('tokenomics.staking', language), value: '15-45%', icon: TrendingUp, color: '#10b981' },
              { label: t('tokenomics.burn', language), value: '2.5%', icon: Shield, color: '#a855f7' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3" style={{ color: stat.color }} />
                <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Access Tiers */}
          <div className="section-animate">
            <h3 className="text-2xl font-bold text-center mb-8">Access Tiers</h3>
            <div className="grid md:grid-cols-5 gap-4">
              {tokenGate.getTiers().map((tier, i) => (
                <div 
                  key={i} 
                  className={`bg-white/5 border rounded-2xl p-6 ${
                    tier.name === 'innovator' ? 'border-[#F2C94C] scale-105' : 'border-white/10'
                  }`}
                >
                  <div className="text-lg font-semibold mb-2 capitalize">{t(`tokenomics.tier.${tier.name}`, language)}</div>
                  <div className="text-2xl font-bold text-[#F2C94C] mb-4">
                    {tier.minTokens === 0 ? 'Free' : `${tier.minTokens}+`}
                  </div>
                  <ul className="space-y-2 text-sm">
                    {tier.features.slice(0, 3).map((feature, j) => (
                      <li key={j} className="text-white/50 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#F2C94C]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {tier.discount > 0 && (
                    <div className="mt-4 text-sm text-emerald-400">
                      {Math.round(tier.discount * 100)}% discount
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section ref={developersRef} className="py-24 relative bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-animate text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full mb-6">
              <Code className="w-5 h-5 text-[#10b981]" />
              <span className="text-sm text-[#10b981]">Developer First</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">{t('developers.title', language)}</h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">{t('developers.description', language)}</p>
          </div>

          <div className="section-animate grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { feature: 'sdk', icon: Code, color: '#F2C94C' },
              { feature: 'api', icon: Server, color: '#00f5ff' },
              { feature: 'docs', icon: Globe, color: '#a855f7' },
              { feature: 'community', icon: Users, color: '#10b981' }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <item.icon className="w-8 h-8" style={{ color: item.color }} />
                </div>
                <h3 className="font-semibold">{t(`developers.feature.${item.feature}`, language)}</h3>
              </div>
            ))}
          </div>

          {/* Code Example */}
          <div className="section-animate bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-sm text-white/50">example.js</span>
            </div>
            <pre className="text-sm text-white/80 font-mono">
{`import { QuantumAI, TokenGate } from '@solariscet/sdk';

// Initialize quantum AI
const ai = new QuantumAI();

// Create an agent with token-gated access
const agent = await ai.createAgent({
  name: 'My Quantum Agent',
  type: 'reasoning',
  quantumEnhance: true
});

// Process query with quantum speedup
const response = await agent.process({
  prompt: 'Optimize my smart contract',
  quantumEnhance: true
});

console.log(response.result);`}
            </pre>
          </div>

          {/* CTA Buttons */}
          <div className="section-animate flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-[#F2C94C] text-[#05060B] rounded-xl font-semibold hover:bg-[#F2C94C]/90 transition-all">
              <Globe className="w-5 h-5" />
              {t('developers.cta.docs', language)}
            </button>
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all">
              <Code className="w-5 h-5" />
              {t('developers.cta.github', language)}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Atom className="w-8 h-8 text-[#F2C94C]" />
                <span className="text-xl font-bold">SOLARIS CET</span>
              </div>
              <p className="text-white/50 text-sm">{t('footer.tagline', language)}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('footer.product', language)}</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><button onClick={() => scrollToSection(quantumRef)} className="hover:text-white">Quantum AI</button></li>
                <li><button onClick={() => scrollToSection(agentsRef)} className="hover:text-white">AI Agents</button></li>
                <li><button onClick={() => scrollToSection(tokenomicsRef)} className="hover:text-white">Tokenomics</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('footer.resources', language)}</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">GitHub</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('footer.company', language)}</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 text-center text-sm text-white/50">
            {t('footer.copyright', language)}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
