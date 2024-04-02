const router = require("express").Router();
const FastingCount = require("../models/FastingCount");
const { spawn } = require('child_process');
// data add to database
router.post("/addFasting", async (req, res) => {
  try {
    const { user,sugarcount, date } = req.body;

    if (!user || !sugarcount || !date) {
      return res.status(400).json({ error: "Please provide all required fields." });
    }

    const newFasting = new FastingCount({
      userid: user,
      sugarcount: sugarcount,
      date: date,
      
    });

    const savedFastingCount = await newFasting.save();

    res.status(200).json(savedFastingCount);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post('/addConsult', async (req, res) => {
  try {
    // Extract user input from the request body
    const { age, gender, weight, height, bmi, sugarcount } = req.body;

    // Run the Python script using spawn, passing user input as JSON through stdin
    const pythonProcess = spawn('python', ['./work_exe_module.py']);

    // Pass the user input as JSON through stdin
    const userInputJson = JSON.stringify({ age, gender, weight, height, bmi, sugarcount });
    pythonProcess.stdin.write(userInputJson);
    pythonProcess.stdin.end();

    // Collect data from the Python script
    let scriptOutput = '';

    // Handle data events from stdout
    pythonProcess.stdout.on('data', (data) => {
      scriptOutput += data.toString();
    });

    // Handle errors from stderr
    pythonProcess.stderr.on('data', (data) => {
      console.error('Python Script Error:', data.toString());
    });

    // Handle script completion
    await new Promise((resolve) => {
      pythonProcess.on('close', (code) => {
        console.log('Python script execution completed with exit code:', code);

        if (code === 0) {
          try {
            // Parse the JSON response from the Python script
            const recommendations = JSON.parse(scriptOutput);
            res.status(200).json(recommendations);
          } catch (parseError) {
            console.error('Error parsing Python script output:', parseError);
            res.status(500).json({ message: 'Internal Server Error' });
          }
        } else {
          console.error('Python Script Error. Exit code:', code);
          res.status(500).json({ message: 'Internal Server Error' });
        }

        resolve();
      });
    });
  } catch (error) {
    console.error('Error running Python script:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get("/getFastingCounts/:userId", async (req, res) => {
    try {
      const randomCounts = await FastingCount.find({ userid: req.params.userId });
      res.status(200).json(randomCounts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
