import { Router } from "express";
import IBaseController from "@controllers/types/IBaseController";

export default abstract class BaseRouter {
  public readonly router: Router;
  protected readonly controller: IBaseController

  constructor(controller: IBaseController) {
    this.router = Router()
    this.controller = controller
    this.defineRoutes()
  }

  abstract defineRoutes(): void
}