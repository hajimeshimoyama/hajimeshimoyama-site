import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { imageSize } from 'image-size';

const cache = new Map<string, { width: number; height: number }>();

export function getImageDimensions(publicPath: string): { width: number; height: number } {
  if (cache.has(publicPath)) return cache.get(publicPath)!;
  const filePath = join(process.cwd(), 'public', publicPath);
  const buffer = readFileSync(filePath);
  const { width, height } = imageSize(buffer);
  const dims = { width: width!, height: height! };
  cache.set(publicPath, dims);
  return dims;
}
