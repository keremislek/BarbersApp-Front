import React,{useState} from 'react'
import Slider from "react-slick";
import ReactFlagsSelect from 'react-flags-select';
import { FaFacebook } from 'react-icons/fa';
import Calendar from 'react-calendar';


export default function HeroSection() {

    const [selected,setSelected]=useState('TR');

    const phones={
        US: '+1',
        GB:'+75',
        TR: '+90'
    }

    var settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay:true,
        speed:500,
        autoplaySpeed:2000,
        cssEase:"linear"
    };
    return (
        <div className="relative h-[500px]">
            <Slider {...settings}>
                <div>
                    <img className="w-full h-[500px] object-cover" src="https://heygoldie.com/blog/wp-content/uploads/2021/12/barber-shop-decor-ideas.jpg.webp" />
                </div>
                <div>
                    <img className='w-full h-[500px] object-cover' src='https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/ceb58746-5e96-448a-8cf2-4c2e8609973b/msbsnomask-54578-2.jpg?format=750w' />
                </div>
            </Slider>
            <div className='container flex justify-between items-center absolute top-0 left-1/2 -translate-x-1/2 h-full z-20'>
                <div className="flex flex-col gap-y-8 absolute top-40 left-10">
                    <img src='https://cdn.logojoy.com/wp-content/uploads/2018/05/30161127/651.png' className="h-32 w-32" alt="logo" />
                    <h3 className= 'text-white font-extrabold' >Yakışıklanmak için <br/>Bizi Seçin</h3>
                </div>
                <div className=' absolute top-1/2 right-10 transform -translate-y-1/2  w-[400px] rounded-lg bg-gray-50 p-6'>
                    <Calendar/>
                    <h4 className='text-primary-brand-color text-center font-semibold mb-4'>Giriş yap veya kayıt ol</h4>
                    <div className='grid gpa-y-4'>
                    <div className='flex gap-x-2'>
                        <ReactFlagsSelect 
                        countries={Object.keys(phones)}
                        customLabels={phones}
                        placeholder="Select Language"
                        onSelect={code=>setSelected(code)}
                        selected={selected}
                        className='flag-select'
                        />
                        <label className='flex relative block'>
                            <input className='h-14 px-4 border-2 border-gray-200 rounded-lg w-full transition-colors hover:border-purple-500 outline-none peer' />
                            <span className='absolute top-0 left-0 bottom-0 right-0 flex-item-center justify-center px-4 text-sm text-gray-700 peer-focus:h-1 transition-all'> 
                            
                            </span>
                        </label>
                    </div>
                    <button className='bg-brand-yellow text-primary-brand-color transition-colors hover:bg-primary-brand-color hover:text-brand-yellow h-12 flex items-center justify-center rounded w-full text-sm font-semibold  '>
                        Telefon Numarası İle Devam Et
                    </button>
                    <hr className='h-[1px] bg-gray-300 my-2' />
                    <button className='bg-blue-900 bg-opacity-10 text-blue-700 transition-colors hover:bg-blue-700 hover:text-white h-12 flex items-center rounded w-full text-sm font-semibold  '>
                    <FaFacebook  size={24} />
                       <span className='mx-auto'> Facebook ile Devam Et </span>
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
