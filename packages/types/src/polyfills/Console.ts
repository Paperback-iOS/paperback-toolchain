// @ts-nocheck

export class Console {
  log(...msg: string[]) {
    Application.console_log(msg);
  }

  warn(...msg: string[]) {
    Application.console_warn(msg);
  }

  error(...msg: string[]) {
    Application.console_error(msg);
  }
}