// require("dotenv").config();

// const config = require("./config.json");
// const mongoose = require("mongoose");

// mongoose.connect(config.connectionString);

// const user = require("./models/user.model");
// const Note = require("./models/note.model");

// const express = require("express");
// const cors = require("cors");
// const app = express();

// const jwt = require("jsonwebtoken");
// const { authenticateToken } = require("./utilities");

// app.use(express.json());

// app.use(
//     cors({
//         origin: "*",
//     })
// );

// app.get("/", (req, res) => {
//     res.json({ data: "hello" });
// });

// //create Account
// app.post("/create-account", async (req, res) => {

//     const { fullName, email, password } = req.body;

//     if (!fullName) {
//         return res
//             .status(400)
//             .json({ error: true, message: "full name is required" });
//     }
//     if (!email) {
//         return res.status(400).json({ error: true, message: "email is required" });
//     }
//     if (!password) {
//         return res
//             .status(400)
//             .json({ error: true, message: "password is required" });
//     }

//     const isUser = await User.findOne({ email: email });

//     if (isUser) {
//         return res.json({
//             error: true,
//             message: "User already exist",
//         });
//     }

//     const user = new user({
//         fullName,
//         email,
//         password,
//     });

//     await user.save();

//     const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
//         expiresIn: "36000m",
//     });

//     return res.json({
//         error: false,
//         user,
//         accessToken,
//         message: "Registration Successful",
//     });

// })


// app.post("/login", authenticateToken, async (req, res) => {
//     const { email, password } = req.body;

//     if (!email) {
//         return res.status(400).json({ message: "email is required" });
//     }
//     if (!password) {
//         return res.status(400).json({ message: "password is required" });
//     }

//     const userInfo = await user.findOne({ email: email });

//     if (!userInfo) {
//         return res.status(400).json({ message: "user not found" });
//     }

//     if (userInfo.email == email && userInfo.password == password) {
//         const user = { user: userInfo };
//         const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
//             expiresIn: "36000m",
//         });
//         return res.json({
//             error:false,
//             message:"Login Successfully",
//             email,
//             accessToken,
//         });
//     }else{
//         return res.status(400).json({
//             error:true,
//             message:"Invalid Credentials",
//         });
//     }
// });

// //Get User
// app.get("/get-user", async(req, res) => {
//     const {user} = req.user;

//     const isUser =  await User.findOne({ _id: user._id});

//     if(!isUser){
//         return res.sendStatus(401);
//     }

//     return res.json({
//         user: {
//             fullName: isUser.fullName,
//             email: isUser.email,
//             _id: isUser._id,
//             createdOn: isUser.createdOn,
//         },
//         message: "",
//     });
// });

// //Add Note
// app.post("/add-note", authenticateToken, async(req, res) => {
//     const {title, content, tags} = req.body;
//     const {user} = req.user;

//     if(!title){
//         return res.status(400).json({error:true, message:"title is required"});
//     }

//     if(!content){
//         return res
//         .status(400)
//         .json({error:true, message:"content is required"});
//     }

//     try{
//         const note = new Note({
//             title, 
//             content, 
//             tags : tags || [],
//             userId: user._id,
//         });
//         await note.save();

//         return res.json({
//             error:false,
//             note,
//             message: "Note added successfully",
//         });
//     }
//     catch(error){
//         return res.status(500).json({
//             error:true,
//             message:"Internal Server Error",
//         });
//     }
// });

// //Edit NOte
// app.post("/edit-note/:noteId", authenticateToken, async(req, res) => {
//     const noteId = req.params.noteId;
//     const {title, content, tags, isPinned} = req.body;
//     const {user} = req.user;

//     if(!title && !content && !tags){
//         return res
//         .status(400)
//         .json({error:true, message: "No changes provided"});
//     }

//     try{
//         const note = await Note.findOne({_id:noteId, userId: user._id});

//         if(!note){
//             return res.status(404).json({error: true, message: "Note not found"});
//         }

//         if(title) note.title = title;
//         if(content) note.content = content;
//         if(tags) note.tags = tags;
//         if(isPinned) note.isPinned = isPinned;

//         await note.save();

//         return res.json({
//             error:false.
//             note,
//             message: "Note updated successfully",
//         })
//     }catch{error}{
//         return res.status(500).json({
//             error:true,
//             message: "Internal Server Error",
//         });
//     }
// })

// //Get all note
// app.get("/get-all-notes/", authenticateToken, async(req, res) => {
//     const {user} = req.user;

//     try{
//         const notes = await Note.find({userId : user._id}).sort({isPinned: -1});
//         return res.json({
//             error:false,
//             notes,
//             message:"All notes retrives successfully",
//         });
//     }catch(error){
//         return res.status(500).json({
//             error:true,
//             message:"Internal Sever Error",
//         });
//     }
// }) 

// //Delete Note
// app.delete("/delete-note/:noteId", authenticateToken, async(req, res) => {
//     const noteId = req.params.noteId;
//     const {uset} = req.user;

//     try{
//         const note = await Note.findOne({ _id: noteId, userId: user._id});
//         if(!note){
//             return res.status(404).json({error:true, message: "Note not found"});
//         }

//         await Note.deleteOne({ _id: noteId, userId: user._id});

//         return res.json({
//             error:false,
//             message: "Note delete successfully",
//         });
//     }
//     catch(error){
//         return res.status(500).json({
//             error:true,
//             message:"Internal Server error",
//         });
//     }
// })

// //Update Note
// app.put("/update-note-pinned/:noteId", authenticateToken, async(req, res) => {
//     const noteId = req.params.noteId;
//     const {isPinned} = req.body;
//     const {user} = req.user;

//     try{
//         const note = await Note.findOne({_id:noteId, userId: user._id});

//         if(!note){
//             return res.status(404).json({error: true, message: "Note not found"});
//         }

//         note.isPinned = isPinned ;

//         await note.save();

//         return res.json({
//             error:false.
//             note,
//             message: "Note updated successfully",
//         })
//     }catch{error}{
//         return res.status(500).json({
//             error:true,
//             message: "Internal Server Error",
//         });
//     }
// })

// app.listen(8000);

// module.exports = app;















require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

// Increase server selection timeout
mongoose.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // serverSelectionTimeoutMS: 30000 // 30 seconds
    serverSelectionTimeoutMS: 5000, // Increase server selection timeout
    socketTimeoutMS: 45000,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(cors({
    origin: "*",
}));

app.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});

// Create Account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: "Full name is required" });
    }
    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    try {
        const isUser = await User.findOne({ email });
        if (isUser) {
            return res.json({ error: true, message: "User already exists" });
        }

        const newUser = new User({ fullName, email, password });
        await newUser.save();

        const accessToken = jwt.sign({ user: newUser }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "36000m" });

        return res.json({
            error: false,
            user: newUser,
            accessToken,
            message: "Registration Successful",
        });
    } catch (error) {
        console.error('Error creating account:', error.message);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});




// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ message: "User not found" });
    }

    if (userInfo.email === email && userInfo.password === password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });
        return res.json({ error: false, message: "Login successful", email, accessToken });
    } else {
        return res.status(400).json({ error: true, message: "Invalid credentials" });
    }
});

// Get User

app.get("/get-user", authenticateToken, async(req, res) => {
        const {user} = req.user;
    
        const isUser =  await User.findOne({ _id: user._id});
    
        if(!isUser){
            return res.sendStatus(401);
        }
    
        return res.json({
            user: {
                fullName: isUser.fullName,
                email: isUser.email,
                _id: isUser._id,
                createdOn: isUser.createdOn,
            },
            message: "",
        });
    });
// app.get("/get-user", authenticateToken, async (req, res) => {
//     const { user } = req.user;

//     try {
//         const isUser = await user.findOne({ _id: user._id });
//         if (!isUser) return res.sendStatus(401);

//         return res.json({
//             user: {
//                 fullName: isUser.fullName,
//                 email: isUser.email,
//                 _id: isUser._id,
//                 createdOn: isUser.createdOn,
//             },
//             message: "",
//         });
//     } catch (error) {
//         return res.status(500).json({ error: true, message: "Internal Server Error" });
//     }
// });


// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" });
    }

    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });
        await note.save();

        return res.json({ error: false, note, message: "Note added successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags) {
        return res
            .status(400)
            .json({ error: true, message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

// Get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.json({ error: false, notes, message: "All notes retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({ error: false, message: "Note deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Update Note Pinned Status
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false.
                note,
            message: "Note updated successfully",
        })
    } catch { error } {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

//Search Notes
app.get("/search-notes/", authenticateToken, async(req, res) => {
    const {user} = req.user;
    const {query} = req.query;

    if(!query){
        return res
        .status(400)
        .json({ error:true, message:"search query is required"});
    }

    try{
        const matchingNotes = await Note.find({
            userId : user._id,
            $or: [
                {title:{ $regex: new RegExp(query, "i")}},
                {content : { $regex : new RegExp(query, "i")}},
            ],
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully",
        });

    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error",
        });
    }
})

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

module.exports = app;
