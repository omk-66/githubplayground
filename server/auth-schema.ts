import { pgTable, text, integer, timestamp, boolean, primaryKey, serial } from "drizzle-orm/pg-core";  // Use serial from pg-core
import { relations } from 'drizzle-orm';
import { pgEnum } from 'drizzle-orm/pg-core';
import { unique } from "drizzle-orm/pg-core";

// Enum Definitions
export const visibilityEnum = pgEnum('visibility', ['public', 'private']);
export const memberRoleEnum = pgEnum('member_role', ['owner', 'admin', 'member']);

// User Table
export const user = pgTable("user", {
	id: text("id").primaryKey(),  // Text type for UUID
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

// Session Table
export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

// Account Table
export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

// Verification Table
export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

// Playgrounds Table
export const playgrounds = pgTable('playgrounds', {
	id: serial('id').primaryKey(),  // Use serial for auto-increment in PostgreSQL
	name: text('name').notNull(),
	description: text('description'),
	visibility: visibilityEnum('visibility').default('public').notNull(),
	tags: text('tags').array(),
	isFeatured: boolean('is_featured').default(false),
	creatorId: text('creator_id').references(() => user.id),  // Fix to match user.id type (text)
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Playground Members Table
export const playgroundMembers = pgTable("playground_members", {
	id: serial('id').primaryKey(), // Add explicit primary key
	userId: text("user_id").notNull().references(() => user.id),
	playgroundId: integer("playground_id").notNull().references(() => playgrounds.id),
	role: memberRoleEnum("role").default("member").notNull(),
	joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (table) => ({
	// Change from primaryKey to unique constraint
	uniqueUserPlayground: unique().on(table.userId, table.playgroundId),
}));

// Relations
export const usersRelations = relations(user, ({ many }) => ({
	playgrounds: many(playgroundMembers),
}));

export const playgroundsRelations = relations(playgrounds, ({ one, many }) => ({
	creator: one(user, {
		fields: [playgrounds.creatorId],
		references: [user.id],
	}),
	members: many(playgroundMembers),
}));
