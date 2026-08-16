import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    year: z.number(),
    // 恒久設置 or 会期限定の学会作品発表展など。表示上は区別しないが、データとしては保持する。
    category: z.enum(['permanent', 'exhibition']),
    venue: z.string().optional(),
    period: z.string().optional(),
    materials: z.string().optional(),
    size: z.string().optional(),
    // public/images 配下への相対パス（Phase 2で実素材に差し替え）
    coverImage: z.string(),
    images: z.array(z.string()).default([]),
    // Phase 4 で旧サイトの自動生成URL（例: /z）から新URLへ301リダイレクトするための対応表に使う
    oldPath: z.string().optional(),
    // トップページでの並び順。省略時は year の降順。
    order: z.number().optional(),
  }),
});

export const collections = { works };
