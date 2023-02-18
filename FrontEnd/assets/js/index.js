const isLocal = window.location.protocol === `file:`;
const baseURL = isLocal ? `http://localhost:5678` : `${window.location.origin}`;
const BODY = document.querySelector(`body`);
const LOGIN_FORM = document.querySelector(`#loginForm`);
const CONNECTED = `connected`,
TOKEN = `token`,
ERROR = `error`,
WORKS_ARRAY = `worksArray`,
CATEG_ARRAY = `categoriesArray`,
IN_LOGIN = `inLogin`;



function docIsReady(softRefresh) {
    setUpLocalStorage();
    fetchDatas().then(([worksArray, categoriesArray]) => {
        // Construct works items and filter buttons
        constructWorksItems(worksArray);
        if (!softRefresh){
            filtersButton(categoriesArray);
        }        
    });   
    if (!softRefresh) {
        handleClickNavigation();
        LOGIN_FORM.addEventListener(`submit`, connexion);
    }    
    
    handleClickModification(softRefresh);
    
}

/**
* delete works from localstorage, and check if we are connected from less an hour
* 
*/
function setUpLocalStorage() {
    localStorage.removeItem(WORKS_ARRAY);
    localStorage.removeItem(CATEG_ARRAY);
    const connected = JSON.parse(localStorage.getItem(TOKEN));
    if (connected && new Date(connected.expiration) >= new Date()) {
        BODY.classList.add(CONNECTED);
    } else {
        localStorage.removeItem(TOKEN);
    }
}

/**
* add click event on each navigation link
* 
*/
function handleClickNavigation() {
    const navigationLinks = document.querySelectorAll(`#navigationLinks li`);
    navigationLinks.forEach(link => {
        link.addEventListener(`click`, (e) => {
            switch(e.target.innerHTML) {
                case `projets` :
                BODY.classList.remove(IN_LOGIN);
                break;
                case `login` :
                BODY.classList.add(IN_LOGIN);
                break;
                case `logout` :
                localStorage.removeItem(TOKEN);
                BODY.classList.remove(CONNECTED);
                default:
                break;
            }
        });
    });
}

/**
* Fetch works and Categories from backend
*   if localstorage is already set, no need to ping backend again
* 
*/
async function fetchDatas() {
    let worksArray = [];
    let categoriesArray = [];
    
    // Check if the worksArray and categoriesArray exist in the local storage
    if (localStorage.getItem(WORKS_ARRAY) && localStorage.getItem(CATEG_ARRAY)) {
        worksArray = JSON.parse(localStorage.getItem(WORKS_ARRAY));
        categoriesArray = JSON.parse(localStorage.getItem(CATEG_ARRAY));
        return [worksArray, categoriesArray];
    } else {
        return Promise.all([
            getAllWorks().then(value => {
                worksArray = value;
                localStorage.setItem(WORKS_ARRAY, JSON.stringify(worksArray));
                return worksArray;
            }),
            getAllCategories().then(value => {
                categoriesArray = value;
                localStorage.setItem(CATEG_ARRAY, JSON.stringify(categoriesArray));
                return categoriesArray;
            })
        ]);
    }
}

/**
* Function calling API to get all works
* @returns promise of works in array
*/
async function getAllWorks() {
    const works = await fetch(`${baseURL}/api/works`).then(d => d.json());
    return works;
}

async function getAllCategories() {
    const categories = await fetch(`${baseURL}/api/categories`).then(d => d.json());
    return categories;
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

/**
* 
* @param {Backend categories list } categoriesArray 
*/
function filtersButton(categoriesArray){  
    const filtersHTML = document.getElementById(`filtersButton`);
    
    const buttonAll = creatAndAppendButton(`Tous`,0, filtersHTML, `buttonCategory`);  
    buttonAll.addEventListener(`click`, filterWorksCallback);  
    for (const category of categoriesArray) {                
        const buttonByCategory = creatAndAppendButton(category.name,
            category.id,
            filtersHTML,
            `buttonCategory`
            );
            buttonByCategory.addEventListener(`click`, filterWorksCallback);
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
    function creatAndAppendButton(buttonLabel, dataId, locationToAppend, classList) {
        const button = document.createElement(`button`);
        
        // Creat a class for labelButton to use it in CSS    
        button.setAttribute(`class`, classList);
        button.setAttribute(`data-id`, dataId); 
        
        const buttonName = document.createTextNode(buttonLabel);
        button.appendChild(buttonName);
        locationToAppend.appendChild(button);   
        return button;   
    }
    /**
    * callback function of filter click
    * @param {The event bubbled up by JavaScript for a click} event 
    */
    function filterWorksCallback(event) {
        const target = event.target;
        resetSelectedClass();
        target.classList.add(`selected`);
        const selectedCategory = parseInt(target.getAttribute(`data-id`));
        
        fetchDatas().then(() => {
            constructWorksItems(JSON.parse(localStorage.getItem(WORKS_ARRAY)), selectedCategory);
        }); 
    }
    
    /**
    * remove special class on buttons
    * 
    */
    function resetSelectedClass() {
        const buttonCategories = document.querySelectorAll(`.buttonCategory`);
        buttonCategories.forEach(button => {
            button.classList.remove(`selected`);
        });
    }
    
    
    
    
    
    
    