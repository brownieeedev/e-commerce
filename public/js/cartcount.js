const method = async () => {
  try {
    const response = await fetch("http://127.0.0.1:4000/api/v1/rendeles/cart");
    const result = await response.json();
    if (result.status === "success") {
      document.getElementById("cart-count").textContent =
        result.kosar.termekIds.length;
    }
  } catch (err) {
    console.log(err);
  }
};

method();
