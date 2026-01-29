import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  real,
  boolean,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const frameworkEnum = pgEnum("framework", ["NIS2", "DORA", "AI_ACT"]);
export const assessmentStatusEnum = pgEnum("assessment_status", [
  "in_progress",
  "completed",
]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  company: varchar("company", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(), // 30-day retention
  supabaseUserId: uuid("supabase_user_id").unique(),
});

// Assessment templates (predefined NIS2, DORA, AI Act)
export const assessmentTemplates = pgTable("assessment_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  framework: frameworkEnum("framework").notNull(),
  version: varchar("version", { length: 20 }).notNull().default("1.0"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Assessment categories
export const assessmentCategories = pgTable("assessment_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateId: uuid("template_id")
    .notNull()
    .references(() => assessmentTemplates.id, { onDelete: "cascade" }),
  key: varchar("key", { length: 100 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  weight: real("weight").notNull().default(1),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleSk: varchar("title_sk", { length: 255 }).notNull(),
  titleCz: varchar("title_cz", { length: 255 }).notNull(),
  descriptionEn: text("description_en"),
  descriptionSk: text("description_sk"),
  descriptionCz: text("description_cz"),
});

// Assessment questions
export const assessmentQuestions = pgTable("assessment_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => assessmentCategories.id, { onDelete: "cascade" }),
  key: varchar("key", { length: 100 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  weight: real("weight").notNull().default(1),
  questionEn: text("question_en").notNull(),
  questionSk: text("question_sk").notNull(),
  questionCz: text("question_cz").notNull(),
  helpTextEn: text("help_text_en"),
  helpTextSk: text("help_text_sk"),
  helpTextCz: text("help_text_cz"),
});

// Answer options
export const answerOptions = pgTable("answer_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => assessmentQuestions.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
  score: real("score").notNull(), // 0 to 1
  labelEn: varchar("label_en", { length: 255 }).notNull(),
  labelSk: varchar("label_sk", { length: 255 }).notNull(),
  labelCz: varchar("label_cz", { length: 255 }).notNull(),
});

// User assessments
export const assessments = pgTable("assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  templateId: uuid("template_id")
    .notNull()
    .references(() => assessmentTemplates.id),
  framework: frameworkEnum("framework").notNull(),
  status: assessmentStatusEnum("status").notNull().default("in_progress"),
  overallScore: real("overall_score"),
  categoryScores: jsonb("category_scores"), // { categoryKey: score }
  currentCategoryIndex: integer("current_category_index").default(0),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Assessment responses
export const assessmentResponses = pgTable("assessment_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  questionId: uuid("question_id")
    .notNull()
    .references(() => assessmentQuestions.id),
  selectedOptionId: uuid("selected_option_id")
    .notNull()
    .references(() => answerOptions.id),
  score: real("score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Recommendations (generated after assessment completion)
export const recommendations = pgTable("recommendations", {
  id: uuid("id").primaryKey().defaultRandom(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  categoryKey: varchar("category_key", { length: 100 }).notNull(),
  priority: integer("priority").notNull(), // 1 = highest
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleSk: varchar("title_sk", { length: 255 }).notNull(),
  titleCz: varchar("title_cz", { length: 255 }).notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionSk: text("description_sk").notNull(),
  descriptionCz: text("description_cz").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  assessments: many(assessments),
}));

export const assessmentTemplatesRelations = relations(
  assessmentTemplates,
  ({ many }) => ({
    categories: many(assessmentCategories),
    assessments: many(assessments),
  })
);

export const assessmentCategoriesRelations = relations(
  assessmentCategories,
  ({ one, many }) => ({
    template: one(assessmentTemplates, {
      fields: [assessmentCategories.templateId],
      references: [assessmentTemplates.id],
    }),
    questions: many(assessmentQuestions),
  })
);

export const assessmentQuestionsRelations = relations(
  assessmentQuestions,
  ({ one, many }) => ({
    category: one(assessmentCategories, {
      fields: [assessmentQuestions.categoryId],
      references: [assessmentCategories.id],
    }),
    options: many(answerOptions),
    responses: many(assessmentResponses),
  })
);

export const answerOptionsRelations = relations(answerOptions, ({ one }) => ({
  question: one(assessmentQuestions, {
    fields: [answerOptions.questionId],
    references: [assessmentQuestions.id],
  }),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  user: one(users, {
    fields: [assessments.userId],
    references: [users.id],
  }),
  template: one(assessmentTemplates, {
    fields: [assessments.templateId],
    references: [assessmentTemplates.id],
  }),
  responses: many(assessmentResponses),
  recommendations: many(recommendations),
}));

export const assessmentResponsesRelations = relations(
  assessmentResponses,
  ({ one }) => ({
    assessment: one(assessments, {
      fields: [assessmentResponses.assessmentId],
      references: [assessments.id],
    }),
    question: one(assessmentQuestions, {
      fields: [assessmentResponses.questionId],
      references: [assessmentQuestions.id],
    }),
    selectedOption: one(answerOptions, {
      fields: [assessmentResponses.selectedOptionId],
      references: [answerOptions.id],
    }),
  })
);

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  assessment: one(assessments, {
    fields: [recommendations.assessmentId],
    references: [assessments.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AssessmentTemplate = typeof assessmentTemplates.$inferSelect;
export type AssessmentCategory = typeof assessmentCategories.$inferSelect;
export type AssessmentQuestion = typeof assessmentQuestions.$inferSelect;
export type AnswerOption = typeof answerOptions.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type NewAssessment = typeof assessments.$inferInsert;
export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
