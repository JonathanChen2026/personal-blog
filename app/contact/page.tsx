import { config } from "@/site.config";
const { contact } = config;


export default function ContactPage() {
  return (
    <div>
      <h1 style={{ fontSize: contact.titleFontSize, fontWeight: contact.titleFontWeight, letterSpacing: contact.titleLetterSpacing, textTransform: 'uppercase', marginBottom: '24px' }}>
        CONTACT
      </h1>
      <p style={{ fontSize: contact.fontSize, lineHeight: contact.lineHeight, color: 'var(--text)' }}>
  
        <a href="mailto:Jonathan.chen360@gmail.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          jonathan.chen360@gmail.com
        </a>
        <br /> <br />
        <a href="https://www.linkedin.com/in/jonathan-chen-502a5a247/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          linkedin
        </a>
        
      </p>
    </div>
  );
}