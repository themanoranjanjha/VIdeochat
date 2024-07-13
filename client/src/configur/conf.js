const conf = {
    appwriteUrl: String(process.env.APPWRITE_URL),
    appwriteProjectId: String(process.env.REACT_APP_APPWRITE_PROJECT_ID),
    
    // appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    // appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    
}
 console.log(" conf",process.env.REACT_APP_APPWRITE_PROJECT_ID);
export default conf