// ═══════════════════════════════════════════════════════
//  SITE CONFIG — tweak any number here to change the site
// ═══════════════════════════════════════════════════════

export const config = {

  // ── Navbar ────────────────────────────────────────────
  nav: {
    yourName: 'Jonathan Chen',           // ← change to your name

    nameFontSize: '16px',            // size of your name on the left
    nameFontWeight: '400',           // 400=thin, 500=medium, 700=bold, 900=black
    nameLetterSpacing: '0.05em',     // spread between letters

    linkFontSize: '15px',            // size of THOUGHTS, PROJECTS etc
    linkFontWeight: '500',           // weight of inactive nav links
    linkActiveFontWeight: '500',     // weight of the currently active link
    linkLetterSpacing: '0.10em',     // spread between link letters
    linkGap: '32px',                 // space between nav links

    // How far the link group sits from the center
    // 50% = perfectly centered. Increase % to push right, decrease to push left
    linkGroupOffset: '66%',

    // Gap between your name and the centered link cluster
    // This doesn't move the links — it only affects the name's right margin
    nameRightMargin: '0px',
    nameLeftMargin: '310px',

    paddingVertical: '22px',         // top/bottom padding of the whole navbar
    paddingHorizontal: '40px',       // left/right padding of the whole navbar
  },

  // ── Body / General Text ───────────────────────────────
  body: {
    fontSize: '17px',                // base font size for all body text
    lineHeight: '1.8',               // spacing between lines
    fontWeight: '400',               // base font weight
  },

  // ── Homepage ──────────────────────────────────────────
  home: {
    iconSize: '80px',                // the emoji/icon at the top
    iconMarginBottom: '0px',
    paragraphFontSize: '15.5px',
    paragraphLineHeight: '2',
    paragraphSpacing: '28px',   // gap between paragraphs
    paragraphFontWeight: '200',
    paragraphTextTransform: 'none',   
  },

  // ── Writing List (Thoughts page) ─────────────────────
  thoughts: {
    titleFontSize: '1.5rem',         // "WRITING" heading
    titleFontWeight: '500',
    titleLetterSpacing: '0.10em',

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
    titleLetterSpacing: '0.10em',
    fontSize: '17px',                // base font size for all body text
    lineHeight: '1.8',               // spacing between lines
    fontWeight: '400',               // base font weight

  },


    // ── contact page ─────────────────────
  contact: {
    titleFontSize: '1.5rem',        
    titleFontWeight: '500',
    titleLetterSpacing: '0.10em',
    fontSize: '17px',                // base font size for all body text
    lineHeight: '1.8',               // spacing between lines
    fontWeight: '400',               // base font weight
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
    navMaxWidth: '800px',               // max width of the content area
    paddingHorizontal: '32px',
    paddingVertical: '72px',
  },

  // ── Theme toggle ─────────────────────────────────────
  themeToggle: {
    fontSize: '11px',
    padding: '4px 12px',
  },
};