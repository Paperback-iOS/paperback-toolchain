export interface TestLogger {
  scope(key: string): TestLogger
  list(key: string): TestLogger
  log(key: string, value: unknown): TestLogger
}