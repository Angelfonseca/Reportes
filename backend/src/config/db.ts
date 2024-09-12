import { connect } from "mongoose";

async function dbConnect(): Promise<void> {
  const DB_URI = process.env.MONGOURI as string;
  const DB_NAME = process.env.MONGODB_NAME as string;

  if (!DB_URI || !DB_NAME) {
    throw new Error("Missing MONGOURI or MONGODB_NAME in environment variables");
  }

  // Conectar a la base con el nombre de la base de datos especificada en el .env
  await connect(DB_URI, {
    dbName: DB_NAME,
  });
  
  console.log(`Connected to database: ${DB_NAME}`);
}

export default dbConnect;
