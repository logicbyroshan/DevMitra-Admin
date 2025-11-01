document.addEventListener('DOMContentLoaded', function() {
    // Proficiency Slider
    const proficiencyInput = document.getElementById('proficiency-input');
    const proficiencyFill = document.getElementById('proficiency-fill');
    const proficiencyValue = document.getElementById('proficiency-value');

    proficiencyInput.addEventListener('input', function() {
        const value = this.value;
        proficiencyFill.style.width = value + '%';
        proficiencyValue.textContent = value + '%';
    });

    // Icon Method Toggle
    const iconMethodRadios = document.querySelectorAll('input[name="icon-method"]');
    const iconUploadSection = document.getElementById('icon-upload-section');
    const iconFontAwesomeSection = document.getElementById('icon-fontawesome-section');

    iconMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'upload') {
                iconUploadSection.style.display = 'block';
                iconFontAwesomeSection.style.display = 'none';
            } else {
                iconUploadSection.style.display = 'none';
                iconFontAwesomeSection.style.display = 'block';
            }
        });
    });

    // Icon Upload
    const iconUpload = document.getElementById('icon-upload');
    const iconInput = iconUpload.querySelector('input[type="file"]');
    const iconPreview = document.getElementById('icon-preview');

    iconUpload.addEventListener('click', () => iconInput.click());
    
    iconUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        iconUpload.style.borderColor = 'var(--accent-color)';
    });

    iconUpload.addEventListener('dragleave', () => {
        iconUpload.style.borderColor = '';
    });

    iconUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        iconUpload.style.borderColor = '';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleIconUpload(file);
        }
    });

    iconInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleIconUpload(file);
        }
    });

    function handleIconUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            iconPreview.innerHTML = `
                <div class="preview-image">
                    <img src="${e.target.result}" alt="Skill Icon">
                    <button type="button" class="preview-remove" onclick="removeIcon()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            iconPreview.classList.add('active');
        };
        reader.readAsDataURL(file);
    }

    window.removeIcon = function() {
        iconPreview.innerHTML = '';
        iconPreview.classList.remove('active');
        iconInput.value = '';
    };

    // FontAwesome Icon Selection
    const faClassInput = document.getElementById('fa-class-input');
    const faIconPreview = document.getElementById('fa-icon-preview');
    const iconOptions = document.querySelectorAll('.icon-option');

    faClassInput.addEventListener('input', function() {
        const iconClass = this.value;
        faIconPreview.innerHTML = `<i class="${iconClass || 'fas fa-question'}"></i>`;
    });

    iconOptions.forEach(option => {
        option.addEventListener('click', function() {
            iconOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            const iconClass = this.dataset.icon;
            faClassInput.value = iconClass;
            faIconPreview.innerHTML = `<i class="${iconClass}"></i>`;
        });
    });

    // Certificate Method Toggle
    const certMethodRadios = document.querySelectorAll('input[name="cert-method"]');
    const certFileSection = document.getElementById('cert-file-section');
    const certLinkSection = document.getElementById('cert-link-section');

    certMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'file') {
                certFileSection.style.display = 'block';
                certLinkSection.style.display = 'none';
            } else {
                certFileSection.style.display = 'none';
                certLinkSection.style.display = 'block';
            }
        });
    });

    // Certificate Upload
    const certUpload = document.getElementById('cert-upload');
    const certInput = certUpload.querySelector('input[type="file"]');
    const certPreview = document.getElementById('cert-preview');

    certUpload.addEventListener('click', () => certInput.click());
    
    certUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        certUpload.style.borderColor = 'var(--accent-color)';
    });

    certUpload.addEventListener('dragleave', () => {
        certUpload.style.borderColor = '';
    });

    certUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        certUpload.style.borderColor = '';
        const file = e.dataTransfer.files[0];
        if (file) {
            handleCertUpload(file);
        }
    });

    certInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleCertUpload(file);
        }
    });

    function handleCertUpload(file) {
        const fileName = file.name;
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        certPreview.innerHTML = `
            <div class="preview-image" style="max-width: 100%; text-align: center;">
                <div style="padding: 1rem; border: 1px solid var(--border-color); border-radius: 0.5rem; background: var(--card-bg);">
                    <i class="fas fa-file-${file.type === 'application/pdf' ? 'pdf' : 'image'}" style="font-size: 2rem; color: var(--accent-color);"></i>
                    <p style="margin-top: 0.5rem; font-weight: 500;">${fileName}</p>
                    <p style="font-size: 0.85rem; color: var(--text-secondary);">${fileSize} MB</p>
                </div>
                <button type="button" class="preview-remove" onclick="removeCert()" style="position: relative; margin-top: 1rem;">
                    <i class="fas fa-times"></i> Remove
                </button>
            </div>
        `;
        certPreview.classList.add('active');
    }

    window.removeCert = function() {
        certPreview.innerHTML = '';
        certPreview.classList.remove('active');
        certInput.value = '';
    };

    // Form Submission
    const form = document.getElementById('create-skill-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Skill created successfully!');
        // window.location.href = 'DevMitra-ManageSkills.html';
    });
});
