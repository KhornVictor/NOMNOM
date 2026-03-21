const createFoodCard = (food) => {
  const card = document.createElement("div");
  card.className = "food-card";

  const image = document.createElement("img");
  image.className = "food-image";
  image.src = food.image_url;
  image.alt = food.name;

  const name = document.createElement("p");
  name.className = "food-name";
  name.textContent = food.name;

  const description = document.createElement("p");
  description.className = "food-description";
  description.textContent = food.description;

  const meta = document.createElement("div");
  meta.className = "food-meta";

  const price = document.createElement("span");
  price.className = "food-price";
  price.textContent = `$${Number(food.price).toFixed(2)}`;

  const addButton = document.createElement("button");
  addButton.className = "add-btn";
  addButton.type = "button";
  addButton.textContent = "+";
  addButton.disabled = !food.is_available;

  if (!food.is_available) {
    addButton.title = "This item is currently unavailable";
  }

  meta.append(price, addButton);
  card.append(image, name, description, meta);

  return card;
};

const normalizeFilter = (filterLabel = "All") => {
  return filterLabel.trim().toLowerCase();
};

const shouldRenderItem = (item, filterLabel) => {
  const filter = normalizeFilter(filterLabel);

  if (filter === "all") {
    return true;
  }

  if (filter === "wait list") {
    return !item.is_available;
  }

  if (filter === "served" || filter === "dine in" || filter === "take away") {
    return item.is_available;
  }

  return true;
};

export const renderCards = async (root = document, filterLabel = "All") => {
  const foodGrid = root.querySelector("#food-grid");

  if (!foodGrid) {
    return;
  }

  try {
    const response = await fetch("./public/data/menu_items.json");

    if (!response.ok) {
      throw new Error(`Failed to load menu items: ${response.statusText}`);
    }

    const items = await response.json();
    const fragment = document.createDocumentFragment();

    items
      .filter((item) => shouldRenderItem(item, filterLabel))
      .forEach((item) => {
        fragment.appendChild(createFoodCard(item));
      });

    foodGrid.innerHTML = "";

    if (!fragment.childNodes.length) {
      foodGrid.innerHTML =
        '<p class="component-error">No menu items match this filter.</p>';
      return;
    }

    foodGrid.appendChild(fragment);
  } catch (error) {
    foodGrid.innerHTML =
      '<p class="component-error">Unable to load menu items right now.</p>';
    console.error(error);
  }
};

export const initFoodPage = async (root = document) => {
  const statusPills = root.querySelectorAll(".status-list .status-pill");

  await renderCards(root, "All");

  statusPills.forEach((pill) => {
    if (pill.dataset.bound === "true") {
      return;
    }

    pill.dataset.bound = "true";

    pill.addEventListener("click", async () => {
      statusPills.forEach((item) => item.classList.remove("active"));
      pill.classList.add("active");
      await renderCards(root, pill.textContent || "All");
    });
  });
};

export const get10FoodCards = async (root = document) => {
  const foodGrid = root.querySelector("#food-container #food-grid");
  if (!foodGrid) {
    return;
  }

  const getOrderingCount = (item) => {
    const value = item.ordering_count ?? item.ording_count ?? 0;
    return Number.isFinite(Number(value)) ? Number(value) : 0;
  };

  try {
    const response = await fetch("./public/data/menu_items.json");
    if (!response.ok) {
      throw new Error(`Failed to load menu items: ${response.statusText}`);
    }
    const items = await response.json();
    const fragment = document.createDocumentFragment();

    items
      .slice()
      .sort((a, b) => getOrderingCount(b) - getOrderingCount(a))
      .slice(0, 12)
      .forEach((item) => {
        fragment.appendChild(createFoodCard(item));
      });

    foodGrid.innerHTML = "";
    foodGrid.appendChild(fragment);
  } catch (error) {
    foodGrid.innerHTML =
      '<p class="component-error">Unable to load menu items right now.</p>';
    console.error(error);
  }
};
