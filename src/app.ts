import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import cors from "cors"
import cookieParser from 'cookie-parser'
import passport from 'passport'
import expressSession from "express-session"
import "./app/config/passport"
import { router } from './app/routes/index.js'
import { globalErrorHandler } from './app/middlewares/globalErrorHandler.js'
import { notFound } from './app/middlewares/notFound.js'

export const app: Application = express()

// Passport JS Initialization Middlewares
app.use(expressSession({
    secret: "Your Secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// Necessary Middleware
app.use(cookieParser())
app.use(express.json())
app.use(morgan("dev"))
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://air-clast-next-js.vercel.app"
    ],
    methods:["POST","GET","PATCH","DELETE","PUT"],
    credentials: true
}))

app.use("/api/v1", router)


app.get("/", async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Air Guard System Backend"
    })
})


app.use(globalErrorHandler)

app.use(notFound)