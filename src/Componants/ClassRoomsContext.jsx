




/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useContext, useState, useEffect } from "react";
import { useGetAllClassRoomMutation } from "../Slice/ClassRoomSlice";

const ClassRoomContext = createContext();

export const ClassRoomProvider = ({ children }) => {
  const [classroomsData, setClassroomsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [getClassrooms, { data, isLoading: isClassroomsLoading, isSuccess: isClassroomsSuccess }] =
    useGetAllClassRoomMutation();

  const refetchClassrooms = async () => {
    setIsLoading(true);
    try {
      const res = await getClassrooms().unwrap();
      setClassroomsData(res.classrooms || []);
      setIsSuccess(true);
    } catch (err) {
      console.error("فشل في جلب الصفوف الدراسية:", err);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetchClassrooms();
  }, []);

  const addNewClassroom = (newClassroom) => {
    setClassroomsData(prev => [newClassroom, ...prev]);
  };

  return (
    <ClassRoomContext.Provider
      value={{
        classroomsData,
        isSuccess,
        isLoading,
        refetchClassrooms, 
        addNewClassroom  
      }}
    >
      {children}
    </ClassRoomContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useClassRooms = () => {
  const context = useContext(ClassRoomContext);
  if (context === undefined) {
    throw new Error("useClassRooms must be used within a ClassRoomProvider");
  }
  return context;
};
