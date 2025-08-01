# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Manoj Kumar Reddy Palasamudram, built as a static HTML/CSS/JavaScript site with a minimalist Apple-inspired design aesthetic.

## Architecture

### Core Files Structure
- `index.html`: Single-page portfolio with semantic sections (hero, about, experience, projects, skills, education, contact)
- `style.css`: Comprehensive CSS with CSS custom properties, responsive design, and subtle animations
- `script.js`: Vanilla JavaScript for scroll-triggered animations and active navigation highlighting
- `resume/main.tex`: LaTeX resume source file

### Design System
The site uses a custom design system built with CSS custom properties:
- **Typography**: Inter font family with carefully defined font weights and sizes
- **Color Palette**: Apple-inspired neutral colors with CSS variables (--bg-color, --text-color-primary, etc.)
- **Spacing**: Consistent spacing system using --space-unit (8px base) with multipliers
- **Animations**: Subtle scroll-triggered animations using Intersection Observer API

### JavaScript Architecture
- Uses vanilla JavaScript with Intersection Observer for performance-optimized scroll animations
- Two separate observers: one for section visibility animations, another for navigation highlighting
- No external dependencies or frameworks

## Development Workflow

### Making Changes
1. **Content Updates**: Edit the HTML directly in `index.html` for content changes
2. **Styling**: Modify `style.css` - leverage existing CSS custom properties for consistency
3. **Interactive Features**: Extend `script.js` for additional JavaScript functionality

### Testing Changes
- Open `index.html` directly in a browser for local testing
- No build process required - this is a static site

### Resume Updates
- Edit `resume/main.tex` for resume changes
- Requires LaTeX compiler (pdflatex) to generate PDF output

## Code Conventions

### CSS
- Use existing CSS custom properties (--space-*, --text-color-*, etc.) for consistency
- Follow the established responsive design patterns (mobile-first approach)
- Maintain the Apple-inspired minimalist aesthetic
- All animations should be subtle and performance-conscious

### JavaScript
- Use vanilla JavaScript without external dependencies
- Follow existing patterns for Intersection Observer usage
- Maintain performance-first approach (unobserve elements after animation)

### HTML
- Maintain semantic structure with proper sectioning elements
- Use existing class naming conventions (.job-entry, .project-entry, etc.)
- Keep accessibility considerations (focus-visible styles are implemented)

## Key Features to Preserve

1. **Sticky Navigation**: Header with active link highlighting based on scroll position
2. **Scroll Animations**: Subtle fade-in and slide-up animations for sections and content
3. **Responsive Design**: Mobile-first responsive layout with breakpoints at 768px and 480px
4. **Apple-Inspired Aesthetics**: Clean typography, subtle borders, minimal shadows
5. **Performance**: Optimized animations and intersection observers for smooth scrolling

## Resume Integration

The LaTeX resume (`resume/main.tex`) contains the same professional information as the HTML portfolio but in a printable format. Keep content synchronized between both formats when making updates.