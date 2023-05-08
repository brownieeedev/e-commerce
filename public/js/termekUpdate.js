document
  .querySelector(".btn.btn--small.btn--green")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const nev = document.getElementById("nev").value;
    const meret = document.getElementById("meret").value;
    const szin = document.getElementById("szin").value;
    const raktaron = document.getElementById("db").value;
    try {
      const response = await fetch("/api/v1/termekek/updateTermek", {
        method: "PATCH", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({ nev, meret, szin, raktaron }), // body data type must match "Content-Type" header
      });
      const result = await response.json();
      if (result.status === "success") {
        // location.reload();
        alert("Sikeresen feltöltötted az raktárat");
        // location.assign("/termekAttekintes");
      } else if (result.status === "not found") {
        alert("Nincs ilyen elem a rendszerben!");
      }
    } catch (err) {
      alert(err);
    }
  });
