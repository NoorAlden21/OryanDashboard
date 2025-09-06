import SideBar from "./Componants/SideBar";
import React from 'react';
import router from "./routes/routes";
import { RouterProvider } from "react-router-dom";
import Login from "./Componants/Login";

export default function App(){
    return (
       
        <div>

         <RouterProvider router={router} />;
      </div>
      );
}