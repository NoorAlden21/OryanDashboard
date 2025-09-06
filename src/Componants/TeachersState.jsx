
/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useContext, useState, useEffect } from "react";
import { useGetTeachersQuery } from "../Slice/TeachersSlice";


const TeacherContext = createContext();

export const TeachersProvider = ({ children }) => {
  const [teachersData, setteachersDData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    data: teachers,
    isLoading: isteachersLoading,
    isSuccess: isteachersSuccess,
  } = useGetTeachersQuery();

  useEffect(() => {
    if (isteachersSuccess && teachers) {
      setteachersDData(teachers);
      setIsLoading(false);
      setIsSuccess(true);
    } else if (isteachersLoading) {
      setIsLoading(true);
      setIsSuccess(false);
    } else {
      setIsLoading(false);
      setIsSuccess(false);
    }
  }, [isteachersSuccess, isteachersLoading, teachers]);


 

  return (
    <TeacherContext.Provider
      value={{
        teachersData,
        isSuccess,
        isLoading
       
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTeachers = () => {
  const context = useContext(TeacherContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
