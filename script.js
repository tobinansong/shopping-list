const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const itemList = document.querySelector("#item-list");
const clearBtn = document.querySelector("#clear");
const itemFilter = document.querySelector("#filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems(){
    //Create list item
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));
}
checkUI();

function onAddItemSubmit(e){
    e.preventDefault();

    const newItem = itemInput.value;

    //Validate Input
    if(newItem === ""){
        alert("Please add an item");
        return;
    }

    //Check for Edit Mode
    if(isEditMode) {
        const itemToEdit = itemList.querySelector(".edit-mode");

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove("edit-mode");
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if(checKIfItemExists(newItem)) {
            alert("That item already exists.");
            return;
        }
    }

    //Creater Item DOM Element
    addItemToDOM(newItem);

    //Add Item To Local Storage
    addItemToStorage(newItem)

    checkUI();

    itemInput.value = "";
}

function addItemToDOM(item){
    //Create list item
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item));

    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);
   //Add LI to the Dom
    itemList.appendChild(li);
}

function createButton(classes){
    const button = document.createElement("button");
    button.className = classes;
    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon);
    return button;
}

function createIcon(classes){
    const icon = document.createElement("i");
    icon.className = classes;
    return icon;
}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();

    //Add new Item to Array
    itemsFromStorage.push(item);

    //Convert To JSON String and Set to local storage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage))
}

function getItemsFromStorage(){
    let itemsFromStorage;

    if(localStorage.getItem("items") == null){
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    }

    return itemsFromStorage
    
}

function onClickItem(e){
    if (e.target.parentElement.classList.contains("remove-item")){
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function checKIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
 }

function setItemToEdit(item){
    isEditMode = true;
    
    itemList.querySelectorAll("li").forEach((i) => i.classList.remove("edit-mode"));
    
    item.classList.add("edit-mode");
    formBtn.innerHTML ='<i class="fa-pen>"</i>Update  Item';
    formBtn.style.color ="red";
    formBtn.style.backgroundColor ="#89CFF0";
    
    itemInput.value = item.textContent;
}
function removeItem(item){
    if(confirm("Are You Sure?")){
        //Remove item from DOM
        item.remove();

        // Remove Item From Storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();
    //Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    //Re-set to localStorage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));

}

function clearItems(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild)
    }

    //Clear From LocalStorage
    localStorage.removeItem("items");

    checkUI();
}

function filterItems(e){
    const items = document.querySelectorAll("li");
    const text = e.target.value.toLowerCase();

    items.forEach((item) =>{
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
        item.style.display = "flex";
        }   else {
            item.style.display = "none";
        }
    });
}

function checkUI(){
    itemInput.value = "";

    const items = document.querySelectorAll("li");
    if(items.length === 0){
        clearBtn.style.display ="none";
        itemFilter.style.display ="none";
    } else{
        clearBtn.style.display ="block";
        itemFilter.style.display ="block";
    }

    formBtn.innerHTML ='<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = "#333";
    formBtn.style.color = "white";

    isEditMode = false;
}

// Initalize App
function init(){
//EVENT LISTENERS
itemForm.addEventListener("submit", onAddItemSubmit);
itemList.addEventListener("click", onClickItem);
clearBtn.addEventListener("click", clearItems);
itemFilter.addEventListener("input", filterItems);
document.addEventListener("DOMContentLoaded", displayItems)
checkUI();

}

init();





// localStorage.setItem("name", "Tobin Ansong")
// console.log(localStorage.getItem("name"))
// //localStorage.removeItem("name");
// localStorage.clear();