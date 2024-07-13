import { Client, Account } from 'appwrite';
import conf from '../configur/conf';
export const PROJECT_ID = conf.appwriteProjectId
// export const DATABASE_ID = conf.appwriteDatabaseId
// export const COLLECTION_ID_MESSAGES = conf.appwriteCollectionId
//  console.log("hgfh")
const client = new Client();
console.log("project Id", conf.appwriteProjectId)
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);
// export const database = new Databases(client);
export const account = new Account(client);
 export default client;