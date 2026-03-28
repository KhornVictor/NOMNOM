import { fetchResturants } from "../services/Resturant.js";

const FALLBACK_IMAGE =
  "https://img.freepik.com/free-photo/close-up-delicious-pizza-with-tomatoes-cheese_23-2148888637.jpg?semt=ais_hybrid&w=740&q=80";

const createResturantCard = (resturant, variant = "compact") => {
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

  if (variant === "detailed") {
    const description = document.createElement("p");
    description.className = "restaurant-description";
    description.textContent =
      resturant.description ||
      "Fresh ingredients, quick service, and crowd-favorite dishes.";

    const meta = document.createElement("div");
    meta.className = "restaurant-meta";

    const address = document.createElement("p");
    address.innerHTML = `<i class="fa-solid fa-location-dot" aria-hidden="true"></i>${resturant.address || "Address not available"}`;

    const phone = document.createElement("p");
    phone.innerHTML = `<i class="fa-solid fa-phone" aria-hidden="true"></i>${resturant.phone || "Phone not available"}`;

    meta.append(address, phone);
    item.append(description, meta);
  }

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
      '<p class="restaurant-empty-state">No restaurants available right now.</p>';
    return;
  }

  const isDetailedView = Boolean(shopItems.closest(".restaurant-page"));
  const itemsToRender = isDetailedView ? resturants : resturants.slice(0, 10);

  const fragment = document.createDocumentFragment();

  itemsToRender.forEach((resturant) => {
    fragment.appendChild(
      createResturantCard(resturant, isDetailedView ? "detailed" : "compact"),
    );
  });

  shopItems.appendChild(fragment);
};

export const initResturantBox = async (root = document) => {
  await renderResturantBox(root);
};
