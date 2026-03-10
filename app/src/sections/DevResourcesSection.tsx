import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import {
  BarChart2,
  Code2,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Layers,
  BookOpen,
  Zap,
  Shield,
  Globe,
  Database,
} from 'lucide-react';

// ─── Static data ──────────────────────────────────────────────────────────────

interface Tool {
  name: string;
  freeTier: string;
  details: string[];
  url: string;
}

interface Category {
  id: string;
  icon: typeof BarChart2;
  color: 'gold' | 'cyan' | 'purple';
  label: string;
  headline: string;
  tools: Tool[];
}

const categories: Category[] = [
  {
    id: 'data',
    icon: BarChart2,
    color: 'gold',
    label: 'Market & On-Chain Data',
    headline: 'Real-time prices, industry reports, and on-chain analytics at zero cost',
    tools: [
      {
        name: 'CoinMarketCap & CoinGecko',
        freeTier: 'Demo API — ~10,000 calls/month',
        details: [
          'Real-time and historical price feeds for your dApp',
          'Manual portfolio tracking and PnL monitoring',
          'Downloadable quarterly crypto industry reports',
        ],
        url: 'https://www.coingecko.com/en/api',
      },
      {
        name: 'Messari',
        freeTier: 'Basic screener + free quarterly reports',
        details: [
          'Filter thousands of tokens with on-chain metrics (real volume, circulating cap)',
          '"State of…" quarterly protocol reports — institutional-grade, completely free',
        ],
        url: 'https://messari.io',
      },
      {
        name: 'CoinDesk Indices',
        freeTier: 'Free CDI data access',
        details: [
          'CoinDesk Price Indices (CDI) — widely used as oracle references in legacy contracts',
          'Benchmark data for auditing and research',
        ],
        url: 'https://www.coindesk.com/indices',
      },
    ],
  },
  {
    id: 'infra',
    icon: Code2,
    color: 'cyan',
    label: 'Web3 Infrastructure',
    headline: 'Connect to mainnets and testnets, deploy secure contracts, learn the EVM — all for free',
    tools: [
      {
        name: 'Alchemy (& Infura)',
        freeTier: '300M Compute Units/month free',
        details: [
          'Supernode RPC endpoints for Ethereum, Polygon, Arbitrum — no node hardware required',
          'Daily Sepolia testnet faucet — free test ETH for gas',
          'Alchemy University: free JavaScript and Solidity bootcamps with integrated coding environments',
        ],
        url: 'https://www.alchemy.com',
      },
      {
        name: 'OpenZeppelin',
        freeTier: 'Fully open-source (MIT)',
        details: [
          'Contracts Wizard — point-and-click UI that generates audited Solidity (ERC-20, ERC-721, ERC-1155)',
          'Battle-tested library importable via npm or GitHub for any project',
        ],
        url: 'https://wizard.openzeppelin.com',
      },
      {
        name: 'Ethereum Foundation Dev Portal',
        freeTier: '100% free, peer-reviewed',
        details: [
          'Complete EIP (Ethereum Improvement Proposals) specifications',
          'Core-developer-reviewed tutorials: running a node, secp256k1 elliptic curve cryptography, EVM architecture',
        ],
        url: 'https://ethereum.org/en/developers',
      },
    ],
  },
  {
    id: 'education',
    icon: GraduationCap,
    color: 'purple',
    label: 'Education & Debugging',
    headline: 'Learn to audit smart contracts, debug on-chain errors, and write Solidity — at no cost',
    tools: [
      {
        name: 'Ethereum Stack Exchange',
        freeTier: 'Free community Q&A',
        details: [
          'Post buggy code, receive solutions from senior engineers asynchronously',
          'Vast historical archive for common errors: "Out of Gas", "Revert", re-entrancy attacks',
        ],
        url: 'https://ethereum.stackexchange.com',
      },
      {
        name: 'Cyfrin Updraft',
        freeTier: '50+ hours of free content',
        details: [
          'Security and audit courses built on Foundry and Hardhat',
          'Hands-on vulnerability discovery exercises in smart contracts',
        ],
        url: 'https://updraft.cyfrin.io',
      },
      {
        name: 'CryptoZombies',
        freeTier: 'Free in-browser IDE',
        details: [
          'Write Solidity and Vyper directly in the browser — no local setup required',
          'Platform compiles and evaluates code in real time with instant feedback',
        ],
        url: 'https://cryptozombies.io',
      },
    ],
  },
];

const COLOR_MAP = {
  gold: {
    bg: 'bg-solaris-gold/10',
    text: 'text-solaris-gold',
    cardBorder: 'border-solaris-gold/20 hover:border-solaris-gold/40',
    activeBg: 'bg-solaris-gold/15',
    activeBorder: 'border-solaris-gold/40',
    dot: 'bg-solaris-gold',
  },
  cyan: {
    bg: 'bg-solaris-cyan/10',
    text: 'text-solaris-cyan',
    cardBorder: 'border-solaris-cyan/20 hover:border-solaris-cyan/40',
    activeBg: 'bg-solaris-cyan/15',
    activeBorder: 'border-solaris-cyan/40',
    dot: 'bg-solaris-cyan',
  },
  purple: {
    bg: 'bg-purple-400/10',
    text: 'text-purple-400',
    cardBorder: 'border-purple-400/20 hover:border-purple-400/40',
    activeBg: 'bg-purple-400/15',
    activeBorder: 'border-purple-400/40',
    dot: 'bg-purple-400',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

const DevResourcesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const conclusionRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<string>('data');

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 82%',
            end: 'top 58%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        tabsRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          scrollTrigger: {
            trigger: tabsRef.current,
            start: 'top 85%',
            end: 'top 62%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 85%',
            end: 'top 60%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        conclusionRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          scrollTrigger: {
            trigger: conclusionRef.current,
            start: 'top 88%',
            end: 'top 65%',
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const active = categories.find(c => c.id === activeCategory) ?? categories[0];
  const colors = COLOR_MAP[active.color];

  return (
    <section
      ref={sectionRef}
      className="relative bg-solaris-dark py-24 lg:py-32"
    >
      {/* Background grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-[40vh] grid-floor opacity-10" />
      </div>

      <div className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div ref={headerRef} className="mb-12 lg:mb-16">
          {/* Icon badge */}
          <div className="w-14 h-14 rounded-2xl bg-solaris-gold/10 flex items-center justify-center mb-6">
            <Layers className="w-7 h-7 text-solaris-gold" />
          </div>

          <div className="hud-label text-[10px] mb-3">DEVELOPER RESOURCES</div>

          <h2 className="font-display font-bold text-[clamp(28px,3.5vw,44px)] text-solaris-text mb-4">
            Free Tools for{' '}
            <span className="text-solaris-gold">Web3 Builders</span>
          </h2>

          <p className="text-solaris-muted text-base lg:text-lg leading-relaxed max-w-2xl">
            From prototype to production, the open-source ecosystem gives every developer with an
            internet connection access to institutional-grade blockchain infrastructure — at zero cost.
          </p>
        </div>

        {/* ── Category Tabs ── */}
        <div ref={tabsRef} className="flex flex-wrap gap-3 mb-8">
          {categories.map(cat => {
            const c = COLOR_MAP[cat.color];
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? `${c.activeBg} ${c.activeBorder} ${c.text}`
                    : 'bg-white/5 border-white/10 text-solaris-muted hover:border-white/20 hover:text-solaris-text'
                }`}
              >
                <cat.icon className={`w-4 h-4 ${isActive ? c.text : 'text-solaris-muted'}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── Active category panel ── */}
        <div ref={contentRef} className="grid lg:grid-cols-3 gap-5 mb-12">
          {active.tools.map(tool => (
            <div
              key={tool.name}
              className={`glass-card p-6 border ${colors.cardBorder} transition-all duration-300 flex flex-col`}
            >
              {/* Tool header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-display font-semibold text-solaris-text text-base leading-tight">
                  {tool.name}
                </h3>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`shrink-0 ${colors.text} hover:opacity-70 transition-opacity`}
                  aria-label={`Open ${tool.name}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Free tier badge */}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${colors.bg} mb-4 self-start`}>
                <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                <span className={`text-[11px] font-mono font-medium ${colors.text}`}>
                  {tool.freeTier}
                </span>
              </div>

              {/* Details */}
              <ul className="space-y-2.5 flex-1">
                {tool.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-solaris-muted leading-snug">
                    <ChevronRight className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${colors.text}`} />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Perspective & Conclusion ── */}
        <div ref={conclusionRef} className="grid lg:grid-cols-2 gap-6">
          {/* Perspective */}
          <div className="glass-card p-6 border border-white/8">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-solaris-cyan" />
              <span className="font-display font-semibold text-solaris-text text-sm">
                Balanced Perspective
              </span>
            </div>
            <div className="space-y-3 text-sm text-solaris-muted leading-relaxed">
              <p>
                <span className="text-solaris-gold font-medium">Opportunity:</span>{' '}
                The high density of free, open-source tooling democratises access to financial
                infrastructure — any developer with an internet connection can build.
              </p>
              <p>
                <span className="text-solaris-cyan font-medium">Trade-off:</span>{' '}
                SaaS "free tiers" (Alchemy, Infura) introduce centralised failure points in an
                ecosystem that prizes decentralisation. Rate limits also force growing projects toward
                expensive enterprise plans.
              </p>
              <p>
                <span className="text-purple-400 font-medium">Synthesis:</span>{' '}
                Free tooling is <em>exceptional</em> for DevNet and Testnet phases. Mainnet production
                eventually demands investment — dedicated RPC nodes, paid security audits — costs that
                cannot be avoided indefinitely.
              </p>
            </div>
          </div>

          {/* Conclusion / Call to Action */}
          <div className="glass-card p-6 border border-solaris-gold/15">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-solaris-gold" />
              <span className="font-display font-semibold text-solaris-text text-sm">
                Actionable Conclusion
              </span>
            </div>
            <p className="text-sm text-solaris-muted leading-relaxed mb-5">
              You can build an entire Proof-of-Concept dApp using exclusively zero-cost tools:{' '}
              <span className="text-solaris-text font-medium">OpenZeppelin Wizard</span> for the
              contract,{' '}
              <span className="text-solaris-text font-medium">VS Code</span> as IDE,{' '}
              <span className="text-solaris-text font-medium">Alchemy</span> for Sepolia connectivity,
              and a{' '}
              <span className="text-solaris-text font-medium">CoinGecko API</span> for live prices.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Code2, text: 'OpenZeppelin Wizard', url: 'https://wizard.openzeppelin.com' },
                { icon: Globe, text: 'Alchemy Supernode', url: 'https://www.alchemy.com' },
                { icon: BarChart2, text: 'CoinGecko API', url: 'https://www.coingecko.com/en/api' },
                { icon: Shield, text: 'Cyfrin Updraft', url: 'https://updraft.cyfrin.io' },
                { icon: BookOpen, text: 'CryptoZombies', url: 'https://cryptozombies.io' },
                { icon: GraduationCap, text: 'ETH Stack Exchange', url: 'https://ethereum.stackexchange.com' },
              ].map(link => (
                <a
                  key={link.text}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 hover:bg-solaris-gold/10 hover:text-solaris-gold text-solaris-muted text-xs transition-all duration-200 group"
                >
                  <link.icon className="w-3.5 h-3.5 shrink-0 group-hover:text-solaris-gold" />
                  <span className="leading-tight">{link.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DevResourcesSection;
