import chalk from "chalk";

/** 统一配色：各 CLI 共用同一套主题，避免样式散乱 */
export const theme = {
  primary: chalk.cyan,
  accent: chalk.green,
  warn: chalk.yellow,
  error: chalk.bold.red,
  muted: chalk.gray,
} as const;

/** 计算字符串的终端显示宽度：中日韩 / 全角 / emoji 按 2 计，其余按 1 计 */
function displayWidth(text: string): number {
  let width = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    const wide =
      (code >= 0x1100 && code <= 0x115f) || // Hangul Jamo
      (code >= 0x2e80 && code <= 0x303e) || // CJK radicals / punctuation
      (code >= 0x3040 && code <= 0x33ff) || // Hiragana .. CJK compatibility
      (code >= 0x3400 && code <= 0x4dbf) || // CJK extension A
      (code >= 0x4e00 && code <= 0x9fff) || // CJK unified
      (code >= 0xa000 && code <= 0xa4cf) || // Yi
      (code >= 0xac00 && code <= 0xd7a3) || // Hangul syllables
      (code >= 0xf900 && code <= 0xfaff) || // CJK compatibility ideographs
      (code >= 0xfe30 && code <= 0xfe4f) || // CJK compatibility forms
      (code >= 0xff00 && code <= 0xff60) || // Fullwidth forms
      (code >= 0xffe0 && code <= 0xffe6) ||
      (code >= 0x1f000 && code <= 0x1fffd) || // Emoji
      (code >= 0x20000 && code <= 0x2fffd) ||
      (code >= 0x30000 && code <= 0x3fffd);
    width += wide ? 2 : 1;
  }
  return width;
}

/** 按显示宽度左补齐到 target（中英文混排时保证列对齐） */
export function padRight(text: string, target: number): string {
  const pad = Math.max(0, target - displayWidth(text));
  return text + " ".repeat(pad);
}

/** 顶部居中大标题横幅（box 边框），用于每个 CLI 的起始与结束 */
export function banner(title: string): void {
  const inner = 46;
  console.log("");
  console.log(theme.primary("  ┌" + "─".repeat(inner) + "┐"));
  const titlePad = Math.max(0, inner - displayWidth(title));
  const titleLeft = Math.floor(titlePad / 2);
  console.log(
    theme.primary("  │") +
      theme.primary.bold(
        " ".repeat(titleLeft) + title + " ".repeat(titlePad - titleLeft),
      ) +
      theme.primary("│"),
  );
  console.log(theme.primary("  └" + "─".repeat(inner) + "┘"));
}

/** 水平分割线 */
export function divider(): void {
  console.log(theme.muted("  " + "─".repeat(50)));
}

/** 小结标题（左侧竖条引导） */
export function section(text: string): void {
  console.log(theme.muted("  ▍" + text));
}

/** 一条「标签 + 名称 + ➜ URL」的服务行，列对齐 */
export function urlRow(label: string, name: string, url: string): void {
  console.log(
    `  ${theme.primary.bold(padRight(label, 10))}${theme.primary.bold(padRight(name, 14))}${theme.accent("➜")}  ${theme.primary.underline(url)}`,
  );
}

/** 带序号的步骤标题：步骤 1/3 · 说明 */
export function step(current: number, total: number, text: string): void {
  console.log(`\n  ${theme.primary.bold(`[${current}/${total}]`)} ${text}`);
}

/** 成功提示 */
export function ok(text: string): void {
  console.log(chalk.green("  ✔ ") + text);
}

/** 警告提示 */
export function warn(text: string): void {
  console.log(chalk.yellow("  ⚠ ") + text);
}

/** 错误提示 */
export function fail(text: string): void {
  console.log(chalk.red("  ✖ ") + text);
}
