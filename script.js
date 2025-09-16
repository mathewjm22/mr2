// Medical Patient Presentation App JavaScript

class MedicalPresentation {
    constructor() {
        this.diagnosisCounter = 0;
        this.currentEditingField = null;
        this.init();
    }

    init() {
        this.setupEditableFields();
        this.setupDifferentialDiagnosis();
        this.loadData();
    }

    // Setup editable fields functionality
    setupEditableFields() {
        const editableFields = document.querySelectorAll('.editable-field');
        
        editableFields.forEach(field => {
            const content = field.querySelector('.field-content');
            const input = field.querySelector('.field-input');
            
            // Click to edit
            field.addEventListener('click', () => {
                if (!field.classList.contains('editing')) {
                    this.startEditing(field);
                }
            });
            
            // Handle Enter key to save
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.stopEditing(field);
                } else if (e.key === 'Escape') {
                    this.cancelEditing(field);
                }
            });
            
            // Handle blur to save
            input.addEventListener('blur', () => {
                setTimeout(() => {
                    if (field.classList.contains('editing')) {
                        this.stopEditing(field);
                    }
                }, 100);
            });
        });
    }

    startEditing(field) {
        if (this.currentEditingField && this.currentEditingField !== field) {
            this.stopEditing(this.currentEditingField);
        }
        
        this.currentEditingField = field;
        const content = field.querySelector('.field-content');
        const input = field.querySelector('.field-input');
        const placeholder = field.dataset.placeholder;
        
        field.classList.add('editing');
        
        // Set input value to current content (if not placeholder)
        if (content.textContent === placeholder) {
            input.value = '';
        } else {
            input.value = content.textContent;
        }
        
        content.style.display = 'none';
        input.style.display = 'block';
        input.focus();
        input.select();
    }

    stopEditing(field) {
        const content = field.querySelector('.field-content');
        const input = field.querySelector('.field-input');
        const placeholder = field.dataset.placeholder;
        
        field.classList.remove('editing');
        
        // Update content
        const newValue = input.value.trim();
        if (newValue) {
            content.textContent = newValue;
            content.classList.remove('placeholder');
        } else {
            content.textContent = placeholder;
            content.classList.add('placeholder');
        }
        
        content.style.display = 'block';
        input.style.display = 'none';
        
        this.currentEditingField = null;
        this.saveData();
    }

    cancelEditing(field) {
        const content = field.querySelector('.field-content');
        const input = field.querySelector('.field-input');
        
        field.classList.remove('editing');
        content.style.display = 'block';
        input.style.display = 'none';
        
        this.currentEditingField = null;
    }

    // Setup differential diagnosis functionality
    setupDifferentialDiagnosis() {
        const addBtn = document.getElementById('add-diagnosis-btn');
        const newDiagnosisInput = document.getElementById('new-diagnosis');
        const diagnosisList = document.getElementById('diagnosis-list');
        
        // Add diagnosis button
        addBtn.addEventListener('click', () => {
            this.addDiagnosis();
        });
        
        // Enter key to add diagnosis
        newDiagnosisInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addDiagnosis();
            }
        });
        
        // Setup drag and drop
        this.setupDragAndDrop();
    }

    addDiagnosis() {
        const newDiagnosisInput = document.getElementById('new-diagnosis');
        const diagnosisText = newDiagnosisInput.value.trim();
        
        if (!diagnosisText) return;
        
        const diagnosisItem = this.createDiagnosisItem(diagnosisText);
        const diagnosisList = document.getElementById('diagnosis-list');
        
        diagnosisList.appendChild(diagnosisItem);
        newDiagnosisInput.value = '';
        
        this.updateDiagnosisRanks();
        this.saveData();
    }

    createDiagnosisItem(text) {
        const li = document.createElement('li');
        li.className = 'diagnosis-item';
        li.draggable = true;
        li.dataset.id = ++this.diagnosisCounter;
        
        li.innerHTML = `
            <span class="diagnosis-rank">1</span>
            <span class="diagnosis-text">${this.escapeHtml(text)}</span>
            <button class="delete-diagnosis" onclick="medicalApp.deleteDiagnosis(this)">×</button>
        `;
        
        return li;
    }

    deleteDiagnosis(button) {
        const diagnosisItem = button.closest('.diagnosis-item');
        diagnosisItem.remove();
        this.updateDiagnosisRanks();
        this.saveData();
    }

    updateDiagnosisRanks() {
        const diagnosisItems = document.querySelectorAll('.diagnosis-item');
        diagnosisItems.forEach((item, index) => {
            const rank = item.querySelector('.diagnosis-rank');
            rank.textContent = index + 1;
        });
    }

    setupDragAndDrop() {
        const diagnosisList = document.getElementById('diagnosis-list');
        let draggedElement = null;
        let placeholder = null;
        
        diagnosisList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('diagnosis-item')) {
                draggedElement = e.target;
                e.target.classList.add('dragging');
                
                // Create placeholder
                placeholder = document.createElement('li');
                placeholder.className = 'drop-indicator';
                placeholder.style.height = e.target.offsetHeight + 'px';
            }
        });
        
        diagnosisList.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('diagnosis-item')) {
                e.target.classList.remove('dragging');
                if (placeholder && placeholder.parentNode) {
                    placeholder.remove();
                }
                draggedElement = null;
                placeholder = null;
                this.updateDiagnosisRanks();
                this.saveData();
            }
        });
        
        diagnosisList.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!draggedElement) return;
            
            const afterElement = this.getDragAfterElement(diagnosisList, e.clientY);
            
            if (placeholder) {
                if (afterElement == null) {
                    diagnosisList.appendChild(placeholder);
                } else {
                    diagnosisList.insertBefore(placeholder, afterElement);
                }
                placeholder.classList.add('visible');
            }
        });
        
        diagnosisList.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedElement || !placeholder) return;
            
            // Replace placeholder with dragged element
            placeholder.parentNode.replaceChild(draggedElement, placeholder);
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.diagnosis-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Data persistence
    saveData() {
        const data = {
            fields: {},
            diagnoses: []
        };
        
        // Save field data
        const editableFields = document.querySelectorAll('.editable-field');
        editableFields.forEach(field => {
            const fieldName = field.dataset.field;
            const content = field.querySelector('.field-content');
            const placeholder = field.dataset.placeholder;
            
            if (content.textContent !== placeholder) {
                data.fields[fieldName] = content.textContent;
            }
        });
        
        // Save diagnosis data
        const diagnosisItems = document.querySelectorAll('.diagnosis-item');
        diagnosisItems.forEach(item => {
            const text = item.querySelector('.diagnosis-text').textContent;
            data.diagnoses.push(text);
        });
        
        localStorage.setItem('medicalPresentation', JSON.stringify(data));
    }

    loadData() {
        const savedData = localStorage.getItem('medicalPresentation');
        if (!savedData) return;
        
        try {
            const data = JSON.parse(savedData);
            
            // Load field data
            Object.entries(data.fields || {}).forEach(([fieldName, value]) => {
                const field = document.querySelector(`[data-field="${fieldName}"]`);
                if (field) {
                    const content = field.querySelector('.field-content');
                    content.textContent = value;
                    content.classList.remove('placeholder');
                }
            });
            
            // Load diagnosis data
            if (data.diagnoses && data.diagnoses.length > 0) {
                const diagnosisList = document.getElementById('diagnosis-list');
                data.diagnoses.forEach(diagnosis => {
                    const diagnosisItem = this.createDiagnosisItem(diagnosis);
                    diagnosisList.appendChild(diagnosisItem);
                });
                this.updateDiagnosisRanks();
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }

    // Utility function to escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Clear all data
    clearAll() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.removeItem('medicalPresentation');
            location.reload();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.medicalApp = new MedicalPresentation();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+S to save (already auto-saves, but gives user feedback)
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        window.medicalApp.saveData();
        
        // Show brief save indicator
        const indicator = document.createElement('div');
        indicator.textContent = 'Saved!';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: fadeOut 2s forwards;
        `;
        
        document.body.appendChild(indicator);
        setTimeout(() => indicator.remove(), 2000);
    }
});

// Add CSS animation for save indicator
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: translateY(0); }
        70% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);