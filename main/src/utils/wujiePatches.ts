/**
 * wujie 微前端运行时补丁：
 * 1. 屏蔽嵌套引起的 vue-router history.state 重复提示（console.warn 幂等补丁）。
 * 2. 屏蔽子应用快速切换时容器被移除后异步回调引发的偶发未捕获异常（控制台降噪）。
 *
 * 注意：这里只做「降噪」；子应用切换竞态导致蒙层卡死的问题，
 * 由 shared store 里的 setRouteLoading 看门狗解决。
 */

// 遮蔽无界嵌套引起的 vue 路由警告（仅执行一次的幂等补丁，防止重复包装叠加）
function patchConsoleWarn(): void {
  const originalWarn = console.warn;
  console.warn = (msg, ...args) => {
    if (
      String(msg).includes("history.state") &&
      String(msg).includes("manually replaced")
    ) {
      return;
    }
    originalWarn.apply(console, [msg, ...args]);
  };
}

// 屏蔽 wujie 子应用快速切换时的偶发未捕获异常：容器被移除后异步回调仍在执行，
// 会抛 "Cannot ... of null"。仅当下面的签名精确匹配时才兜住，避免误吞真实 bug。
const SWITCH_RACE_REJECTIONS = new Set([
  "Cannot set properties of null (setting 'disabled')",
  "Cannot read properties of null (reading 'insertBefore')",
]);

function suppressSwitchRejection(event: PromiseRejectionEvent): void {
  const msg = (event.reason && (event.reason as Error).message) || "";
  if (SWITCH_RACE_REJECTIONS.has(msg)) {
    event.preventDefault();
  }
}

/**
 * 应用所有 wujie 运行时补丁。幂等：重复调用不会被叠加。
 */
export function applyWujiePatches(): void {
  if (window.__warnPatched) return;

  patchConsoleWarn();
  window.addEventListener("unhandledrejection", suppressSwitchRejection);
  window.__warnPatched = true;
}
