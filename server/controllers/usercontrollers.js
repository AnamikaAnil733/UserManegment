import User from '../models/user.js';

export const getCurrentUser = async (req, res) => {
    console.log("req.user inside /me route:", req.user); // ✅ add this
  
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
  
    res.json({
      name: req.user.name,
      email: req.user.email,
      profileUrl: req.user.profileUrl || '',
    });
  };
  

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

   
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const uploadProfileImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.image = image;
    await user.save();

    res.status(200).json({ message: "Profile image updated", image });
  } catch (err) {
    console.error("Error updating profile image:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: Check if new email already exists (for unique email constraint)
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== userId) {
      return res.status(409).json({ message: "Email already in use" });
    }

    existingUser.name = name;
    existingUser.email = email;

    const updatedUser = await existingUser.save();

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error in updateProfile:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};
