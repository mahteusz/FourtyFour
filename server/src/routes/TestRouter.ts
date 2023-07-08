import BaseRouter from "./BaseRouter";

export default class TestRouter extends BaseRouter {
  defineRoutes() {
    this.router.get("/", this.controller.getAll)
    this.router.get("/:id", this.controller.get)
    this.router.delete("/:id", this.controller.delete)
    this.router.patch("/:id", this.controller.patch)
    this.router.post("/", this.controller.post)
  }
}	