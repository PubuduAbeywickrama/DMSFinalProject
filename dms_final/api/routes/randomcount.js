const router = require("express").Router();
const RandomCount = require("../models/RandomCount");

// data add to database
router.post("/addRandom", async (req, res) => {
  try {
    const { user,sugarcount, date, time } = req.body;

    if (!user || !sugarcount || !date || !time) {
      return res.status(400).json({ error: "Please provide all required fields." });
    }

    const newRandom = new RandomCount({
      userid: user,
      sugarcount: sugarcount,
      date: date,
      time: time,
    });

    const savedRandomCount = await newRandom.save();

    res.status(200).json(savedRandomCount);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getRandomCounts/:userId", async (req, res) => {
    try {
      const randomCounts = await RandomCount.find({ userid: req.params.userId });
      res.status(200).json(randomCounts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
