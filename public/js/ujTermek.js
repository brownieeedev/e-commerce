document
  .querySelector(".form.form-user-data")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData();
    const nev = document.getElementById("nev").value;
    const meret = document.getElementById("meret").value;
    const szin = document.getElementById("szin").value;
    const beszallito = document.getElementById("beszallito").value;
    const beerkezesiAr = document.getElementById("beerkezesiAr").value;
    const ar = document.getElementById("ar").value;
    const raktaron = document.getElementById("db").value;
    const leiras = document.getElementById("leiras").value;
    let photos = document.getElementById("file").files;
    for (let i = 0; i < photos.length; i++) {
      form.append("file", photos[i]);
    }
    form.append("nev", nev);
    form.append("meret", meret);
    form.append("szin", szin);
    form.append("beszallito", beszallito);
    form.append("beerkezesiAr", beerkezesiAr);
    form.append("ar", ar);
    form.append("raktaron", raktaron);
    form.append("leiras", leiras);

    createTermek(form);
  });

const createTermek = async (form) => {
  try {
    const response = await fetch("/api/v1/termekek/createTermek", {
      method: "POST",
      body: form,
    });
    const result = await response.json();
    if (result.status === "success") {
      location.reload();
      alert("Sikeresen felvitted az új terméket");
    }
  } catch (err) {
    alert(err);
  }
};
