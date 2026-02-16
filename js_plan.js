// New Logic for Combobox
function setupPtnDropdownEventListeners() {
    // Uni Dropdown
    const uniInput = document.getElementById('ptn-uni-input');
    const uniDropdown = document.getElementById('ptn-uni-dropdown');

    // Focus/Click -> Open
    uniInput.addEventListener('focus', () => {
        openDropdown(uniDropdown);
        // Show all if empty, or filter if has text
        filterUni(uniInput.value);
    });

    uniInput.addEventListener('click', (e) => {
        e.stopPropagation();
        openDropdown(uniDropdown);
    });

    // Input -> Filter
    uniInput.addEventListener('input', (e) => {
        const val = e.target.value;
        openDropdown(uniDropdown); // Ensure open
        filterUni(val);
    });

    // Click Outside -> Close (handled by document click listener usually)

    // Major Dropdown
    const majorInput = document.getElementById('ptn-major-input');
    const majorDropdown = document.getElementById('ptn-major-dropdown');

    majorInput.addEventListener('focus', () => {
        if (!checkUniSelected()) return;
        openDropdown(majorDropdown);
        filterMajor(majorInput.value);
    });
    // ... similar logic
}

function filterUni(query) {
    // ... filtering logic adapted from existing code
}

function selectPtnOption(value, type) {
    // Set input value
    if (type === 'uni') {
        document.getElementById('ptn-uni-input').value = value;
        closeDropdown('ptn-uni-dropdown');
        // Reset major
        document.getElementById('ptn-major-input').value = '';
        populateMajorDropdown(value);
    }
    // ...
}
