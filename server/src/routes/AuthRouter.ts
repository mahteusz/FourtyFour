import AuthController from "@controllers/AuthController";
import BaseRouter from "./BaseRouter";
import { Router } from "express";

export default class AuthRouter {
  public readonly router: Router;
  protected readonly controller: AuthController

  constructor(controller: AuthController) {
    this.router = Router()
    this.controller = controller
    this.defineRoutes()
  }

  private defineRoutes() {
    this.router.post("/login", this.controller.login)
  }
}	