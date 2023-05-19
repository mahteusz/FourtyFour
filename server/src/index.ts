import express from "express";
class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config()
  }

  public config(): void {
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

  }

  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log(`API running on port: ${this.app.get("port")}`)
    });
  }

}

const server = new Server();

server.start();