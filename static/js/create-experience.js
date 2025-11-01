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

    // Currently Working Checkbox
    const currentlyWorkingCheckbox = document.getElementById('currently-working');
    const endDateInput = document.getElementById('end-date');

    currentlyWorkingCheckbox.addEventListener('change', function() {
        if (this.checked) {
            endDateInput.value = '';
            endDateInput.disabled = true;
        } else {
            endDateInput.disabled = false;
        }
    });

    // Company Logo Upload
    const logoUpload = document.getElementById('logo-upload');
    const logoInput = logoUpload.querySelector('input[type="file"]');
    const logoPreview = document.getElementById('logo-preview');

    logoUpload.addEventListener('click', () => logoInput.click());
    
    logoUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        logoUpload.style.borderColor = 'var(--accent-color)';
    });

    logoUpload.addEventListener('dragleave', () => {
        logoUpload.style.borderColor = '';
    });

    logoUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        logoUpload.style.borderColor = '';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleLogoUpload(file);
        }
    });

    logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleLogoUpload(file);
        }
    });

    function handleLogoUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            logoPreview.innerHTML = `
                <div class="preview-image">
                    <img src="${e.target.result}" alt="Company Logo">
                    <button type="button" class="preview-remove" onclick="removeLogo()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            logoPreview.classList.add('active');
        };
        reader.readAsDataURL(file);
    }

    window.removeLogo = function() {
        logoPreview.innerHTML = '';
        logoPreview.classList.remove('active');
        logoInput.value = '';
    };

    // Workplace Images Upload
    const workplaceUpload = document.getElementById('workplace-upload');
    const workplaceInput = workplaceUpload.querySelector('input[type="file"]');
    const workplacePreview = document.getElementById('workplace-preview');
    let workplaceFiles = [];

    workplaceUpload.addEventListener('click', () => workplaceInput.click());

    workplaceUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        workplaceUpload.style.borderColor = 'var(--accent-color)';
    });

    workplaceUpload.addEventListener('dragleave', () => {
        workplaceUpload.style.borderColor = '';
    });

    workplaceUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        workplaceUpload.style.borderColor = '';
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        handleWorkplaceUpload(files);
    });

    workplaceInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleWorkplaceUpload(files);
    });

    function handleWorkplaceUpload(files) {
        files.forEach(file => {
            workplaceFiles.push(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const index = workplaceFiles.length - 1;
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Workplace">
                    <button type="button" class="preview-remove" onclick="removeWorkplaceImage(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                workplacePreview.appendChild(previewItem);
                workplacePreview.classList.add('active');
            };
            reader.readAsDataURL(file);
        });
    }

    window.removeWorkplaceImage = function(index) {
        workplaceFiles.splice(index, 1);
        renderWorkplaceImages();
    };

    function renderWorkplaceImages() {
        workplacePreview.innerHTML = '';
        if (workplaceFiles.length === 0) {
            workplacePreview.classList.remove('active');
            return;
        }
        workplaceFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Workplace">
                    <button type="button" class="preview-remove" onclick="removeWorkplaceImage(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                workplacePreview.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    // Form Submission
    const form = document.getElementById('create-experience-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get TinyMCE content
        const details = tinymce.get('experience-details').getContent();
        
        // Validate
        if (!details) {
            alert('Please add detailed experience description');
            return;
        }

        // Show success message
        alert('Experience created successfully!');
        // Redirect or reset form
        // window.location.href = 'DevMitra-ManageExperience.html';
    });
});
