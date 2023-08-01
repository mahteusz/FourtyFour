import BaseRouter from "./BaseRouter";
import verifyAuthentication from "@middlewares/verifyAuthentication";
import TestController from "@controllers/TestController";

export default class TestRouter extends BaseRouter {
  defineRoutes() {
    this.router.get("/auth-protected", verifyAuthentication,
      (this.controller as TestController).authProtected)
    this.router.get("/", this.controller.getAll)
    this.router.get("/:id", this.controller.get)
    this.router.delete("/:id", this.controller.delete)
    this.router.patch("/:id", this.controller.patch)
    this.router.post("/", this.controller.post)
  }
}