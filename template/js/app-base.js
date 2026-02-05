const byId = (id) => document.getElementById(id);

// Chiude tutti i menu <details> aperti (utile se hai piu menu nella toolbar).
const closeAllMenus = () => {
  document.querySelectorAll("details[open]").forEach((details) => {
    details.removeAttribute("open");
  });
};

// Apre un dialog prendendo il contenuto da un <template>.
const openTemplateDialog = ({ dialogId, titleId, bodyId, title, templateId }) => {
  const dialog = byId(dialogId);
  const titleEl = byId(titleId);
  const bodyEl = byId(bodyId);
  const template = byId(templateId);

  if (!dialog || !titleEl || !bodyEl || !template) {
    return;
  }

  closeAllMenus();
  titleEl.textContent = title;
  bodyEl.replaceChildren(template.content.cloneNode(true));

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
    return;
  }
  dialog.setAttribute("open", "");
};

// Permette di avere un solo menu aperto alla volta.
const bindSingleOpenMenu = (selector) => {
  document.querySelectorAll(selector).forEach((menu) => {
    menu.addEventListener("toggle", () => {
      if (!menu.open) {
        return;
      }
      document.querySelectorAll(selector).forEach((other) => {
        if (other !== menu) {
          other.removeAttribute("open");
        }
      });
    });
  });
};

// Chiudi il dialog cliccando sul backdrop (quando supportato).
const bindDialogBackdropClose = (dialogId) => {
  const dialog = byId(dialogId);
  if (!dialog) {
    return;
  }
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      if (typeof dialog.close === "function") {
        dialog.close();
        return;
      }
      dialog.removeAttribute("open");
    }
  });
};
