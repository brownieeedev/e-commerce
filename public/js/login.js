const login = async (email, password) => {
  console.log(email, password);
  try {
    const response = await fetch("/api/v1/users/login", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ email, jelszo: password }), // body data type must match "Content-Type" header
    });
    const result = await response.json();
    console.log(result.status, result.message);
    if (result.status === "success") {
      location.assign("/");
    }
  } catch (err) {
    console.error(err);
  }
};

if (!document.getElementById("form")) {
  console.log("errorr");
} else {
  document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    await login(email, password);
  });
}
