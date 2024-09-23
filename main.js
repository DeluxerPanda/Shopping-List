let index = 0;

// Helper function to get URL parameters
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return params;
}

// Helper function to find the maximum index from URL parameters
function getMaxIndexFromParams(params) {
  let maxIndex = 0;
  params.forEach((value, key) => {
    const match = key.match(/itemTextTitel(\d+)/);
    if (match) {
      const currentIndex = parseInt(match[1], 10);
      if (currentIndex > maxIndex) {
        maxIndex = currentIndex;
      }
    }
  });
  return maxIndex;
}

// Generate new box based on title and description
function generateItemBox(id, title, description, stack = 1) {
  return `
<div class="box" id="${id}">
            <div class="itemImgContainer">
                <img class="itemImg" src="no_img_found.png" alt="Shopping item Image">
            </div>
            <div class="itemTextContainer" onclick="editItem(${id})">
                <h1 class="itemTextToEdit">Klicka här för att redigera</h1>
                <h2 class="itemTextTitel">${title}</h2>
                <h2 class="itemTextDiscription">${description}</h2>
            </div>
            <div class="itemStackConatiner">
                <h2 class="itemStackDisplay">${stack}</h2>
                <div class="itemCheckContaineer">
                    <input type="checkbox" class="itemCheck">
                </div>
            </div>
        </div>
    `;
}

// Function to create infinite boxes with dynamic titles and descriptions
function createInfiniteBoxes() {
  const shoppingItemContainer = document.getElementById('shoppingItem');
  const params = getUrlParams();
  index = getMaxIndexFromParams(params) + 1;

  for (let i = 0; i < index; i++) {
    if (params.has(`itemTextTitel${i}`) && params.has(`itemTextDiscription${i}`)) {
      const title = params.get(`itemTextTitel${i}`);
      const description = params.get(`itemTextDiscription${i}`);
      const stack = params.get(`itemStack${i}`) || 1;
      const newBoxHTML = generateItemBox(i, title, description, stack);
      shoppingItemContainer.insertAdjacentHTML('beforeend', newBoxHTML);
    }
  }
}

const dialogEdit = document.getElementById("dialogEdit");
const dialogAdd = document.getElementById("dialogAdd");

function addNewItem() {
  const params = getUrlParams();

  const dialogTitel = document.getElementById('dialogAddTitelInput');
  dialogTitel.value = "Produktnamn";

  const dialogDiscription = document.getElementById('dialogAddDiscriptionInput');
  dialogDiscription.value = "";

  const dialogStack = document.getElementById('dialogAddStackInput');
  dialogStack.value = 1;

  // Open the dialog
  dialogAdd.showModal();

  // Add an event listener for the submit button
  document.getElementById('dialogAddSubmitButton').onclick = function() {
    const newTitle = document.getElementById('dialogAddTitelInput').value;
    const newDescription = document.getElementById('dialogAddDiscriptionInput').value;
    const stack = document.getElementById('dialogAddStackInput').value;
      params.append(`itemTextTitel${index}`, newTitle);
      params.append(`itemTextDiscription${index}`, newDescription);
      params.append(`itemStack${index}`, stack);

      const newUrl = window.location.pathname + '?' + params.toString();
      window.history.pushState({ path: newUrl }, '', newUrl);

      const newBoxHTML = generateItemBox(index, newTitle, newDescription, stack);
      document.getElementById('shoppingItem').insertAdjacentHTML('beforeend', newBoxHTML);
      index++;
      dialogAdd.close();
  };
}

function editItem(id) {
  const params = getUrlParams();
  const titleKey = `itemTextTitel${id}`;
  const descriptionKey = `itemTextDiscription${id}`;
  const stackKey = `itemStack${id}`;

  const currentTitle = params.get(titleKey);
  const currentDescription = params.get(descriptionKey);
  const currentStack = params.get(stackKey);

  // Open the dialog
  dialogEdit.showModal();

  // Set current values in the dialog inputs
  const dialogTitel = document.getElementById('dialogEditTitelInput');
  dialogTitel.value = currentTitle;

  const dialogDiscription = document.getElementById('dialogEditDiscriptionInput');
  dialogDiscription.value = currentDescription;

  const dialogStack = document.getElementById('dialogEditStackInput');
  dialogStack.value = currentStack;

  // Add an event listener for the submit button
  document.getElementById('dialogEditTSubmitButton').onclick = function() {
    let newTitle = dialogTitel.value;
    let newDescription = dialogDiscription.value;
    let newStack = dialogStack.value;

    // Update the URL parameters
    params.set(titleKey, newTitle);
    params.set(descriptionKey, newDescription);
    params.set(stackKey, newStack);

    let newUrl = window.location.pathname + '?' + params.toString();
    window.history.pushState({ path: newUrl }, '', newUrl);

    // Update the displayed box
    const box = document.getElementById(`${id}`);
    box.querySelector('.itemTextTitel').textContent = newTitle;
    box.querySelector('.itemTextDiscription').textContent = newDescription;
    box.querySelector('.itemStackDisplay').textContent = newStack;

    // Close the dialog
    dialogEdit.close();
  };

  document.getElementById('deleteButton').onclick = function() {
    removeItem(id);

    dialogEdit.close();
  };
}
function removeItem(id) {
  const params = getUrlParams();
  const titleKey = `itemTextTitel${id}`;
  const descriptionKey = `itemTextDiscription${id}`;
  const stackKey = `itemStack${id}`;

  // Remove the item from URL parameters
  params.delete(titleKey);
  params.delete(descriptionKey);
  params.delete(stackKey);

  const newUrl = window.location.pathname + '?' + params.toString();
  window.history.pushState({ path: newUrl }, '', newUrl);

  // Remove the displayed item box
  const box = document.getElementById(`${id}`);
  if (box) {
    box.remove();
  }
}


window.onload = function () {
    createInfiniteBoxes();
}


document.getElementById('addMoreBtn').addEventListener('click', addNewItem);

let valueAdd;

document.getElementById("dialogButtonIncressStack").onclick = function() {
  valueAdd = document.getElementById("dialogAddStackInput").value
  if (valueAdd >= 1 && valueAdd <= 998) {
  valueAdd++;
  document.getElementById("dialogAddStackInput").value = valueAdd;
}
}

document.getElementById("dialogButtonDecressStack").onclick = function() {
  valueAdd =  document.getElementById("dialogAddStackInput").value
  if (valueAdd >= 2 && valueAdd <= 999) {
  valueAdd--;
  document.getElementById("dialogAddStackInput").value = valueAdd; 
}
}

let valueEdit;

document.getElementById("dialogButtonIncressEditStack").onclick = function() {
  valueEdit =  document.getElementById("dialogEditStackInput").value
  if (valueEdit >= 1 && valueEdit <= 998) {
  valueEdit++;
  document.getElementById("dialogEditStackInput").value = valueEdit;
}
}

document.getElementById("dialogButtonDecressEditStack").onclick = function() {
  valueEdit =  document.getElementById("dialogEditStackInput").value
  if (valueEdit >= 2 && valueEdit <= 999) {
  valueEdit--;
  document.getElementById("dialogEditStackInput").value = valueEdit; 
}
}
