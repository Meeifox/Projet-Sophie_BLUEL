function docIsReady() {
    let worksArray = [];
    let categoriesArray = [];

    // Check if the worksArray and categoriesArray exist in the local storage
    if (localStorage.getItem(`worksArray`) && localStorage.getItem(`categoriesArray`)) {
        worksArray = JSON.parse(localStorage.getItem(`worksArray`));
        categoriesArray = JSON.parse(localStorage.getItem(`categoriesArray`));

        // Construct works items and filter buttons
        constructWorksItems(worksArray);
        filtersButton(categoriesArray);

    } else {
        // Call API to get all works
        getAllWorks().then(value => {
            worksArray = value;
            localStorage.setItem(`worksArray`, JSON.stringify(worksArray));
            constructWorksItems(worksArray);
        });

        // Call API to get all categories
        getAllCategories().then(value => {
            categoriesArray = value;
            localStorage.setItem(`categoriesArray`, JSON.stringify(categoriesArray));
            filtersButton(categoriesArray);
        });
    }
}

/**
* Function calling API to get all works
* @returns promise of works in array
*/
async function getAllWorks() {
    const works = await fetch(`http://localhost:5678/api/works`).then(d => d.json());
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
* @param
*/
function constructWorksItems(worksArray, selectedCategory) {
    if (!selectedCategory) {
        selectedCategory = 0;
    }
    // get the Galery HTML, where i will add all works
    const myGalleryHTML = document.querySelector(`#portfolio > .gallery`);
    myGalleryHTML.innerHTML = ``;
    // Iterate on works array
    for (const work of worksArray) {
        if (selectedCategory == 0 || work.categoryId == selectedCategory) {
            const figure = document.createElement(`figure`);  
            //Create the img element
            const imageGallery = document.createElement(`img`);
            imageGallery.setAttribute(`alt`, work.title);
            imageGallery.setAttribute(`src`, work.imageUrl);
            imageGallery.setAttribute(`crossOrigin`, `Anonymous`);// for CORS policies
            //Create the figCaption element
            const figcaption = document.createElement(`figcaption`);
            figcaption.innerHTML = work.title;            
            //append everything ( img and figaption -> figure -> gallery)
            figure.appendChild(imageGallery);
            figure.appendChild(figcaption);
            myGalleryHTML.appendChild(figure); 
        }
    }
}


async function getAllCategories() {
    const categories = await fetch(`http://localhost:5678/api/categories`).then(d => d.json());
    return categories;
}
/**
* 
* @param {Backend categories list } categoriesArray 
*/
function filtersButton(categoriesArray){  
    const filtersHTML = document.getElementById(`filtersButton`);
    
    creatAndAppendButton(`Tous`,0, filtersHTML);    
    for (const category of categoriesArray) {                
        creatAndAppendButton(category.name,category.id, filtersHTML);
    }
}
/**
* Funtion use for creat a button.
* @param {Display text on button} buttonLabel 
* @param {the id of category} categoryId
* @param {Where to put button on page} locationToAppend 
* <span id="filtersButton">
* </span>
*/
function creatAndAppendButton(buttonLabel, categoryId, locationToAppend) {
    const button = document.createElement(`button`);
    
    // Creat a class for labelButton to use it in CSS    
    button.setAttribute(`class`, `buttonCategory`);
    button.setAttribute(`data-id`, categoryId); 
    
    const buttonName = document.createTextNode(buttonLabel);
    button.appendChild(buttonName);
    locationToAppend.appendChild(button);  
    
    button.addEventListener(`click`, filterWorksCallback);
}
/**
 * 
 * @param {The event bubbled up by JavaScript for a click} event 
 */
function filterWorksCallback(event) {
    const target = event.target;
    const selectedCategory = parseInt(target.getAttribute(`data-id`));
    constructWorksItems(JSON.parse(localStorage.getItem(`worksArray`)), selectedCategory);
    
}




