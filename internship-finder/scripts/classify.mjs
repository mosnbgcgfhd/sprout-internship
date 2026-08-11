// Keeps the "no noise" promise: only real internships get through, and
// each one gets a rough category tag for filtering.

const INTERN_WORDS = /\b(intern|internship|co-?op|working student)\b/i;
const EXCLUDE_WORDS = /\b(senior|staff|principal|lead|director|manager)\b/i;

const CATEGORY_RULES = [
  { category: "engineering", pattern: /\b(software|swe|engineer|developer|devops|data eng)\b/i },
  { category: "data", pattern: /\b(data scien|machine learning|ml |ai |analytics|data analyst)\b/i },
  { category: "design", pattern: /\b(design|ux|ui|product design)\b/i },
  { category: "marketing", pattern: /\b(marketing|growth|social media|content)\b/i },
  { category: "business", pattern: /\b(business|finance|operations|sales|product manage)\b/i },
];

export function isInternship(title) {
  if (!title) return false;
  return INTERN_WORDS.test(title) && !EXCLUDE_WORDS.test(title);
}

export function categorize(title) {
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(title)) return rule.category;
  }
  return null;
}
