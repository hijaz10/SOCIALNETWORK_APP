import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from '../Utilities/generateToken.js';
import EmailVerification from "../models/email.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import redis from "../configs/redis.js";

export const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email.endsWith("@maaun.edu.ng")) {
      return res.status(400).json({ message: "Only @maaun.edu.ng emails allowed" });
    }

    const code = crypto.randomInt(100000, 999999).toString();

    await EmailVerification.findOneAndDelete({ email });

    await EmailVerification.create({
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Verify your email",
      text: `Your verification code is ${code}`,
    });

    res.json({ message: "Verification code sent" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sending code" });
  }
};


export const signup = async (req, res) => {
  try {
    const { email, username, fullname, bio, password, profile_pic, code } = req.body;

    const record = await EmailVerification.findOne({ email });

    if (!record || record.code !== code)
      return res.status(400).json({ message: "Invalid verification code" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "Verification code expired" });

    await EmailVerification.deleteOne({ email });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      fullname,
      bio,
      profile_pic,
      password: hashedPassword,
    });

      try {
          generateTokenAndSetCookie(user._id, res);
      } catch (tokenErr) {
          console.error("Error generating token:", tokenErr);
          return res.status(500).json({ message: "Token generation failed" });
      }

    res.status(201).json({
      message: "login successful",
      user: {
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        profile_pic: user.profile_pic,
        location: user.location,
        bio: user.bio,
      },
});
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error verifying email" });
  }
};

    


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email.endsWith("@maaun.edu.ng")) {
      return res
        .status(400)
        .json({ message: "Only @maaun.edu.ng emails are allowed" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
        return res.status(400).json({ message: "Incorrect password" })
    }

    try {
        generateTokenAndSetCookie(user._id, res);
    } catch (tokenErr) {
        console.error("Error generating token:", tokenErr);
        return res.status(500).json({ message: "Token generation failed" });
    }

    res.status(201).json({
      message: "login successful",
      user: {
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        profile_pic: user.profile_pic,
        location: user.location,
        bio: user.bio,
      },
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
	try {
		res.clearCookie("jwt-App");
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
}

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const cachedUser = await redis.get(`user:${userId}`);

    if (cachedUser) {
      return res.json({
        source: "cache",
        user: JSON.parse(cachedUser),
      });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    await redis.set(`user:${userId}`, JSON.stringify(user), { EX: 3600 });

    return res.json({
      source: "database",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const authUserId = req.user._id; 

    if (userId !== authUserId.toString()) {
      return res.status(403).json({ message: "You can only Update your own account" });
    }
    const { email, username, fullname, bio, password, profile_pic } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) {
      if (!email.endsWith("@maaun.edu.ng")) {
        return res.status(400).json({
          message: "Only @maaun.edu.ng emails are allowed",
        });
      }
      user.email = email;    
    }

    if (username) {
      user.username = username;
    }

    if (fullname) {
      user.fullname = fullname;
    }

    if (bio) {
      user.bio = bio;
    }

    if (profile_pic) {
      user.profile_pic = profile_pic;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await redis.del(`user:${userId}`);
    await user.save();

    res.json({
      message: "User updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const authUserId = req.user._id; 

    if (userId !== authUserId.toString()) {
      return res.status(403).json({ message: "You can only delete your own account" });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    await redis.del(`user:${userId}`);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
