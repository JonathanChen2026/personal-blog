// ═══════════════════════════════════════════════════════
//  SITE CONFIG — tweak any number here to change the site
// ═══════════════════════════════════════════════════════

export const config = {
  name: 'Jonathan Chen',

  // ── Body / General Text ───────────────────────────────
  body: {
    fontSize: '17px',                // base font size for all body text
    lineHeight: '1.8',               // spacing between lines
    fontWeight: '400',               // base font weight
  },

  // ── About page ────────────────────────────────────────
  about: {
    iconSize: '80px',                // the emoji/icon at the top
    iconMarginBottom: '0px',
    paragraphFontSize: '15.5px',
    paragraphLineHeight: '2',
    paragraphSpacing: '28px',   // gap between paragraphs
  },

  // ── Writing List (Thoughts page) ─────────────────────
  thoughts: {
    titleFontSize: '1.5rem',         // "WRITING" heading
    titleFontWeight: '500',

    subtitleFontSize: '15px',

    postTitleFontSize: '15px',       // each post's title
    postTitleFontWeight: '500',
    postExcerptFontSize: '13px',
    postDateFontSize: '12px',
    postGap: '48px',                 // vertical space between posts

    tagFontSize: '10px',
    filterFontSize: '11px',
    filterLetterSpacing: '0.1em',
  },

  // ── projects page ─────────────────────
  projects: {
    titleFontSize: '1.5rem',        
    titleFontWeight: '500',
  },

  // ── Individual Post ───────────────────────────────────
  post: {
      titleFontSize: '1.8rem',
      titleFontWeight: '500',
      titleLineHeight: '1.35',
      bodyFontSize: '16px',
      bodyLineHeight: '1.9',

      // ── Heading sizes inside post content ──
      h1FontSize: '1.5rem',
      h1FontWeight: '700',
      h2FontSize: '1.2rem',
      h2FontWeight: '700',
      h3FontSize: '1.0rem',
      h3FontWeight: '600',
      headingLineHeight: '1.4',
      headingMarginTop: '2rem',
      headingMarginBottom: '0.75rem',
    },

  // ── Layout ────────────────────────────────────────────
  layout: {
    maxWidth: '780px',
    paddingHorizontal: '32px',
    paddingVertical: '72px',
  },
};
