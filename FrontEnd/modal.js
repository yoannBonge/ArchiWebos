// Éléments dont on se servira au gré du code pour éviter les problèmes de scope.
const gallery = document.querySelector(".gallery");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const modalMainContent = document.querySelector(".modal-main-content");
const editContainer = document.querySelector(".edit-content");
const backButtonContainer = document.createElement("div");
backButtonContainer.className = "back-button";
let selectedFile = "";
const categoriesDropList = document.createElement("select");
categoriesDropList.setAttribute("id", "categories");
const emptyOption = document.createElement("option");
emptyOption.className = "empty-option";

// Ici, on demande les catégories à l'API pour ne les inclure qu'une seule fois dans la liste déroulante
// qui se trouvera dans le formulaire d'ajout de projet.
addCategoriesInDropList();

async function addCategoriesInDropList() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  categoriesDropList.appendChild(emptyOption);
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categoriesDropList.appendChild(option);
  });
}

//============================PARTIE OPEN/CLOSE MODAL============================

// Lorsqu'on clique sur un élément ayant la classe "modal-trigger", on switche l'affichage de la modale.
// Donc en l'occurence, on fera disparaître la modale.
modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    toggleModal();
  });
});

// La fonction qui affiche la modale après l'avoir vidée, pour que son contenu ne soit pas dupliqué
// à chaque ouverture/fermeture, étant donné que l'on utilise un toggle.
function toggleModal() {
  backButtonContainer.remove();
  modalMainContent.innerHTML = "";
  editContainer.innerHTML = "";
  const modalContainer = document.getElementById("user-modal");
  modalContainer.classList.toggle("active");
  changeModalTitle();
  displayGalleryModal();
}

//============================PARTIE AFFICHAGE PROJETS MODALE============================

function displayGalleryModal() {
  const addButton = document.createElement("button");
  addButton.textContent = "Ajouter une photo";
  addButton.className = "add-photo";
  addButton.addEventListener("click", () => {
    addProjectFeature();
  });
  const deleteGalleryButton = document.createElement("button");
  deleteGalleryButton.textContent = "Supprimer la galerie";
  deleteGalleryButton.className = "delete-gallery";
  editContainer.append(addButton, deleteGalleryButton);
  getProjectsInModal();
}

async function getProjectsInModal() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  displayProjectsInModal(data);
}

function displayProjectsInModal(works) {
  modalMainContent.innerHTML = "";
  // On crée pour chaque projet une "fiche" qui s'affichera dans la modale.
  works.forEach((project) => {
    const projectBox = document.createElement("div");
    projectBox.classList.add("modal-project");
    projectBox.setAttribute("id", project.id);

    const imageProject = document.createElement("img");
    imageProject.classList.add("modal-img");
    imageProject.src = project.imageUrl;

    const edit = document.createElement("div");
    edit.classList.add("modal-edit");
    edit.textContent = "éditer";
    // On appelle la fonction qui génère un bouton pour chaque projet afin de pouvoir le supprimer.
    addDeleteProjectFeature(project, projectBox);

    projectBox.appendChild(imageProject);
    projectBox.appendChild(edit);
    modalMainContent.appendChild(projectBox);
  });
}

//============================PARTIE SUPPRESSION PROJETS============================

function addDeleteProjectFeature(project, projectBox) {
  const deleteProjectIcon = document.createElement("div");
  deleteProjectIcon.className = "delete-project";

  const trashCanIcon = document.createElement("i");
  trashCanIcon.className = "fa-solid fa-trash-can";

  const squareIcon = document.createElement("i");
  squareIcon.className = "fa-solid fa-square";

  deleteProjectIcon.append(trashCanIcon, squareIcon);
  deleteProjectIcon.setAttribute("id", project.id);
  deleteProjectIcon.addEventListener("click", (event) => {
    event.preventDefault();
    const projectId = event.currentTarget.getAttribute("id");
    const confirmation = window.confirm(
      "Êtes-vous sûr(e) de vouloir supprimer ce projet du site ?"
    );

    if (confirmation) {
      deleteProject(projectId);
    } else {
      return;
    }
  });
  projectBox.appendChild(deleteProjectIcon);
}

// La fonction qui supprime le projet, de la modale et de la galerie principale.
async function deleteProject(projectId) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const deletedProjectModal = document.querySelector(
      `.modal-project[id="${projectId}"]`
    );
    if (deletedProjectModal) {
      deletedProjectModal.remove();

      const deletedProjectGallery = document.querySelector(
        `.gallery figure[id="${projectId}"]`
      );
      if (deletedProjectGallery) {
        deletedProjectGallery.remove();
      }
    }
  } else {
    alert("Échec de la tentative de suppression de la ressource");
  }
}

//============================PARTIE AJOUT PROJET============================

// La fonction qui modifie le contenu de la modale pour afficher l'interface servant à ajouter un projet
// dans le site.
function addProjectFeature() {
  // On appelle la fonction qui génère la flèche de retour à la galerie, dans la modale.
  generateBackToGallery();

  const modalTitle = document.getElementById("modal-title");
  modalTitle.textContent = "Ajout photo";

  modalMainContent.innerHTML = "";
  editContainer.innerHTML = "";
  // On appelle la fonction qui génère la page modale pour l'ajout de projet.
  generateAddProjectForm();
}

function generateBackToGallery() {
  const backToModalGallery = document.createElement("i");
  backToModalGallery.className = "fa-solid fa-arrow-left";
  backToModalGallery.classList.add("back-to-modal-gallery");

  backButtonContainer.appendChild(backToModalGallery);

  const modal = document.querySelector(".modal");
  const closeButton = document.querySelector(".close-button");
  modal.insertBefore(backButtonContainer, closeButton);

  backToModalGallery.addEventListener("click", () => {
    setTimeout(changeModalTitle, 2);
    backButtonContainer.remove();
    displayGalleryModal();
  });
}

// Cette fonction nous sert pour switcher le titre de la modale, selon que l'on soit dans la galerie
// ou dans l'interface d'ajout de projet.
function changeModalTitle() {
  const modalTitle = document.getElementById("modal-title");
  modalTitle.textContent = "Galerie photo";
}

// Cette fonction peut paraître bien longue, mais c'est parce-qu'elle crée chaque élément de l'interface
// d'ajout de projet.
function generateAddProjectForm() {
  const addProjectForm = document.createElement("form");
  addProjectForm.className = "add-project-form";

  const imageCanva = document.createElement("div");
  imageCanva.className = "image-canva";

  const imageIcon = document.createElement("i");
  imageIcon.className = "fa-regular fa-image";
  imageIcon.classList.add("image-icon");

  const addPhotoButton = document.createElement("button");
  addPhotoButton.textContent = "+ Ajouter photo";
  addPhotoButton.className = "add-photo-btn";

  const photoInput = document.createElement("input");
  photoInput.className = "photo-input";
  photoInput.type = "file";
  photoInput.accept = ".jpg, .jpeg, .png";
  // Ici, on cache l'input car on se sert simplement de son fonctionnement, sans avoir besoin de l'afficher.
  // Le bouton pour ajouter une photo suffit.
  photoInput.style.display = "none";
  photoInput.required = true;

  addPhotoButton.addEventListener("click", function (event) {
    event.preventDefault();
    photoInput.click();
  });

  const addPhotoRules = document.createElement("p");
  addPhotoRules.textContent = "jpg, png : 4mo max";
  addPhotoRules.className = "photo-rules";

  imageCanva.append(imageIcon, addPhotoButton, addPhotoRules);

  const titleInput = document.createElement("div");
  titleInput.className = "title-input";

  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "title");
  titleLabel.textContent = "Titre";
  const titleField = document.createElement("input");
  titleField.setAttribute("id", "title");
  titleField.type = "text";
  titleInput.append(titleLabel, titleField);

  const categoryInput = document.createElement("div");
  categoryInput.className = "category-input";

  const categoryLabel = document.createElement("label");
  categoryLabel.setAttribute("for", "categories");
  categoryLabel.textContent = "Catégorie";
  emptyOption.selected = true;
  categoryInput.append(categoryLabel, categoriesDropList);

  const separationLine = document.createElement("div");
  separationLine.className = "line";

  const validButton = document.createElement("button");
  validButton.type = "submit";
  validButton.setAttribute("id", "add-photo-valid");
  validButton.textContent = "Valider";
  validButton.disabled = true;

  addProjectForm.append(
    imageCanva,
    titleInput,
    categoryInput,
    separationLine,
    validButton
  );

  modalMainContent.append(addProjectForm);

  //============================PARTIE GESTION DISPONIBILITÉ BOUTON "VALIDER" - AJOUT PROJET============================

  // On appelle pour le champ "Titre" et pour la photo choisie "checkFormValidity", la fonction qui
  // vérifie si le formulaire est bien rempli, auquel cas le bouton "Valider" devient disponible au click.
  titleField.addEventListener("input", () => {
    checkFormValidity(titleField, photoInput, categoriesDropList, validButton);
  });

  // Là, le problème est que si l'user souhaite entrer un titre à son projet avant de charger l'image,
  // le bouton ne s'active pas (peut-être à cause du fonctionnement inhérent aux input). C'est pourquoi
  // l'on écoute le "blur" de l'input pour lui assigner aussi un "checkFormValidity".
  titleField.addEventListener("blur", () => {
    checkFormValidity(titleField, photoInput, categoriesDropList, validButton);
  });

  // On utilise dans cet écouteur un bref délai de manière à ce que le "click" puis le "blur" soient bien pris en
  // compte par le navigateur. On simule ces évènements pour que le "checkFormValidity" fonctionne correctement
  // afin d'activer le bouton lorsque tous les champs sont remplis, peu importe l'ordre dans lequel on les remplit.
  photoInput.addEventListener("change", async () => {
    // On appelle la fonction qui affiche l'image en s'assurant qu'elle convienne aux restrictions de taille
    // et de type de fichier.
    displaySelectedImage(photoInput, imageCanva);
    titleField.click();
    await new Promise((resolve) => setTimeout(resolve, 2));
    titleField.blur();
    displayReturnButton(imageCanva);
    checkFormValidity(titleField, photoInput, categoriesDropList, validButton);
  });

  categoriesDropList.addEventListener("change", () => {
    checkFormValidity(titleField, photoInput, categoriesDropList, validButton);
  });

  // On appelle la fonction qui ajoute le projet.
  enableAddProject(validButton, titleField);
}

// La fonction rend actif le bouton "Valider" si les champs du formulaire sont bien remplis.
function checkFormValidity(
  titleField,
  photoInput,
  categoriesDropList,
  validButton
) {
  const titleValue = titleField.value.trim();
  const selectedImage = document.querySelector(".selected-image");
  const selectedCategoryId = categoriesDropList.value;

  if (titleValue && selectedImage && selectedCategoryId) {
    validButton.disabled = false;
  } else {
    validButton.disabled = true;
  }
}

function displaySelectedImage(photoInput, imageCanva) {
  // On pointe le fichier choisi ([0] car on n'a choisi qu'un seul fichier) en
  // l'obtenant dans la liste "files" générée par l'input après le choix du fichier par l'user.
  selectedFile = photoInput.files[0];
  if (selectedFile != "") {
    // On crée une liste de types de fichiers acceptés ainsi qu'une variable définissant la taille
    // maximale que l'on acceptera pour le fichier.
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 4 * 1024 * 1024;
    // Si le fichier a un type inclu dans la liste de types et une taille qui n'excède pas la taille maximale
    // qu'on a défini, on se sert de "FileReader" pour lire ce fichier puis fournir une URL qui constituera la
    // source du fichier qu'on affichera ensuite dans l'espace dédié dans la modale.
    if (
      allowedTypes.includes(selectedFile.type) &&
      selectedFile.size <= maxSize
    ) {
      const selectedImage = document.createElement("img");
      selectedImage.className = "selected-image";
      const reader = new FileReader();
      reader.onload = function () {
        selectedImage.src = reader.result;
        imageCanva.innerHTML = "";
        imageCanva.appendChild(selectedImage);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      alert(
        "Le fichier doit être une image JPG ou PNG et ne doit pas dépasser 4 Mo."
      );
    }
  }
}

function displayReturnButton(imageCanva) {
  const returnButton = document.createElement("button");
  returnButton.textContent = "retirer";
  returnButton.className = "return-button";
  returnButton.addEventListener("click", () => {
    addProjectFeature();
  });
  imageCanva.appendChild(returnButton);
}

//============================PARTIE VALIDATION - AJOUT PROJET============================

// La fonction qui obtient les éléments du projet que l'user voudra ajouter, puis qui communique avec
// l'API pour finaliser l'ajout de projet.
function enableAddProject(validButton) {
  validButton.addEventListener("click", (event) => {
    event.preventDefault();
    const title = document.getElementById("title");
    const titleValue = title.value.trim();
    const selectedImage = selectedFile;
    const selectedCategoryId = categoriesDropList.value;

    if (titleValue && selectedImage && selectedCategoryId) {
      fetchAddProject(titleValue, selectedImage, selectedCategoryId);
    } else {
      alert("Veuillez remplir tous les champs obligatoires.");
    }
  });
}

async function fetchAddProject(titleValue, selectedImage, selectedCategoryId) {
  const formData = new FormData();
  formData.append("image", selectedImage);
  formData.append("title", titleValue);
  formData.append("category", selectedCategoryId);
  const token = sessionStorage.getItem("token");
  console.log(token);
  console.log(selectedImage);
  console.log(titleValue);
  console.log(selectedCategoryId);

  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  if (response.ok) {
    console.log("Votre projet a bien été ajouté à la base de données");
  }
}
