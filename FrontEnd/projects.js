//============================PARTIE PROJET============================

//Je crée une variable qui me servira à stocker les projets selon qu'ils sont filtrés ou non.
let arrayWorks = "";

//Je crée la fonction async qui demande à l'API de lui fournir la liste des projets.
async function getProjects() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  //Je stocke aussi la réponse de l'API dans la variable dont je me servirai pour filtrer les projets.
  arrayWorks = data;
  //J'appelle la fonction qui affiche les projets.
  displayProjects(data);
}

function displayProjects(works) {
  const gallery = document.querySelector(".gallery");
  //Je crée une nouvelle liste "projectHTML" qui va chercher dans chaque projet de "works" son image et son nom.
  const projectsHTML = works.map((project) => {
    let imageProject = project.imageUrl;
    let titleProject = project.title;
    //Je demande qu'on me retourne (toujours pour chaque projet) un bloc HTML avec son image et son nom.
    return `
      <figure>
        <img src="${imageProject}">
        <figcaption>${titleProject}</figcaption>
      </figure>
    `;
  });
  //J'ajoute tous les éléments (générés dans ma nouvelle liste), dans ma balise gallery.
  //La méthode "join" fusionne toutes les balises <figure> générées afin que le tout soit envoyé dans le
  //HTML non pas sous la forme d'un tableau mais d'une seule chaîne de caractères.
  gallery.innerHTML = projectsHTML.join("");
}

//============================PARTIE FILTRES============================

//Je crée la fonction async qui demande à l'API de lui fournir la liste des catégories de projets.
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  //J'appelle la fonction qui génèrera des boutons de filtres.
  generateButtons(categories);
}

//La fonction génèrera un bouton de filtre par catégorie.
function generateButtons(categories) {
  const filtersButtons = document.querySelector(".filters-buttons");
  //Je profite de cette fonction pour d'abord créer un bouton "Tous" pour éviter de le faire ailleurs.
  const buttonAll = document.createElement("button");
  buttonAll.textContent = "Tous";
  buttonAll.addEventListener("click", () => {
    displayProjects(arrayWorks);
  });
  //Je crée une nouvelle liste "buttons" qui octroiera à chaque catégorie un bouton de filtre
  //nommé par le nom de sa catégorie.
  const buttons = categories.map((project) => {
    const button = document.createElement("button");
    button.textContent = project.name;
    //Au "click", j'appelle la fonction pour filtrer, je stocke le résultat dans une variable
    //que je passe en argument à la fonction qui affiche les projets.
    button.addEventListener("click", () => {
      let filteredWorks = filterArrayByNames(arrayWorks, project.name);
      displayProjects(filteredWorks);
    });
    //Je demande qu'on me retourne pour chaque catégorie son bouton.
    return button;
  });
  //J'ajoute dans ma balise "filtersButtons" mon bouton "Tous" ainsi que tous mes boutons générés.
  filtersButtons.append(buttonAll, ...buttons);
}

//La fonction filtre les works pour ne retourner que ses éléments dont le nom est identique à ceux de l'autre liste.
function filterArrayByNames(arrayWorks, categoryName) {
  return arrayWorks.filter((project) => {
    return project.category.name === categoryName;
  });
}

getProjects();
getCategories();
