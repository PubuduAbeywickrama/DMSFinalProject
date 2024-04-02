import React from 'react';
import axios from 'axios';
import { Card } from '@mui/material';
import  { useContext ,useState, useEffect} from 'react'
import { AuthContext } from "../../context/AuthContext";
import LineCharts from '../lineChart/LineCharts';
import Topbar from '../topbar/Topbar';
import "./home.css";
export default function Home() {
  const { user } = useContext(AuthContext);
  console.log('User ID:', user._id);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [lastDiabeticLevel, setLastDiabeticLevel] = useState(0);
  const [currentDiabeticLevel, setCurrentDiabeticLevel] = useState(0);
  const [testedFDate, setFastingDate] = useState(0);
  const [randomBloodSugar, setRandomBloodSugar] = useState('');
  const [testedDate, setTestedDate] = useState('');
  const [testedTime, setTestedTime] = useState('');
  
  const handleFileSubmit = async (event) => {
    event.preventDefault();
  
    // Check if a file is selected
    if (!selectedFile) {
      console.error('No file selected.');
      return;
    }
  
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      // Make a POST request to the file upload endpoint
      const response = await axios.post('http://localhost:8800/api/upload', formData);
  
      // Extracted glucose level and date from the response
      const { glucoseLevel, date } = response.data;
  
      // Update the state with the received glucose level and date
      setCurrentDiabeticLevel(glucoseLevel);
      setFastingDate(date);
  
      // Handle the response if needed
      console.log('Response from server:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  const handleFileInput = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:8800/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const glucoseLevel = response.data; // Assuming the glucose level is directly returned
      const date = response.data
      console.log('Glucose Level from server:', glucoseLevel);
  
      // Update the state with the received glucose level
      setCurrentDiabeticLevel(glucoseLevel);
      setFastingDate(date);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleRandomBloodSugarSubmit = async (event) => {
    event.preventDefault();
    
    const data = {
      user: user._id,
      sugarcount: randomBloodSugar,
      date: testedDate,
      time: testedTime,
    };
    
    try {
      // Make a POST request to your server endpoint
      const response = await axios.post('http://localhost:8800/api/randomcount/addRandom', data);

      // Clear the form or do any other necessary actions
      setRandomBloodSugar('');
      setTestedDate('');
      setTestedTime('');
      getData();
      fetchData();
      console.log('Response from server:', response.data);

      // Handle the response if needed
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting random blood sugar:', error);
    }
  }

  const handleFastingBloodSugarSubmit = async (event) => {
    event.preventDefault();
    
    const data = {
      user: user._id,
      sugarcount: currentDiabeticLevel.glucoseLevel,
      date: currentDiabeticLevel.date,
    };
    
    try {
      // Make a POST request to your server endpoint
      const response = await axios.post('http://localhost:8800/api/fastingcount/addFasting', data);
      getFData();
      fetchFData();
      setCurrentDiabeticLevel('')
      setFastingDate('')
      setSelectedFile('')
      console.log('Response from server:', response.data);

      // Handle the response if needed
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting random blood sugar:', error);
    }
  }

  // const handleFastingBloodSugarSubmit = async (event) => {
  //   event.preventDefault();
  
  //   // Include additional user data
  //   const data = {
  //     user: user._id,
  //     sugarcount: currentDiabeticLevel.glucoseLevel,
  //     date: currentDiabeticLevel.date,
  //     age: user.age,
  //     gender: user.gender,
  //     weight: user.weight,
  //     height: user.height,
  //     bmi: user.bmi,
  //     glucose: user.glucose,
  //   };
  // console.log(data)
  //   try {
  //     // Make a POST request to your server endpoint
  //     const response = await axios.post('http://localhost:8800/api/fastingcount/addFasting', data);
  //     getFData();
  //     fetchFData();
  //     setCurrentDiabeticLevel('');
  //     setFastingDate('');
  //     setSelectedFile('');
  //     console.log('Response from server:', response.data);
  
  //     // Handle the response if needed
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error('Error submitting random blood sugar:', error);
  //   }
  // };
  
  const [randomCounts, setRandomCounts] = useState([]);
  const [glucoseData, setGlucoseData] = useState([]);
  const [fastingCounts, setFastingCounts] = useState([]);
  const [fglucoseData, setFGlucoseData] = useState([]);
  useEffect(() => {
        getData();
        fetchData();
        getFData();
        fetchFData();
    }, [user._id])

    function getData() {
        axios.get(`http://localhost:8800/api/randomcount/getRandomCounts/${user._id}`)
            .then((res) => {
                setRandomCounts(res.data);
            }).catch((err) => {
                console.error(err);
            });
    }
    function fetchData() {
      axios.get(`http://localhost:8800/api/randomcount/getRandomCounts/${user._id}`)
          .then((res) => {
            console.log('Received glucose data:', res.data);
            setGlucoseData(res.data);
          }).catch((err) => {
              console.error(err);
          });
    }
    function getFData() {
      axios.get(`http://localhost:8800/api/fastingcount/getFastingCounts/${user._id}`)
          .then((res) => {
            setFastingCounts(res.data);
          }).catch((err) => {
              console.error(err);
          });
  }
  function fetchFData() {
    axios.get(`http://localhost:8800/api/fastingcount/getFastingCounts/${user._id}`)
        .then((res) => {
          console.log('Received fasting data:', res.data);
          setFGlucoseData(res.data);
        }).catch((err) => {
            console.error(err);
        });
  }
  

  const getBackgroundColor = (glucoseLevel) => {
    if (glucoseLevel <= 90) {
      return 'green';
    } else if (glucoseLevel > 90 && glucoseLevel <= 140) {
      return 'yellow';
    } else {
      return 'red';
    }
  };
    


  return (
    <div style={{marginTop: '550px'}}>
      <Topbar/>
      <div class="container">
        <div class="left-container">
          <button class="button big-button">Upload Your Medical Report</button>
          
          <form onSubmit={handleFileSubmit} style={{ width: '100%' }}>
            <label htmlFor="pdfFile" style={{ fontSize: '18px', color: 'red' }}>
              Choose a PDF file:
            </label>
            <input
              type="file"
              id="pdfFile"
              accept="application/pdf"
              onChange={handleFileInput}
              style={{ fontSize: '18px', marginBottom: '20px' }}
            />
            
            <h4 style={{ color: 'rgb(2, 27, 59)' }}>Diabetic Level analyzer</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p>Tested Date: {currentDiabeticLevel.date}</p>
              <p>Glucose Level: {currentDiabeticLevel.glucoseLevel}</p>
            </div>

            
            <div style={{ display: 'block', alignItems: 'center' }}>
            <div
              style={{
                backgroundColor: getBackgroundColor(currentDiabeticLevel.glucoseLevel),
                height: '30px',
                width: '60px',
                marginRight: '5px',
              }}
            />
          </div>
          </div>
          

          </form>
          <form onSubmit={handleFastingBloodSugarSubmit}>
          <button
              type="submit"
              className="button green-button"
              style={{ width: '100%', backgroundColor: 'green', color: 'white' }}
            >
              Upload Data
            </button>
          </form>

        
        
        </div>

        <div className="right-container">
          <h3 style={{textAlign:"center"}}>Random blood test</h3>
          <form onSubmit={handleRandomBloodSugarSubmit} style={{ padding: '20px', width:"100%" }}>
            <label htmlFor="randomBloodSugar" style={{marginLeft:"5px"}}>Enter random blood sugar value:</label><br />
            <input
              type="number"
              id="randomBloodSugar"
              value={randomBloodSugar}
              onChange={(event) => setRandomBloodSugar(event.target.value)}
              required
              style={{ borderRadius: '10px', borderColor: '#4d4dff', margin: "5px", padding: "5px", width:"100%"}}
            />
            <br />
            <label htmlFor="testedDate" style={{marginLeft:"5px"}}>Tested date:</label><br />
            <input
              type="date"
              id="testedDate"
              value={testedDate}
              onChange={(event) => setTestedDate(event.target.value)}
              required
              style={{ borderRadius: '10px', borderColor: '#4d4dff', margin: "5px", padding: "5px", width:"100%" }}
            />
            <br />
            <label htmlFor="testedTime" style={{marginLeft:"5px"}}>Tested time:</label><br />
            <input
              type="time"
              id="testedTime"
              value={testedTime}
              onChange={(event) => setTestedTime(event.target.value)}
              required
              style={{ borderRadius: '10px', borderColor: '#4d4dff', margin: "5px", padding: "5px", width:"100%"}}
            />
            <br />
            <button type="submit" className="button" style={{ width: '100%', backgroundColor: '#4d4dff', color: "white",marginLeft:"5px",marginRight:"5px",marginTop:"20px" }}>
              Submit
            </button>
          </form>
        </div>
      </div>

      <div class="container">
        <LineCharts randomData={glucoseData} fastingData={fastingCounts} />
      </div>

      <div class="container">
        <div class="table-container">
            <h3>Fasting Sugar Count</h3>
            
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Glucose Level</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {fastingCounts.map((item) => (
                  <tr key={item._id}>
                    <td>{item.date}</td>
                    <td>{`${item.sugarcount} mg/dL`}</td>
                    
                    <td>{item.sugarcount < 100 ? 'Low' : 'High'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>
          <div class="table-container">
          <h3>Random Record</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Glucose Level</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {randomCounts.map((item) => (
                  <tr key={item._id}>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td>{`${item.sugarcount} mg/dL`}</td>
                    
                    <td>{item.sugarcount < 100 ? 'Low' : 'High'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
    
  );
              }