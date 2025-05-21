import data from './destination';
import destinationModel from './models/destination.model';

export async function run()  {
    const result = await destinationModel.insertMany(data)
    console.log(result);
}