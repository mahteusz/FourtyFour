import express from "express";
import { connectToDB, disconnectDB } from "@helpers/db";
import { ITest, TestModel, connect as connectToFakeDB, disconnect as disconnectFromFakeDB }
  from "@helpers/mongodb-memory.server";
import { userRoute, testRoute, authRoute } from "@config/routes";
import { UserRouter, TestRouter, AuthRouter } from "@routes/index";
import { UserController, BaseController, AuthController } from "@controllers/index"
import { MongoService, BcryptService, JWTService } from "@services/index"
import { UserModel } from "@models/index";
import { IUser } from "@models/types/index";
import { errorMiddleware } from "@middlewares/index";
import http from "http"
import saltRounds from "@config/encrypt";
import { JWT_SECRET } from "@util/secrets";
import { accessTokenTimeToExpire, refreshTokenTimeToExpire } from "@config/auth";
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
    this.defineAuthRoutes()
    if (process.env.NODE_ENV == "DEV") {
      this.defineTestRoutes()
    }
  }

  private defineUserRoutes(): void {
    const mongoService = new MongoService<IUser>(UserModel)
    const controller = new UserController(mongoService)
    this.app.use(userRoute, new UserRouter(controller).router)
  }

  private defineAuthRoutes(): void {
    const mongoService = new MongoService<IUser>(UserModel)
    const encryptService = new BcryptService(saltRounds)
    const accessTokenService = new JWTService(JWT_SECRET!, accessTokenTimeToExpire)
    const refreshTokenService = new JWTService(JWT_SECRET!, refreshTokenTimeToExpire)
    const controller = new AuthController(mongoService, encryptService, accessTokenService, refreshTokenService)
    this.app.use(authRoute, new AuthRouter(controller).router)
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