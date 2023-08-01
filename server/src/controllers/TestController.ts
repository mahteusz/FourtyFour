import { Request, Response, NextFunction } from "express";
import BaseController from "./baseController";
import { ITest } from "@helpers/mongodb-memory.server";
import { CustomRequest } from "@middlewares/types";

export default class TestController extends BaseController<ITest>{

  public authProtected = async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as CustomRequest).user
    res.status(200).json({ data: user })
  }
}