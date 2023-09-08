/* eslint-disable @typescript-eslint/unbound-method */
import type { ChildProcess } from "child_process"
import { formatLogs } from "../pretty-docker-logs"
import { compose } from "./util"

export class Containers {
  declare logger?: ChildProcess

  stopped = false

  static async clean() {
    await compose("stop")
  }

  static async create() {
    const containers = new Containers()
    await compose("up -d")
    return containers
  }

  async close() {
    if (this.stopped) return
    this.stopped = true
    await this.stopLogging()
    await compose("stop")
  }

  async startLogging() {
    if (this.stopped || this.logger) return
    this.logger = await compose("logs -f --tail 10 --no-color", true, false)
    this.logger.stdout?.on("data", this.log)
    this.logger.stderr?.on("data", this.log)
  }

  async stopLogging() {
    if (!this.logger) return
    this.logger.stdout?.off("data", this.log)
    this.logger.stderr?.off("data", this.log)
    this.logger.kill("SIGINT")
    this.logger = undefined
  }

  private log(data: Buffer) {
    console.log(formatLogs(data))
  }

  static async build() {
    await compose("build")
  }

  static async services() {
    const out = await compose("ps --services", false, false)
    return out.split("\n").filter(Boolean).sort()
  }

  static async isRunning() {
    const out = await compose("top", false, false)
    return out.length !== 0
  }

  async buildService(service: string) {
    await compose(`build ${service}`)
  }

  async restartService(service: string) {
    await compose(`restart ${service}`)
  }
}
