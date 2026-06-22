import type { Request, Response, NextFunction } from "express";

export function validateSignup(req:Request, res:Response, next:NextFunction){
    const { name, email, password } = req.body

    if(!name || typeof name !== 'string' || name.trim().length < 2){
        return res.status(400).json({message: "Name must be 2 characters"})
    }
    if(!email || typeof email !== 'string' || !email.includes("@")){
        return res.status(400).json({message: "Invalid email"})
    }
    if(!password || typeof password !== 'string' || password.length < 7){
        return res.status(400).json({message: "password must be at least 7 characters"})
    }
    next()
}

export function validateLogin(req:Request, res:Response, next:NextFunction){
    const { email, password } = req.body

    if(!email || typeof email !== 'string' || !email.includes("@")){
        return res.status(400).json({message: "Invalid email"})
    }
    if(!password || typeof password !== 'string' || password.length === 0){
        return res.status(400).json({message: "password is requires"})
    }
    next()
}