document.addEventListener('DOMContentLoaded', function() {
    // Initialize TinyMCE for documentation field only
    if (typeof tinymce !== 'undefined') {
        tinymce.init({
            selector: '#id_documentation',
            height: 400,
            menubar: false,
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | formatselect | bold italic underline strikethrough | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | link image | ' +
                'forecolor backcolor | code fullscreen | help',
            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; color: #e0e0e0; background-color: #1a1a1a; }',
            skin: 'oxide-dark',
            content_css: 'dark'
        });
    }

    // Global function to clear thumbnail
    window.clearThumbnail = function() {
        const thumbnailPreview = document.getElementById('thumbnail-preview');
        const thumbnailInput = document.getElementById('id_thumbnail');
        if (thumbnailPreview) {
            thumbnailPreview.innerHTML = '';
            thumbnailPreview.classList.remove('active');
        }
        if (thumbnailInput) {
            thumbnailInput.value = '';
        }
    };

    // Thumbnail Upload
    const thumbnailUploadArea = document.getElementById('thumbnail-upload-area');
    const thumbnailInput = document.getElementById('id_thumbnail');
    const thumbnailPreview = document.getElementById('thumbnail-preview');

    if (thumbnailUploadArea && thumbnailInput) {
        thumbnailUploadArea.addEventListener('click', () => thumbnailInput.click());
        
        thumbnailUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            thumbnailUploadArea.style.borderColor = 'var(--accent-blue)';
        });

        thumbnailUploadArea.addEventListener('dragleave', () => {
            thumbnailUploadArea.style.borderColor = '';
        });

        thumbnailUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            thumbnailUploadArea.style.borderColor = '';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                thumbnailInput.files = dataTransfer.files;
                handleThumbnailUpload(file);
            }
        });

        thumbnailInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleThumbnailUpload(file);
            }
        });
    }

    function handleThumbnailUpload(file) {
        if (thumbnailPreview) {
            const reader = new FileReader();
            reader.onload = (e) => {
                thumbnailPreview.innerHTML = `
                    <div class="preview-image">
                        <img src="${e.target.result}" alt="Thumbnail">
                        <button type="button" class="preview-remove" onclick="clearThumbnail()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                thumbnailPreview.classList.add('active');
            };
            reader.readAsDataURL(file);
        }
    }

    // Screenshots Upload
    const screenshotsUploadArea = document.getElementById('screenshots-upload-area');
    const screenshotsInput = document.getElementById('screenshots-input');
    const screenshotsPreview = document.getElementById('screenshots-preview');
    let screenshotFiles = [];

    if (screenshotsUploadArea && screenshotsInput) {
        screenshotsUploadArea.addEventListener('click', () => screenshotsInput.click());

        screenshotsUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            screenshotsUploadArea.style.borderColor = 'var(--accent-blue)';
        });

        screenshotsUploadArea.addEventListener('dragleave', () => {
            screenshotsUploadArea.style.borderColor = '';
        });

        screenshotsUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            screenshotsUploadArea.style.borderColor = '';
            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            handleScreenshotsUpload(files);
        });

        screenshotsInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            handleScreenshotsUpload(files);
        });
    }

    function handleScreenshotsUpload(files) {
        files.forEach(file => {
            screenshotFiles.push(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const index = screenshotFiles.length - 1;
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.dataset.index = index;
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Screenshot">
                    <button type="button" class="preview-remove">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                // Add remove functionality
                previewItem.querySelector('.preview-remove').addEventListener('click', function() {
                    removeScreenshot(index);
                });
                
                screenshotsPreview.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    function removeScreenshot(index) {
        screenshotFiles.splice(index, 1);
        renderScreenshots();
    }

    function renderScreenshots() {
        if (!screenshotsPreview) return;
        
        screenshotsPreview.innerHTML = '';
        if (screenshotFiles.length === 0) {
            return;
        }
        screenshotFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.dataset.index = index;
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Screenshot">
                    <button type="button" class="preview-remove">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                // Add remove functionality
                previewItem.querySelector('.preview-remove').addEventListener('click', function() {
                    removeScreenshot(index);
                });
                
                screenshotsPreview.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    // Skills Selector
    const skillsSearch = document.getElementById('skills-search');
    const skillsList = document.getElementById('skills-list');
    const selectedSkillsContainer = document.getElementById('selected-skills');
    const selectedSkills = new Set();

    skillsSearch.addEventListener('focus', () => {
        skillsList.classList.add('active');
    });

    skillsSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const options = skillsList.querySelectorAll('.skill-option');
        options.forEach(option => {
            const skillName = option.dataset.skill.toLowerCase();
            option.style.display = skillName.includes(searchTerm) ? '' : 'none';
        });
    });

    skillsList.addEventListener('click', (e) => {
        const option = e.target.closest('.skill-option');
        if (option) {
            const skill = option.dataset.skill;
            const icon = option.querySelector('i').className;
            
            if (selectedSkills.has(skill)) {
                selectedSkills.delete(skill);
                option.classList.remove('selected');
            } else {
                selectedSkills.add(skill);
                option.classList.add('selected');
            }
            renderSelectedSkills(icon, skill);
        }
    });

    function renderSelectedSkills(icon, skill) {
        selectedSkillsContainer.innerHTML = '';
        const skillsArray = Array.from(selectedSkills);
        skillsArray.forEach(skillName => {
            const skillOption = skillsList.querySelector(`[data-skill="${skillName}"]`);
            const skillIcon = skillOption.querySelector('i').className;
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                <i class="${skillIcon}"></i>
                <span>${skillName}</span>
                <span class="remove-skill" onclick="removeSkill('${skillName}')">&times;</span>
            `;
            selectedSkillsContainer.appendChild(tag);
        });
    }

    window.removeSkill = function(skill) {
        selectedSkills.delete(skill);
        const option = skillsList.querySelector(`[data-skill="${skill}"]`);
        if (option) option.classList.remove('selected');
        renderSelectedSkills();
    };

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.skills-selector')) {
            skillsList.classList.remove('active');
        }
    });

    // Draft and Publish Button Handlers
    const saveDraftBtn = document.getElementById('save-draft-btn');
    const publishBtn = document.getElementById('publish-btn');
    const statusInput = document.getElementById('id_status');

    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            // Set status to draft
            if (statusInput) {
                statusInput.value = 'draft';
            }
            // Trigger form submission
            form.dispatchEvent(new Event('submit', { cancelable: true }));
        });
    }

    if (publishBtn) {
        publishBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Set status to active (or keep current status if editing)
            if (statusInput) {
                const currentStatus = statusInput.value;
                // Only change to 'active' if it's currently 'draft' or empty
                if (!currentStatus || currentStatus === 'draft') {
                    statusInput.value = 'active';
                }
            }
            // Trigger form submission
            form.dispatchEvent(new Event('submit', { cancelable: true }));
        });
    }

    // Form Submission
    const form = document.getElementById('create-project-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create FormData object to handle file uploads
            const formData = new FormData(form);
            
            // Add screenshot files to FormData
            screenshotFiles.forEach((file, index) => {
                formData.append('screenshots', file);
            });
            
            // Submit form via AJAX
            fetch(form.action || window.location.href, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const isDraft = formData.get('status') === 'draft';
                    const message = isDraft ? 'Project saved as draft!' : (data.message || 'Project saved successfully!');
                    alert(message);
                    if (data.redirect_url) {
                        window.location.href = data.redirect_url;
                    }
                } else {
                    let errorMsg = 'Error saving project:\n';
                    if (data.errors) {
                        for (let field in data.errors) {
                            errorMsg += `${field}: ${data.errors[field].join(', ')}\n`;
                        }
                    }
                    alert(errorMsg);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while saving the project.');
            });
        });
    }
});
