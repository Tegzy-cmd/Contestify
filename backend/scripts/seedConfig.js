import mongoose from 'mongoose';
import Config from '../models/Config.js'; // Ensure your model file uses ESModule export

const configs = [
    {
        key: 'siteName',
        value: 'Contestify',
        description: 'The name of the site'
    },
    {
        key: 'maxContestants',
        value: '100',
        description: 'Maximum number of contestants per contest'
    },
    {
        key: 'allowRegistration',
        value: 'true',
        description: 'Allow new user registrations'
    }
];

async function seedConfig() {
    try {
        await mongoose.connect('mongodb://localhost:27017/contestify', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await Config.deleteMany({});
        await Config.insertMany(configs);

        console.log('Config seed complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seedConfig();