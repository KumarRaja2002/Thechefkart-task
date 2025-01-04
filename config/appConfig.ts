import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// set up data
const appData = {
    api_version: "v1.0",
    port : Number(process.env.PORT) || 3000,
};

const db = {
    dbUser:String(process.env.DB_USER),
    dbName:String(process.env.DB_NAME),
    dbUrl:String(process.env.DB_URL),
    dbPassword:String(process.env.DB_PASSWORD),
    dbHost:String(process.env.DB_HOST),
    dbPort:Number(process.env.DB_PORT),
    dbCa: process.env.DB_CA
}



const configData = {
    app: appData,    
    db: db,
   
};



export default configData;  
