import { config } from "@/site.config";
const { contact } = config;


export default function ContactPage() {
  return (
    <div>
      <h1 style={{ fontSize: contact.titleFontSize, fontWeight: contact.titleFontWeight, letterSpacing: contact.titleLetterSpacing, textTransform: 'uppercase', marginBottom: '24px' }}>
        CONTACT
      </h1>
      <p style={{ fontSize: '13px', lineHeight: '1.9', color: 'var(--text)' }}>
        You can reach me at{' '}
        <a href="mailto:you@email.com" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          you@email.com
        </a>
        .
      </p>
    </div>
  );
}