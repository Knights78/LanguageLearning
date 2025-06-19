import express from "express"
import {protectedRoute }from "../middleware/protectedRoute.js"
import { getStreamToken } from "../controllers/chat.controller.js"
const router=express.Router()
router.get("/token",protectedRoute,getStreamToken)//this function will generate the stream token which is required by the stream chat sdk
export default router