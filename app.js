const express = require("express")
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const connectDB = require("./config/dbConect");
const cors = require("cors");
const xss = require("xss-clean");
const ratelimiting = require("express-rate-limit")
const helmet = require("helmet");
const hpp = require("hpp");
const { errorHandler, notFound } = require("./middlewares/error");
require('dotenv').config();
const { createServer } = require("http");
const { Server } = require("socket.io");


const httpServer = createServer(app);
const io = new Server(httpServer, { cors: {
  origin: "https://blog-side.onrender.com",
}});



// conction mongo db
connectDB();

app.use(express.json());




// MIDDLEWARES


app.use(helmet());

app.use(hpp());

app.use(xss());

app.use(ratelimiting({
  windowMs: 10 * 60 * 1000,
  max: 170,
}
));

// Cors Policy
app.use(cors({
  origin: "https://blog-side.onrender.com"
}));


//socket io
io.onlineUser = {}
io.on('connection', (socket) => {
  require("./socketIo/notifec")(socket, io);
  require("./socketIo/frind")(socket, io);
  require("./socketIo/message")(socket, io);
});


//Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/posts", require("./routes/postsRoute"));
app.use("/api/comments", require("./routes/commentsRoute"));
app.use("/api/categories", require("./routes/categoryRoute"));
app.use("/api/password", require("./routes/passwordRoute"));
app.use("/api/frind", require("./routes/frindsRoute"));
app.use("/api/chats", require("./routes/chatRoute"));

// Error handeler 
app.use(notFound);
app.use(errorHandler);







// RUNING THE SERVER

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

 /*mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
}) */



