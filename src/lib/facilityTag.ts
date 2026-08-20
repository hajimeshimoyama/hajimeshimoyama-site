// 恒久設置作品のタイトルに含まれる実在の施設名から、機械的に分野タグを判定する。
// 本文や会場（展示先ギャラリー等）は対象にしない — 展示会場を「発注元」と誤認しないため。
// タイトルに書かれている固有名詞のみを根拠にするため、新しい事実の創作にはあたらない。
const RULES: { label: string; pattern: RegExp }[] = [
  { label: '医療施設', pattern: /病院|医院|クリニック/ },
  { label: '教育機関', pattern: /大学|専門学校|学院|幼稚園|小学校|中学校|高等学校/ },
  { label: '企業・オフィス', pattern: /株式会社|有限会社|工場|(?<!学)社(?!会)/ },
  { label: '公共施設・自治体', pattern: /市庁舎|水道局|市役所|区役所|図書館/ },
];

export function getFacilityTag(category: string, title: string): string | null {
  if (category !== 'permanent') return null;
  for (const rule of RULES) {
    if (rule.pattern.test(title)) return rule.label;
  }
  return null;
}
