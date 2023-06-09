import { Router } from "express";
import { IBaseController } from "../controllers/types/IBaseController";

export abstract class BaseRouter {
  protected readonly router: Router;
  protected readonly controller: IBaseController

  constructor(router: Router, controller: IBaseController) {
    this.router = router
    this.controller = controller
    this.defineRoutes()
  }

  abstract defineRoutes(): void
}