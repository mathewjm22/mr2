# Medical Patient Presentation (MR2)

A single-page web application for structuring medical patient presentations. This tool helps healthcare professionals organize patient information in a standardized, efficient format.

## Features

### Three-Column Layout
- **Left Column (Patient History)**: HPI, PMH, PSH, FH, Medications
- **Middle Column (Clinical Assessment)**: Vitals, Physical Exam, Labs/Imaging Orders  
- **Right Column (Assessment & Plan)**: Patient One-Liner, Differential Diagnosis

### Interactive Editable Fields
- **Click-to-Edit**: Click any field to start editing
- **Enter-to-Save**: Press Enter to save your changes
- **Persistent Storage**: All data is automatically saved to local storage

### Differential Diagnosis Management
- **Add Diagnoses**: Type and press Enter or click "Add Diagnosis"
- **Drag-and-Drop Ranking**: Reorder diagnoses by dragging them
- **Auto-Numbering**: Rankings update automatically
- **Delete Function**: Remove diagnoses with the × button

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Adaptive layout that stacks columns on smaller screens

## Quick Start

1. Open `index.html` in any modern web browser
2. Click on any field to start adding patient information
3. Use the differential diagnosis section to build your ranked list
4. Data persists automatically between sessions

## Usage Example

1. **Patient One-Liner**: "45-year-old male with acute chest pain, concerning for acute coronary syndrome vs pulmonary embolism"
2. **HPI**: "45-year-old male presents with acute onset chest pain radiating to left arm..."
3. **Vitals**: "BP: 140/90, HR: 110, T: 98.6°F, RR: 22, O2 Sat: 94% on RA"
4. **Differential**: Rank your diagnoses by likelihood (drag to reorder)

## Technical Details

- Pure HTML5, CSS3, and JavaScript
- No external dependencies
- Local storage for data persistence
- Responsive CSS Grid layout
- Drag-and-drop API implementation

## Browser Compatibility

Works with all modern browsers including:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## Files

- `index.html` - Main application structure
- `styles.css` - Styling and responsive design
- `script.js` - Interactive functionality and data management