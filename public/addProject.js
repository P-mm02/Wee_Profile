const addProjectBtn = document.getElementById('addProjectBtn');
const projectModal = document.getElementById('projectModal');
const cancelBtn = document.getElementById('cancelBtn');

addProjectBtn.addEventListener('click', () => {
    projectModal.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    projectModal.classList.add('hidden');
});    
window.addEventListener('click', (event) => {
    if (event.target == projectModal) {
        projectModal.classList.add('hidden');
    }
});