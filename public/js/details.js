document.getElementById("kosarba").addEventListener("click", async (e) => {
  e.preventDefault();
  const slug = e.target.dataset.slug;
  const db = document.getElementById("input").value;
  const meret = document.querySelector("select").value;
  const data = { db, meret };
  console.log(data);
  try {
    const response = await fetch(
      `http://127.0.0.1:4000/api/v1/rendeles/cart/add/${slug}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    if (result.status === "success") {
      location.reload(true);
    }
  } catch (err) {
    console.log(err);
  }
});
