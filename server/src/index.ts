import express from "express";
import connectToDB from "@config/db";
import userRoute from "@config/routes";
import UserRouter from "@routes/UserRouter";
import UserController from "@controllers/UserController";
import MongoService from "@services/MongoService";
import UserModel from "@models/user";
import IUser from "@models/types/IUser";
import errorMiddleware from "@middlewares/errorMiddleware";
class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config()
    this.defineRoutes()
    this.defineMiddlewares()
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
    this.app.listen(this.app.get("port"), () => {
      console.log(`API running on port: ${this.app.get("port")}`)
    });
  }

}

const server = new Server();

server.start();