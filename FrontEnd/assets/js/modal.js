const MODAL_CONTAINER = document.querySelector(`#modalContainer`);
const FILES_INPUT = document.getElementById(`files`);

function handleClickModification(softRefresh){
    if (!softRefresh){
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
        
        addNewPicture();
        dropPicture ();
        validPictureButton();
        
    }    
    // Fetch data from the API and use it to construct the modal items for works and add any new pictures to the data
    fetchDatas().then(result => {  
        constructModalWorksItems(result[0]);
        addPictureToData(result[1]);
    });
    
    
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
// Delete a work from the API when its delete button is clicked
async function deleteThisWork(e) {
    const button = e.target;
    const workId = parseInt(button.getAttribute(`data-id`));
    if (confirm(`Êtes-vous sûr de vouloir supprimer ce travail?`)) {
        const response = await fetch(`${baseURL}/api/works/${workId}`, {
            method: 'DELETE',
            headers : {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem(TOKEN)).data}`
            }
        });
        if (response.ok) {
            docIsReady(true);
        }
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
        
        // Get the dropped file
        const file = event.dataTransfer.files[0];
        
        if (file.type === `image/jpeg` || file.type === `image/png`) {
            // Check if the file is an image file (JPEG or PNG) and is not too large
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
    
    // Handle clicking the insert image button
    FILES_INPUT.addEventListener(`change`, (event) => {
        const file = event.target.files[0];
        
        if (file.type === `image/jpeg` || file.type === `image/png`) {
            if (file.size <= 4000000) {
                // Read the file and create an image element with the file content as the source
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
/**
* Add current picture to data base and gallery
*/
function addPictureToData(categoriesArray){
    const selectedOption = document.querySelector(`#listBox`);
    selectedOption.innerHTML = ``;
    for (const category of categoriesArray) {
        const option = document.createElement(`Option`);
        option.innerHTML = category.name;
        option.setAttribute(`value`, category.id);
        selectedOption.appendChild(option);
    }
}

function validPictureButton(){
    const buttonValidationPicture = document.querySelector(`#validationPicture`);
    buttonValidationPicture.addEventListener(`click`,(e)=> {        
        e.preventDefault(); // prevent the default form submission
        
        // Get the form elements
        let form = document.getElementById(`uploadForm`);
        let filesInput = document.getElementById(`files`);
        let titleInput = document.getElementById(`titleImage`);
        let categoryInput = document.getElementById(`listBox`);
        
        // Create a FormData object to send the form data to the server
        let formData = new FormData();
        
        // Check if form is correctly filled
        if (filesInput.files[0] && titleInput.value && categoryInput.value){
            // Define the onload function to read the file content and add it to the FormData object
            formData.append('image', filesInput.files[0]);            
            // Get the values of the other inputs and add them to the FormData object
            formData.append('title', titleInput.value);
            formData.append('category', categoryInput.value);
            submitNewWork(formData);
        }        
    });   
}

async function submitNewWork(formData){
    const response = await fetch(`${baseURL}/api/works`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem(TOKEN)).data}`
        },
        body: formData
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }
    else {
        callSpinner();
        resetModal();
        docIsReady(true); 
    }
}
