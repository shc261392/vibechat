import screenshot from 'screenshot-desktop';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

const CAPTURE_DIR = path.join(process.env.HOME || '', '.vibechat', 'captures');

// Ensure capture directory exists
if (!fs.existsSync(CAPTURE_DIR)) {
  fs.mkdirSync(CAPTURE_DIR, { recursive: true });
}

export interface ScreenCapture {
  timestamp: number;
  imagePath: string;
  hash: string;
  width: number;
  height: number;
}

/**
 * Captures a screenshot and stores it locally
 */
export async function captureScreenshot(): Promise<ScreenCapture> {
  try {
    const timestamp = Date.now();
    const buffer = await screenshot({ format: 'png' });
    
    // Generate hash for deduplication
    const hash = createHash('sha256').update(buffer).digest('hex');
    
    // Save screenshot to disk
    const filename = `capture_${timestamp}.png`;
    const imagePath = path.join(CAPTURE_DIR, filename);
    
    fs.writeFileSync(imagePath, buffer);

    // Extract dimensions (simplified - in production use 'image-size' package)
    return {
      timestamp,
      imagePath,
      hash,
      width: 1920,  // placeholder
      height: 1080, // placeholder
    };
  } catch (error) {
    throw new Error(`Failed to capture screenshot: ${(error as Error).message}`);
  }
}

/**
 * Gets the most recent screenshot
 */
export function getLatestCapture(): ScreenCapture | null {
  const files = fs.readdirSync(CAPTURE_DIR).sort().reverse();
  
  if (files.length === 0) return null;
  
  const latestFile = files[0];
  const imagePath = path.join(CAPTURE_DIR, latestFile);
  const stats = fs.statSync(imagePath);
  
  return {
    timestamp: stats.mtimeMs,
    imagePath,
    hash: '', // Would need to calculate
    width: 1920,
    height: 1080,
  };
}

/**
 * Cleans up old screenshots (older than maxAge)
 */
export function cleanupOldCaptures(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
  const now = Date.now();
  const files = fs.readdirSync(CAPTURE_DIR);
  
  files.forEach(file => {
    const filePath = path.join(CAPTURE_DIR, file);
    const stats = fs.statSync(filePath);
    
    if (now - stats.mtimeMs > maxAge) {
      fs.unlinkSync(filePath);
    }
  });
}
