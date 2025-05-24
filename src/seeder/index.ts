import "../config/dotenv";
import SeederModal from "./seederModal";
import DestinationSeeder from "./destination.seeder";

const seeders: SeederModal[] = [
    new DestinationSeeder(),
];

const main = async () => {
    for (const seeder of seeders) {
        try {
            await seeder.execute();
        } catch (e) {
            console.log(e);
        }
    }
};

main();