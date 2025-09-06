



import React from "react";
import { useParams } from "react-router-dom";
import { useGetClassroomTeachersQuery } from "../Slice/ClassRoomSlice";
import ClassroomAssignmentView from "./ClassroomAssignmentView";
import { Loader2, AlertTriangle } from 'lucide-react';

const AssignTeachersPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetClassroomTeachersQuery(id);

  return (
    <div className="p-8 bg-neutral min-h-screen">
      {(() => {
        if (isLoading) {
          return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-lg text-slate-500">جاري تحميل بيانات الصف...</p>
            </div>
          );
        }

        if (isError || !data?.data) {
          return (
            <div className="flex flex-col items-center justify-center h-[60vh] bg-error/10 rounded-lg p-8">
              <AlertTriangle className="h-12 w-12 text-error" />
              <h3 className="mt-4 text-xl font-bold text-error">حدث خطأ</h3>
              <p className="mt-2 text-error/80">لم نتمكن من تحميل بيانات تعيين المعلمين.</p>
            </div>
          );
        }

        return (
          <ClassroomAssignmentView 
            classroomData={data.data} 
            classroomId={id} 
          />
        );
      })()}
    </div>
  );
};

export default AssignTeachersPage;
