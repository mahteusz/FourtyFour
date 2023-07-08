import express from "express";
import { connectToDB, disconnectDB } from "@helpers/db";
import userRoute from "@config/routes";
import UserRouter from "@routes/UserRouter";
import UserController from "@controllers/UserController";
import MongoService from "@services/MongoService";
import UserModel from "@models/user";
import IUser from "@models/types/IUser";
import errorMiddleware from "@middlewares/errorMiddleware";
import http from "http"
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
    connectToDB()
  }

  private defineRoutes(): void {
    this.defineUserRoutes()
  }

  private defineUserRoutes(): void {
    const mongoService = new MongoService<IUser>(UserModel)
    const controller = new UserController(mongoService) 
    this.app.use(userRoute, new UserRouter(controller).router)
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
    await disconnectDB()
    this.listener.close()
  }

}

const server = new Server();
export default server