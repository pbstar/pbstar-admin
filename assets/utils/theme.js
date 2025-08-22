/**
 * 切换主题
 * @param {boolean} isDark 是否为暗色主题
 */
export function changeTheme(isDark) {
  const htmlElement = document.documentElement;

  if (isDark) {
    htmlElement.setAttribute("data-theme", "dark");
    htmlElement.classList.add("dark");
  } else {
    htmlElement.removeAttribute("data-theme");
    htmlElement.classList.remove("dark");
  }
}
