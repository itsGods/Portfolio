export const calculateReadingTime = (markdown: string): number => {
  const text = markdown.replace(/#|\*|_|`|\[|\]|\(|\)|!|>|-|\+/g, '');
  const words = text.trim().split(/\s+/).length;
  const wordsPerMinute = 238;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

export const stripAndTruncate = (
  html: string, 
  max = 155
): string => {
  const text = html.replace(/<[^>]*>/g, '').trim()
  return text.length > max 
    ? text.slice(0, max).trimEnd() + '...' 
    : text
}
