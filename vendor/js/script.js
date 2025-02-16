"use strict";
// =============== removing load screen when dom is loaded ==============
document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.querySelector(".loading-screen");
  loadingScreen.style.opacity = 0;
  setTimeout(() => loadingScreen.remove(), 1000);
});
// =============== adding mobile menu on mobile menu button click ===============
const mobileMenuButton = document.querySelector(".menu-button");
const hero = document.querySelector(".hero");
mobileMenuButton.addEventListener("click", () => {
  const mobileMenu = document.createElement("div");
  ["mobil-nav-menu", "bg", "overlay", "hidden"].forEach((cls) =>
    mobileMenu.classList.add(cls)
  );
  mobileMenu.innerHTML = `
  <div class="container">
    <div class="overlay">
      <a href="#special">
        <img
          src="images/special-menu-link.webp"
          width="640"
          height="426"
          alt="specials section link image"
        />
      </a>
    </div>
    <div class="overlay">
      <a href="#reserv">
        <img
          src="images/reserv-menu-link.webp"
          width="640"
          height="426"
          alt="reservation and order section link image"
        />
      </a>
    </div>
    <div class="overlay">
      <a href="#menu">
        <img
          src="images/menu-menu-link.webp"
          width="640"
          height="426"
          alt="menu section link image"
        />
      </a>
    </div>
    <div class="overlay">
      <a href="#event">
        <img
          src="images/event-menu-link.webp"
          width="640"
          height="426"
          alt="special event section link image"
        />
      </a>
    </div>
    <div class="overlay">
      <a href="#chefs">
        <img
          src="images/chef-menu-link.webp"
          width="640"
          height="426"
          alt="our chefs section link image"
        />
      </a>
    </div>
    <div class="overlay">
      <a href="#contact">
        <img
          src="images/contact-menu-link.webp"
          width="640"
          height="426"
          alt="contact us section link image"
        />
      </a>
    </div>
  </div>
  `;
  hero.appendChild(mobileMenu);
});
// =============== initiate special of the week carousel ===============
$(".special-carousel").owlCarousel({
  loop: true,
  margin: 5,
  nav: true,
  items: 1,
  center: true,
  dots: false,
  navText: [
    `<div><i class='icon-angle-left'></i><span>pr<br />ev</span></div>`,
    `<div><span>ne<br />xt</span><i class='icon-angle-right'></i></div>`,
  ],
});
// =============== showing special of the week info ===============
const veiled = document.querySelectorAll(".veiled");
veiled.forEach((veiledElement) =>
  veiledElement.addEventListener("click", (e) => {
    const veilButton = e.target.closest(".veil-btn");
    if (veilButton) {
      veilButton.classList.toggle("active");

      let veilItem;
      if (veilButton.dataset.veiltarget) {
        veilItem = document.querySelector(`.${veilButton.dataset.veiltarget}`);
      } else {
        veilItem = veilButton.parentElement;
      }
      if (!veilItem.classList.contains("veil-added")) {
        const veilContainer = document.createElement("div");
        veilContainer.classList.add("veil-container");
        veilContainer.innerHTML = `<div class="veil-first-left"></div>
              <div class="veil-first-right"></div>
              <div class="veil-second-left"></div>
              <div class="veil-second-right"></div>`;
        veilItem.appendChild(veilContainer);
      }
      veilItem.classList.add("veil-added");
      setTimeout(() => {
        veilItem.classList.toggle("veil-on");
      }, 0);
    }
  })
);
// =============== food menu ===============
const foodMenus = document.querySelectorAll(".menu");
// function to spread the menu items in the ui
function showMenu(menuArr, menu) {
  const gridContainer = document.createElement("div");
  gridContainer.classList.add("grid-container");
  menuArr.forEach((menu) => {
    const menuColumn = document.createElement("div");
    menuColumn.classList.add("menu-column");
    const menuHeading = document.createElement("h3");
    menuHeading.classList.add("menu-name");
    menuHeading.innerHTML = `${menu.name}`;
    menuColumn.append(menuHeading);
    menu.items.forEach((item) => {
      const itemContainer = document.createElement("div");
      itemContainer.classList.add("item-container");
      itemContainer.innerHTML = `
                <div class="item-box">
                  <div class="check-box"></div>
                  <p class="item-name">${item.name}</p>
                  <label for="${item.name}">${item.name}</label>
                  <input id="${
                    item.name
                  }" type="number" class="quantity" value="1" min="1" />
                  ${
                    item.addOns
                      ? `<div>
                          <i class="icon-plus add-ons-icon"></i>
                          <span class="price">$${item.price}</span>
                        </div>`
                      : `<span class="price">$${item.price}</span>`
                  }
                  ${
                    item.describtion
                      ? `<p class="item-description">${item.describtion}</p>`
                      : ``
                  }

                </div>`;
      if (item.addOns) {
        const addOnsList = document.createElement("ul");
        addOnsList.classList.add("add-ons-list");
        addOnsList.style.pointerEvents = "none"; // modified
        item.addOns.forEach((addOn) => {
          const li = document.createElement("li");
          li.innerHTML = `<div class="item-box">
                  <div class="check-box"></div>
                  <p class="item-name">${addOn.name}</p>
                  <label for="${addOn.name}">${addOn.name}</label>
                  <input id="${
                    addOn.name
                  }" type="number" class="quantity" value="1" min="1" />
                  <span class="price">$${addOn.price}</span>
                  ${
                    addOn.describtion
                      ? `<p class="item-description">${addOn.describtion}</p>`
                      : ``
                  }
                  </div>
                </div>`;
          addOnsList.append(li);
        });
        itemContainer.append(addOnsList);
      }
      menuColumn.append(itemContainer);
    });
    gridContainer.append(menuColumn);
  });
  menu.append(gridContainer);
}
// fetching the food menu from the json file
let mainMenu = [];
const getMenu = fetch("vendor/js/menu.json")
  .then((result) => (result = result.json()))
  .then((result) => {
    mainMenu = result;
    return mainMenu;
  })
  .then((mainMenu) => {
    const reservMenu = document.querySelector(".reserv .menu");
    showMenu(mainMenu, reservMenu);
    return mainMenu;
  });
// ============== cart ==================
const cart = {
  items: [],
  totalPrice: 0,
};
// function to calculate total price from cart items
function calculatePrice() {
  cart.totalPrice = 0;
  cart.items.forEach((item) => {
    cart.totalPrice += Number(item.price) * Number(item.quantity);
  });
  const totalPrices = document.querySelectorAll(
    ".total-price-box .total-price"
  );
  totalPrices.forEach((price) => {
    price.innerHTML = `$${cart.totalPrice.toFixed(2)}`;
  });
}
// function to delete item from cart
function deleteItem(itemName, arr) {
  const itemIndex = arr.findIndex((item) => item.name === itemName);
  arr.splice(itemIndex, 1);
}
// function to add or remove items from cart
function addOrRemoveItemToCart(add, clicked, quantity, type, itemParentName) {
  const menuName = clicked
    .closest(".menu-column")
    .querySelector(".menu-name").textContent;
  const itemName =
    clicked.parentElement.querySelector(".item-name").textContent;
  if (add && type === "main") {
    const itemToAdd = mainMenu
      .find((menu) => menu.name === menuName)
      .items.find((item) => item.name === itemName);
    itemToAdd.quantity = quantity;
    // adding the element to the cart
    cart.items.push(itemToAdd);
  } else if (add && type === "sub") {
    const itemParent = mainMenu
      .find((menu) => menu.name === menuName)
      .items.find((item) => item.name === itemParentName);
    const itemToAdd = itemParent.addOns.find(
      (addOn) => addOn.name === itemName
    );
    itemToAdd.quantity = quantity;
    // adding the subItem name to the parent name so when the parent gets unchecked the sub gets unchecked too
    itemParent.checkedSubs
      ? itemParent.checkedSubs.push(itemName)
      : (itemParent.checkedSubs = [itemName]);
    // adding the subItem to the cart
    cart.items.push(itemToAdd);
  } else if (!add && type === "main") {
    // check if items have checked sub items in the cart then delete them
    const item = cart.items.find((item) => item.name === itemName);
    item.checkedSubs &&
      item.checkedSubs.forEach((subItem) => {
        console.log(subItem);
        deleteItem(subItem, cart.items);
      });
    item.checkedSubs = [];
    // deleting the item from the cart
    deleteItem(itemName, cart.items);
  } else if (!add && type === "sub") {
    const itemParent = cart.items.find((item) => item.name === itemParentName);
    // deleting subitem from the main items checked sub items
    deleteItem(itemName, itemParent.checkedSubs);
    // deleting subitem from the cart
    deleteItem(itemName, cart.items);
  }
  // calculating the price from the cart
  calculatePrice();
  console.log(cart.items);
}
// function to match items from main menu in the reservation section with the menu in the category section
function matchItemBoxes(clicked) {
  let clickedItemBox = [];
  const clickedMenu = clicked.closest(".menu");
  const clickedItemName = clicked
    .closest(".item-box")
    .querySelector(".item-name").textContent;
  const menusToCheck = [...foodMenus].filter(
    (menu) => menu.id !== clickedMenu.id
  );
  menusToCheck.forEach((menu) => {
    const itemBoxes = menu.querySelectorAll(".item-box");
    clickedItemBox.push(
      [...itemBoxes].find(
        (itemBox) =>
          itemBox.querySelector(".item-name").textContent === clickedItemName
      )
    );
  });
  return clickedItemBox;
}

foodMenus.forEach((menu) => {
  menu.addEventListener("click", (e) => {
    const clicked = e.target;
    if (clicked.classList.contains("check-box")) {
      const addOnsList = clicked.closest(".item-box").nextElementSibling;
      if (clicked.classList.contains("checked")) {
        clicked.classList.remove("checked");
        // deselecting every checked sub element
        if (addOnsList) {
          const addOnsListItems = addOnsList.children;
          [...addOnsListItems].forEach((li) => {
            const checkBox = li.querySelector(".check-box");
            checkBox.classList.contains("checked") &&
              checkBox.classList.remove("checked");
          });
        }
        // deactevating the sub list
        addOnsList ? (addOnsList.style.pointerEvents = "none") : "";
      } else {
        clicked.classList.add("checked");
        addOnsList ? (addOnsList.style.pointerEvents = "all") : "";
      }
      // adding/removing the clicked item from cart
      const itemQuantity =
        clicked.parentElement.querySelector(".quantity").value;
      const addOrRemove = clicked.classList.contains("checked");
      const type = clicked.closest(".add-ons-list") ? "sub" : "main";
      const itemParentName =
        type === "sub"
          ? clicked
              .closest(".add-ons-list")
              .previousSibling.querySelector(".item-name").textContent
          : "";
      addOrRemoveItemToCart(
        addOrRemove,
        clicked,
        itemQuantity,
        type,
        itemParentName
      );
      // mathcing checked items from main menu in reservation section with the menus in the category section
      const matchedItemBoxes = matchItemBoxes(clicked);
      if (matchedItemBoxes[0]) {
        if (addOrRemove) {
          matchedItemBoxes.forEach((box) => {
            box.querySelector(".check-box").classList.add("checked");
          });
        } else {
          matchedItemBoxes.forEach((box) => {
            box.querySelector(".check-box").classList.remove("checked");
          });
        }
      }
    } else if (clicked.classList.contains("add-ons-icon")) {
      clicked
        .closest(".item-box")
        .nextElementSibling.classList.toggle("active");
    }
  });
});
getMenu.then(() => {
  foodMenus.forEach((quantity) =>
    quantity.addEventListener("change", (e) => {
      const changedItemName = e.target
        .closest(".item-box")
        .querySelector(".item-name").textContent;
      cart.items.forEach((item) =>
        item.name === changedItemName ? (item.quantity = e.target.value) : ""
      );
      calculatePrice();
      const matchedItemBoxes = matchItemBoxes(e.target);
      if (matchedItemBoxes[0]) {
        matchedItemBoxes.forEach((box) => {
          box.querySelector(".quantity").value = e.target.value;
        });
      }
    })
  );
});
// =============== menu categories ===============
const menuCategories = document.querySelector(".menu-categories");
const menuCategoriesGrid = menuCategories.querySelector(".grid-container");
const menuCategoriesMenu = document.querySelector(".menu-categories .menu");
menuCategories.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("veil-btn") &&
    e.target.classList.contains("menu-box")
  ) {
    const menuName = e.target.dataset.name;
    const mainMenuColumns = document
      .querySelector("#menu-1")
      .querySelectorAll(".menu-column");
    const singleMenuColumn = [...mainMenuColumns].find(
      (column) => column.querySelector(".menu-name").textContent === menuName
    );
    menuCategoriesGrid.innerHTML = ``;
    menuCategoriesGrid.append(singleMenuColumn.cloneNode(true));
  }
});
// =============== initiate reviews carousel ===============
$(".reviews-carousel").owlCarousel({
  loop: true,
  margin: 5,
  nav: true,
  items: 1,
  center: true,
  dots: false,
  navText: [
    `<div><i class='icon-angle-left'></i><span>pr<br />ev</span></div>`,
    `<div><span>ne<br />xt</span><i class='icon-angle-right'></i></div>`,
  ],
});
// =============== flipping clock ===============
function fillSlot(clock, slot, intSlotNum) {
  const slotNum = Math.floor(intSlotNum).toString().split("");
  const fronts = clock.querySelectorAll(`.${slot} .front span`);

  if (slotNum.length > 1 && slotNum.length != 0) {
    fronts.forEach(
      (front) =>
        (front.textContent = front.parentElement.classList.contains("left")
          ? slotNum[0]
          : slotNum[1])
    );
  } else if (slotNum.length === 1) {
    fronts.forEach((front) => {
      front.textContent = front.parentElement.classList.contains("left")
        ? 0
        : slotNum[0];
    });
  }
}

const clock = document.querySelector(".clock-container");
let timeInMills = 45020000 * 2;
const totalDayNum = timeInMills / (1000 * 60 * 60 * 24);
let intDayNum = Math.floor(totalDayNum);
fillSlot(clock, "days", intDayNum);
let intHourNum = (totalDayNum % 1) * 24;
fillSlot(clock, "hours", intHourNum);
let intMinuteNum = (intHourNum % 1) * 60;
fillSlot(clock, "minutes", intMinuteNum);
let intSecondNum = (intMinuteNum % 1) * 60;
fillSlot(clock, "seconds", intSecondNum);
function minusOne(group) {
  const topFront = group.querySelector(".top.front");
  const topRear = group.querySelector(".top.rear");
  const bottomFront = group.querySelector(".bottom.front");
  const bottomRear = group.querySelector(".rear.bottom");
  let startValue = Number(topFront.textContent);
  const groupLeafs = group.querySelectorAll(".leaf");
  // resetting when hitting minmum value
  if (startValue === 0) {
    const rotorClassList = group.closest(".rotor").classList;
    let totalToCheck;
    switch (rotorClassList[1]) {
      case "seconds":
        totalToCheck = timeInMills / 1000;
        break;
      case "minutes":
        totalToCheck = timeInMills / (1000 * 60);
        break;
      case "hours":
        totalToCheck = timeInMills / (1000 * 60 * 60);
        break;
      case "days":
        totalToCheck = timeInMills / (1000 * 60 * 60 * 24);
        break;
    }
    if (group.classList.contains("right")) {
      if (!rotorClassList.contains("hours")) {
        if (0 < totalToCheck && totalToCheck < 9) {
          startValue = 10;
        } else if (totalToCheck > 9) {
          startValue = 10;
          const prevGroupId = `#group-${group.id.split("-")[1] - 1}`;
          minusOne(clock.querySelector(prevGroupId));
        } else {
          return false;
        }
      } else {
        if (0 < totalToCheck && totalToCheck < 9) {
          startValue = 10;
        } else if (9 < totalToCheck && totalToCheck < 24) {
          startValue = 10;
          const prevGroupId = `#group-${group.id.split("-")[1] - 1}`;
          minusOne(clock.querySelector(prevGroupId));
        } else if (totalToCheck > 24) {
          startValue = 4;
          const prevGroupId = `#group-${group.id.split("-")[1] - 1}`;
          minusOne(clock.querySelector(prevGroupId));
        } else {
          return false;
        }
      }
    }
    if (group.classList.contains("left")) {
      if (!rotorClassList.contains("hours")) {
        if (totalToCheck > 9) {
          startValue = 6;
          const prevGroupId = `#group-${group.id.split("-")[1] - 1}`;
          minusOne(clock.querySelector(prevGroupId));
        } else if (totalToCheck < 9) {
          return false;
        }
      } else {
        if (totalToCheck > 9) {
          startValue = 3;
          const prevGroupId = `#group-${group.id.split("-")[1] - 1}`;
          minusOne(clock.querySelector(prevGroupId));
        } else if (totalToCheck < 9) {
          return false;
        }
      }
    }
  }
  // ================ resetting when hitting minmum value ===============
  topFront.classList.add("flip-front");
  bottomRear.classList.add("flip-rear");

  topRear.querySelector("span").textContent = startValue - 1;
  bottomRear.querySelector("span").textContent = startValue - 1;
  timeInMills -= 1000;
  setTimeout(() => {
    groupLeafs.forEach((leaf) => {
      leaf.classList.toggle("front");
      leaf.classList.toggle("rear");
    });
    topFront.classList.remove("flip-front");
    bottomRear.classList.remove("flip-rear");
    topFront.querySelector("span").textContent = startValue - 1;
    bottomFront.querySelector("span").textContent = startValue - 1;
  }, 850); //850 milliseconds
}
const seconds = document.querySelector(".clock-container .seconds");
setInterval(() => minusOne(seconds.querySelector(".group.right")), 1000);
// ==================== mapbox =======================
// const coordinates = [51.5079, -0.129958];
// const mapToken =
//   "pk.eyJ1IjoiaWh0aGVtZXMiLCJhIjoiY2trcGR5OWU4MDN1dDJ4cGYxanF2ejIzYiJ9.m5GeTM3saQPbwlqjvnPvBQ";
// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//   container: "map",
//   style: "mapbox://styles/mapbox/streets-v12",
//   center: [coordinates[1], coordinates[0]],
//   zoom: 16,
// });
// map.addControl(new mapboxgl.NavigationControl());
// // Create a DOM element for marker.
// const geojson = {
//   type: "FeatureCollection",
//   features: [
//     {
//       type: "Feature",
//       properties: {
//         message: "Foo",
//         iconSize: [27, 35.25],
//       },
//       geometry: {
//         type: "Point",
//         coordinates: [coordinates[1], coordinates[0]],
//       },
//     },
//   ],
// };
// // adding marker
// const marker = new mapboxgl.Marker({
//   color: "#ea4335",
// })
//   .setLngLat([coordinates[1], coordinates[0]])
//   .addTo(map);
// // adding google map link
// const mapContainer = document.querySelector(".map");
// const link = document.createElement("a");
// link.href = `https://www.google.com/maps/place/51%C2%B030'28.6%22N+0%C2%B007'47.9%22W/@${coordinates[0]},${coordinates[1]},17z/data=!3m1!4b1!4m4!3m3!8m2!3d${coordinates[0]}!4d${coordinates[1]}?entry=ttu`;
// link.title = "location in google maps";
// link.innerHTML = `<i class="icon-resize-full"></i>`;
// mapContainer.appendChild(link);

// google maps
let map;

async function initMap() {
  // The location of london
  const position = { lat: 51.5079, lng: -0.129958 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at london
  map = new Map(document.getElementById("map"), {
    zoom: 16,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  // The marker, positioned at london
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "london",
  });
}

initMap();
