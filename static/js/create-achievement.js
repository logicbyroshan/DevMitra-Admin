document.addEventListener('DOMContentLoaded', function() {
    // Initialize TinyMCE
    tinymce.init({
        selector: '.tinymce-editor',
        height: 400,
        menubar: false,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | formatselect | bold italic underline strikethrough | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | link image | ' +
            'forecolor backcolor | code fullscreen | help',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }'
    });

    // No Expiration Checkbox
    const noExpirationCheckbox = document.getElementById('no-expiration');
    const expirationInput = noExpirationCheckbox.closest('.form-group').querySelector('input[type="month"]');

    noExpirationCheckbox.addEventListener('change', function() {
        if (this.checked) {
            expirationInput.value = '';
            expirationInput.disabled = true;
        } else {
            expirationInput.disabled = false;
        }
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
                    <img src="${e.target.result}" alt="Achievement Badge">
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

    // Icon Selection
    const iconOptions = document.querySelectorAll('.icon-option');
    const selectedIconPreview = document.getElementById('selected-icon-preview');

    iconOptions.forEach(option => {
        option.addEventListener('click', function() {
            iconOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            const iconClass = this.dataset.icon;
            selectedIconPreview.innerHTML = `<i class="${iconClass}"></i>`;
        });
    });

    // Credential Method Toggle
    const credentialMethodRadios = document.querySelectorAll('input[name="credential-method"]');
    const credentialFileSection = document.getElementById('credential-file-section');
    const credentialLinkSection = document.getElementById('credential-link-section');

    credentialMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'file') {
                credentialFileSection.style.display = 'block';
                credentialLinkSection.style.display = 'none';
            } else {
                credentialFileSection.style.display = 'none';
                credentialLinkSection.style.display = 'block';
            }
        });
    });

    // Credential Upload
    const credentialUpload = document.getElementById('credential-upload');
    const credentialInput = credentialUpload.querySelector('input[type="file"]');
    const credentialPreview = document.getElementById('credential-preview');

    credentialUpload.addEventListener('click', () => credentialInput.click());
    
    credentialUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        credentialUpload.style.borderColor = 'var(--accent-color)';
    });

    credentialUpload.addEventListener('dragleave', () => {
        credentialUpload.style.borderColor = '';
    });

    credentialUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        credentialUpload.style.borderColor = '';
        const file = e.dataTransfer.files[0];
        if (file) {
            handleCredentialUpload(file);
        }
    });

    credentialInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleCredentialUpload(file);
        }
    });

    function handleCredentialUpload(file) {
        const fileName = file.name;
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        const fileType = file.type === 'application/pdf' ? 'pdf' : 'image';
        
        credentialPreview.innerHTML = `
            <div class="preview-image" style="max-width: 100%; text-align: center;">
                <div style="padding: 1.5rem; border: 1px solid var(--border-color); border-radius: 0.5rem; background: var(--card-bg);">
                    <i class="fas fa-file-${fileType}" style="font-size: 3rem; color: var(--accent-color);"></i>
                    <p style="margin-top: 1rem; font-weight: 500;">${fileName}</p>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">${fileSize} MB</p>
                    <button type="button" class="btn-secondary btn-sm" onclick="removeCredential()" style="margin-top: 1rem;">
                        <i class="fas fa-times"></i> Remove File
                    </button>
                </div>
            </div>
        `;
        credentialPreview.classList.add('active');
    }

    window.removeCredential = function() {
        credentialPreview.innerHTML = '';
        credentialPreview.classList.remove('active');
        credentialInput.value = '';
    };

    // Form Submission
    const form = document.getElementById('create-achievement-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get TinyMCE content
        const details = tinymce.get('achievement-details').getContent();

        // Show success message
        alert('Achievement created successfully!');
        // window.location.href = 'DevMitra-ManageAchievements.html';
    });
});
