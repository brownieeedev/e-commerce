const buttons = document.querySelectorAll(".btnTorles");
buttons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const id = e.target.dataset.id;
    try {
      const response = await fetch(`/api/v1/rendeles/remove/${id}`, {
        method: "PATCH", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.status === "success") {
        location.reload(true);
      }
    } catch (err) {
      console.log(err);
    }
  });
});

//price calculating logic
const inputs = document.querySelectorAll("input[type=number]");
inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    const ar = e.target.dataset.ar;
    const priceElement = e.target.closest("tr").querySelector(".reszosszeg");
    priceElement.textContent = e.target.value * ar + " Ft";
    updateTotalPrice();
  });
});

function updateTotalPrice() {
  const reszosszegElements = document.querySelectorAll(".reszosszeg");
  let sumprice = 0;
  reszosszegElements.forEach((element) => {
    const reszosszeg = parseFloat(element.textContent);
    if (!isNaN(reszosszeg)) {
      sumprice += reszosszeg;
    }
  });
  const afa = Math.ceil(sumprice * 0.27);
  const sum = Math.ceil(sumprice + afa);
  document.getElementById("sum").textContent = sumprice - afa;
  document.getElementById("afa").textContent = afa;
  document.getElementById("reszosszeg-osszesen").textContent = sumprice;
}

document
  .querySelector(".btn--checkout")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    let items = [];
    let names = [];
    let amounts = [];
    let sizes = [];
    document.querySelectorAll(".cart-info > div > p").forEach((i) => {
      names.push(i.textContent);
    });
    document.querySelectorAll(".amount").forEach((i) => {
      amounts.push(i.value);
    });
    document.querySelectorAll(".select").forEach((i) => {
      sizes.push(i.value);
    });
    items.push({ termek: names, darab: amounts, meret: sizes });
    console.log(items);
    try {
      const response = await fetch(
        `http://127.0.0.1:4000/api/v1/rendeles/saveCart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(items),
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
