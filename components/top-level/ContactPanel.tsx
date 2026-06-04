import { config } from '@/site.config';

const { contact } = config;

const contactLinkStyle = {
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
};

export default function ContactPanel() {
  return (
    <div>
      <h1
        style={{
          fontSize: contact.titleFontSize,
          fontWeight: contact.titleFontWeight,
          letterSpacing: contact.titleLetterSpacing,
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}
      >
        CONTACT
      </h1>
      <p style={{ fontSize: contact.fontSize, lineHeight: contact.lineHeight, color: 'var(--text)' }}>
        <a
          href="mailto:chen6111@purdue.edu"
          rel="noopener noreferrer"
          style={contactLinkStyle}
          target="_blank"
        >
          chen6111@purdue.edu
        </a>
        <br /> <br />
        <a
          href="https://www.linkedin.com/in/jonathan-chen-502a5a247/"
          rel="noopener noreferrer"
          style={contactLinkStyle}
          target="_blank"
        >
          linkedin
        </a>
      </p>
    </div>
  );
}
