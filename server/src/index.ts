import express from "express";
import { connectToDB, disconnectDB } from "@helpers/db";
import { ITest, TestModel, connect as connectToFakeDB, disconnect as disconnectFromFakeDB }
  from "@helpers/mongodb-memory.server";
import { userRoute, testRoute } from "@config/routes";
import UserRouter from "@routes/UserRouter";
import UserController from "@controllers/UserController";
import MongoService from "@services/MongoService";
import UserModel from "@models/user";
import IUser from "@models/types/IUser";
import errorMiddleware from "@middlewares/errorMiddleware";
import http from "http"
import BaseController from "@controllers/baseController";
import TestRouter from "@routes/TestRouter";
class Server {
  public app: express.Application;
  private listener: http.Server;

  constructor() {
    this.app = express();
    this.listener = new http.Server()
    this.config()
    this.defineRoutes()
    this.defineMiddlewares()
    this.start()
  }

  private config(): void {
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.configDB()
  }

  private configDB(): void {
    process.env.NODE_ENV === "DEV" ? connectToFakeDB() : connectToDB()
  }

  private defineRoutes(): void {
    this.defineUserRoutes()
    if (process.env.NODE_ENV == "DEV") {
      this.defineTestRoutes()
    }
  }

  private defineUserRoutes(): void {
    const mongoService = new MongoService<IUser>(UserModel)
    const controller = new UserController(mongoService)
    this.app.use(userRoute, new UserRouter(controller).router)
  }

  private defineTestRoutes(): void {
    const mongoService = new MongoService<ITest>(TestModel)
    const controller = new BaseController<ITest>(mongoService)
    this.app.use(testRoute, new TestRouter(controller).router)
  }

  private defineMiddlewares(): void {
    this.defineErrorMiddleware()
  }

  private defineErrorMiddleware(): void {
    this.app.use(errorMiddleware)
  }

  public start(): void {
    this.listener = this.app.listen(this.app.get("port"), () => {
      console.log(`API running on port: ${this.app.get("port")}`)
    });
  }

  public async close() {
    process.env.NODE_ENV === "DEV" ? await disconnectFromFakeDB() : await disconnectDB()
    this.listener.close()
  }

}

const server = new Server();
export default server