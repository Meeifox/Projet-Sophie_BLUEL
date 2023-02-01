function docIsReady() {
    const works = getAllWorks();
    works.then(value => constructWorksItems(value));
    
    const categories = getAllCategories();
    categories.then(value => filtersButton(value));
    
}

/**
* Function calling API to get all works
* @returns promise of works in array
*/
async function getAllWorks() {
    const works = await fetch("http://localhost:5678/api/works").then(d => d.json());
    return works;
}

/**
* function to construct element one by one and append them to gallery
* element looks like this 
* <figure>
*     <img src="assets/images/abajour-tahina.png" alt="Abajour Tahina">
*     <figcaption>Abajour Tahina</figcaption>
* </figure>
* @param {an array full of Works items} worksArray 
*/
function constructWorksItems(worksArray) {
    // get the Galery HTML, where i will add all works
    const myGalleryHTML = document.getElementById("portfolio").getElementsByClassName("gallery")[0];
    // Iterate on works array
    for (const work of worksArray) {
        console.log(work);
        const figure = document.createElement("figure");  
        
        //Create the img element
        const imageGallery = document.createElement("img");
        imageGallery.setAttribute("alt", work.title);
        imageGallery.setAttribute("src", work.imageUrl);
        imageGallery.setAttribute("crossOrigin", "Anonymous");// for CORS policies
        
        //Create the figCaption element
        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = work.title;
        
        //append everything ( img and figaption -> figure -> gallery)
        figure.appendChild(imageGallery);
        figure.appendChild(figcaption);
        myGalleryHTML.appendChild(figure); 
    }
}


async function getAllCategories() {
    const categories = await fetch("http://localhost:5678/api/categories").then(d => d.json());
    return categories;
}

function filtersButton(categoriesArray){  
    const filtersHTML = document.getElementById("filtersButton");
    
    creatAndAppendButton(`Tous`,filtersHTML);    
    for (const categorie of categoriesArray) {
        console.log(categorie);        
        creatAndAppendButton(categorie.name, filtersHTML);
    }
}
/**
* Funtion use for creat a button.
* @param {Display text on button} labelButton 
* @param {Where to put button on page} locationToAppend 
* <span id="filtersButton">
* </span>
*/
function creatAndAppendButton(labelButton, locationToAppend) {
    const button = document.createElement("button");
    
    // Creat a class for labelButton to use it in CSS
    button.setAttribute(`class`, `categorieButton`);

    const nameButton = document.createTextNode(labelButton);
    button.appendChild(nameButton);
    locationToAppend.appendChild(button);
}

