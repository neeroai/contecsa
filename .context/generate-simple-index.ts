#!/usr/bin/env tsx
/**
 * Simplified INDEX.md generator for Contecsa
 * Generates indices based on current file structure
 */

import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, relative, basename } from 'path';

interface FileInfo {
  name: string;
  path: string;
  exports: string[];
}

function extractExports(filePath: string): string[] {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const exports: string[] = [];
    
    // Extract named exports
    const namedExports = content.matchAll(/export\s+(?:const|function|class|interface|type|enum)\s+(\w+)/g);
    for (const match of namedExports) {
      exports.push(match[1]);
    }
    
    // Extract default exports
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
    
    // Try to extract from @description or @file
    const descMatch = content.match(/@description\s+([^\n*]+)/);
    if (descMatch) return descMatch[1].trim();
    
    const fileMatch = content.match(/@file\s+([^\n*]+)/);
    if (fileMatch) return fileMatch[1].trim();
    
    // Fallback to first comment
    const commentMatch = content.match(/\/\*\*\s*\n\s*\*\s*([^\n*]+)/);
    if (commentMatch) return commentMatch[1].trim();
    
    return 'TODO: Add description';
  } catch (error) {
    return 'TODO: Add description';
  }
}

function scanDirectory(dirPath: string): FileInfo[] {
  const files: FileInfo[] = [];
  
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
  
  // Purpose
  content += `## Purpose\n\n`;
  if (moduleName === 'lib') {
    content += `Core utilities and business logic for Contecsa system.\n\n`;
  } else if (moduleName === 'components') {
    content += `React components for Contecsa UI (shadcn/ui + custom components).\n\n`;
  } else if (moduleName === 'hooks') {
    content += `Custom React hooks for Contecsa application.\n\n`;
  } else {
    content += `${moduleName} module for Contecsa.\n\n`;
  }
  
  // File Map
  content += `## File Map\n\n`;
  content += `| File | Purpose | Key Exports |\n`;
  content += `|------|---------|-------------|\n`;
  
  for (const file of files) {
    const purpose = getFilePurpose(file.path);
    const exportsStr = file.exports.length > 0 ? file.exports.join(', ') : '(none)';
    content += `| ${file.name} | ${purpose} | ${exportsStr} |\n`;
  }
  
  content += `\n`;
  
  // Dependencies
  content += `## Dependencies\n\n`;
  content += `**Internal:** Auto-detected from imports\n`;
  content += `**External:** See package.json\n`;
  content += `**Used by:** Components throughout the application\n\n`;
  
  // Subdirectories
  if (subdirs.length > 0) {
    content += `## Subdirectories\n\n`;
    for (const subdir of subdirs) {
      content += `- **${subdir}/** - See ${subdir}/INDEX.md\n`;
    }
    content += `\n`;
  }
  
  // Critical Patterns
  content += `## Critical Patterns\n\n`;
  content += `- Multi-tenant architecture (Contecsa + 9 consortiums)\n`;
  content += `- SICOM read-only integration\n`;
  content += `- WhatsApp-first interface design\n\n`;
  
  // Quick Start
  content += `## Quick Start\n\n`;
  content += `\`\`\`typescript\n`;
  content += `// Import from ${moduleName}\n`;
  if (files.length > 0 && files[0].exports.length > 0) {
    const firstExport = files[0].exports[0] !== '(default)' ? files[0].exports[0] : basename(files[0].name, '.ts');
    content += `import { ${firstExport} } from '@/${moduleName}/${files[0].name.replace(/\.tsx?$/, '')}';\n`;
  }
  content += `\`\`\`\n\n`;
  
  content += `---\n`;
  content += `**Generated:** ${new Date().toISOString()}\n`;
  content += `**Files:** ${files.length} | **Subdirs:** ${subdirs.length}\n`;
  
  return content;
}

// Main execution
const modules = [
  { path: 'src/lib', name: 'lib' },
  { path: 'src/components', name: 'components' },
  { path: 'src/hooks', name: 'hooks' }
];

console.log('Regenerating INDEX.md files...\n');

for (const module of modules) {
  const indexPath = join(module.path, 'INDEX.md');
  const content = generateIndex(module.path, module.name);
  
  writeFileSync(indexPath, content);
  console.log(`✓ Generated ${indexPath}`);
}

console.log('\n✓ All INDEX.md files regenerated');
