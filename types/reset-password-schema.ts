import * as z from "zod";

export const resetPasswordSchema = z.object({
    email : z.string().email({
        message : "Invalid email address"
    })
})