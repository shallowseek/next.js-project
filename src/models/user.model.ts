import mongoose, {Schema,Document} from 'mongoose';


export interface Message extends Document
// The Message interface will have:


// All the properties and methods that Document already has
// Plus the additional properties: content (string) and timestamp (Date)

// Think of it like this:

// Document is the parent/base interface
// Message is the child interface that gets everything from Document plus its own stuff

{
  content: string;
  timestamp: Date;
}




const MessageSchema:Schema<Message> = new Schema({
// The Schema<Message> is telling TypeScript: "This schema should match the structure defined in the Message interface."
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
    }
 
)


export interface User extends Document {
    name: string;
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  veifyCodeExpires: Date;
  isVerified: boolean; // Optional property
  isAcceptedMessage: boolean;
  messages: Message[];
  // messages: Message[]; // This means the User can have multiple messages
  // Each message will follow the structure defined in the Message interface
}


// What's TypeScript-specific:

// interface User { ... } - defining interfaces
// username: string - type annotations
// messages: Message[] - array type annotations
// const user: User - variable type annotations
// extends Document - interface inheritance

const UserSchema: Schema<User> = new Schema({
  name:{
    type: String,
    required: true,
  }
  
    ,username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  verifyCode: {
    type: String,
    required: true
  },
  veifyCodeExpires: {
    type: Date,
    required: true
  },
  isAcceptedMessage: {
    type: Boolean,
    default: true
  },

    isVerified: {
        type: Boolean,
        default: false
    },
  messages: [MessageSchema] // This means the User can have multiple messages
  // Each message will follow the structure defined in the Message interface




})                  //case when model is already defined in mongoose.models

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);
export default UserModel;

// The <User> is telling TypeScript: "This model will create objects that follow the User interface structure."

// interface Person { name: string; age: number; } so it means that now typescript will check that object person has name and age whuch are string and number ?
// interface Person {
//   name: string;
//   age: number;
// }This means TypeScript will check that any object you say is a Person must have:

// A name property that is a string
// An age property that is a number

// "If you tell me something is a Person, I will check that it has exactly a 'name' (string) and 'age' (number). If it doesn't match, I'll show you an error."

// const person2: Person = {
//   name: "Bob",     // string ✓
//   age: "twenty"    // string ❌ (should be number!)
// };
// // TypeScript error: Type 'string' is not assignable to type 'number'











// Great question! Let me explain `extends Document` by comparing it to simpler examples.

// **Simple extends example first:**
// ```typescript
// interface Animal {
//   name: string;
//   age: number;
// }

// interface Dog extends Animal {
//   breed: string;
// }
// ```

// This means `Dog` gets everything from `Animal` PLUS its own stuff:
// ```typescript
// const myDog: Dog = {
//   name: "Buddy",    // ← from Animal
//   age: 3,           // ← from Animal  
//   breed: "Golden"   // ← from Dog
// };
// ```

// **Now your MongoDB example:**
// ```typescript
// interface Message extends Document {
//   content: string;
//   timestamp: Date;
// }
// ```

// **What `Document` contains:**
// The `Document` interface (from Mongoose) has MongoDB-specific properties like:
// ```typescript
// interface Document {
//   _id: ObjectId;           // MongoDB's unique ID
//   save(): Promise<this>;   // Method to save to database
//   remove(): Promise<this>; // Method to delete from database
//   toJSON(): object;        // Convert to plain object
//   // ... and many more MongoDB methods
// }
// ```

// **So `Message extends Document` means:**
// Your `Message` interface gets ALL of Document's properties/methods PLUS your custom ones:

// ```typescript
// const message: Message = {
//   // From Document:
//   _id: someObjectId,
//   save: function() { /* MongoDB save logic */ },
//   remove: function() { /* MongoDB remove logic */ },
  
//   // From Message:
//   content: "Hello world!",
//   timestamp: new Date()
// };
// ```

// **Why extend Document?**
// Because you want your Message to be a real MongoDB document that can:
// ```typescript
// const msg = new MessageModel({...});
// await msg.save();        // ← This comes from Document
// await msg.remove();      // ← This comes from Document
// console.log(msg._id);    // ← This comes from Document
// console.log(msg.content); // ← This comes from Message
// ```

// **So extending Document gives your Message all the MongoDB superpowers!**