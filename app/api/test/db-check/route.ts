import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    // 1. Test database connection
    const db = await DatabaseService.getInstance();
    
    // 2. Test User model
    const UserModel = mongoose.model('User');
    
    // 3. Get connection status and details
    const connectionState = mongoose.connection.readyState;
    const connectionStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    // 4. Get database details
    let dbName = 'unknown';
    let collectionNames: string[] = [];
    
    if (mongoose.connection.db) {
      dbName = mongoose.connection.db.databaseName;
      const collections = await mongoose.connection.db.listCollections().toArray();
      collectionNames = collections.map(c => c.name);
    }

    return NextResponse.json({
      status: "success",
      database: {
        name: dbName,
        connection: connectionStates[connectionState as keyof typeof connectionStates],
        models: Object.keys(mongoose.models),
        collections: collectionNames,
        userModel: UserModel ? "registered" : "not registered"
      },
      connection: {
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      }
    });
  } catch (error) {
    console.error("Database check error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 