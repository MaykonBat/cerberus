import Config from "../config";

import { PrismaClient } from "commons";

let singleton: PrismaClient;

export default async (): Promise<PrismaClient> => {
  if (!singleton) {
    singleton = new PrismaClient();
    await singleton.$connect();
  }

  return singleton;
};
