/* Bağlantı Kontrolü
console.log(`Bağlantı Kontrolü`);
 */
//! HTML'den elemanları çağırma
const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const submitBtn = document.querySelector(".submit-btn");
const allDeleteBtn = document.querySelector(".all-delete");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");

//! Edit Mode Variables

let editMode = false;
let editItem;
let editItemId;

//! Functions
//* Form gönderildiğinde çalışacak fonksiyon
const addItem = (e) => {
  //* Sayfanın yenilenmesini iptal ettik.
  e.preventDefault();
  const value = input.value;
  // console.log(`Form Gönderildi : ${id} ${value}`);
  if (value !== "" && !editMode) {
    //* Silme işlemleri için benzersiz değere ihtiyacımız var bunun için id oluşturduk.
    const id = new Date().getTime().toString();
    // console.log(id, value);
    createElement(id, value);
    setToDefault();
    addToLocalStorage(id, value);

    showAlert("ADD SUCCESS", "success");
  } else if (value !== "" && editMode) {
    editItem.innerHTML = value;
    uptadeLocalStorage(editItemId, value);
    showAlert("EDIT SUCCESS", "edit");
    setToDefault();
  }
};

//! Alert function

const showAlert = (text, action) => {
  //* Alert kısmının içeriğini belirledik.
  alert.textContent = `${text}`;
  //* Alert kısmının class'ını ekledik.
  alert.classList.add(`alert-${action}`);
  //* Alert kısmının thread ksımını belirledik.
  setTimeout(() => {
    alert.textContent = ``;
    alert.classList.remove(`alert-${action}`);
  }, 1500);
};

//! Delete function

const deleteItem = (e) => {
  //* Burada Item container'a ulaştık.
  // console.log(e.target.parentElement.parentElement.parentElement);
  const element = e.target.parentElement.parentElement.parentElement;
  //* Silmek istedğimiz elemanın id'sine erişmek için
  const id = element.dataset.id;
  itemList.removeChild(element);
  removeFromLocalStorage(id);
  showAlert("DELETE SUCCESS", "danger");
  //* Eleman silindiğinde kontrol edip butonu gizlemeliyiz.
  if (!itemList.children.length) {
    allDeleteBtn.style.display = "none";
  }
};

//! Edit function

const editItems = (e) => {
  //* Burada Item name ( kardeş elemana ) ulaştık.
  // console.log(e.target.parentElement.parentElement.previousElementSibling);
  const element = e.target.parentElement.parentElement.parentElement;
  editItem = e.target.parentElement.parentElement.previousElementSibling;
  input.value = editItem.innerText;
  editMode = true;
  editItemId = element.dataset.id;
  submitBtn.textContent = `Edit`;
};

//! Varsayılana değerlere döndüren function

const setToDefault = () => {
  input.value = "";
  editMode = false;
  editItemId = "";
  submitBtn.textContent = "Add";
};
//! Sayfa yüklendiğinde elemanları render edecek function

const renderItems = () => {
  let items = getFromLocalStorage();
  console.log(items);
  if (items.length > 0) {
    items.forEach((item) => createElement(item.id, item.value));
  }
  //* Sayfa ilk yüklendiğinde (renderItems fonksiyonunda), eğer eleman varsa butonu göster, yoksa gizle.
  if (items.length > 0) {
    items.forEach((item) => createElement(item.id, item.value));
    allDeleteBtn.style.display = "block"; // Butonu göster
  } else {
    allDeleteBtn.style.display = "none"; // Butonu gizle
  }
};

//! Eleman oluşturan fuction
const createElement = (id, value) => {
  //* Yeni bir eleman oluşturduk
  const newDiv = document.createElement("div");
  //* Bu elemana attribute ekledik.Silmek için div elamanın class'ına ekledik.
  newDiv.setAttribute("data-id", id);
  //* Bu elemana class ekledik.
  newDiv.classList.add("items-list-item");
  //* Bu elemanın HTML içeriğini belirledik.
  newDiv.innerHTML = `
          <p class="item-name">${value}</p>
            <div class="btn-container">
              <button class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
  `;
  //* Delete button eriştik.
  const deleteBtn = newDiv.querySelector(".delete-btn");
  // console.log(deleteBtn);
  deleteBtn.addEventListener("click", deleteItem);
  //* Edit button eriştik.
  const editBtn = newDiv.querySelector(".edit-btn");
  // console.log(editBtn);
  editBtn.addEventListener("click", editItems);
  //* newDiv'i itemlist'e ekledik.
  itemList.appendChild(newDiv);
  showAlert("ADDED SUCCESS", "success");

  //* Clear button'u görünür yap. Yeni eleman eklendiğinde clear button'u görünür yapmamız gerekiyor.
  allDeleteBtn.style.display = "block";
};

//! Clear Button Sıfırlama function

const clearItems = () => {
  const items = document.querySelectorAll(".items-list-item");
  if (items.length > 0) {
    items.forEach((item) => {
      itemList.removeChild(item);
    });
    allDeleteBtn.style.display = "none";
    showAlert("ALL ITEMS DELETED SUCCESS", "danger");
    localStorage.removeItem("items");
  }
};

//! LocalStorage kayıt yapan function

const addToLocalStorage = (id, value) => {
  const item = { id, value };
  let items = getFromLocalStorage();
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
};

//! LocalStorage veri alan function

const getFromLocalStorage = () => {
  return localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
};

//! LocalStorage veri silen function

const removeFromLocalStorage = (id) => {
  let items = getFromLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("items", JSON.stringify(items));
};

//! LocalStorage güncelleyen function

const uptadeLocalStorage = (id, newValue) => {
  let items = getFromLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      //* Spread Operatör : Bu özellik bir elemanı güncellerken veri kaybını önlemek için kullanılır. Burada biz obje içerisinde yer alan value yu güncelledik. Ama bunu yaparken id değerini kaybetmemek için Spread Operatör kullandık.
      return { ...item, value: newValue };
    }
    return item;
  });
  //* Burada value kısmını güncelledik bunun dışında kalan items özelliklerini sabit tuttuk.
  localStorage.setItem("items", JSON.stringify(items));
};

//! Olay İzleyicileri (addEventListener)
//* Formun gönderildiği an
form.addEventListener("submit", addItem);
//* Sayafanın yenilendiği zaman
window.addEventListener("DOMContentLoaded", renderItems);
//* Clear Button tıklanınca elemanları sıfırlama
allDeleteBtn.addEventListener("click", clearItems);
