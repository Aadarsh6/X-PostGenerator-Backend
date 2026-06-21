import type { Request, Response } from "express";
import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signup = async(req:Request, res:Response)=>{
    const { name, email, password } = req.body
//!Check if user already exist
    try {
    const existingUser = await prisma.user.findFirst({
        where: {email:email}
    })
    if(existingUser){
        console.log("User already exist with this credentials");
        res.status(409).json({message:"User already exist with this credentials"})
        return
    }} catch (error) {
        res.status(400).json({message:"Can't crete user", error})
    }

//!Password hashing

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword);

        const signup = await prisma.user.create({
            data:{ 
                name: name,
                email: email,
                password: hashedPassword
            }
        })

//!Generate JWT token for user

        const token = jwt.sign({
            userId: signup.id
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "7d"
        }
    )
    res.status(200).json({token, id:signup.id, name:signup.name, email:signup.email })
    } catch (error) {
        res.status(500).json({message:"Error while creating user", error})
    }

}

const login = async(req:Request, res:Response)=>{

    const { email, password } = req.body
//!Checking if user exists or not
    try {
        const userExists = await prisma.user.findUnique({
            where:{email:email}
        })
        if(!userExists){
            console.log("User does not exist");
            res.status(404).json({message:"User doesn't exist"})
            return
        }


//!Password verification

        const passwordVerification = await bcrypt.compare(password, userExists.password!)
        if(!passwordVerification) return res.status(404).json({message:"Invalid credentials"})

//!Jwt sign/creating session

        const token = await jwt.sign({
            userId: userExists.id
        },
            process.env.JWT_SECRET!,
            {
                expiresIn: "7d"
            }
    )
        res.status(200).json({token, id: userExists.id, name: userExists.name, email: userExists.email})
    } catch (error) {
        res.status(500).json({message: "Error logging in", error})
    }
}