//La fonction principale qui demande l'authentification lorsque le formulaire est rempli puis
//que le bouton "Se connecter" est cliqué.
function logIn() {
  //On permet de revenir à l'accueil en cliquant sur "Sophie Bluel".
  canGoBackToHomepage();

  //On pointe vers le formulaire qui servira à se connecter.
  let logInForm = document.querySelector("form");

  //À la soumission du formulaire, on bloque le reload de la page puis on soumet la tentative
  //de connexion. Si elle est validée, on stocke le token et on vérifie la connexion pour enfin
  //renvoyer l'utilisateur sur la page d'accueil, ou en cas d'échec, alerter.
  logInForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitForm();
  });

  //Si l'on appuie sur la touche "Entrée", on fait de même.
  logInForm.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitForm();
    }
  });
}

//La fonction qui permet de revenir à l'accueil à partir de la page de connexion.
function canGoBackToHomepage() {
  const homePageLink = document.querySelector("h1");
  homePageLink.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

//On crée une fonction qui identifie les valeurs entrées par l'utilisateur puis qui les soumet
//à l'API.
function submitForm() {
  let emailField = document.getElementById("mail");
  let email = emailField.value;
  let passField = document.getElementById("pass");
  let pass = passField.value;
  fetchLogIn(email, pass);
}

//La fonction async qui demande à l'API l'authentification de l'utilisateur, puis qui vérifie que
//l'authentification a bien eu lieu.
async function fetchLogIn(mail, password) {
  //On crée le body qui contiendra les informations prises en compte pour authentifier l'utilisateur,
  //conformément à la documentation de l'API.
  const body = {
    email: mail,
    password: password,
  };
  const response = await fetch("http://localhost:5678/api/users/login", {
    //Étant donné le type de requête POST (non par défaut), on le précise puis on ajoute le header.
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    //On convertit le body en chaîne JSON pour que le serveur l'interprête.
    body: JSON.stringify(body),
  });

  const data = await response.json();
  //Si on a un token (ce qui signifie que la connexion est validée), on le stocke dans le
  //localStorage pour les actions que l'utilisateur pourra faire en tant que connecté.
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  //On s'assure que l'authentification s'est bien déroulée et l'on renvoie à l'accueil.
  checkAuthentication();
}

//La fonction qui vérifie si un token est bien stocké dans le localStorage, auquel cas cela
//signifie que l'utilisateur est bien connecté et donc on le renvoie à la page d'accueil.
function checkAuthentication() {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "index.html";
  } else {
    alert("Échec de la connexion");
  }
}

logIn();
