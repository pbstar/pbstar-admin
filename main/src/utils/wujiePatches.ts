/**
 * wujie 微前端运行时补丁：
 * 1. 屏蔽嵌套引起的 vue-router history.state 重复提示（console.warn 幂等补丁）。
 * 2. 屏蔽子应用快速切换时容器被移除后异步回调引发的偶发未捕获异常（控制台降噪）。
 *
 * 这些异常可能来自主 window（Promise 拒绝 / 同步错误），也可能来自子应用的沙箱 iframe
 * window——后者不会冒泡到主 window，所以还要借助 wujie 的 plugin（windowPropertyOverride）
 * 把监听器挂到子应用的沙箱 window 上（见下方 wujieErrorPatchPlugin）。
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

/**
 * 屏蔽 wujie 子应用快速切换时的偶发未捕获异常：容器被移除后异步回调仍在执行，
 * 会抛 "Cannot ... of null/undefined"。仅当下面的签名精确匹配时才兜住，避免误吞真实 bug。
 */
const SWITCH_RACE_MESSAGES = new Set([
  "Cannot set properties of null (setting 'disabled')",
  "Cannot read properties of null (reading 'insertBefore')",
  "Cannot read properties of undefined (reading 'mermaid')",
]);

function isSwitchRaceMessage(msg: string): boolean {
  return SWITCH_RACE_MESSAGES.has(msg);
}

function suppressUnhandledRejection(event: PromiseRejectionEvent): void {
  const msg = (event.reason && (event.reason as Error).message) || "";
  if (isSwitchRaceMessage(msg)) {
    event.preventDefault();
  }
}

function suppressError(event: ErrorEvent): void {
  const msg =
    (event.error && (event.error as Error).message) || event.message || "";
  if (isSwitchRaceMessage(msg)) {
    event.preventDefault();
  }
}

/**
 * wujie plugin：把降噪监听器注册到子应用沙箱 iframe window 上。
 * windowPropertyOverride 在沙箱窗口初始化时、子应用脚本执行之前被调用，
 * 因此能拦截子应用运行期抛出的同步错误（error 事件不会冒泡到主 window）。
 *
 * 在 startApp 中通过 `plugins: [wujieErrorPatchPlugin]` 使用。
 */
export const wujieErrorPatchPlugin = {
  windowPropertyOverride: (iframeWindow: Window) => {
    iframeWindow.addEventListener("error", suppressError);
    iframeWindow.addEventListener(
      "unhandledrejection",
      suppressUnhandledRejection,
    );
  },
};

/**
 * 应用所有 wujie 运行时补丁（主 window 侧）。幂等：重复调用不会被叠加。
 */
export function applyWujiePatches(): void {
  if (window.__warnPatched) return;

  patchConsoleWarn();
  window.addEventListener("unhandledrejection", suppressUnhandledRejection);
  window.addEventListener("error", suppressError);
  window.__warnPatched = true;
}
