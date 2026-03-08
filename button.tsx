/**
 * SOLARIS CET - Token Gating System
 * Sistem de acces bazat pe tokenuri CET
 */

// TokenGate - Sistem de acces bazat pe tokenuri CET

export interface TokenHolder {
  address: string;
  balance: number;
  stakedAmount: number;
  tier: AccessTier;
  permissions: string[];
  expiresAt: number;
}

export interface AccessTier {
  name: string;
  minTokens: number;
  maxTokens: number;
  features: string[];
  discount: number;
  priority: number;
}

export interface MonetizationConfig {
  basePrice: number;
  tokenDiscount: number;
  stakingReward: number;
  referralBonus: number;
  developerShare: number;
}

export class TokenGate {
  private holders: Map<string, TokenHolder> = new Map();
  private tiers: Map<string, AccessTier> = new Map();
  private config: MonetizationConfig;
  private totalRevenue: number = 0;
  private tokenPrice: number = 0.1; // USD per CET

  constructor(config?: Partial<MonetizationConfig>) {
    this.config = {
      basePrice: 0.001,
      tokenDiscount: 0.25,
      stakingReward: 0.15,
      referralBonus: 0.1,
      developerShare: 0.7,
      ...config
    };
    this.initializeTiers();
  }

  private initializeTiers(): void {
    const tiers: AccessTier[] = [
      {
        name: 'observer',
        minTokens: 0,
        maxTokens: 99,
        features: ['basic-access', 'view-content', 'community-chat'],
        discount: 0,
        priority: 1
      },
      {
        name: 'explorer',
        minTokens: 100,
        maxTokens: 999,
        features: ['basic-access', 'view-content', 'community-chat', 'ai-queries', 'quantum-sim'],
        discount: 0.1,
        priority: 2
      },
      {
        name: 'innovator',
        minTokens: 1000,
        maxTokens: 9999,
        features: ['basic-access', 'view-content', 'community-chat', 'ai-queries', 'quantum-sim', 'api-access', 'custom-agents'],
        discount: 0.25,
        priority: 3
      },
      {
        name: 'architect',
        minTokens: 10000,
        maxTokens: 99999,
        features: ['basic-access', 'view-content', 'community-chat', 'ai-queries', 'quantum-sim', 'api-access', 'custom-agents', 'hosting', 'white-label'],
        discount: 0.4,
        priority: 4
      },
      {
        name: 'quantum-master',
        minTokens: 100000,
        maxTokens: Infinity,
        features: ['all-features', 'unlimited-access', 'governance', 'revenue-share', 'priority-support'],
        discount: 0.5,
        priority: 5
      }
    ];

    for (const tier of tiers) {
      this.tiers.set(tier.name, tier);
    }
  }

  // Verifică dacă un utilizator are acces la o funcționalitate
  hasAccess(address: string, feature: string): boolean {
    const holder = this.holders.get(address);
    if (!holder) return false;

    // Verifică expirarea
    if (holder.expiresAt < Date.now()) {
      this.downgradeTier(address);
      return false;
    }

    const tier = this.tiers.get(holder.tier.name);
    if (!tier) return false;

    return tier.features.includes(feature) || tier.features.includes('all-features');
  }

  // Verifică dacă utilizatorul poate hosta aplicația
  canHost(address: string): boolean {
    return this.hasAccess(address, 'hosting');
  }

  // Verifică dacă utilizatorul poate dezvolta AI
  canDevelopAI(address: string): boolean {
    return this.hasAccess(address, 'custom-agents');
  }

  // Obține prețul pentru o funcționalitate
  getPrice(address: string, _feature: string): number {
    const holder = this.holders.get(address);
    const basePrice = this.config.basePrice;
    
    if (!holder) return basePrice;

    const tier = this.tiers.get(holder.tier.name);
    if (!tier) return basePrice;

    // Aplică discountul tier-ului
    const discountedPrice = basePrice * (1 - tier.discount);
    
    // Aplică discount suplimentar pentru staking
    const stakingDiscount = Math.min(holder.stakedAmount / 10000, 0.2);
    
    return discountedPrice * (1 - stakingDiscount);
  }

  // Înregistrează un nou deținător de tokenuri
  registerHolder(address: string, balance: number): TokenHolder {
    const tier = this.calculateTier(balance);
    
    const holder: TokenHolder = {
      address,
      balance,
      stakedAmount: 0,
      tier,
      permissions: tier.features,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 zile
    };

    this.holders.set(address, holder);
    return holder;
  }

  // Actualizează balanța unui deținător
  updateBalance(address: string, newBalance: number): TokenHolder {
    let holder = this.holders.get(address);
    
    if (!holder) {
      return this.registerHolder(address, newBalance);
    }

    holder.balance = newBalance;
    holder.tier = this.calculateTier(newBalance);
    holder.permissions = holder.tier.features;

    this.holders.set(address, holder);
    return holder;
  }

  // Stake tokenuri
  stake(address: string, amount: number): boolean {
    const holder = this.holders.get(address);
    if (!holder) return false;

    if (holder.balance < amount) return false;

    holder.balance -= amount;
    holder.stakedAmount += amount;
    
    // Recompensă de staking
    const reward = amount * this.config.stakingReward;
    holder.balance += reward;

    this.holders.set(address, holder);
    return true;
  }

  // Unstake tokenuri
  unstake(address: string, amount: number): boolean {
    const holder = this.holders.get(address);
    if (!holder) return false;

    if (holder.stakedAmount < amount) return false;

    holder.stakedAmount -= amount;
    holder.balance += amount;

    this.holders.set(address, holder);
    return true;
  }

  // Procesează o plată
  processPayment(address: string, amount: number, feature: string): boolean {
    const holder = this.holders.get(address);
    if (!holder) return false;

    const price = this.getPrice(address, feature);
    const totalCost = amount * price;

    if (holder.balance < totalCost) return false;

    holder.balance -= totalCost;
    this.totalRevenue += totalCost;

    this.holders.set(address, holder);
    return true;
  }

  // Distribuie venituri către dezvoltatori
  distributeRevenue(): void {
    const developerShare = this.totalRevenue * this.config.developerShare;
    const platformShare = this.totalRevenue - developerShare;

    // Aici s-ar trimite tokenurile către wallet-urile dezvoltatorilor
    console.log(`Distributed ${developerShare} CET to developers`);
    console.log(`Platform retained ${platformShare} CET`);

    this.totalRevenue = 0;
  }

  // Calculează tier-ul bazat pe balanță
  private calculateTier(balance: number): AccessTier {
    for (const tier of this.tiers.values()) {
      if (balance >= tier.minTokens && balance <= tier.maxTokens) {
        return tier;
      }
    }
    return this.tiers.get('observer')!;
  }

  // Downgradează tier-ul când expiră accesul
  private downgradeTier(address: string): void {
    const holder = this.holders.get(address);
    if (!holder) return;

    holder.tier = this.tiers.get('observer')!;
    holder.permissions = holder.tier.features;
    this.holders.set(address, holder);
  }

  // Generează link de referral
  generateReferralLink(address: string): string {
    const code = btoa(address).slice(0, 8);
    return `https://solariscet.io/ref/${code}`;
  }

  // Procesează referral
  processReferral(referrer: string, _newUser: string, amount: number): void {
    const referrerHolder = this.holders.get(referrer);
    if (!referrerHolder) return;

    const bonus = amount * this.config.referralBonus;
    referrerHolder.balance += bonus;
    this.holders.set(referrer, referrerHolder);
  }

  // Obține statistici
  getStats(): {
    totalHolders: number;
    totalStaked: number;
    totalRevenue: number;
    tierDistribution: Record<string, number>;
  } {
    const tierDistribution: Record<string, number> = {};
    let totalStaked = 0;

    for (const holder of this.holders.values()) {
      tierDistribution[holder.tier.name] = (tierDistribution[holder.tier.name] || 0) + 1;
      totalStaked += holder.stakedAmount;
    }

    return {
      totalHolders: this.holders.size,
      totalStaked,
      totalRevenue: this.totalRevenue,
      tierDistribution
    };
  }

  // Getters
  getHolder(address: string): TokenHolder | undefined {
    return this.holders.get(address);
  }

  getAllHolders(): TokenHolder[] {
    return Array.from(this.holders.values());
  }

  getTiers(): AccessTier[] {
    return Array.from(this.tiers.values());
  }

  getConfig(): MonetizationConfig {
    return { ...this.config };
  }

  getTokenPrice(): number {
    return this.tokenPrice;
  }

  setTokenPrice(price: number): void {
    this.tokenPrice = price;
  }
}

// Singleton instance
export const tokenGate = new TokenGate();

export default TokenGate;
