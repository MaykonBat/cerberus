import connect from "./db";
import { Status, User } from "commons";

async function updateUserStatus(address: string, status: Status) : Promise<User>{
    const db = await connect();

    const user = await db.users.update({
        where: { address },
        data: { status }
    })

    return user;
}

export default {
    updateUserStatus
}