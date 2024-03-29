import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cloudinary from "../utils/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';

export const register = async (req, res) => {
	try {
		const { username, email, password, image } = req.body;
		const oldUser = await User.findOne({ email });
		if (oldUser) return res.status(400).json({
			message: "User already exists",
			success: false
		})
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);
		const uploadResponse = await cloudinary.v2.uploader.upload(image, {
			upload_preset: 'opnnk8pe',
		});
		const user = await User.create({
			username,
			password: hashPassword,
			email,
			image: {
				public_id: uploadResponse.public_id,
				url: uploadResponse.secure_url,
			}
		})
		user.save();
		const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY, {
			expiresIn: 30 * 24 * 60 * 60 * 1000
		});
		res.status(200).json({
			token,
			user,
			message: "User Saved",
			success: true
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server Error",
		});
	}


}

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "user not found",
			});
		}
		const validity = await bcrypt.compare(password, user.password);
		if (!validity) {
			console.log("invalid credr")
			return res.status(403).json({
				message: "Invalid credensitial",
				success: false
			})
		}
		const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY, {
			expiresIn: 30 * 24 * 60 * 60 * 1000
		});
		res.status(200).json({
			user,
			token,
			message: "User logged In",
			success: true,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server Error",
		});
	}
}

export const getAllUser = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json({
			users,
			message: "All user are here",
			success: true
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server Error",
		});
	}
}

export const followAndUnFollow = async (req, res) => {
	try {
		const whomFollow = await User.findById(req.params.id);
		const whoFollow = await User.findById(req.body._id);

		if (!whomFollow) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		if (whoFollow.following.includes(whomFollow._id)) {
			const indexfollowing = whoFollow.following.indexOf(whomFollow._id);
			const indexfollowers = whomFollow.followers.indexOf(whoFollow._id);

			whoFollow.following.splice(indexfollowing, 1);
			whomFollow.followers.splice(indexfollowers, 1);

			await whoFollow.save();
			await whomFollow.save();

			res.status(200).json({
				success: true,
				message: "User Unfollowed",
			});
		} else {
			whoFollow.following.push(whomFollow._id);
			whomFollow.followers.push(whoFollow._id);

			await whoFollow.save();
			await whomFollow.save();

			res.status(200).json({
				success: true,
				message: "User followed",
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server Error",
		});
	}
}

export const myProfile = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.status(200).json({
			user,
			message: "Get your profile",
			success: true,
		})

	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server Error",
		});
	}
}

export const editProfile = async (req, res) => {
	try {
		const user = await User.findById(req.body._id);
		if (!user) {
			return res.status(404).json({
				message: "User not Found"
			});
		}
		const { firstName, lastName, bio, image, ytlink, fblink } = req.body;
		const uploadResponse = await cloudinary.v2.uploader.upload(image, {
			upload_preset: 'opnnk8pe',
		});
		const updatedUser = await User.updateOne(
			{ _id: user._id },
			{
				$set: {
					firstName,
					lastName,
					bio,
					image: {
						public_id: uploadResponse.public_id,
						url: uploadResponse.secure_url,
					},
					ytlink,
					fblink,
				}
			}
		);
		if (updatedUser.nModified === 0) {
			res.status(403).json({
				success: false,
				message: "Failed to update user profile",
			});
		}
		res.status(200).json({
			user: updatedUser,
			message: "Profile updated",
			success: true
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server Error",
		});
	}
}

export const searchPerson = async (req, res) => {
	try {
		const { query } = req.query
		const searchedPerson = await User.find({ username: { $regex: query, $options: 'i' } });
		if (!searchedPerson) {
			return res.status(403).json({
				message: "Please enter correct username",
				success: false
			})
		}
		res.status(200).json({
			searchedPerson,
			message: "Person found",
			success: true,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server Error",
		});
	}
}

export const logout = async (req, res) => {
	try {
		req.headers.authorization = null;
		res.status(200).json({
			message: "user logout",
			success: true
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
}


export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			console.log("User not exits");
			return res.status(404).json({
				message: "Usr Not Found",
				success: false,
			})
		}
		console.log("user found");
		const resetToken = user.getResetPasswordToken();
		console.log(resetToken);
		await user.save();
		// const resetUrl = `${req.protocol}://${req.get("host")}/api/users/reset/${resetToken}`;
		const nrrestUrl = `${req.protocol}://localhost:3000/api/user/password/reset/${resetToken}`;

		const message = `Your password reset token is :- \n\n ${nrrestUrl} \n\n If you have not requested this email then, please ignore it`
		// console.log(message);
		try {
			await sendEmail({
				email: user.email,
				subject: `Insta_clone`,
				message
			})
			res.status(200).json({
				user,
				success: true,
				message: `Email sent to ${user.email}`,
			});
		} catch (error) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;

			await user.save();

			res.status(500).json({
				success: false,
				message: "Internal server error"
			});
		}
		res.status(200).json({
			success: true,
			message: "done",
		})

	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
}

export const resetPassword = async (req, res) => {
	try {
		const resetPasswordToken = crypto
			.createHash("sha256")
			.update(req.params.token)
			.digest("hex");
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() }
		})
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Token is invalid or has expired",
			});
		}
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.password, salt);
		user.password = hashPassword;

		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save();
		const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY);
		res.status(200).json({
			user,
			token,
			success: true,
			message: "Password updated"
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}

}

export const getMe = async (req, res) => {
	try {
		const me = await User.findById(req.body._id);
		res.status(200).json({ me, success: true, message: "I am here" });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server Error",
		});
	}
}

export const getUser = async (req, res) => {
	// console.log(req.params.id);
	if (req.params.id==undefined) {
		console.log("No param id");
	}
	try {
		const user = await User.findById(req.params.id);
		if (!user)
			return res.status(404).json({
				message: "No User"
			})
		// const {password,updatedAt,...other}=user._doc;
		res.status(200).json({ user, message: "ok" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ error, message: "Internal Server Error" });
	}
}

export const getFriends = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user)
			return res.json({
				message: "No Usere"
			})
		const { password, updatedAt, ...other } = user._doc;
		res.status(200).json(other);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
}