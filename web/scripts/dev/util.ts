import type { ChildProcess } from "child_process"
import { cmdAsync as cmd, pc, shellAsync as shell } from "../pretty-logs"

const args = process.argv.slice(2)

export const isServe = args.includes("serve")
export const isSudo = args.includes("sudo")
export const isBuild = args.includes("build")
export const isClean = args.includes("clean")

export async function pnpm(args: string, pipe = true, cd?: string) {
  if (cd) return await cmd(`cd ${cd} && pnpm -s ${args}`, pipe)
  else return await cmd(`pnpm -s ${args}`, pipe)
}

export function compose(args: string, spawn?: false, pipe?: boolean): Promise<string>
export function compose(args: string, spawn: true, pipe?: boolean): Promise<ChildProcess>
export async function compose(args: string, spawn = false, pipe = true) {
  const str = `npm run compose${isSudo ? "-sudo" : ""} -- ${args}`
  return spawn ? await shell(str, pipe) : await cmd(str, pipe)
}

export class ProgressLine {
  constructor(line?: string) {
    if (line) this.update(line)
  }

  update(line: string) {
    process.stdout.clearLine(-1)
    process.stdout.cursorTo(0)
    process.stdout.write(line)
  }

  break(line?: string) {
    if (line) this.update(line)
    process.stdout.write("\n")
  }
}

export async function starting<T>(name: string, promise: Promise<T>) {
  const progress = new ProgressLine(`Starting ${name} ...`)
  try {
    const result = await promise
    progress.break(`Starting ${name} ... ${pc.green("done")}`)
    return result
  } catch (error) {
    progress.break(`Starting ${name} ... ${pc.red("failed")}`)
    throw error
  }
}

export async function closing<T>(name: string, promise: Promise<T>) {
  const progress = new ProgressLine(`Stopping ${name} ...`)
  try {
    const result = await promise
    progress.break(`Stopping ${name} ... ${pc.green("done")}`)
    return result
  } catch (error) {
    progress.break(`Stopping ${name} ... ${pc.red("failed")}`)
    throw error
  }
}
