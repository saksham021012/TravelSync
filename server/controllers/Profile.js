// const User = require('../models/User');

// const getProfile = async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id).select('-password'); // Exclude password
//         res.status(200).json(user);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Failed to get profile' });
//     }
// };

// const updateProfile = async (req, res) => {
//     const { name, email } = req.body;
  
//     try {
//       const updatedUser = await User.findByIdAndUpdate(
//         req.user.id,
//         { name, email },
//         { new: true }
//       ).select('-password'); // Don't send password back
  
//       res.status(200).json(updatedUser);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Failed to update profile' });
//     }
//   };
  
