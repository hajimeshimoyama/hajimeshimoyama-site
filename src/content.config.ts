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
    // 階数などでギャラリーを見出し付きグループに分けたい場合に使う。指定時は images より優先。
    imageGroups: z
      .array(z.object({ label: z.string(), images: z.array(z.string()) }))
      .optional(),
    // public/videos 配下への相対パス
    video: z.string().optional(),
    // キャラクター等のモチーフ参考画像。メインギャラリーより小さく、拡大なしで表示。
    motifImages: z.array(z.string()).optional(),
    // 撮影者・アートプロデュース等の第三者クレジット。本文と区別しmutedスタイルで表示。
    credit: z.string().optional(),
    // Phase 4 で旧サイトの自動生成URL（例: /z）から新URLへ301リダイレクトするための対応表に使う
    oldPath: z.string().optional(),
    // トップページでの並び順。省略時は year の降順。
    order: z.number().optional(),
  }),
});

export const collections = { works };
