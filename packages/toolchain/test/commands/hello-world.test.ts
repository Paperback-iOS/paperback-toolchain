import {expect, test} from '@oclif/test'

describe('hello-world', () => {
  test
  .stdout()
  .command(['hello-world'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['hello-world', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
