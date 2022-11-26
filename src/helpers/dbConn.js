import mongoose from 'mongoose';

async function connectDB() {
	try {
		await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	} catch (err) {
		console.log(err);
	}
}

export default connectDB;
