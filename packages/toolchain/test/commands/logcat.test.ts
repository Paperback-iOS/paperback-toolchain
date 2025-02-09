import { runCommand } from "@oclif/test";
import { expect } from "chai";


describe('logcat', () => {
  it("runs logcat with no parameters", async () => {
    const { stdout } = await runCommand("logcat");
    expect(stdout).to.contain("");
  });
})
