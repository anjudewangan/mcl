fetch("/session").then((res) => {
  if (res.status === 400) {
    localStorage.removeItem("role");
  }
});
