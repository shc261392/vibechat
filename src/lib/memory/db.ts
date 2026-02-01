import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.env.HOME || '', '.vibechat');
const DB_PATH = path.join(DB_DIR, 'memory.db');

let db: sqlite3.Database | null = null;

/**
 * Initialize the memory database
 */
export async function initializeMemoryDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Ensure directory exists
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Create tables
      createTables()
        .then(() => resolve())
        .catch(reject);
    });
  });
}

/**
 * Create database tables
 */
async function createTables(): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  const tables = [
    // Conversations table
    `CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      created_at INTEGER,
      updated_at INTEGER,
      personality_id TEXT,
      title TEXT,
      summary TEXT
    )`,

    // Messages table
    `CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      role TEXT CHECK(role IN ('user', 'assistant')),
      content TEXT,
      screenshot_path TEXT,
      created_at INTEGER,
      FOREIGN KEY(conversation_id) REFERENCES conversations(id)
    )`,

    // Personalities table
    `CREATE TABLE IF NOT EXISTS personalities (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      system_prompt TEXT,
      traits TEXT,
      color TEXT,
      avatar TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )`,

    // Memory entries table
    `CREATE TABLE IF NOT EXISTS memory_entries (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      key TEXT,
      value TEXT,
      importance INTEGER,
      created_at INTEGER,
      FOREIGN KEY(conversation_id) REFERENCES conversations(id)
    )`,

    // Settings table
    `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at INTEGER
    )`,
  ];

  for (const sql of tables) {
    await runAsync(sql);
  }
}

/**
 * Execute a query asynchronously
 */
function runAsync(sql: string, params?: any[]): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    const run = params ? db.run.bind(db) : db.run.bind(db);
    (params ? run(sql, params) : run(sql)).on('error', reject).on('close', () => resolve() as never);
  });
}

/**
 * Get database instance
 */
export function getDatabase(): sqlite3.Database {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

export interface Conversation {
  id: string;
  created_at: number;
  updated_at: number;
  personality_id: string;
  title: string;
  summary?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  screenshot_path?: string;
  created_at: number;
}

/**
 * Save a message to memory
 */
export async function saveMessage(message: Message): Promise<void> {
  const sql = `
    INSERT INTO messages (id, conversation_id, role, content, screenshot_path, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return runAsync(sql, [
    message.id,
    message.conversation_id,
    message.role,
    message.content,
    message.screenshot_path,
    message.created_at,
  ]);
}

/**
 * Get conversation history
 */
export async function getConversationHistory(conversationId: string): Promise<Message[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    db.all(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversationId],
      (err, rows) => {
        if (err) reject(err);
        else resolve((rows || []) as Message[]);
      }
    );
  });
}

/**
 * Create a new conversation
 */
export async function createConversation(
  personalityId: string,
  title: string
): Promise<Conversation> {
  const id = `conv_${Date.now()}`;
  const now = Date.now();

  const sql = `
    INSERT INTO conversations (id, created_at, updated_at, personality_id, title)
    VALUES (?, ?, ?, ?, ?)
  `;

  await runAsync(sql, [id, now, now, personalityId, title]);

  return {
    id,
    created_at: now,
    updated_at: now,
    personality_id: personalityId,
    title,
  };
}
