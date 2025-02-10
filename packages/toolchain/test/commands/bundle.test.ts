import { runCommand } from "@oclif/test";
import { expect } from "chai";

describe("bundle", () => {
  it("runs bundle", async () => {
    const { stdout } = await runCommand("bundle");
    expect(stdout).to.contain("Working directory:");
  });
});
