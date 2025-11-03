document.addEventListener('DOMContentLoaded', function() {
    console.log('Create Experience JS loaded');
    
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
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
        setup: function(editor) {
            editor.on('init', function() {
                console.log('TinyMCE initialized for:', editor.id);
            });
        }
    });

    // Currently Working Checkbox
    const currentlyWorkingCheckbox = document.querySelector('input[name="currently_working"]');
    const endDateInput = document.querySelector('input[name="end_date"]');

    if (currentlyWorkingCheckbox && endDateInput) {
        currentlyWorkingCheckbox.addEventListener('change', function() {
            if (this.checked) {
                endDateInput.value = '';
                endDateInput.disabled = true;
                endDateInput.style.opacity = '0.5';
            } else {
                endDateInput.disabled = false;
                endDateInput.style.opacity = '1';
            }
        });
    }

    // Company Logo Upload
    const logoUpload = document.getElementById('logo-upload');
    const logoInput = document.querySelector('input[name="company_logo"]');
    const logoPreview = document.getElementById('logo-preview');

    if (logoUpload && logoInput) {
        logoUpload.addEventListener('click', () => logoInput.click());
        
        logoUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            logoUpload.style.borderColor = 'var(--accent-blue)';
        });

        logoUpload.addEventListener('dragleave', () => {
            logoUpload.style.borderColor = '';
        });

        logoUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            logoUpload.style.borderColor = '';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                logoInput.files = dataTransfer.files;
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
    }

    // Workplace Images Upload (Max 5)
    const workplaceUpload = document.getElementById('workplace-upload');
    const workplaceInput = document.getElementById('workplace-input');
    const workplacePreview = document.getElementById('workplace-preview');
    let workplaceFiles = [];
    const MAX_WORKPLACE_IMAGES = 5;

    if (workplaceUpload && workplaceInput) {
        workplaceUpload.addEventListener('click', () => {
            if (workplaceFiles.length < MAX_WORKPLACE_IMAGES) {
                workplaceInput.click();
            } else {
                alert(`Maximum ${MAX_WORKPLACE_IMAGES} workplace images allowed.`);
            }
        });

        workplaceUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (workplaceFiles.length < MAX_WORKPLACE_IMAGES) {
                workplaceUpload.style.borderColor = 'var(--accent-blue)';
            }
        });

        workplaceUpload.addEventListener('dragleave', () => {
            workplaceUpload.style.borderColor = '';
        });

        workplaceUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            workplaceUpload.style.borderColor = '';
            if (workplaceFiles.length >= MAX_WORKPLACE_IMAGES) {
                alert(`Maximum ${MAX_WORKPLACE_IMAGES} workplace images allowed.`);
                return;
            }
            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            handleWorkplaceUpload(files);
        });

        workplaceInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            handleWorkplaceUpload(files);
        });

        function handleWorkplaceUpload(files) {
            const remainingSlots = MAX_WORKPLACE_IMAGES - workplaceFiles.length;
            const filesToAdd = files.slice(0, remainingSlots);
            
            if (files.length > remainingSlots) {
                alert(`Only ${remainingSlots} more image(s) can be added. Maximum ${MAX_WORKPLACE_IMAGES} images allowed.`);
            }

            filesToAdd.forEach(file => {
                workplaceFiles.push(file);
            });
            
            updateWorkplaceInput();
            renderWorkplaceImages();
        }

        function updateWorkplaceInput() {
            const dataTransfer = new DataTransfer();
            workplaceFiles.forEach(file => {
                dataTransfer.items.add(file);
            });
            workplaceInput.files = dataTransfer.files;
        }

        window.removeWorkplaceImage = function(index) {
            workplaceFiles.splice(index, 1);
            updateWorkplaceInput();
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
            workplacePreview.classList.add('active');
        }
    }

    // Form Submission
    const form = document.getElementById('create-experience-form');
    
    // Handle draft and publish buttons
    const draftBtn = form.querySelector('button[name="save_draft"]');
    const publishBtn = form.querySelector('button[name="publish"]');
    
    // Form validation function
    function validateForm() {
        const errors = [];
        
        // Check required fields
        const position = form.querySelector('input[name="position"]');
        const employmentType = form.querySelector('select[name="employment_type"]');
        const employmentStatus = form.querySelector('select[name="employment_status"]');
        const companyName = form.querySelector('input[name="company_name"]');
        const startDate = form.querySelector('input[name="start_date"]');
        const shortDescription = form.querySelector('textarea[name="short_description"]');
        
        if (!position || !position.value.trim()) {
            errors.push('Position/Role is required');
        }
        if (!employmentType || !employmentType.value) {
            errors.push('Employment Type is required');
        }
        if (!employmentStatus || !employmentStatus.value) {
            errors.push('Employment Status is required');
        }
        if (!companyName || !companyName.value.trim()) {
            errors.push('Company Name is required');
        }
        if (!startDate || !startDate.value) {
            errors.push('Start Date is required');
        }
        if (!shortDescription || !shortDescription.value.trim()) {
            errors.push('Short Description is required');
        }
        
        if (errors.length > 0) {
            alert('Please fill in all required fields:\n\n' + errors.join('\n'));
            return false;
        }
        
        return true;
    }
    
    if (draftBtn) {
        draftBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Draft button clicked');
            
            // Trigger TinyMCE save
            if (typeof tinymce !== 'undefined') {
                tinymce.triggerSave();
                console.log('TinyMCE content saved');
            }
            
            // Set is_draft to true
            let draftInput = form.querySelector('input[name="is_draft"]');
            if (!draftInput) {
                draftInput = document.createElement('input');
                draftInput.type = 'hidden';
                draftInput.name = 'is_draft';
                form.appendChild(draftInput);
            }
            draftInput.value = 'true';
            console.log('Submitting form as draft');
            form.submit();
        });
    }
    
    if (publishBtn) {
        publishBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Publish button clicked');
            
            // Validate form before submission
            if (!validateForm()) {
                return;
            }
            
            // Trigger TinyMCE save
            if (typeof tinymce !== 'undefined') {
                tinymce.triggerSave();
                console.log('TinyMCE content saved');
            }
            
            // Set is_draft to false
            let draftInput = form.querySelector('input[name="is_draft"]');
            if (!draftInput) {
                draftInput = document.createElement('input');
                draftInput.type = 'hidden';
                draftInput.name = 'is_draft';
                form.appendChild(draftInput);
            }
            draftInput.value = 'false';
            console.log('Submitting form as published');
            form.submit();
        });
    }

    form.addEventListener('submit', (e) => {
        console.log('Form submitting...');
        // Trigger TinyMCE save before form submission
        if (typeof tinymce !== 'undefined') {
            tinymce.triggerSave();
            console.log('TinyMCE content saved on submit');
        }
    });
});