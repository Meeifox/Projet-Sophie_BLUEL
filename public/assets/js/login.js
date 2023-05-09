/**
* callback Function of a click on the submit button in login form
* 
*/
async function connexion(event) {
    event.preventDefault();
    event.stopPropagation();
    LOGIN_FORM.classList.remove(ERROR);
    const email = document.getElementById(`emailLogin`).value;
    const password = document.getElementById(`passwordLogin`).value;

    if (email && password) {
        login(email, password)
        .then(data => {
            BODY.classList.add(CONNECTED);
            BODY.classList.remove(IN_LOGIN);
            // expiration date, for the token ( 1 hour)
            const expirationInSeconds = 3600;
            const expirationDate = new Date(new Date().getTime() + expirationInSeconds * 1000);

            // save the token and the expiration date in localstorage
            localStorage.setItem(TOKEN, JSON.stringify({
              data: data.token,
              expiration: expirationDate.toJSON()
            }));
        })
        .catch(error => {
            LOGIN_FORM.classList.add(ERROR);
        });
    }
}

/**
* this function ping backend with email and password, to see if we can login
* 
*/
async function login(email, password) {
    const response = await fetch(`${baseURL}/api/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}