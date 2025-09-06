

 


import React, { useState } from "react";
import { useAssignTeachersToClassroomMutation } from "../Slice/ClassRoomSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BookOpen, UserCheck, ChevronLeft, Loader2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClassroomAssignmentView = ({ classroomData, classroomId }) => {
  const { classroom_name, classroom_type, subjects } = classroomData;
  const navigate = useNavigate();

  const getInitialState = () => {
    const initialState = {};
    subjects.forEach(subject => {
      if (subject.assigned_teacher) {
        initialState[subject.subject_id] = subject.assigned_teacher.id;
      }
    });
    return initialState;
  };

  const [selectedTeachers, setSelectedTeachers] = useState(getInitialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignTeachersToClassroom] = useAssignTeachersToClassroomMutation();

  const handleTeacherSelect = (subjectId, teacherId) => {
    setSelectedTeachers(prev => ({
      ...prev,
      [subjectId]: teacherId
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const assignments = Object.entries(selectedTeachers)
        .filter(([_, teacherId]) => teacherId)
        .map(([subjectId, teacherProfileId]) => ({
          subject_id: parseInt(subjectId),
          teacher_profile_id: parseInt(teacherProfileId)
        }));

      if (assignments.length === 0) {
        toast.warn("لم تقم باختيار أي معلم.");
        setIsSubmitting(false);  
        return;
      }

      await assignTeachersToClassroom({ classroomId, assignments }).unwrap();
      toast.success("تم حفظ التعيينات بنجاح!");
      
    } catch (error) {
      toast.error(error.data?.message || "حدث خطأ أثناء الحفظ");
    } finally {
      if (isSubmitting) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-textMain tracking-tight">تعيين المعلمين</h1>
            <p className="mt-2 text-lg text-slate-500">
              الصف: <span className="font-semibold text-primary">{classroom_name}</span> ({classroom_type})
            </p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white text-textMain rounded-lg hover:bg-slate-50 border border-slate-300 flex items-center transition-colors">
              <ChevronLeft size={20} className="ml-1" /> العودة
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center disabled:bg-primary/50 shadow-sm transition-colors">
              {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : <UserCheck size={20} className="mr-2" />}
              حفظ التعيينات
            </button>
          </div>
        </div>
      </header>

      <main className="space-y-6">
        {subjects.map((subject) => (
          <div key={subject.subject_id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen size={32} className="text-primary" />
            </div>
            <div className="flex-grow text-center md:text-right">
              <h3 className="text-lg font-bold text-textMain">{subject.subject_name}</h3>
              <p className="text-sm text-slate-500">اختر معلمًا لتدريس هذه المادة</p>
            </div>
            <div className="w-full md:w-1/3">
              {subject.teachers.length > 0 ? (
                <div className="relative">
                  <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    id={`teacher-select-${subject.subject_id}`}
                    className="block w-full p-3 pl-10 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary appearance-none text-right"
                    value={selectedTeachers[subject.subject_id] || ""}
                    onChange={(e) => handleTeacherSelect(subject.subject_id, e.target.value)}
                  >
                    <option value="">-- اختر معلم --</option>
                    {subject.teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="text-center text-sm text-slate-400 italic bg-neutral p-3 rounded-lg">
                  لا يوجد معلمين مؤهلين
                </div>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default ClassroomAssignmentView;
