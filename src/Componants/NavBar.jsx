import React from 'react';
import "../Style/navbar.css";
import "./../assets/logo1.jpg";
import doctorIcon from './../assets/doctorIcon.svg';
import notificatioIcon from './../assets/notificatioIcon.svg';

export default function NavBar(){
    return (
    <div className='ml-64'>
  <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-4 p-4 ">
                <h1 className="text-2xl font-bold">MediZen Dashboard</h1>
                <div className="flex items-center">
                    <img src={notificatioIcon} alt="Notification" className="h-6 w-6 mr-4" />
                    <img src={doctorIcon} alt="User Profile" className="h-10 w-10 rounded-full border border-gray-300" />
                    <div className="ml-2 text-left">
                            <span className="text-lg font-semibold">Dr. Ahmed</span>
                            <span className="text-gray-500 text-sm block">surgery</span> {/* تغيير لعرضها تحت الاسم */}
                        </div>
                </div>
                
            </div>
            <hr className="border-t border-gray-300 my-2" />

        </div>

    </div>
  
  );
}


