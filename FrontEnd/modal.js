const modalContainer = document.getElementById("user-modal");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const modalGallery = document.querySelector(".modal-gallery");

//============================PARTIE OPEN/CLOSE MODAL============================

modalTriggers.forEach((trigger) =>
  trigger.addEventListener("click", toggleModal)
);

function toggleModal() {
  const modalContainer = document.getElementById("user-modal");
  modalContainer.classList.toggle("active");
}

//============================PARTIE PROJETS MODALE============================

async function getProjects() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  displayProjectsInModal(data);
}

function displayProjectsInModal(works) {
  for (project of works) {
    const projectBox = document.createElement("div");
    projectBox.classList.add("modal-project");

    const imageProject = document.createElement("img");
    imageProject.classList.add("modal-img");
    imageProject.src = project.imageUrl;

    const deleteProject = document.createElement("div");
    deleteProject.className = "delete-project";

    const trashCanIcon = document.createElement("i");
    trashCanIcon.className = "fa-solid fa-trash-can";

    const squareIcon = document.createElement("i");
    squareIcon.className = "fa-solid fa-square";

    deleteProject.append(trashCanIcon, squareIcon);

    const edit = document.createElement("div");
    edit.classList.add("modal-edit");
    edit.textContent = "éditer";

    projectBox.appendChild(imageProject);
    projectBox.appendChild(deleteProject);
    projectBox.appendChild(edit);
    modalGallery.appendChild(projectBox);
  }
}

getProjects();
