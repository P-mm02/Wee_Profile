// save as PDF file
document.getElementById('savePdfBtn').addEventListener('click', function () {
    var element = document.getElementById('resumeWrapper'); // Target the resumeWrapper only

    // Find all elements that are hidden via display:none or visibility:hidden
    var hiddenElements = [];
    var allElements = element.querySelectorAll('*'); // Select all elements within #resumeWrapper

    allElements.forEach(function (el) {
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            hiddenElements.push(el); // Store the element for later restoration
            el.style.visibility = 'hidden'; // Temporarily hide the element
        }
    });

    // Use html2pdf to convert the element to PDF
    html2pdf(element, {
        margin: 0,
        filename: 'resume.pdf', // Set the desired file name for the PDF
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 4, dpi: 300, useCORS: true },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' } // PDF size and layout
    }).then(function () {
        // Restore the visibility of hidden elements after the PDF is generated
        hiddenElements.forEach(function (el) {
            el.style.visibility = ''; // Reset visibility to original
        });
    });
});

// profileImgs slider
document.getElementById('profileImgs').addEventListener('change', function(event) {
    const slider = document.querySelector('.slider');
    const images = document.querySelectorAll('.slider .oldImg');
    const preImgs = document.querySelectorAll('.slider .preImg');
    let files = Array.from(event.target.files); // Convert FileList to an array
    const totalImages = images.length + preImgs.length;

    // Prevent user from selecting more than 5 files at once
    if (totalImages + files.length > 5) {
        event.target.value = '';
        slider.style.transform = `translateX(0%)`;
        preImgs.forEach(img => {            
            img.remove();            
        });

        const clientAlert = document.getElementById('client-alert');
        clientAlert.style.display = 'flex';
        clientAlert.innerText = 'You cannot upload more than 5 images!';
        
        return;
    }

    // Process valid files
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preImg myProfileImgs w-full object-cover';
            img.style.height = '100%';
            slider.appendChild(img);
            console.log(`Appended image for file: ${file.name}`);
        };
        reader.readAsDataURL(file); 
    });

    // Adjust slider if there are already images
    if (images.length > 0) {            
        const currentIndex = images.length + preImgs.length;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    } 
});

// profileImgs slider Ctrl
let currentIndex = 0;

document.getElementById('nextBtn').addEventListener('click', () => {
        const slider = document.querySelector('.slider');
        const images = document.querySelectorAll('.slider img');
        const totalImages = images.length;  

        if (currentIndex < totalImages - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
});

document.getElementById('prevBtn').addEventListener('click', () => {
        const slider = document.querySelector('.slider');
        const images = document.querySelectorAll('.slider img');
        const totalImages = images.length;

        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalImages - 1;
        }
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
});

document.getElementById('deleteImgBtn').addEventListener('click', () => {
        const images = document.querySelectorAll('.slider img');
        
        if (images[currentIndex].classList.contains('preImg')) {
            const slider = document.querySelector('.slider');
            const preImgs = document.querySelectorAll('.slider .preImg');
            const fileInput = document.getElementById('profileImgs');            
            const files = fileInput.files;
            const fileIndex = currentIndex - (images.length - files.length);
            const dataTransfer = new DataTransfer();

            for (let i = 0; i < files.length; i++) {
                if (i !== fileIndex) {
                    dataTransfer.items.add(files[i]); // Add all files except the one to remove
                }
            }

            if (currentIndex > 0) {
                currentIndex--;
                slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            } 
            
            fileInput.files = dataTransfer.files;            

            preImgs[fileIndex].remove();
        } else {           
            const deleteImgForm = document.getElementById('deleteImgForm');         

            deleteImgForm.action = '/resume/'+images[currentIndex].alt+'?_method=DELETE';     
            deleteImgForm.submit();

            /* fetch('/resume/'+images[currentIndex].alt+'?_method=DELETE', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: 'your-item-id' })  // Optional: Pass any data if needed            
            })            
            .then(response => {
                if (response.ok) {
                    console.log('Item deleted');                
                } else {
                    console.error('Failed to delete');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
             */
        }       
});

// PhoneNumber format
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, ''); // Remove all non-numeric characters
    let formattedValue = '';
  
    if (value.length > 0) {
      formattedValue += value.substring(0, 3); // First 3 digits
    }
    if (value.length > 3) {
      formattedValue += '-' + value.substring(3, 6); // Next 3 digits
    }
    if (value.length > 6) {
      formattedValue += '-' + value.substring(6, 10); // Last 4 digits
    }
  
    input.value = formattedValue;
}

// Language
function addLanguage() {
    const languageCount = document.querySelectorAll('.langCon').length;
    const container = document.getElementById('languageSkills');
    const newLanguageDiv = document.createElement('div');
    newLanguageDiv.classList.add('langCon', 'mb-4', 'flex', 'items-center', 'space-x-2');

    newLanguageDiv.innerHTML = `
            <div>
                <div class="input-wrapper relative">
                    <input 
                    type="text" 
                    name="resume[languageSkill][${languageCount}][language]" 
                    id="language-${languageCount}" 
                    placeholder="Language"
                    data-index="${languageCount}" 
                    class="inputBG block w-full rounded-md shadow-sm"
                    />                    
                    <button type="button" class="delete-lang delete-btn text-white text-xs">
                        &#10006;
                    </button>
                </div>                                  
            </div>
            <div>
                <div class="battery-rating flex rounded-md overflow-hidden bg-white" style="border: 4px solid rgba(0, 0, 0, 0.8);">
                ${[...Array(10)].map((_, i) => `
                    <div 
                        class="w-3 h-10 border border-gray-700 bg-gray-800 button battery-block"                            
                        data-rating="${i + 1}"
                        style="cursor: pointer;">
                    </div>
                `).join('')}
                </div>                                
                <input 
                    type="hidden" 
                    name="resume[languageSkill][${languageCount}][rating]" 
                    id="rating-hidden-${languageCount}" 
                    placeholder="1-10" 
                    min="1" 
                    max="10"
                    class="rating-input block w-24 rounded-md border-gray-300 shadow-sm"
                />
            </div>            
    `;
        
    container.appendChild(newLanguageDiv); 

    // Add event listeners for rating blocks
    const ratingBlocks = newLanguageDiv.querySelectorAll('.battery-block');
    const ratingInput = newLanguageDiv.querySelector('.rating-input');

    ratingBlocks.forEach(block => {
        block.addEventListener('click', function() {
            const ratingValue = this.getAttribute('data-rating');
            ratingInput.value = ratingValue; // Update hidden input with selected rating

            // Update the visual appearance of the blocks based on rating
            ratingBlocks.forEach((b, idx) => {
                if (idx + 1 <= ratingValue) {
                    b.classList.remove('bg-gray-100');
                    b.classList.add(getColorForRating(idx + 1));
                } else {
                    b.classList.remove(getColorForRating(idx + 1));
                    b.classList.add('bg-gray-100');
                }
            });
        });
    });

    // Function to get color based on rating
    function getColorForRating(rating) {
        if (rating === 1) return 'bg-red-700';
        if (rating === 2) return 'bg-red-600';
        if (rating === 3) return 'bg-red-500';
        if (rating === 4) return 'bg-yellow-300';
        if (rating === 5) return 'bg-yellow-200';
        if (rating === 6) return 'bg-yellow-100';
        if (rating === 7) return 'bg-green-300';
        if (rating === 8) return 'bg-green-400';
        if (rating === 9) return 'bg-green-500';
        if (rating === 10) return 'bg-green-600';
        return '';
    }
}
document.getElementById('languageSkills').addEventListener('click', function(event) {
// Check if the clicked element has the class 'delete-lang'
    if (event.target && event.target.classList.contains('delete-lang')) {
        // Find the closest parent element with the class 'langCon'
        const langConTarget = event.target.closest('.langCon');
        
        if (langConTarget) {
            langConTarget.remove(); // Remove the .langCon element from the DOM

            const langCons = document.querySelectorAll('.langCon'); // Select all remaining language divs
            
            langCons.forEach((langCon, newIndex) => {                
                // Update id and name for the language input
                const langInput = langCon.querySelector('input[type="text"]');
                langInput.id = `language${newIndex}`;
                langInput.name = `resume[languageSkill][${newIndex}][language]`;
                langInput.setAttribute('data-index', newIndex);               

                // Update id and name for the hidden rating input
                const ratingInput = langCon.querySelector('input[type="hidden"]');
                ratingInput.id = `rating-hidden-${newIndex}`;
                ratingInput.name = `resume[languageSkill][${newIndex}][rating]`;
            });
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const languageSkillsContainer = document.getElementById('languageSkills');

    Sortable.create(languageSkillsContainer, {
        animation: 150,
        handle: '.langCon',  // Ensure dragging is only triggered by this class
        onEnd: (evt) => {
            updateIndices();
        }
    });

    function updateIndices() {
        const languageItems = document.querySelectorAll('#languageSkills .langCon');
        languageItems.forEach((item, index) => {
            // Update the input names with new index after sorting
            const languageInput = item.querySelector('input[name^="resume[languageSkill]"]');
            const ratingInput = item.querySelector('input[type="hidden"]');
            
            languageInput.name = `resume[languageSkill][${index}][language]`;
            ratingInput.name = `resume[languageSkill][${index}][rating]`;
        });
    }
});

// battery-rating, scale Ctrl
document.querySelectorAll('.battery-rating').forEach(ratingContainer => {
    ratingContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('battery-block')) {
            const rating = e.target.getAttribute('data-rating');
            const blocks = ratingContainer.querySelectorAll('.battery-block');

            const colorClasses = [
                'bg-red-700',   // index 0
                'bg-red-600',   // index 1
                'bg-red-500',   // index 2
                'bg-yellow-300', // index 3
                'bg-yellow-200', // index 4
                'bg-yellow-100', // index 5
                'bg-green-300', // index 6
                'bg-green-400', // index 7
                'bg-green-500', // index 8
                'bg-green-600'  // index 9
            ];

            blocks.forEach((block, index) => {
                block.classList.remove('bg-gray-100', ...colorClasses); // Remove all color classes
                if (index < rating) {
                    block.classList.add(colorClasses[index]); // Add the corresponding color class based on index
                } else {
                    block.classList.add('bg-gray-100'); // If the index is greater than or equal to the rating, set gray
                }
            });

            /* blocks.forEach((block, index) => {
                if (index < rating) {
                    block.classList.remove('bg-gray-100');
                    if (index === 0) {
                        block.classList.add('bg-red-500');
                    } else if (index === 1) {
                        block.classList.add('bg-red-400');
                    } else if (index === 2) {
                        block.classList.add('bg-red-300');
                    } else if (index === 3) {
                        block.classList.add('bg-yellow-400');
                    } else if (index === 4) {
                        block.classList.add('bg-yellow-300');
                    } else if (index === 5) {
                        block.classList.add('bg-yellow-200');
                    } else if (index === 6) {
                        block.classList.add('bg-green-200');
                    } else if (index === 7) {
                        block.classList.add('bg-green-300');
                    } else if (index === 8) {
                        block.classList.add('bg-green-400');
                    } else if (index === 9) {
                        block.classList.add('bg-green-500');
                    }
                } else {
                    block.classList.remove('bg-green-500');
                    block.classList.add('bg-gray-100');
                }
            }); */

            // Update the hidden input value
            const hiddenInput = ratingContainer.nextElementSibling;
            hiddenInput.value = rating;
        }
    });
});

// Job position
document.getElementById('addPositionBtn').addEventListener('click', function() {
    const container = document.createElement('div');
    container.classList.add('jobCon', 'input-wrapper', 'relative');

    const index = document.querySelectorAll('input[name^="resume[lookingFor]"]').length;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.name = `resume[lookingFor][${index}][position]`;
    input.id = `position-${index}`;
    input.placeholder = 'Enter position';
    input.className = 'inputBG block w-full rounded-md shadow-sm font-bold';
    
    const button = document.createElement('button');
    button.className = 'delete-job delete-btn text-white text-xs'
    button.type = 'button'
    button.innerHTML = '&#10006;'

    container.appendChild(input);
    container.appendChild(button);
    
    document.getElementById('lookingForCon').insertBefore(container, document.getElementById('addPositionBtn'));

});

document.getElementById('lookingForCon').addEventListener('click', function(event) {
    // Check if the clicked element has the class 'delete-lang'
        if (event.target && event.target.classList.contains('delete-job')) {
            // Find the closest parent element with the class 'langCon'
            const jobConTarget = event.target.closest('.jobCon');
            
            if (jobConTarget) {
                jobConTarget.remove(); // Remove the .langCon element from the DOM

                const jobCons = document.querySelectorAll('.jobCon'); // Select all remaining language divs
                
                jobCons.forEach((jobCon, newIndex) => {                
                    // Update id and name for the language input
                    const jobInput = jobCon.querySelector('input[type="text"]');
                    jobInput.id = `position-${newIndex}`;
                    jobInput.name = `resume[lookingFor][${newIndex}][position]`;            
                });
            }
        }
    });

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Sortable on the job container
    const lookingForCon = document.getElementById('lookingForCon');
    
    Sortable.create(lookingForCon, {
        animation: 150,
        handle: '.jobCon', // Only .jobCon elements are draggable
        onEnd: function () {
            // Reorder indices after moving an item
            updateJobIndices();
        }
    });

    function updateJobIndices() {
        // Loop over all jobCon elements to update their index attributes
        const jobEntries = lookingForCon.querySelectorAll('.jobCon');
        jobEntries.forEach((job, index) => {
            // Update position input name to match the new order
            job.querySelector('input[name^="resume[lookingFor]["]').name = `resume[lookingFor][${index}][position]`;
            job.querySelector('input[name^="resume[lookingFor]["]').id = `position-${index}`;
        });
    }
});

// Introduction
window.onload = function() {
    const introductionTextarea = document.getElementById('introduction');
        if (introductionTextarea) {
            autoResize(introductionTextarea); // Run autoResize on page load for the introduction field
        }
    };
function autoResize(textarea) {
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set height to match content
}

// Skills
document.getElementById('addSkillBtn').addEventListener('click', function() {
    const container = document.getElementById('skillsContainer');
    const newIndex = container.querySelectorAll('.skill-entry').length;

    // Create a new skill entry div
    const newSkill = document.createElement('div');
    newSkill.classList.add('skill-entry', 'skillCon', 'input-wrapper', 'relative');
    newSkill.innerHTML = `            
            <input 
                type="text" 
                name="resume[skills][${newIndex}][skill]" 
                placeholder="Enter skill" 
                class="inputBG block w-full rounded-md shadow-sm font-bold"
            >
            
            <div class="grid grid-cols-10 battery-rating flex rounded-md overflow-hidden bg-white" style="border: 4px solid rgba(0, 0, 0, 0.8);">
                ${[...Array(10)].map((_, i) => `
                    <div 
                        class="h-10 border border-gray-700 bg-gray-800 battery-block"
                        data-rating="${i + 1}"
                        style="cursor: pointer;">
                    </div>
                `).join('')}
            </div>
            
            <input 
                type="hidden" 
                name="resume[skills][${newIndex}][rating]" 
                min="1" 
                max="10"
                placeholder="Rating (1-10)" 
                class="inputBG block w-full rounded-md shadow-sm hidden rating-input"
            >

            <button type="button" class="delete-skill delete-btn text-white text-xs">
                &#10006;
            </button>
    `;

    // Insert new skill entry before the "Add Skill" button
    container.appendChild(newSkill);

    // Add event listeners for rating blocks
    const ratingBlocks = newSkill.querySelectorAll('.battery-block');
    const ratingInput = newSkill.querySelector('.rating-input');

    ratingBlocks.forEach(block => {
        block.addEventListener('click', function() {
            const ratingValue = this.getAttribute('data-rating');
            ratingInput.value = ratingValue; // Update hidden input with selected rating

            // Update the visual appearance of the blocks based on rating
            ratingBlocks.forEach((b, idx) => {
                if (idx + 1 <= ratingValue) {
                    b.classList.remove('bg-gray-100');
                    b.classList.add(getColorForRating(idx + 1));
                } else {
                    b.classList.remove(getColorForRating(idx + 1));
                    b.classList.add('bg-gray-100');
                }
            });
        });
    });

    // Function to get color based on rating
    function getColorForRating(rating) {
        if (rating === 1) return 'bg-red-700';
        if (rating === 2) return 'bg-red-600';
        if (rating === 3) return 'bg-red-500';
        if (rating === 4) return 'bg-yellow-300';
        if (rating === 5) return 'bg-yellow-200';
        if (rating === 6) return 'bg-yellow-100';
        if (rating === 7) return 'bg-green-300';
        if (rating === 8) return 'bg-green-400';
        if (rating === 9) return 'bg-green-500';
        if (rating === 10) return 'bg-green-600';
        return '';
    }
});

document.getElementById('skillsContainer').addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('delete-skill')) {
        const skillConTarget = event.target.closest('.skillCon');
        
        if (skillConTarget) {
            skillConTarget.remove();

            const skillCons = document.querySelectorAll('.skillCon');
            
            skillCons.forEach((skillCon, newIndex) => {
                const skillInput = skillCon.querySelector('input[type="text"]');
                skillInput.name = `resume[skills][${newIndex}][skill]`;               
                
                const ratingInput = skillCon.querySelector('input[type="hidden"]');
                ratingInput.name = `resume[skills][${newIndex}][rating]`;
            });
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const skillsContainer = document.getElementById('skillsContainer');
    
    Sortable.create(skillsContainer, {
        animation: 150,
        handle: '.skillCon', // Only the skillCon elements are draggable
        onEnd: function (evt) {
            // Reorder indices after moving an item
            updateSkillIndices();
        }
    });

    function updateSkillIndices() {
        // Loop over all skillCon elements to update their index attributes
        const skillEntries = skillsContainer.querySelectorAll('.skill-entry');
        skillEntries.forEach((skill, index) => {
            // Update skill and rating input names to match the new order
            skill.querySelector('input[name^="resume[skills]["]').name = `resume[skills][${index}][skill]`;
            skill.querySelector('input[name^="resume[skills]["][type="hidden"]').name = `resume[skills][${index}][rating]`;
        });
    }
});

//Bootcamps
document.getElementById('addBootcampBtn').addEventListener('click', function() {
    // Get the container where the bootcamp entries are stored
    const bootcampContainer = document.getElementById('bootcampContainer');
    
    // Get the current number of bootcamp entries to generate unique IDs
    const bootcampCount = bootcampContainer.children.length;

    // Create a new bootcamp entry div
    const bootcampEntry = document.createElement('div');
    bootcampEntry.classList.add('bootcamp-entry', 'p-2', 'rounded-md', 'bg-gray-900', 'text-white', 'input-wrapper', 'relative');
    
    // Set the inner HTML for the new bootcamp entry
    bootcampEntry.innerHTML = `
        <!-- Bootcamp Name -->
        <div class="mb-2">
            <label for="bootcampName-${bootcampCount}" class="block text-sm font-medium">Bootcamp Name</label>
            <input 
                type="text" 
                name="resume[bootcamp][${bootcampCount}][bootcampName]" 
                placeholder="Enter bootcamp name" 
                class="inputBG block w-full rounded-md shadow-sm"
            />
        </div>
        <!-- Instructor Name -->
        <div class="mb-2">
            <label for="instructor-${bootcampCount}" class="block text-sm font-medium">Instructor</label>
            <input 
                type="text" 
                name="resume[bootcamp][${bootcampCount}][instructor]" 
                placeholder="Enter instructor name" 
                class="inputBG block w-full rounded-md shadow-sm"
            />
        </div>
        <!-- Certificate -->
        <div class="mb-2">
            <label for="certificate-${bootcampCount}" class="block text-sm font-medium">Certificate</label>
            <input 
                type="text" 
                name="resume[bootcamp][${bootcampCount}][certificate]" 
                placeholder="Enter certificate name" 
                class="inputBG block w-full rounded-md shadow-sm"
            />
        </div>
        <!-- Delete Button -->
        <button type="button" class="delete-bootcamp delete-btn text-white text-xs">
            &#10006;
        </button>
    `;

    // Append the new entry to the bootcamp container
    bootcampContainer.appendChild(bootcampEntry);            
});

document.getElementById('bootcampContainer').addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('delete-bootcamp')) {
        const bootcampTarget = event.target.closest('.bootcamp-entry');
        
        if (bootcampTarget) {
            bootcampTarget.remove();

            const bootcamps = document.querySelectorAll('.bootcamp-entry');
            
            bootcamps.forEach((bootcamp, newIndex) => {
                const bootcampName = bootcamp.querySelector('input[name*="[bootcampName]"]');
                bootcampName.name = `resume[bootcamp][${newIndex}][bootcampName]`;               
                
                const bootcampInstructor = bootcamp.querySelector('input[name*="[instructor]"]');
                bootcampInstructor.name = `resume[bootcamp][${newIndex}][instructor]`;

                const bootcampCertificate = bootcamp.querySelector('input[name*="[certificate]"]');
                bootcampCertificate.name = `resume[bootcamp][${newIndex}][certificate]`;
            });
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const bootcampContainer = document.getElementById('bootcampContainer');
    
    Sortable.create(bootcampContainer, {
        animation: 150,
        handle: '.bootcamp-entry', // Only the skillCon elements are draggable
        onEnd: function (evt) {
            // Reorder indices after moving an item
            updateBootcampIndices();
        }
    });

    function updateBootcampIndices() {
        // Loop over all skillCon elements to update their index attributes
        const bootcampEntry = bootcampContainer.querySelectorAll('.bootcamp-entry');
        bootcampEntry.forEach((bootcamp, index) => {
            // Update skill and rating input names to match the new order
            bootcamp.querySelector('input[name*="[bootcampName]"]').name = `resume[bootcamp][${index}][bootcampName]`;
            bootcamp.querySelector('input[name*="[instructor]"]').name = `resume[bootcamp][${index}][instructor]`;
            const certificate = bootcamp.querySelector('input[name*="[certificate]"]');
            if (certificate) {
                certificate.name = `resume[bootcamp][${index}][certificate]`;
            }
        });
    }
});    

//Hobby
document.getElementById('addHobbyBtn').addEventListener('click', function() {
    const hobbyContainer = document.getElementById('hobbyContainer');
    const index = hobbyContainer.children.length;
    const hobbyEntry = document.createElement('div');
    hobbyEntry.classList.add('hobby-entry', 'input-wrapper', 'relative');
    hobbyEntry.innerHTML = `
        <input 
            type="text" 
            name="resume[hobbies][${index}][hobby]" 
            placeholder="Enter hobby" 
            class="inputBG block w-full rounded-md shadow-sm"
        />
        <button type="button" class="delete-hobby delete-btn text-white text-xs">
            &#10006;
        </button>
    `;
    hobbyContainer.appendChild(hobbyEntry);
   
});

document.getElementById('hobbyContainer').addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('delete-hobby')) {
        const hobbyTarget = event.target.closest('.hobby-entry');
        
        if (hobbyTarget) {
            hobbyTarget.remove();

            const hobbys = document.querySelectorAll('.hobby-entry');
            
            hobbys.forEach((hobby, newIndex) => {
                const hobbyName = hobby.querySelector('input[name*="[hobby]"]');
                hobbyName.name = `resume[hobbies][${newIndex}][hobby]`;
            });
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const hobbyContainer = document.getElementById('hobbyContainer');
    
    Sortable.create(hobbyContainer, {
        animation: 150,
        handle: '.hobby-entry', // Only the skillCon elements are draggable
        onEnd: function (evt) {
            // Reorder indices after moving an item
            updateHobbyIndices();
        }
    });

    function updateHobbyIndices() {
        // Loop over all skillCon elements to update their index attributes
        const hobbyEntry = hobbyContainer.querySelectorAll('.hobby-entry');
        hobbyEntry.forEach((hobby, index) => {
            // Update skill and rating input names to match the new order
            hobby.querySelector('input[name^="resume[hobbies]["]').name = `resume[hobbies][${index}][hobby]`;
        });
    }
});
        
//Additional resume Ctrl
document.getElementById('resumeAdditional-btn').addEventListener('click', function() {
    const resumeAdditional = document.getElementById('resumeAdditional');
    if (resumeAdditional.style.display === 'none' || resumeAdditional.style.display === '') {
        resumeAdditional.style.display = 'block';
    } else {
        resumeAdditional.style.display = 'none';
    }
});