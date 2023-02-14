const MODAL_CONTAINER = document.querySelector(`#modalContainer`);
const FILES_INPUT = document.getElementById(`files`);

function handleClickModification(){
    
    const buttonModification = document.querySelector(`#portfolio .portfolioConnected .buttonModify`);
    buttonModification.addEventListener(`click`,(e)=> {
        BODY.classList.add(`inModal`);
        callSpinner();
    }); 
    
    const closeModal = document.querySelectorAll(`.closeModal`);
    closeModal.forEach(buttonClose => {
        buttonClose.addEventListener(`click`,(e)=> { 
            resetModal();   
            BODY.classList.remove(`inModal`);
        });
    });  
    const lastModal = document.querySelector(`.lastModal`);
    lastModal.addEventListener(`click`,(e)=> { 
        resetModal();   
    });
    
    
    fetchDatas().then(result => {  
        constructModalWorksItems(result[0]);
    });
    
    addNewPicture();
    dropPicture ();
}

function constructModalWorksItems(worksArray) {
    const myModalGalleryHTML = document.querySelector(`#editGallery`);
    myModalGalleryHTML.innerHTML = ``;
    
    for (const work of worksArray) {        
        const figure = document.createElement(`figure`);  
        
        const imageGallery = document.createElement(`img`);
        imageGallery.setAttribute(`alt`, work.title);
        imageGallery.setAttribute(`src`, work.imageUrl);
        imageGallery.setAttribute(`crossOrigin`, `Anonymous`);
        
        const figcaption = document.createElement(`figcaption`);
        figcaption.innerHTML = `éditer`;                    
        
        figure.appendChild(imageGallery);
        figure.appendChild(figcaption);
        myModalGalleryHTML.appendChild(figure); 
        
        creatAndAppendButton(``, work.id, figure,`fa-solid fa-up-down-left-right movePicture`);
        const buttonDelete = creatAndAppendButton(``, work.id, figure,`fa-solid fa-trash-can deletePicture`);
        buttonDelete.addEventListener(`click`, deleteThisWork);
        
    }
}

function addNewPicture(){
    const buttonAddPicture = document.querySelector(`#addPicture`);
    buttonAddPicture.addEventListener(`click`,(e)=> {
        callSpinner();
        MODAL_CONTAINER.classList.add(`showUpload`);
    }); 
    
}

async function deleteThisWork(e) {
    const button = e.target;
    const workId = parseInt(button.getAttribute(`data-id`));
    if (confirm("Êtes-vous sûr de vouloir supprimer ce travail?")) {
        const response = await fetch(`${baseURL}/api/works/${workId}`, {
            method: 'DELETE',
            headers : {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem(TOKEN)).data}`
            }
        });
    }
}

function callSpinner() {
    MODAL_CONTAINER.classList.add(`spinner`);
    setTimeout(() => {MODAL_CONTAINER.classList.remove(`spinner`)}, 100);
}


function dropPicture () {
    const dropArea = document.getElementById(`dropArea`);
    const insertImageButton = document.getElementById(`insertImage`);
    
    dropArea.addEventListener(`dragover`, (event) => {
        event.preventDefault();
        dropArea.classList.add(`highlight`);
    });
    
    dropArea.addEventListener(`dragleave`, (event) => {
        event.preventDefault();
        dropArea.classList.remove(`highlight`);
    });
    
    dropArea.addEventListener(`drop`, (event) => {
        event.preventDefault();
        dropArea.classList.remove(`highlight`);
        
        const file = event.dataTransfer.files[0];
        
        if (file.type === `image/jpeg` || file.type === `image/png`) {
            if (file.size <= 4000000) {
                FILES_INPUT.files = event.dataTransfer.files;
                FILES_INPUT.dispatchEvent(new Event(`change`));
            }
            else {
                alert(`Le fichier est trop lourd. Veuillez sélectionner un fichier plus petit (maximum 4Mo).`);
            }
        } else {
            alert(`Le fichier n'est pas au format jpeg ou png. Veuillez sélectionner un autre fichier.`);
        }
        
    });
    
    insertImageButton.addEventListener(`click`, () => {
        FILES_INPUT.click();
    });
    
    FILES_INPUT.addEventListener(`change`, (event) => {
        const file = event.target.files[0];
        
        if (file.type === `image/jpeg` || file.type === `image/png`) {
            if (file.size <= 4000000) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const image = new Image();
                    image.src = event.target.result; 
                    image.classList.add(`newUploadImage`);                  
                    dropArea.appendChild(image);
                    document.querySelector(`#dropArea > .pictureRectangle`).classList.add(`hide`);
                };
                reader.readAsDataURL(file);                 
            }
        }
    });
}

function resetModal() {
    MODAL_CONTAINER.classList.remove(`showUpload`);
    FILES_INPUT.files = null;
    document.querySelector(`#dropArea > .pictureRectangle`).classList.remove(`hide`);
    const uploadedImage = document.querySelector(`.newUploadImage`);
    if (uploadedImage){ 
        uploadedImage.remove();
    }
}
