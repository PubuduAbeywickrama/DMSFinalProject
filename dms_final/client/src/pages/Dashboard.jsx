import React from 'react';
import Topbar from '../components/topbar/Topbar';
import gifImage from '../asserts/bot.gif';
import askmeGif from '../asserts/askme.gif';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Make sure to add the appropriate styles in your CSS file

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Topbar />
      <div className="dashboard-content">
        <div className="description-container">
          <h1>Diabetes management: How lifestyle, daily routine affect blood sugar</h1>
          <p>
          Keeping your blood sugar levels within the range recommended by your doctor can be challenging. That's because many things make your blood sugar levels change, sometimes unexpectedly. Following are some factors that can affect your blood sugar levels.
          </p>
        </div>
        <div className="button-container">
        <Link to="/home">
          <button className="green-button">Check My Medical Report</button>
        </Link>
        <Link to="/medication">
          <button className="blue-button">Doctor Consultation</button>
        </Link>
        </div>
      </div>
      <div className="dashboard-content-right">
        <div className="gif-container">

          
          <Link to="/chatbot">
            <img className='askmegif' src={askmeGif} alt="Your GIF" />
          </Link>
          <Link to="/chatbot">
            <img className='botgif' src={gifImage} alt="Your GIF" />
          </Link>
        </div>
      </div>
        
    </div>
  );
}
