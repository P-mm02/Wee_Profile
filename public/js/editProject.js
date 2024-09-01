const projectCardEditCon = document.getElementById('projectCardEditCon');
const cancelBtn = document.getElementById('cancelBtn');

cancelBtn.addEventListener('click', () => {
    projectCardEditCon.classList.add('hidden');
});    
window.addEventListener('click', (event) => {
    if (event.target == projectCardEditCon) {
        projectCardEditCon.classList.add('hidden');
    }
});