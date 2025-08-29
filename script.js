/**
 * CV Harvard Style - Professional PDF Generation
 * Ignacio Muñoz - DevOps & Cloud Professional
 */

// Enhanced PDF download function - Single Page Optimized
function downloadPDF() {
    // Track print attempt
    trackCVInteraction('print_attempt');
    
    // Create optimized styles for printing
    const printStyles = `
        <style>
            @page { 
                size: A4; 
                margin: 0.4in 0.5in; 
            }
            * { 
                font-size: 9pt !important; 
                line-height: 1.2 !important; 
            }
            body { 
                margin: 0 !important; 
                padding: 0 !important; 
                max-width: none !important; 
            }
            .download-btn { 
                display: none !important; 
            }
            .header h1 { 
                font-size: 14pt !important; 
            }
            .section { 
                margin-bottom: 8pt !important; 
                page-break-inside: avoid !important; 
            }
            .section h2 { 
                font-size: 10pt !important; 
                margin-bottom: 4pt !important; 
            }
            .job-description { 
                font-size: 8pt !important; 
                margin-left: 8pt !important; 
            }
            .skills-grid { 
                gap: 4pt !important; 
            }
            .skill-list { 
                font-size: 7pt !important; 
            }
        </style>
    `;
    
    // Hide download button temporarily
    const downloadBtn = document.querySelector('.download-btn');
    const originalDisplay = downloadBtn ? downloadBtn.style.display : '';
    if (downloadBtn) {
        downloadBtn.style.display = 'none';
    }
    
    // Add print styles to document
    const styleElement = document.createElement('style');
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);
    
    // Add print class to body for additional styling
    document.body.classList.add('printing');
    
    // Configure print settings
    const originalTitle = document.title;
    document.title = 'CV_Ignacio_Munoz_DevOps';
    
    // Trigger print dialog
    window.print();
    
    // Cleanup after print
    setTimeout(() => {
        // Remove print styles
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
        }
        
        // Restore button
        if (downloadBtn) {
            downloadBtn.style.display = originalDisplay;
        }
        
        // Remove print class
        document.body.classList.remove('printing');
        
        // Restore title
        document.title = originalTitle;
        
        trackCVInteraction('print_complete');
    }, 500);
}

// Print optimization
function optimizeForPrint() {
    // Ensure content fits on one page
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.pageBreakInside = 'avoid';
    });
    
    // Optimize spacing for print
    const container = document.querySelector('.container');
    if (container) {
        container.style.fontSize = '10pt';
        container.style.lineHeight = '1.3';
    }
}

// ATS-friendly text extraction
function extractTextForATS() {
    const textContent = {
        name: document.querySelector('.header h1')?.textContent || '',
        title: document.querySelector('.subtitle')?.textContent || '',
        summary: document.querySelector('.section p')?.textContent || '',
        skills: [],
        experience: []
    };
    
    // Extract skills
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        const categoryName = category.querySelector('h3')?.textContent || '';
        const skills = category.querySelector('.skill-list')?.textContent || '';
        textContent.skills.push({ category: categoryName, skills: skills });
    });
    
    // Extract experience
    const experiences = document.querySelectorAll('.experience-item');
    experiences.forEach(exp => {
        const title = exp.querySelector('.job-title')?.textContent || '';
        const company = exp.querySelector('.company')?.textContent || '';
        const date = exp.querySelector('.date-location')?.textContent || '';
        textContent.experience.push({ title, company, date });
    });
    
    return textContent;
}

// Enhanced analytics tracking
function trackCVInteraction(action, details = {}) {
    const eventData = {
        action: action,
        timestamp: new Date().toISOString(),
        page: 'CV',
        user_agent: navigator.userAgent,
        details: details
    };
    
    // Log to console (can be replaced with actual analytics)
    console.log('CV Interaction:', eventData);
    
    // Could integrate with Google Analytics, etc.
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: 'CV',
            event_label: JSON.stringify(details)
        });
    }
}

// Accessibility improvements
function enhanceAccessibility() {
    // Add ARIA labels
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        const heading = section.querySelector('h2');
        if (heading) {
            const sectionId = `section-${index}`;
            section.setAttribute('aria-labelledby', sectionId);
            heading.id = sectionId;
        }
    });
    
    // Add skip navigation
    const skipNav = document.createElement('a');
    skipNav.href = '#main-content';
    skipNav.textContent = 'Skip to main content';
    skipNav.className = 'skip-nav';
    skipNav.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
    `;
    skipNav.addEventListener('focus', () => {
        skipNav.style.top = '6px';
    });
    skipNav.addEventListener('blur', () => {
        skipNav.style.top = '-40px';
    });
    
    document.body.insertBefore(skipNav, document.body.firstChild);
    
    // Add main content landmark
    const container = document.querySelector('.container');
    if (container) {
        container.id = 'main-content';
        container.setAttribute('role', 'main');
    }
}

// Performance optimization
function optimizePerformance() {
    // Lazy load non-critical elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    });
    
    // Observe sections for animation
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// PDF quality check
function validatePDFLayout() {
    const container = document.querySelector('.container');
    if (!container) return false;
    
    const containerHeight = container.offsetHeight;
    const pageHeight = 11 * 72; // 11 inches in points
    
    if (containerHeight > pageHeight) {
        console.warn('Content may not fit on one page. Consider reducing content or font size.');
        return false;
    }
    
    return true;
}

// Initialize CV functionality
function initializeCV() {
    // Track page load
    trackCVInteraction('page_load', {
        referrer: document.referrer,
        timestamp: Date.now()
    });
    
    // Optimize for print
    optimizeForPrint();
    
    // Enhance accessibility
    enhanceAccessibility();
    
    // Optimize performance
    optimizePerformance();
    
    // Validate layout
    validatePDFLayout();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + P for print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            downloadPDF();
            trackCVInteraction('keyboard_print');
        }
        
        // Ctrl/Cmd + S for save (redirect to print)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            downloadPDF();
            trackCVInteraction('keyboard_save');
        }
    });
    
    // Track print events
    window.addEventListener('beforeprint', () => {
        trackCVInteraction('print_start');
    });
    
    window.addEventListener('afterprint', () => {
        trackCVInteraction('print_complete');
    });
    
    console.log('CV initialized successfully - ATS optimized, print ready');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCV);
} else {
    initializeCV();
}

// Export functions for global use
window.CVApp = {
    downloadPDF,
    optimizeForPrint,
    extractTextForATS,
    trackCVInteraction,
    validatePDFLayout
};
