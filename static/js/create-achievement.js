document.addEventListener('DOMContentLoaded', function() {
    // Icon Method Toggle
    const iconMethodRadios = document.querySelectorAll('input[name="icon_method"]');
    const iconUploadSection = document.getElementById('icon-upload-section');
    const iconFontAwesomeSection = document.getElementById('icon-fontawesome-section');
    const iconTypeInput = document.querySelector('input[name="icon_type"]');
    iconMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'upload') {
                iconUploadSection.style.display = 'block';
                iconFontAwesomeSection.style.display = 'none';
                if (iconTypeInput) iconTypeInput.value = 'upload';
            } else {
                iconUploadSection.style.display = 'none';
                iconFontAwesomeSection.style.display = 'block';
                if (iconTypeInput) iconTypeInput.value = 'fontawesome';
            }
        });
    });
    // Icon Upload
    const iconUpload = document.getElementById('icon-upload');
    const iconInput = document.querySelector('input[name="icon_image"]');
    const iconPreview = document.getElementById('icon-preview');
    if (iconUpload && iconInput) {
        iconUpload.addEventListener('click', () => iconInput.click());
        iconUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            iconUpload.style.borderColor = 'var(--accent-blue)';
        });
        iconUpload.addEventListener('dragleave', () => {
            iconUpload.style.borderColor = '';
        });
        iconUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            iconUpload.style.borderColor = '';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                iconInput.files = dataTransfer.files;
                handleIconUpload(file);
            }
        });
        iconInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleIconUpload(file);
            }
        });
    }
    function handleIconUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            iconPreview.innerHTML = '<div class="preview-image"><img src="' + e.target.result + '" alt="Achievement Badge"><button type="button" class="preview-remove" onclick="removeIcon()"><i class="fas fa-times"></i></button></div>';
            iconPreview.classList.add('active');
        };
        reader.readAsDataURL(file);
    }
    window.removeIcon = function() {
        iconPreview.innerHTML = '';
        iconPreview.classList.remove('active');
        if (iconInput) iconInput.value = '';
    };
    // FontAwesome Icon Selection
    const iconOptions = document.querySelectorAll('.icon-option');
    const iconClassInput = document.querySelector('input[name="icon_class"]');
    const selectedIconPreview = document.getElementById('selected-icon-preview');
    iconOptions.forEach(option => {
        option.addEventListener('click', function() {
            iconOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            const iconClass = this.dataset.icon;
            if (iconClassInput) iconClassInput.value = iconClass;
            if (selectedIconPreview) {
                selectedIconPreview.innerHTML = '<i class="' + iconClass + '"></i>';
            }
        });
    });
    // Credential Method Toggle
    const credentialMethodRadios = document.querySelectorAll('input[name="credential_method"]');
    const credentialFileSection = document.getElementById('credential-file-section');
    const credentialLinkSection = document.getElementById('credential-link-section');
    const credentialTypeInput = document.querySelector('input[name="credential_type"]');
    credentialMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'file') {
                credentialFileSection.style.display = 'block';
                credentialLinkSection.style.display = 'none';
                if (credentialTypeInput) credentialTypeInput.value = 'file';
            } else {
                credentialFileSection.style.display = 'none';
                credentialLinkSection.style.display = 'block';
                if (credentialTypeInput) credentialTypeInput.value = 'link';
            }
        });
    });
    // Credential Upload
    const credentialUpload = document.getElementById('credential-upload');
    const credentialInput = document.querySelector('input[name="credential_file"]');
    const credentialPreview = document.getElementById('credential-preview');
    if (credentialUpload && credentialInput) {
        credentialUpload.addEventListener('click', () => credentialInput.click());
        credentialUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            credentialUpload.style.borderColor = 'var(--accent-blue)';
        });
        credentialUpload.addEventListener('dragleave', () => {
            credentialUpload.style.borderColor = '';
        });
        credentialUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            credentialUpload.style.borderColor = '';
            const file = e.dataTransfer.files[0];
            if (file) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                credentialInput.files = dataTransfer.files;
                handleCredentialUpload(file);
            }
        });
        credentialInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleCredentialUpload(file);
            }
        });
    }
    function handleCredentialUpload(file) {
        const isPDF = file.type === 'application/pdf';
        const isImage = file.type.startsWith('image/');
        if (isPDF) {
            credentialPreview.innerHTML = '<div class="preview-document"><i class="fas fa-file-pdf"></i><span>' + file.name + '</span><button type="button" class="preview-remove" onclick="removeCredential()"><i class="fas fa-times"></i></button></div>';
            credentialPreview.classList.add('active');
        } else if (isImage) {
            const reader = new FileReader();
            reader.onload = (e) => {
                credentialPreview.innerHTML = '<div class="preview-image"><img src="' + e.target.result + '" alt="Credential"><button type="button" class="preview-remove" onclick="removeCredential()"><i class="fas fa-times"></i></button></div>';
                credentialPreview.classList.add('active');
            };
            reader.readAsDataURL(file);
        }
    }
    window.removeCredential = function() {
        credentialPreview.innerHTML = '';
        credentialPreview.classList.remove('active');
        if (credentialInput) credentialInput.value = '';
    };
    
    // Form submission handling
    const form = document.getElementById('create-achievement-form');
    const isActiveInput = document.querySelector('input[name="is_active"]');
    const isDraftInput = document.querySelector('input[name="is_draft"]');
    
    // Handle form submission based on which button was clicked
    form.addEventListener('submit', function(e) {
        const submitter = e.submitter;
        
        if (submitter && submitter.value === 'draft') {
            // Save as draft
            if (isDraftInput) isDraftInput.value = 'True';
            if (isActiveInput) isActiveInput.value = 'False';
        } else if (submitter && submitter.value === 'publish') {
            // Publish (active)
            if (isDraftInput) isDraftInput.value = 'False';
            if (isActiveInput) isActiveInput.value = 'True';
        }
    });
    
    // No expiration checkbox handler
    const noExpirationCheckbox = document.getElementById('no-expiration');
    const expirationInput = document.querySelector('input[name="expiration_date"]');
    
    if (noExpirationCheckbox && expirationInput) {
        noExpirationCheckbox.addEventListener('change', function() {
            if (this.checked) {
                expirationInput.value = '';
                expirationInput.disabled = true;
                expirationInput.style.opacity = '0.5';
            } else {
                expirationInput.disabled = false;
                expirationInput.style.opacity = '1';
            }
        });
    }
    
    // Fade-in animations
    const sections = document.querySelectorAll('.section-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    sections.forEach(section => {
        observer.observe(section);
    });
});
