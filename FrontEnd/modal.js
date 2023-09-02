const gallery = document.querySelector(".gallery");
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

async function getProjectsInModal() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  displayProjectsInModal(data);
}

function displayProjectsInModal(works) {
  modalGallery.innerHTML = "";
  works.forEach((project) => {
    const projectBox = document.createElement("div");
    projectBox.classList.add("modal-project");

    const imageProject = document.createElement("img");
    imageProject.classList.add("modal-img");
    imageProject.src = project.imageUrl;

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
        "Êtes-vous sûr de vouloir supprimer ce projet du site ?"
      );

      if (confirmation) {
        deleteProject(projectId);
        alert("Projet supprimé du site");
      } else {
        return;
      }
    });

    const edit = document.createElement("div");
    edit.classList.add("modal-edit");
    edit.textContent = "éditer";

    projectBox.appendChild(imageProject);
    projectBox.appendChild(deleteProjectIcon);
    projectBox.appendChild(edit);
    modalGallery.appendChild(projectBox);
  });
}

async function deleteProject(projectId) {
  const token = localStorage.getItem("token");
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
        `.project[id="${projectId}"]`
      );
      if (deletedProjectGallery) {
        deletedProjectGallery.remove();
      }
    }
  } else {
    console.log("Échec de la tentative de suppression de la ressource");
  }
}

getProjectsInModal();
