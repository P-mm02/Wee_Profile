const deleteProjectBtn = document.getElementById('deleteProjectBtn')
const deleteProjectForm = document.getElementById('deleteProjectForm')
const projectCardsCon = document.getElementById('projectCardsCon')


deleteProjectBtn.addEventListener('click', () => {
    deleteProjectForm.classList.remove('hidden')
    projectCardsCon.classList.add('hidden')
})

function toggleCheckbox(cardId) {
    const checkbox = document.getElementById(`card-${cardId}`)
    const card = checkbox.closest('button')
    checkbox.checked = !checkbox.checked
    if (checkbox.checked) {
        card.style.backgroundColor = 'rgb(219, 66, 66)'
    } else {
        card.style.backgroundColor = '#1E1E2E'
    }
}