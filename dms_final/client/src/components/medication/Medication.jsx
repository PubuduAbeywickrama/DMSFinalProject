import React, { useState } from "react";
import  { useContext , useEffect} from 'react'
import { AuthContext } from "../../context/AuthContext";
import Topbar from "../topbar/Topbar";
import axios from "axios";
import './medication.css'

function Medication() {
  const { user } = useContext(AuthContext);
  const [currentDiabeticLevel, setCurrentDiabeticLevel] = useState(0);
  const [medications, setMedications] = useState([]);
  const [pillName, setPillName] = useState("");
  const [pillTime, setPillTime] = useState("");
  const [recommendation, setRecommendation]= useState([])
  function handlePillNameChange(event) {
    setPillName(event.target.value);
  }

  function handlePillTimeChange(event) {
    setPillTime(event.target.value);
  }
  const [fastingCounts, setFastingCounts] = useState([]);
  useEffect(() => {
    
    getFData();
    
}, [user._id])

 console.log(fastingCounts)
  function getFData() {
    axios.get(`http://localhost:8800/api/fastingcount/getFastingCounts/${user._id}`)
        .then((res) => {
          setFastingCounts(res.data);
        }).catch((err) => {
            console.error(err);
    });
  }

  function handleAddPill() {
    const newPill = { name: pillName, time: pillTime };
    setMedications([...medications, newPill]);
    setPillName("");
    setPillTime("");
  }

  function suggestFood(glucoseLevel) {
    if (glucoseLevel < 100) {
      return "You have a normal glucose level. Maintain a balanced diet with fruits, vegetables, lean proteins, and whole grains.";
    } else {
      return "Monitor your glucose level and consult with a healthcare professional for dietary recommendations.";
    }
  }
  
  // Function to suggest exercise based on BMI
  function suggestExercise(bmi) {
    if (bmi < 18.5) {
      return "Consider incorporating strength training exercises and a balanced diet to gain healthy weight.";
    } else if (18.5 <= bmi && bmi < 24.9) {
      return "Maintain a regular exercise routine and a balanced diet to stay in a healthy weight range.";
    } else {
      return "Incorporate both cardiovascular exercises and strength training along with a balanced diet to manage weight.";
    }
  }


  function handleRemovePill(pillName) {
    const updatedMedications = medications.filter(
      (pill) => pill.name !== pillName
    );
    setMedications(updatedMedications);
  }

  const handleConsult = async (event) => {
    event.preventDefault();
  
    // Include additional user data
    const data = {
      sugarcount: fastingCounts[0].sugarcount,
      age: user.age,
      gender: user.gender,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      
    };
    
  console.log(data)
  
    try {
      // Make a POST request to your server endpoint
      const response = await axios.post('http://localhost:8800/api/fastingcount/addConsult', data);
      // getFData();
      // fetchFData();
      // setCurrentDiabeticLevel('');
      // setFastingDate('');
      // setSelectedFile('');
    setRecommendation(response.data);

      console.log('Response from server:', response.data);
  
      // Handle the response if needed
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting random blood sugar:', error);
    }
  };
  console.log('Response from server:', recommendation);

  const handleAddRandomRecord = async () => {
    // Add logic to send the data to the server
    try {
      const response = await axios.post("YOUR_API_ENDPOINT", {
        user: "user_id", // Replace with the actual user ID
        sugarcount: 120, // Replace with the actual glucose level
        date: "2023-01-01", // Replace with the actual date
        time: "12:00", // Replace with the actual time
      });

      // Handle the response if needed
      console.log(response.data);
    } catch (error) {
      console.error("Error adding random record:", error);
    }
  };

  return (
    <div style={{marginTop: '250px'}}>
      <Topbar/>
      <div className="container">
      
      <div className="left-container">
        <h3 style={{textAlign:"center"}}>Medication Reminder</h3>
        <div style={{ margin: "10px" }}>
          <label style={{marginLeft:"5px"}} htmlFor="pillName">Pill Name:</label>
          <input
            id="pillName"
            type="text"
            value={pillName}
            onChange={handlePillNameChange}
            style={{ borderRadius: '10px', borderColor: '#4d4dff', margin: "5px", padding: "5px", width:"100%"}}
          />
        </div>
        <div style={{ margin: "10px" }}>
          <label style={{marginLeft:"5px"}} htmlFor="pillTime">Pill Time:</label>
          <input
            id="pillTime"
            type="time"
            value={pillTime}
            onChange={handlePillTimeChange}
            style={{ borderRadius: '10px', borderColor: '#4d4dff', margin: "5px", padding: "5px", width:"100%"}}
          />
        </div>
        <button className="button" style={{ width: '100%', backgroundColor: '#4d4dff', color: "white",marginLeft:"5px",marginRight:"5px",marginTop:"20px" }} onClick={handleAddPill}>Add Pill</button>
        
      </div>
      <div className="right-container">
        <div >
          
          {medications.map((pill) => (
            <div key={pill.name} className="pill-card">
              <h3>{pill.name}</h3>
              <p>Time: {pill.time}</p>
              <button
                className="remove-button"
                onClick={() => handleRemovePill(pill.name)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      
    </div>
    <div className="container">
      
      <div className="leftbottom-container">
        <h3 style={{textAlign:"center"}}>Exercise Consultant</h3>
        <div>
              <p>Hello {user.firstname}</p>
              <p>Your Glucose Level is {user.sugarcount}</p>
              
              {/* <p>{suggestExercise(user.bmi)}</p> */}
              {recommendation.exercise_recommendation}<br></br>
              {recommendation.food_recommendation}
          
        </div>
        <button onClick={handleConsult} type="submit">Consult me</button>
      </div>
      
    

      
    </div>
  </div>
    
  );
}

export default Medication;
