import mongoose from 'mongoose';



type ConnectionObject = {
    isConnected?:number
}

const connection :ConnectionObject={}
// connection.isConnected = "jatin"

async function dbConnect(): Promise<void>
// Promise<void> means "this async function returns nothing when it's done"

{
    if (connection.isConnected){ //if database is already connected
        console.log("database is already connected")
        return 

    }
    try {
        const db =  await mongoose.connect("mongodb+srv://gaurjatin71:RzJzaZamyTBxkdT5@cluster0.sxybbj9.mongodb.net/feedback?retryWrites=true&w=majority" || '', {})
        console.log("this is the data connection we got from mongo db",db)
                // ✅ Update the OUTER connection object (not create a new variable)
        connection.isConnected = db.connections[0].readyState // Note: connections (plural)
        
        console.log("DB conncted succesfully")
    } catch (error) {
         // ↑ If mongoose.connect() fails, mongoose throws an error
        console.log("database connection failed",error)
        process.exit()
        
    }
}
export default dbConnect