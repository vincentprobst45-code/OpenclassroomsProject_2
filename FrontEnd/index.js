
async function getWorks(){
  const response = await fetch("http://localhost:5678/api/works", {
    method : "get",
    headers :{
        "Content-Type" : "application/json"
    }})
    const works = await response.json()
    return works
}
async function displayWorks(paramWorks) {
    let htmlString = ''
    const works = [...paramWorks]
        works.forEach(work => {
            htmlString = htmlString.concat(`<figure data-category="${work.category.name}">
                <img src="${work.imageUrl}" alt="${work.title}">
                <figcaption>${work.title}</figcaption>
                </figure>`)
        });
    document.getElementById('portfolio').querySelector('.gallery').innerHTML = htmlString    
}
async function displayWorksInEditPanel(paramWorks) {
    let htmlString = ''
    const works = [...paramWorks]
        works.forEach(work => {
            htmlString = htmlString.concat(`<figure>
                <img src="${work.imageUrl}" alt="${work.title}" data-id="${work.id}">
                <button><i class="fa-solid fa-trash-can"></i></button>
                </figure>`)
        });
    document.getElementById('photos-edit-panel').innerHTML = htmlString
    
}
function filterByCategory(category){
    if(category != "Tous")
    {
        const filteredWorks = works.filter((work) => work.category.name === category)
        displayWorks(filteredWorks)
    } else{
        displayWorks(works)
    }
}
let works = []
async function firstDisplay(){
    works = await getWorks()
    displayWorks(works) 
}
firstDisplay()

document.querySelectorAll(".filters-container button").forEach((button) => {button.addEventListener("click", (e) => {
        let text = e.target.innerText || e.target.textContent;
        filterByCategory(text)
    })
})

const token = localStorage.getItem("token")
if(token)
{
    document.getElementById("login-link").classList.add("display-none-important")
    document.getElementById("logout-link").classList.add("display-important")
    document.getElementById("edit-mode-banner").classList.add("display-important")
    document.getElementById("edit-mode-project-modify-button").classList.add("display-inline-important")
}

document.getElementById("edit-mode-project-modify-button").addEventListener("click", () => {
    document.getElementById("edit-mode-div").classList.add("display-flex-important")
    document.getElementById("edit-gallery-page-1").classList.remove("display-none-important")
    document.getElementById("edit-gallery-page-2").classList.remove("display-flex-important")
    displayWorksInEditPanel(works)
})
document.querySelectorAll(".edit-panel-close-button").forEach((button) => {button.addEventListener("click", () => {
        document.getElementById("edit-mode-div").classList.remove("display-flex-important")
    })
})
document.getElementById("edit-mode-div").addEventListener("click", (e) => {
    if (e.target === document.getElementById("edit-mode-div"))
    {
        document.getElementById("edit-mode-div").classList.remove("display-flex-important")
    }
})
document.getElementById("add-photo-button").addEventListener("click", (e) => {
        document.getElementById("edit-gallery-page-1").classList.add("display-none-important")
        document.getElementById("edit-gallery-page-2").classList.add("display-flex-important")
})
document.getElementById("edit-panel-back-button").addEventListener("click", (e) => {
        document.getElementById("edit-gallery-page-1").classList.remove("display-none-important")
        document.getElementById("edit-gallery-page-2").classList.remove("display-flex-important")
})
