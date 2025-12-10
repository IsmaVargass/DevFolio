/* js/tutorial.js - Onboarding Tutorial System */

class TutorialSystem {
    constructor(steps) {
        this.steps = steps;
        this.currentStepIndex = 0;
        this.isActive = false;
        this.overlay = null;
        this.tooltip = null;

        this.init();
    }

    init() {
        this.createOverlay();
        this.createTooltip();

        // Check if tutorial should auto-start using simple boolean flag
        this.checkAutoStart();
    }

    checkAutoStart() {
        const shouldShow = localStorage.getItem('show_tutorial');
        console.log('Tutorial check (show_tutorial):', shouldShow);

        if (shouldShow === 'true') {
            console.log('Tutorial flag detected, starting...');
            // Don't remove the flag here - remove it when the tutorial actually starts
            // This prevents issues if auth-guard causes a page reload before the timeout

            // Use longer delay to ensure DOM is ready and auth-guard has finished
            setTimeout(() => {
                console.log('Executing start()');
                // Now it's safe to remove the flag since we're actually starting
                localStorage.removeItem('show_tutorial');
                this.start();
            }, 2000); // Increased delay to allow auth-guard to finish
        }
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        document.body.appendChild(this.overlay);
    }

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tutorial-tooltip';
        document.body.appendChild(this.tooltip);
    }

    start() {
        this.isActive = true;
        this.currentStepIndex = 0;
        this.overlay.classList.add('active');
        this.showStep();
    }

    showStep() {
        const step = this.steps[this.currentStepIndex];
        const element = document.querySelector(step.element);

        if (!element) {
            console.warn(`Tutorial element not found: ${step.element}`);
            this.nextStep();
            return;
        }

        this.highlightElement(element);
        this.updateTooltip(step, element);
    }

    highlightElement(element) {
        document.querySelectorAll('.tutorial-spotlight').forEach(el => {
            el.classList.remove('tutorial-spotlight');
        });
        element.classList.add('tutorial-spotlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    updateTooltip(step, element) {
        const rect = element.getBoundingClientRect();

        this.tooltip.innerHTML = `
            <div class="tutorial-header">
                <span class="tutorial-title">${step.title}</span>
                <button class="tutorial-close" onclick="tutorial.end()">×</button>
            </div>
            <div class="tutorial-content">${step.content}</div>
            <div class="tutorial-footer">
                <span class="tutorial-steps">Paso ${this.currentStepIndex + 1} de ${this.steps.length}</span>
                <div class="tutorial-actions">
                    ${this.currentStepIndex > 0 ?
                `<button class="btn-tutorial btn-tutorial-secondary" onclick="tutorial.prevStep()">Anterior</button>` : ''}
                    <button class="btn-tutorial btn-tutorial-primary" onclick="tutorial.nextStep()">
                        ${this.currentStepIndex === this.steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                    </button>
                </div>
            </div>
        `;

        let top, left;
        const spacing = 15;
        top = rect.bottom + window.scrollY + spacing;
        left = rect.left + window.scrollX + (rect.width / 2) - (300 / 2);

        if (left < 10) left = 10;
        if (left + 300 > window.innerWidth) left = window.innerWidth - 310;

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
        this.tooltip.className = 'tutorial-tooltip show bottom';
    }

    nextStep() {
        if (this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++;
            this.showStep();
        } else {
            this.end(true);
        }
    }

    prevStep() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.showStep();
        }
    }

    end(completed = false) {
        this.isActive = false;
        this.overlay.classList.remove('active');
        this.tooltip.classList.remove('show');

        document.querySelectorAll('.tutorial-spotlight').forEach(el => {
            el.classList.remove('tutorial-spotlight');
        });

        if (completed && window.showToast) {
            window.showToast('¡Tutorial completado! Disfruta de DevFolio.', 'success');
        }
    }

    restart() {
        localStorage.setItem('show_tutorial', 'true');
        window.location.reload();
    }
}

const dashboardSteps = [
    {
        element: '.dashboard-welcome',
        title: 'Bienvenido a DevFolio',
        content: 'Este es tu panel de control. Aquí podrás gestionar todo tu perfil profesional.'
    },
    {
        element: 'a[href="portfolio_builder.html"]',
        title: 'Crea tu Portfolio',
        content: 'Genera tu portfolio profesional en un clic cuando tengas toda tu información lista.'
    },
    {
        element: 'a[href="profile.html"]',
        title: 'Configura tu Perfil',
        content: 'Añade tu foto, biografía y redes sociales para personalizar tu presencia.'
    },
    {
        element: 'a[href="skills.html"]',
        title: 'Tus Habilidades',
        content: 'Muestra lo que sabes hacer. Añade tus skills técnicas y blandas.'
    },
    {
        element: 'a[href="experience.html"]',
        title: 'Añade Experiencia',
        content: 'Registra tu historial laboral y educación para que los reclutadores te conozcan.'
    },
    {
        element: 'a[href="communities.html"]',
        title: 'Únete a Comunidades',
        content: 'Conecta con otros profesionales y descubre ofertas de trabajo.'
    },
    {
        element: 'a[href="resources.html"]',
        title: 'Recursos',
        content: 'Accede a herramientas y recursos útiles para tu desarrollo profesional.'
    },
    {
        element: 'a[href="customer_support.html"]',
        title: 'Centro de Ayuda',
        content: 'Si tienes dudas o problemas, aquí encontrarás soporte y asistencia.'
    }
];

// Initialize
let tutorial;
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on dashboard by looking for a unique element
    // This is more robust than checking URL pathname
    if (document.querySelector('.dashboard-welcome')) {
        console.log('Dashboard detected, initializing tutorial system...');
        tutorial = new TutorialSystem(dashboardSteps);
        window.tutorial = tutorial; // Expose to global scope
    } else {
        console.log('Not on dashboard, skipping tutorial init.');
    }
});
