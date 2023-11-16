"use server"
import { revalidatePath } from "next/cache";


import { prisma } from "@/lib/db"

export async function deleteBoard(id:string){
    await prisma.board.delete({
        where:{
            id
        }
    })

    revalidatePath("/organization/org_2YDBVuPCDFsJG9X0NFBqKhw3JW0")   
}