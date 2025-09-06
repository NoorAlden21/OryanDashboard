
/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useContext, useState, useEffect } from "react";
import { useGetStudentsQuery } from "../Slice/StudentsSlice";


const StudentsContext = createContext();

export const StudentsProvider = ({ children }) => {
  const [studentsData, setstudentsDData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    data: students,
    isLoading: isstudentsLoading,
    isSuccess: isstudentsSuccess,
  } = useGetStudentsQuery();

  useEffect(() => {
    if (isstudentsSuccess && students) {
      setstudentsDData(students);
      setIsLoading(false);
      setIsSuccess(true);
    } else if (isstudentsLoading) {
      setIsLoading(true);
      setIsSuccess(false);
    } else {
      setIsLoading(false);
      setIsSuccess(false);
    }
  }, [isstudentsSuccess, isstudentsLoading, students]);


 

  return (
    <StudentsContext.Provider
      value={{
        studentsData,
        isSuccess,
        isLoading
       
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStudents = () => {
  const context = useContext(StudentsContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
