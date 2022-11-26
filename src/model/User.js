import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		hash: {
			type: String,
			required: true,
		},
		refresh_token: [String],
	},
	{ timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
