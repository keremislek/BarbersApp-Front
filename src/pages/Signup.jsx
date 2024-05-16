import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import API from '../api/axios';

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

    const handleChangeCustomer = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleChangeBarber = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    }

    const handleSubmit = async () => {
        console.log(formData);
        try {
           
            let response;
            if (action === "Barber") {
                const fileRef = ref(storage, `barber_photos/${formData.photo.name}`);
                await uploadBytes(fileRef, formData.photo); // Fotoğrafı Firebase Depolama'ya yükle
    
                const photoURL = await getDownloadURL(fileRef); // Yüklenen fotoğrafın URL'sini al
                console.log("Photo URL:", photoURL);
                
                response = await API.post('/barbers/register', {
                    email: formData.email,
                    password: formData.password,
                    barberName: formData.barberName,
                    photoUrl: photoURL // Fotoğraf URL'sini API'ye gönder
                });
                localStorage.setItem('token',response.data.token)
                localStorage.setItem('id',response.data.id)
                navigate('/barberHome')

            } else if (action === "Customer") {
                response = await API.post('/customers/register', {
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName
                });
                localStorage.setItem('token',response.data.token)
                localStorage.setItem('id',response.data.id)
                navigate('/')
            }
        
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 top-0">
                <div className="">
                    <div className='flex items-center justify-center gap-8'>
                        <button className={action === "Barber" ? "submit gray hover:bg-gray-200 p-2 rounded-lg" : "submit bg-gray-500 border-2 border-gray-700 p-2 rounded-lg"} onClick={() => setAction("Customer")}>Customer</button>
                        <button className={action === "Customer" ? "submit gray hover:bg-gray-200 p-2 rounded-lg" : "submit bg-gray-500 border-2 border-gray-700 p-2 rounded-lg"} onClick={() => setAction("Barber")}>Barber</button>
                    </div>
                    <div className='flex items-center justify-center'>
                        <div>
                            <div className="text-center">{action}</div>
                            <div className="text-lg font-bold mb-4 mx-auto">Kayıt Ol</div>
                        </div>
                    </div>
                    <div class="w-full border-b-2 border-purple-500 mb-4"></div>
                </div>
                <div className="inputs flex flex-col items-center ">
                    {/* Form inputs */}
                    {action === "Customer" && (
                        <>
                            <div className="w-full flex justify-center">
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChangeCustomer} placeholder="First Name" className="input inputs h-10 border-2 border-gray-200 rounded-lg mb-4 w-full lg:w-1/2 transition-colors hover:border-purple-500 outline-none" />
                            </div>
                            <div className="w-full flex justify-center">
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChangeCustomer} placeholder="Surname" className="input inputs h-10 border-2 border-gray-200 rounded-lg mb-4 w-full lg:w-1/2 transition-colors hover:border-purple-500 outline-none" />
                            </div>
                        </>
                    )}
                    {action === "Barber" && (
                        <>
                            <div className="w-full flex justify-center ">
                                <input type="text" name="barberName" value={formData.barberName} onChange={handleChangeBarber} placeholder="Barber Name" className="input inputs h-10 border-2 border-gray-200 rounded-lg mb-4 w-full lg:w-1/2 transition-colors hover:border-purple-500 outline-none" />
                            </div>
                        </>
                    )}
                    <div className="w-full flex justify-center">
                        <input type="email" name="email" value={formData.email} onChange={handleChangeCustomer} placeholder="Email" className="input inputs h-10 border-2 border-gray-200 rounded-lg mb-4 w-full lg:w-1/2 transition-colors hover:border-purple-500 outline-none" />
                    </div>
                    <div className="w-full flex justify-center">
                        <input type="password" name="password" value={formData.password} onChange={handleChangeCustomer} placeholder="Password" className="input inputs h-10 border-2 border-gray-200 rounded-lg mb-4 w-full lg:w-1/2 transition-colors hover:border-purple-500 outline-none" />
                    </div>
                    {/* File input for photo upload */}
                    {action === "Barber" && (
                        <div className="inputs mb-4 w-full lg:w-1/2">
                            <input type="file" name="photo" onChange={handleFileChange} accept="image/*" className="input inputs h-10 border-2 border-gray-200 rounded-lg mb-4 w-full lg:w-1/2 transition-colors hover:border-purple-500 outline-none" />
                        </div>
                    )}
                    {/* Submit button */}
                    <div className="submit-container flex justify-around">
                        <button className="submit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
