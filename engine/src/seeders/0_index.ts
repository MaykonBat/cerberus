import ISeeder from "./ISeeder";
import TokensSeeder from "./1_tokens";
import PoolsSeeder from "./2_pools";

const seeders : ISeeder[] = [
    TokensSeeder,
    PoolsSeeder
]

async function start(){
    console.log(`Initializing Seeders Index...`);

    for(let i=0; i < seeders.length; i++){
        await seeders[i].execute();
    }
    console.log(`Finalized Seeders Index.`);
}

start();