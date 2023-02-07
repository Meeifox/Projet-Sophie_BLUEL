
const loginForm = document.getElementById(`loginForm`);
loginForm.addEventListener(`submit`, function(event) {
    event.preventDefault();
    
    const username = document.getElementById(`username`).value;
    const password = document.getElementById(`password`).value;
    
    // Vérification des informations de connexion ici (peut-être en envoyant une requête au serveur)
    if (username === `admin` && password === `secret`) {
        // Redirection à la page d`accueil ou affichage d`un message de bienvenue
        window.location.replace(`/index.html`);
    } else {
        alert(`Nom d'utilisateur ou mot de passe incorrect.`);
    }
});
