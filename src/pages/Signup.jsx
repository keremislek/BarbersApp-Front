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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
            <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-lg">
                <div className="mb-6 text-center">
                    <div className='flex items-center justify-center gap-8 mb-4'>
                        <button className={`px-4 py-2 rounded-lg font-bold ${action === "Customer" ? "bg-purple-500 text-white" : "bg-gray-300 text-gray-700"}`} onClick={() => setAction("Customer")}>Müşteri</button>
                        <button className={`px-4 py-2 rounded-lg font-bold ${action === "Barber" ? "bg-purple-500 text-white" : "bg-gray-300 text-gray-700"}`} onClick={() => setAction("Barber")}>Berber</button>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{action === "Customer" ? "Müşteri Kayıt" : "Berber Kayıt"}</h2>
                </div>
                <div className="w-full border-b-2 border-purple-500 mb-4"></div>
                <div className="space-y-4">
                    {action === "Customer" && (
                        <>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChangeCustomer} placeholder="İsim" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChangeCustomer} placeholder="Soyisim" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </>
                    )}
                    {action === "Barber" && (
                        <input type="text" name="barberName" value={formData.barberName} onChange={handleChangeBarber} placeholder="Berber Adı" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    )}
                    <input type="email" name="email" value={formData.email} onChange={handleChangeCustomer} placeholder="Email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <input type="password" name="password" value={formData.password} onChange={handleChangeCustomer} placeholder="Şifre" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    {action === "Barber" && (
                        <input type="file" name="photo" onChange={handleFileChange} accept="image/*" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    )}
                    <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-2 rounded-lg transition duration-300 ease-in-out hover:from-blue-500 hover:to-purple-500" onClick={handleSubmit}>Kayıt Ol</button>
                </div>
            </div>
        </div>
    );
}

export default Signup;
