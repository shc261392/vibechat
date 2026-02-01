import axios, { AxiosInstance } from 'axios';

interface OllamaConfig {
  apiUrl: string;
  model: string;
  temperature?: number;
  topP?: number;
  topK?: number;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GenerateResponse {
  model: string;
  created_at: string;
  message: ChatMessage;
  done: boolean;
}

class LLMClient {
  private client: AxiosInstance;
  private config: OllamaConfig;
  private isReady: boolean = false;

  constructor(config: OllamaConfig) {
    this.config = {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.apiUrl,
      timeout: 60000,
    });
  }

  /**
   * Initialize the LLM client and verify connection
   */
  async initialize(): Promise<void> {
    try {
      // Test connection by getting models list
      const response = await this.client.get('/tags');
      if (response.data.models) {
        this.isReady = true;
        console.log(`LLM client ready. Available models: ${response.data.models.length}`);
      }
    } catch (error) {
      throw new Error(`Failed to connect to LLM: ${(error as Error).message}`);
    }
  }

  /**
   * Generate a response from the LLM
   */
  async generateResponse(
    messages: ChatMessage[],
    options?: {
      temperature?: number;
      topP?: number;
      topK?: number;
      maxTokens?: number;
    }
  ): Promise<string> {
    if (!this.isReady) {
      throw new Error('LLM client not initialized');
    }

    try {
      const response = await this.client.post('/chat', {
        model: this.config.model,
        messages,
        stream: false,
        options: {
          temperature: options?.temperature || this.config.temperature,
          top_p: options?.topP || this.config.topP,
          top_k: options?.topK || this.config.topK,
          num_predict: options?.maxTokens || 500,
        },
      });

      return response.data.message.content;
    } catch (error) {
      throw new Error(`LLM generation failed: ${(error as Error).message}`);
    }
  }

  /**
   * Stream a response from the LLM
   */
  async *streamResponse(
    messages: ChatMessage[],
    onChunk?: (chunk: string) => void
  ): AsyncGenerator<string> {
    if (!this.isReady) {
      throw new Error('LLM client not initialized');
    }

    try {
      const response = await this.client.post('/chat', {
        model: this.config.model,
        messages,
        stream: true,
      });

      // Process streaming response
      const lines = response.data.split('\n');
      for (const line of lines) {
        if (line.trim()) {
          const json = JSON.parse(line);
          if (json.message?.content) {
            onChunk?.(json.message.content);
            yield json.message.content;
          }
        }
      }
    } catch (error) {
      throw new Error(`LLM streaming failed: ${(error as Error).message}`);
    }
  }

  /**
   * List available models
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await this.client.get('/tags');
      return response.data.models.map((m: any) => m.name);
    } catch (error) {
      throw new Error(`Failed to list models: ${(error as Error).message}`);
    }
  }

  /**
   * Check if LLM is ready
   */
  getStatus(): { ready: boolean; model: string } {
    return {
      ready: this.isReady,
      model: this.config.model,
    };
  }
}

let llmClient: LLMClient | null = null;

/**
 * Initialize the global LLM client
 */
export async function initializeLLM(config?: Partial<OllamaConfig>): Promise<void> {
  const defaultConfig: OllamaConfig = {
    apiUrl: process.env.LLM_API_URL || 'http://localhost:11434/api',
    model: process.env.LLM_MODEL || 'mistral',
  };

  llmClient = new LLMClient({ ...defaultConfig, ...config });
  await llmClient.initialize();
}

/**
 * Get the LLM client instance
 */
export function getLLMClient(): LLMClient {
  if (!llmClient) {
    throw new Error('LLM client not initialized');
  }
  return llmClient;
}

export { LLMClient, ChatMessage, OllamaConfig };
