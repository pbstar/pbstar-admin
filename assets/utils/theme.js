export function changeTheme(e) {
  if (e) {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.classList.remove("dark");
  }
}
