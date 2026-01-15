#!/usr/bin/env tsx
/**
 * Generate INDEX.md for subdirectories
 */

import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';

function extractExports(filePath: string): string[] {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const exports: string[] = [];
    
    const namedExports = content.matchAll(/export\s+(?:const|function|class|interface|type|enum)\s+(\w+)/g);
    for (const match of namedExports) {
      exports.push(match[1]);
    }
    
    if (content.includes('export default')) {
      exports.push('(default)');
    }
    
    return exports;
  } catch (error) {
    return [];
  }
}

function getFilePurpose(filePath: string): string {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    const descMatch = content.match(/@description\s+([^\n*]+)/);
    if (descMatch) return descMatch[1].trim();
    
    const fileMatch = content.match(/@file\s+([^\n*]+)/);
    if (fileMatch) return fileMatch[1].trim();
    
    const commentMatch = content.match(/\/\*\*\s*\n\s*\*\s*([^\n*]+)/);
    if (commentMatch) return commentMatch[1].trim();
    
    return 'TODO: Add description';
  } catch (error) {
    return 'TODO: Add description';
  }
}

function scanDirectory(dirPath: string) {
  const files: any[] = [];
  
  try {
    const entries = readdirSync(dirPath);
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const stat = statSync(fullPath);
      
      if (stat.isFile() && (entry.endsWith('.ts') || entry.endsWith('.tsx')) && !entry.includes('.test.') && entry !== 'INDEX.md') {
        const exports = extractExports(fullPath);
        files.push({
          name: entry,
          path: fullPath,
          exports
        });
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dirPath}:`, error);
  }
  
  return files.sort((a, b) => a.name.localeCompare(b.name));
}

function getSubdirectories(dirPath: string): string[] {
  const subdirs: string[] = [];
  
  try {
    const entries = readdirSync(dirPath);
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory() && !entry.startsWith('.')) {
        subdirs.push(entry);
      }
    }
  } catch (error) {
    console.error(`Error getting subdirs for ${dirPath}:`, error);
  }
  
  return subdirs.sort();
}

function generateIndex(dirPath: string, moduleName: string): string {
  const files = scanDirectory(dirPath);
  const subdirs = getSubdirectories(dirPath);
  
  let content = `# ${moduleName} - Index\n\n`;
  content += `Version: 1.1 | Date: ${new Date().toISOString().split('T')[0]}\n\n`;
  content += `> Auto-generated from codebase structure\n\n`;
  
  // Purpose based on directory name
  content += `## Purpose\n\n`;
  const purposes: Record<string, string> = {
    'ai': 'AI/LLM configuration and utilities for Gemini 2.0 Flash integration.',
    'mockup-data': 'Test data generators and type definitions for development.',
    'types': 'TypeScript type definitions shared across the application.',
    'dashboard': 'Dashboard-specific components for different user roles.',
    'layout': 'Layout components (sidebar, header, navigation).',
    'ui': 'shadcn/ui base components (button, card, dialog, etc.).'
  };
  
  content += purposes[moduleName] || `${moduleName} module for Contecsa.\n`;
  content += `\n`;
  
  // File Map
  content += `## File Map\n\n`;
  content += `| File | Purpose | Key Exports |\n`;
  content += `|------|---------|-------------|\n`;
  
  for (const file of files) {
    const purpose = getFilePurpose(file.path);
    const exportsStr = file.exports.length > 0 ? file.exports.slice(0, 5).join(', ') : '(none)';
    content += `| ${file.name} | ${purpose} | ${exportsStr} |\n`;
  }
  
  content += `\n`;
  
  // Subdirectories
  if (subdirs.length > 0) {
    content += `## Subdirectories\n\n`;
    for (const subdir of subdirs) {
      content += `- **${subdir}/** - See ${subdir}/INDEX.md\n`;
    }
    content += `\n`;
  }
  
  // Quick Start
  content += `## Quick Start\n\n`;
  content += `\`\`\`typescript\n`;
  content += `// Import from ${moduleName}\n`;
  if (files.length > 0 && files[0].exports.length > 0) {
    const firstExport = files[0].exports[0] !== '(default)' ? files[0].exports[0] : basename(files[0].name, '.ts');
    content += `import { ${firstExport} } from '@/.../${moduleName}/${files[0].name.replace(/\.tsx?$/, '')}';\n`;
  }
  content += `\`\`\`\n\n`;
  
  content += `---\n`;
  content += `**Generated:** ${new Date().toISOString()}\n`;
  content += `**Files:** ${files.length} | **Subdirs:** ${subdirs.length}\n`;
  
  return content;
}

// Generate for subdirectories
const subdirs = [
  { path: 'src/lib/ai', name: 'ai' },
  { path: 'src/lib/types', name: 'types' },
  { path: 'src/lib/mockup-data', name: 'mockup-data' },
  { path: 'src/lib/mockup-data/types', name: 'types' },
  { path: 'src/components/dashboard', name: 'dashboard' },
  { path: 'src/components/layout', name: 'layout' },
  { path: 'src/components/ui', name: 'ui' }
];

console.log('Generating INDEX.md for subdirectories...\n');

for (const dir of subdirs) {
  try {
    const indexPath = join(dir.path, 'INDEX.md');
    const content = generateIndex(dir.path, dir.name);
    
    writeFileSync(indexPath, content);
    console.log(`✓ Generated ${indexPath}`);
  } catch (error) {
    console.log(`⚠ Skipped ${dir.path} (not found or empty)`);
  }
}

console.log('\n✓ Subdirectory INDEX.md files generated');
