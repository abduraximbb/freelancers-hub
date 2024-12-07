const express = require('express');
const config = require('config');
const sequelize = require("./config/db")
const cookieParser = require("cookie-parser");

const error_handling_middleware = require("./middleware/error_handling_middleware");
const { expressWinstonErrorLogger } = require("./middleware/express_logger_middleware");
const mainRouter = require("./routes/index.routes")

const PORT = config.get("port")

const app = express()

app.use(express.json())
app.use(cookieParser());

app.use("/api", mainRouter)

app.use(expressWinstonErrorLogger);

app.use(error_handling_middleware)

async function start(){
    try {
        await sequelize.authenticate();
        await sequelize.sync({alter:true})
        app.listen(PORT, ()=>{
            console.log(`Server started at http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()