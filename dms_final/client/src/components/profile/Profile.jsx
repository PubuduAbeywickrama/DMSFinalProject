import React from 'react'
import axios from 'axios'
import Dp from '../../asserts/dp.jpg'
import  { useContext ,useState} from 'react'
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Topbar from '../topbar/Topbar';

export default function Profile() {
  
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();
    const [firstname, setFirstName] = useState(user.firstname);
    const [lastname, setLastName] = useState(user.lastname);
    const [phone, setPhone] = useState(user.phone);
    const [email, setEmail] = useState(user.email);
    const [age, setAge] = useState(user.age);
    const [gender, setGender] = useState(user.gender );
    const [weight, setWeight] = useState(user.weight );
    const [height, setHeight] = useState(user.height);
    const [bmi, setBmi] = useState(user.bmi);

  return (
    
    <div className='feed' style={{marginTop: '200px'}}>
        <Topbar/>
        <div class="container rounded bg-white mt-5 mb-5">
          <div class="row">
              <div class="col-md-3 border-right">
                  <div class="d-flex flex-column align-items-center text-center p-3 py-5"><img class="rounded-circle mt-5" width="250px" src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"/><span class="font-weight-bold">{user.firstname} {user.lastname}</span><span class="text-black-50">{user.email}</span><span> </span></div>

              </div>
              <div class="col-md-5 border-right">
                  <div class="p-3 py-5">
                      <div class="d-flex justify-content-between align-items-center mb-3">
                          <h4 class="text-right">Profile Settings</h4>
                      </div>

                    <form action="" >
                        <div class="row mt-2">
                            <div class="col-md-6"><label class="labels">First Name</label><input type="text" class="form-control" placeholder="first name" value={firstname}
                                    onChange={(e)=>{
                                        setFirstName(e.target.value);
                                    }}
                            /></div>
                            <div class="col-md-6"><label class="labels">Last Name</label><input type="text" class="form-control" value={lastname} placeholder="last name"
                                    onChange={(e)=>{
                                        setLastName(e.target.value);
                                    }}
                            /></div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12"><label class="labels">Mobile Number</label><input type="text" class="form-control" placeholder="enter phone number" value={phone}
                                    onChange={(e)=>{
                                        setPhone(e.target.value);
                                    }}
                            /></div>
                            <div class="col-md-12"><label class="labels">Email</label><input type="text" class="form-control" placeholder="enter email" value={email}
                             onChange={(e)=>{
                                setEmail(e.target.value);
                            }}
                            /></div>
                            
                            <hr className='rule' />
                            
                    
                            
                            <div class="col-md-12">
                                <label class="labels">Age</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="enter your age"
                                    value={age}
                                    onChange={(e) => {
                                    setAge(e.target.value);
                                    }}
                                />
                                </div>
                                <div class="col-md-12">
                                <label class="labels">Gender</label>
                                <select
                                    className="form-control"
                                    value={gender}
                                    onChange={(e) => {
                                    setGender(e.target.value);
                                    }}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                </div>
                                <div class="col-md-12">
                                <label class="labels">Weight</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="enter weight in kilograms"
                                    value={weight}
                                    onChange={(e) => {
                                    setWeight(e.target.value);
                                    }}
                                />
                                </div>
                                <div class="col-md-12">
                                <label class="labels">Height</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="enter height in centimeters"
                                    value={height}
                                    onChange={(e) => {
                                    setHeight(e.target.value);
                                    }}
                                />
                                </div>
                                <div class="col-md-12">
                                <label class="labels">BMI Value</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="your BMI value"
                                    value={bmi}
                                    onChange={(e) => {
                                    setBmi(e.target.value);
                                    }}
                                />
                                </div>
                        </div>
                        
                        <div class="mt-5 text-center"><button class="btn btn-primary profile-button" type="submit" >Update Profile</button></div>
                    </form>


                  </div>
              </div>
              
          </div>
      </div>
      
    </div>
       
        
    
  )
  
}