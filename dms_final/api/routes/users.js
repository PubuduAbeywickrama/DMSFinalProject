const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//update user
router.put("/:userId", async (req, res) => {
  try {
    // Validate request body
    const { age, gender, weight, height, bmi } = req.body;
    if (!age || !gender || !weight || !height || !bmi) {
      return res.status(400).json({ error: "Incomplete data provided" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.userId },
      {
        $set: {
          age,
          gender,
          weight,
          height,
          bmi,
          // Add other fields as needed
        },
      },
      { new: true }
    );

    // Check if user was found
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json("Account has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
});
//get user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
//update
// router.route("/:id").put(async(req, res) => {
//   let userId = req.params.id;
//   const {firstnamne,lastname,phone,email} = req.body;

//   const updateStudent = {
//       firstnamne,
//       lastname,
//       phone,
//       email,
      
//   }

//   const update = await User.findByIdAndUpdate(userId, updateStudent)
//       .then(()=>{
//           res.status(200).send({status : "User Updated"});
//       })
//       .catch((err)=>{
//           res.status(500).send({status: "Error on update data"});
//       })
// })

module.exports = router;