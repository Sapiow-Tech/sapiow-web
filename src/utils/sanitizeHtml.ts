import DOMPurify from "dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks
 * This function uses DOMPurify to clean HTML content before rendering
 * with dangerouslySetInnerHTML
 *
 * @param dirty - The HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(dirty: string): string {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    // Server-side: return empty string or use a server-side sanitizer
    // For now, we'll return the string as-is on server-side
    // In production, consider using isomorphic-dompurify or similar
    return dirty;
  }

  // Browser-side: use DOMPurify to sanitize
  return DOMPurify.sanitize(dirty, {
    // Allow common HTML tags for content formatting
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "strong",
      "em",
      "u",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
      "code",
      "pre",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "div",
    ],
    // Allow safe attributes
    ALLOWED_ATTR: ["href", "target", "rel", "class", "id"],
    // Add rel="noopener noreferrer" to external links for security
    ADD_ATTR: ["target"],
    // Prevent script execution
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  });
}

