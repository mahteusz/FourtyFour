import express from "express";
import connectToDB from "./config/db";
class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config()
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

  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log(`API running on port: ${this.app.get("port")}`)
    });
  }

}

const server = new Server();

server.start();