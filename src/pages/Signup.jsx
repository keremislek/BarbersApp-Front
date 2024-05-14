import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import API from '../api/axios';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCgwj1IRROxAt8DXC3f5T-5bKwyLl2p1YM",
    authDomain: "barber-app-169e6.firebaseapp.com",
    projectId: "barber-app-169e6",
    storageBucket: "barber-app-169e6.appspot.com",
    messagingSenderId: "214947272707",
    appId: "1:214947272707:web:9b2abe12b7921631fcd636",
    measurementId: "G-D7RKGKKMHF"
  };
  
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        barberName: '',
        photo: null,
    });

    const [action, setAction] = useState("Customer");
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFormData({ ...formData, photo: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    }

    const handleSubmit = async () => {
        console.log(formData);
        try {
            const fileRef = ref(storage, `barber_photos/${formData.photo.name}`);
            await uploadBytes(fileRef, formData.photo); // Upload photo to Firebase Storage

            const photoURL = await getDownloadURL(fileRef); // Get URL of the uploaded photo
            console.log("Photo URL:", photoURL);
            const response = await API.post('/barbers/register', {
                email: formData.email,
                password: formData.password,
                barberName: formData.barberName,
                photoUrl: photoURL // Send photo URL to API
            });
            console.log(response);
            navigate('/barberHome', { state: { id: response.data.id } });
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 top-0">
            <div className="">
                <div className="text">{action}</div>
                <div className="text-lg font-bold mb-4 mx-auto">Kayıt Ol</div>
                <div class="border-b-2 border-purple-500 mb-4"></div>
            </div>
            <div className="inputs flex flex-col items-center">
                {/* Form inputs */}
                {action === "Customer" && (
                    <>
                        <div className="inputs h-10 border-2 border-gray-200 rounded-lg mb-4 w-full lg:w-1/2 transition-colors hover:border-purple-500 outline-none">
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="input" />
                        </div>
                        <div className="inputs h-10 border-2 border-gray-200 rounded-lg mb-4 w-full lg:w-1/2 transition-colors hover:border-purple-500 outline-none">
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Surname" className="input" />
                        </div>
                    </>
                )}
                {action === "Barber" && (
                    <>
                        <div className="inputs h-10 border-2 border-gray-200 rounded-lg mb-4 w-full lg:w-1/2 transition-colors hover:border-purple-500 outline-none">
                            <input type="text" name="barberName" value={formData.barberName} onChange={handleChange} placeholder="Barber Name" className="input" />
                        </div>
                    </>
                )}
                <div className="inputs h-10 border-2 border-gray-200 rounded-lg mb-4 w-full lg:w-1/2 transition-colors hover:border-purple-500 outline-none">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input" />
                </div>
                <div className="inputs h-10 border-2 border-gray-200 rounded-lg mb-4 w-full lg:w-1/2 transition-colors hover:border-purple-500 outline-none">
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="input" />
                </div>
                {/* File input for photo upload */}
                {action === "Barber" && (
                    <div className="inputs mb-4 w-full lg:w-1/2">
                        <input type="file" name="photo" onChange={handleChange} accept="image/*" className="input" />
                    </div>
                )}
                {/* Submit button */}
                <div className="submit-container flex justify-around">
                    <div className={action === "Barber" ? "submit gray" : "submit"}  onClick={() => setAction("Customer")}>Customer</div>
                    <div className={action === "Customer" ? "submit gray" : "submit"} onClick={() => setAction("Barber")}>Barber</div>
                    <button className="submit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
            </div>
        </div>
    );
}

export default Signup;
