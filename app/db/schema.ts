import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

/** Matches domain: BUY / SELL / MINE */
export const transactionTypeEnum = pgEnum('transaction_type', ['BUY', 'SELL', 'MINE']);

/** User — wallet, referral, points */
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    walletAddress: text('wallet_address').notNull().unique(),
    referralCode: text('referral_code').unique(),
    points: integer('points').notNull().default(0),
    role: text('role').notNull().default('visitor'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('users_wallet_address_idx').on(t.walletAddress)],
);

export const userMfa = pgTable(
  'user_mfa',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    secretEncrypted: text('secret_encrypted'),
    enabledAt: timestamp('enabled_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('user_mfa_enabled_at_idx').on(t.enabledAt)],
);

/** Active or historical mining session per user */
export const miningSessions = pgTable(
  'mining_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    startTime: timestamp('start_time', { withTimezone: true }).notNull(),
    lastCheck: timestamp('last_check', { withTimezone: true }).notNull(),
    isRunning: boolean('is_running').notNull().default(false),
    minedAmount: numeric('mined_amount', { precision: 36, scale: 18 }).notNull().default('0'),
  },
  (t) => [index('mining_sessions_user_id_idx').on(t.userId)],
);

/** On-chain / app transactions */
export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: transactionTypeEnum('type').notNull(),
    amount: numeric('amount', { precision: 36, scale: 18 }).notNull(),
    status: text('status').notNull(),
    txHash: text('tx_hash'),
  },
  (t) => [index('transactions_user_id_idx').on(t.userId)],
);

/** Auth sessions (JWT issuance tracking / revocation) */
export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    ip: text('ip'),
    userAgent: text('user_agent'),
  },
  (t) => [
    index('sessions_user_id_idx').on(t.userId),
    index('sessions_expires_at_idx').on(t.expiresAt),
  ],
);

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    walletAddress: text('wallet_address'),
    action: text('action').notNull(),
    details: text('details'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('audit_logs_wallet_address_idx').on(t.walletAddress)],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserMfa = typeof userMfa.$inferSelect;
export type NewUserMfa = typeof userMfa.$inferInsert;
export type MiningSession = typeof miningSessions.$inferSelect;
export type NewMiningSession = typeof miningSessions.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
