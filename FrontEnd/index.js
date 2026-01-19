
async function getWorks(){
    try{
        const response = await fetch("http://localhost:5678/api/works", {
          method : "get",
          headers :{
              "Content-Type" : "application/json"
          }})
          const works = await response.json()
          return works
    }catch(error){
        console.log(error)
    }
}
async function deleteWorkById(workId) {
    try{
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method : "delete",
        headers :{
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }})
        if(response.ok)
        {
            await refreshAndDisplayWorks()
            displayWorksInEditPanel(works)
        }
    }catch(error){
        console.log(error)
    }
}
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories", {
        method : "get",
        headers :{
            "Content-Type" : "application/json"
        }
    })
    const categories = await response.json()
    return categories
}
function displayWorks(paramWorks) {
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
function displayWorksInEditPanel(paramWorks) {
    let htmlString = ''
    const works = [...paramWorks]
        works.forEach(work => {
            htmlString = htmlString.concat(`<figure>
                <img src="${work.imageUrl}" alt="${work.title}">
                <button class="delete-work-button" data-id="${work.id}"><i class="fa-solid fa-trash-can"></i></button>
                </figure>`)
        });
    document.getElementById('photos-edit-panel').innerHTML = htmlString
    document.querySelectorAll('.delete-work-button').forEach((button) =>{
        button.addEventListener("click", () => {
            deleteWorkById(button.dataset.id)
        })
    })
    
}
function setCategoriesForAddPhotoPanel(paramCategories){
    let htmlString = ''
    const categories = [...paramCategories]
        categories.forEach(category => {
            htmlString = htmlString.concat(`<option value="${category.id}">${category.name}</option>`)
        });
    document.getElementById('edit-select-categorie').innerHTML = htmlString
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
async function refreshAndDisplayWorks(){
    works = await getWorks()
    displayWorks(works) 
}
refreshAndDisplayWorks()

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
document.getElementById("add-photo-button").addEventListener("click", async () => {
        document.getElementById("edit-gallery-page-1").classList.add("display-none-important")
        document.getElementById("edit-gallery-page-2").classList.add("display-flex-important")
        const categories = await getCategories()
        setCategoriesForAddPhotoPanel(categories)
})
document.getElementById("edit-panel-back-button").addEventListener("click", (e) => {
        document.getElementById("edit-gallery-page-1").classList.remove("display-none-important")
        document.getElementById("edit-gallery-page-2").classList.remove("display-flex-important")
})

window.addEventListener("drop", (e) => {
  if ([...e.dataTransfer.items].some((item) => item.kind === "file")) {
    e.preventDefault();
  }
});

const dropZone = document.getElementById("drop-zone");

dropZone.addEventListener("drop", dropHandler);

dropZone.addEventListener("dragover", (e) => {
  const fileItems = [...e.dataTransfer.items].filter(
    (item) => item.kind === "file",
  );
  if (fileItems.length > 0) {
    e.preventDefault();
    if (fileItems.some((item) => item.type.startsWith("image/"))) {
      e.dataTransfer.dropEffect = "copy";
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  }
});

window.addEventListener("dragover", (e) => {
  const fileItems = [...e.dataTransfer.items].filter(
    (item) => item.kind === "file",
  );
  if (fileItems.length > 0) {
    e.preventDefault();
    if (!dropZone.contains(e.target)) {
      e.dataTransfer.dropEffect = "none";
    }
  }
});

const preview = document.getElementById("preview");
const dropError = document.getElementById("drop-error");

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB
const ALLOWED_TYPES = ["image/png", "image/jpeg"];

function showDropError(msg) {
  if (dropError) dropError.textContent = msg;
}
function clearDropError() {
  if (dropError) dropError.textContent = "";
}

function displayImages(files) {
  // clear previous previews and errors
  if (!preview) return;
  for (const img of preview.querySelectorAll("img")) {
    URL.revokeObjectURL(img.src);
  }
  preview.textContent = "";
  clearDropError();

  if (!files || files.length === 0) return;

  if (files.length > 1) {
    showDropError('Veuillez sélectionner une seule image.');
    return;
  }

  const file = files[0];

  if (!ALLOWED_TYPES.includes(file.type)) {
    showDropError('Format non supporté. Seuls .png et .jpg sont autorisés.');
    return;
  }

  if (file.size > MAX_SIZE) {
    showDropError('Fichier trop volumineux. Taille maximale : 4 Mo.');
    return;
  }

  const dropZone = document.getElementById('drop-zone');
  [...dropZone.children].forEach(child => child.classList.add('display-none-important'));

  // Ensure the file input contains the dropped file so FormData(e.target) includes it
  if (fileInput) {
    try {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;
    } catch (err) {
      // Fallback: if DataTransfer is not supported, show instruction to use the input
      console.warn('Unable to set file input programmatically, please use the file input to select the file');
    }
  }

  // Build preview (visible in the preview list)
  const li = document.createElement('li');
  const img = document.createElement('img');
  img.src = URL.createObjectURL(file);
  img.alt = file.name;
  li.appendChild(img);
  li.appendChild(document.createTextNode(file.name));
  preview.appendChild(li);

  // Also add a small preview inside the drop zone (remove previous one first)
  const existingPreviewImg = dropZone.querySelector('img.upload-preview');
  if (existingPreviewImg) existingPreviewImg.remove();
  const previewImg = document.createElement('img');
  previewImg.classList.add('upload-preview');
  previewImg.src = img.src;
  previewImg.alt = img.alt;
  previewImg.style.maxWidth = '200px';
  previewImg.style.maxHeight = '200px';
  dropZone.appendChild(previewImg)
}

function dropHandler(ev) {
  ev.preventDefault();
  const files = [...ev.dataTransfer.items]
    .map((item) => item.getAsFile())
    .filter((file) => file);
  displayImages(files);
}

const fileInput = document.getElementById("file-input");
fileInput.addEventListener("change", (e) => {
    if(fileInput.value != '')
    {
        displayImages(Array.from(e.target.files));
    }
});

const addWorkForm = document.getElementById("add-work-form")
addWorkForm.addEventListener("submit", (e) => { 
    e.preventDefault()
    const titre = document.getElementById("titre")
    if (fileInput.files.length !== 1)
    {
        showDropError("Sélectionnez une image")
    }
    else if(titre.value == '' || titre.value == titre.defaultValue){
        showDropError("Choisissez un titre pour l'image")
    }
    else{
        const formData = new FormData(e.target);
        postNewWork(formData)
    }
})

async function postNewWork(formData){
    try{
        console.log("submit")
        const response = await fetch("http://localhost:5678/api/works", {
          method : "POST",
          headers :{
                "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body : formData
        })
        if (response.ok) {
            const dropZone = document.getElementById('drop-zone');
            [...dropZone.children].forEach(child => child.classList.remove('display-none-important'));
            const existingPreviewImg = dropZone.querySelector('img.upload-preview');
            if (existingPreviewImg) existingPreviewImg.remove();
            document.getElementById('edit-gallery-page-1').classList.remove('display-none-important');
            document.getElementById('edit-gallery-page-2').classList.remove('display-flex-important');
            document.getElementById("edit-mode-div").classList.remove("display-flex-important")
            addWorkForm.reset()
            if (fileInput) fileInput.textContent = '';
            document.querySelector('.image-placeholder')?.classList.remove('display-none-important');
            preview.textContent = '';
            clearDropError();
            await refreshAndDisplayWorks();
            displayWorksInEditPanel(works);
        } else {
            console.log("responsepasok")
            const errorPayload = await response.json().catch(() => null);
            showDropError((errorPayload && (errorPayload.error || errorPayload.message)) || 'Erreur lors de l\'upload.');
        }
    }
    catch(error)
    {
        console.log(error)
    }
}
document.getElementById('add-image-file-button').addEventListener("click" , () => {
    document.getElementById('file-input').click();
})
