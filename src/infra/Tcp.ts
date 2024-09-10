import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { useExpressServer } from "routing-controllers";
import mongoose from "mongoose";

import { IService } from "types/services";
import { controllers } from "app/domain";
import { middlewares } from "app/middlewares";

dotenv.config();

export class Tcp implements IService {
  private static instance: Tcp;

  private routePrefix = "api";
  public server = express();

  constructor() {
    if (!Tcp.instance) {
      Tcp.instance = this;
    }
    return Tcp.instance;
  }

  async init(): Promise<boolean> {
    const { server, routePrefix } = this;

    server.use(morgan("tiny"));
    server.use(cors());
    server.use(express.json());
    server.use(express.static("public"));

    useExpressServer(server, {
      routePrefix,
      controllers,
      middlewares,
      cors: true,
      defaultErrorHandler: true,
      validation: false,
    });

    const { MONGODB_URL } = process.env;

    if (!MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined");
    }

    try {
      await mongoose.connect(MONGODB_URL);
      server.listen(4000, () => {
        console.log("Tcp service started on port 4000");
      });
      return true;
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      return false;
    }
  }
}
