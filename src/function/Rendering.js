const mountComponents = async (
  root = document,
  baseUrl = window.location.href,
) => {
  const mounts = root.querySelectorAll("[data-component]");

  await Promise.all(
    Array.from(mounts).map(async (mount) => {
      const filePath = mount.getAttribute("data-component");

      if (!filePath) {
        return;
      }

      const componentUrl = new URL(filePath, baseUrl);

      try {
        const response = await fetch(componentUrl.href);

        if (!response.ok) {
          throw new Error(`Failed to load ${componentUrl.href}`);
        }

        mount.innerHTML = await response.text();

        await mountComponents(mount, componentUrl.href);
      } catch (error) {
        mount.innerHTML =
          '<p class="component-error">Component failed to load.</p>';
        console.error(error);
      }
    }),
  );
};

mountComponents();
