import type { ResumeData, ResumeSection } from '../types';

export function parseResume(markdown: string): ResumeData {
  const lines = markdown.split('\n');

  let name = '';
  let title = '';
  const contact: string[] = [];
  const sections: ResumeSection[] = [];

  let i = 0;

  // Parse header: # Name
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.startsWith('# ')) {
      name = line.replace(/^#\s+/, '');
      i++;
      break;
    }
    i++;
  }

  // Parse title and contact lines (before first ##)
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.startsWith('## ')) break;
    if (line.startsWith('**') && line.endsWith('**')) {
      title = line.replace(/^\*\*|\*\*$/g, '');
    } else if (line.includes('|') || line.includes('@')) {
      contact.push(...line.split('|').map((s) => s.trim()).filter(Boolean));
    }
    i++;
  }

  // Parse ## sections
  let currentHeading = '';
  let currentLines: string[] = [];

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith('## ')) {
      if (currentHeading) {
        sections.push({ heading: currentHeading, content: currentLines.join('\n').trim() });
      }
      currentHeading = line.trim().replace(/^##\s+/, '');
      currentLines = [];
    } else {
      currentLines.push(line);
    }
    i++;
  }
  if (currentHeading) {
    sections.push({ heading: currentHeading, content: currentLines.join('\n').trim() });
  }

  return { name, title, contact, sections };
}

const SIDEBAR_SECTIONS = ['Soft Skills', 'Technical Skills', 'Certifications', 'Interests'];

export function isSidebarSection(heading: string): boolean {
  return SIDEBAR_SECTIONS.includes(heading);
}
