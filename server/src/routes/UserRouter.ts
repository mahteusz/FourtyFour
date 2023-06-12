import { UserController } from "../controllers/UserController";
import { BaseRouter } from "./BaseRouter";

export class UserRouter extends BaseRouter {
  defineRoutes() {
    this.router.get("/", this.controller.getAll)
    this.router.get("/:id", this.controller.get)
    this.router.delete("/:id", this.controller.delete)
    this.router.delete("/:id", this.controller.patch)
    this.router.post("/register", (this.controller as UserController).register)
  }
}	