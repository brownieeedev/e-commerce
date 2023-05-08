const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  card.addEventListener("click", async (e) => {
    e.preventDefault();
    const slug = e.target.closest(".card").dataset.slug;
    try {
      window.location.href = `/termek/${slug}`;
    } catch (err) {
      console.error(err);
    }
  });
});

const buttons = document.querySelectorAll(".blackdiv");
buttons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const slug = e.target.closest(".card").dataset.slug;
    try {
      const response = await fetch(`api/v1/rendeles/cart/add/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.status === "success") {
        console.log("success");
      }
    } catch (err) {
      console.log(err);
    }
  });
});
