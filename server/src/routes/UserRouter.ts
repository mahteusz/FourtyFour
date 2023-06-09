import { BaseRouter } from "./BaseRouter";

export class UserRouter extends BaseRouter {
  defineRoutes() {
    this.router.get("/", this.controller.get)
  }
}	