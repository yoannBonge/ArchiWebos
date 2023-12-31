//============================PARTIE PROJETS============================

// On crée une variable qui servira à stocker les projets selon qu'ils sont filtrés ou non.
let arrayWorks = "";

// On crée la fonction async qui demande à l'API de lui fournir la liste des projets.
async function getProjects() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  // On stocke aussi la réponse de l'API dans la variable dont on se servira pour filtrer les projets.
  arrayWorks = data;
  // On appelle la fonction qui affiche les projets.
  displayProjects(data);
}

function displayProjects(works) {
  const gallery = document.querySelector(".gallery");
  works.forEach((project) => {
    const projectFigure = document.createElement("figure");
    projectFigure.setAttribute("id", project.id);

    const imageProject = document.createElement("img");
    imageProject.src = project.imageUrl;

    const titleProject = document.createElement("figcaption");
    titleProject.textContent = `${project.title}`;

    projectFigure.append(imageProject, titleProject);

    gallery.appendChild(projectFigure);
  });
}

//============================PARTIE FILTRES============================

// On crée la fonction qui demande à l'API de lui fournir la liste des catégories de projets.
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  //On appelle la fonction qui génèrera des boutons de filtres.
  generateButtons(categories);
}

// On crée la fonction qui génère les boutons de filtres.
function generateButtons(categories) {
  const filtersButtons = document.querySelector(".filters-buttons");
  // On profite de cette fonction pour d'abord créer un bouton "Tous".
  const buttonAll = document.createElement("button");
  buttonAll.textContent = "Tous";
  buttonAll.addEventListener("click", () => {
    gallery.innerHTML = "";
    displayProjects(arrayWorks);
  });
  // On ajoute le bouton "Tous" aux filtres.
  filtersButtons.appendChild(buttonAll);
  // Dans une boucle, on parcourt les catégories. Pour chacune, on crée un bouton qu'on nomme par sa catégorie.
  // Au click de chaque bouton, on filtre la galerie en fonction du nom de sa catégorie.
  for (category of categories) {
    const button = document.createElement("button");
    const name = category.name;
    button.textContent = category.name;
    button.addEventListener("click", () => {
      let filteredWorks = filterArrayByNames(arrayWorks, name);
      gallery.innerHTML = "";
      displayProjects(filteredWorks);
    });
    filtersButtons.appendChild(button);
  }
}

// On crée la fonction qui filtre la liste des projets pour ne retourner que ses éléments dont le nom
// de catégorie est identique à ceux de la liste des catégories.
function filterArrayByNames(arrayWorks, categoryName) {
  return arrayWorks.filter((project) => {
    return project.category.name === categoryName;
  });
}
// La fonction qui ajoute le bouton "modifier" ainsi que la bandeau noir en haut de page si l'user est connecté,
// et qui remplace le lien "login" par "logout", de manière à ce qu'il puisse se déconnecter.
function updatePageForLoggedUser() {
  const token = sessionStorage.getItem("token");
  if (token === null) {
    return;
  } else {
    addLoggedUserTopBanner();
    addModifyButton();
    let logInLink = document.querySelector("nav li a[href='login.html']");
    logInLink.textContent = "logout";
    logInLink.addEventListener("click", () => {
      alert("Vous êtes déconnecté(e).");
      sessionStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }
}
// La fonction qui crée et affiche le bouton "modifier" pour accéder à la modale d'édition de la galerie.
function addModifyButton() {
  let token = sessionStorage.getItem("token");
  if (token === null) {
    return;
  } else {
    addModifyUserImageButton();
    const modifyButton = document.createElement("a");
    modifyButton.href = "#user-modal";

    const iconModify = document.createElement("i");
    iconModify.className = "fa-regular fa-pen-to-square";
    iconModify.classList.add("icon-modify");

    const textNode = document.createTextNode("modifier");

    modifyButton.appendChild(iconModify);
    modifyButton.appendChild(textNode);
    modifyButton.classList.add("modify-gallery-button");
    // La fonction toggleModal est définie dans la page "modal.js". Elle affiche (et masque) la modale.
    modifyButton.addEventListener("click", toggleModal);

    const portfolioTitle = document.querySelector(
      "#portfolio .portfolio-title"
    );

    portfolioTitle.appendChild(modifyButton);
  }
}

function addModifyUserImageButton() {
  const modifyButton = document.createElement("a");

  const iconModify = document.createElement("i");
  iconModify.className = "fa-regular fa-pen-to-square";
  iconModify.classList.add("icon-modify");

  const textNode = document.createTextNode("modifier");

  modifyButton.appendChild(iconModify);
  modifyButton.appendChild(textNode);
  modifyButton.classList.add("modify-image-button");

  const userImage = document.querySelector("#introduction");

  userImage.insertAdjacentElement("afterend", modifyButton);
}

function addLoggedUserTopBanner() {
  const banner = document.createElement("div");
  banner.className = "banner";

  const bannerTitle = document.createElement("div");

  const editLogo = document.createElement("i");
  editLogo.className = "fa-regular fa-pen-to-square";
  editLogo.classList.add("icon-modify");

  const textNode = document.createTextNode("Mode édition");

  bannerTitle.appendChild(editLogo);
  bannerTitle.appendChild(textNode);
  bannerTitle.classList.add("banner-title");

  banner.appendChild(bannerTitle);

  const publishButton = document.createElement("button");
  publishButton.className = "publish";
  publishButton.textContent = "publier les changements";

  banner.appendChild(publishButton);

  const header = document.querySelector("header");

  header.insertAdjacentElement("beforebegin", banner);
}

getProjects();
updatePageForLoggedUser();
getCategories();
