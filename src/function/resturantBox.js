import { fetchResturants } from "../services/Resturant.js";

const FALLBACK_IMAGE =
  "https://img.freepik.com/free-photo/close-up-delicious-pizza-with-tomatoes-cheese_23-2148888637.jpg?semt=ais_hybrid&w=740&q=80";

const createResturantCard = (resturant) => {
  const item = document.createElement("div");
  item.className = "shop-item";

  const image = document.createElement("img");
  image.src = resturant.image_url || FALLBACK_IMAGE;
  image.alt = resturant.name || "Restaurant";
  image.loading = "lazy";

  image.addEventListener("error", () => {
    image.src = FALLBACK_IMAGE;
  });

  const title = document.createElement("h2");
  title.textContent = resturant.name || "Unknown Restaurant";

  item.append(image, title);
  return item;
};

export const renderResturantBox = async (root = document) => {
  const shopItems = root.querySelector(".shop-items");

  if (!shopItems) {
    return;
  }

  const resturants = await fetchResturants();
  shopItems.innerHTML = "";

  if (!resturants.length) {
    shopItems.innerHTML =
      '<p class="component-error">No restaurants available right now.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  
  let i = 0;
  resturants.forEach((resturant) => {
    if (i == 10) return;
    fragment.appendChild(createResturantCard(resturant));
    i++;
  });

  shopItems.appendChild(fragment);
};

export const initResturantBox = async (root = document) => {
  await renderResturantBox(root);
};
