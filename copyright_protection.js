
// Copyright Protection
function protectCopyright() {
    const footerId = 'app-copyright';
    const expectedText = 'Copyright © 2026 Maulidi Zikri Nur';

    // Function to ensure footer exists and is correct
    const enforceFooter = () => {
        let footer = document.getElementById(footerId);

        // If missing, recreate specifically before nav
        if (!footer) {
            footer = document.createElement('footer');
            footer.id = footerId;
            footer.className = 'app-footer';

            // Try to find nav to insert before
            const nav = document.querySelector('.bottom-nav');
            if (nav && nav.parentNode) {
                nav.parentNode.insertBefore(footer, nav);
            } else {
                // Fallback: append to body or app-container
                const container = document.querySelector('.app-container') || document.body;
                container.appendChild(footer);
            }
        }

        // Enforce content and style
        if (footer.innerHTML !== expectedText) {
            footer.innerHTML = expectedText;
        }

        // Enforce basic styles inline as backup
        footer.style.userSelect = 'none';
        footer.style.pointerEvents = 'none';
        footer.style.display = 'block';
        footer.style.visibility = 'visible';
        footer.style.opacity = '1';
    };

    // Run initially
    enforceFooter();

    // Watch for changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Check if footer was removed or modified
            if (mutation.type === 'childList' ||
                (mutation.type === 'characterData' && mutation.target.parentNode.id === footerId) ||
                (mutation.target.id === footerId)) {
                enforceFooter();
            }
        });
    });

    // Observe body subtree
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'hidden']
    });

    // Prevent context menu on footer
    document.addEventListener('contextmenu', (e) => {
        if (e.target.id === footerId) {
            e.preventDefault();
        }
    });
}
