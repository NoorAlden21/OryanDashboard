import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetStudentsByClassroomQuery, useRecordStudentAttendanceMutation } from '../Slice/AttendanceSlice';
import { Loader2, AlertTriangle, Check, X, Clock, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const RecordAttendance = () => {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState({});   
  const [period, setPeriod] = useState(1); 
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: studentsData, isLoading, isError, error } = useGetStudentsByClassroomQuery(classroomId);
  
  const [recordAttendance, { isLoading: isRecording }] = useRecordStudentAttendanceMutation();

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async () => {
    const entries = Object.keys(attendance)
      .filter(studentId => attendance[studentId] !== 'present')
      .map(studentId => ({
        student_profile_id: parseInt(studentId),
        status: attendance[studentId],
      }));

    if (entries.length === 0) {
      toast.info("لم يتم تحديد أي طالب كغائب أو متأخر.");
      return;
    }

    const payload = {
      classroom_id: parseInt(classroomId),
      date,
      period,
      entries,
    };

    try {
      await recordAttendance(payload).unwrap();
      toast.success("تم تسجيل الحضور بنجاح!");
      navigate('/attendance'); 
    } catch (err) {
      toast.error(err.data?.message || "فشل في تسجيل الحضور.");
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  if (isError) return <div className="p-8 text-center"><AlertTriangle className="h-12 w-12 text-error mx-auto" /><h3 className="mt-4 text-xl font-bold text-error">خطأ: {error.data?.message}</h3></div>;

  return (
    <div className="p-8 bg-neutral min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <button onClick={() => navigate('/attendance')} className="flex items-center gap-2 text-sm text-primary font-semibold mb-4">
            <ArrowRight size={16} />
            العودة إلى قائمة الصفوف
          </button>
          <h1 className="text-4xl font-extrabold text-textMain">تسجيل حضور الصف: {studentsData?.classroom_name}</h1>
          <p className="mt-2 text-lg text-slate-500">حدد حالة كل طالب ثم اضغط على زر الحفظ في الأسفل.</p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">التاريخ</label>
              <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="period" className="block text-sm font-medium text-slate-700 mb-1">الحصة</label>
              <input type="number" id="period" min="1" value={period} onChange={e => setPeriod(parseInt(e.target.value))} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div className="space-y-4">
            {studentsData?.students.map(student => (
              <div key={student.student_profile_id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg transition-all">
                <p className="font-semibold text-lg text-textMain mb-4 sm:mb-0">{student.name}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleStatusChange(student.student_profile_id, 'present')} className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${attendance[student.student_profile_id] === 'present' || !attendance[student.student_profile_id] ? 'bg-success/10 text-success' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    <Check size={18} /> حاضر
                  </button>
                  <button onClick={() => handleStatusChange(student.student_profile_id, 'absent')} className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${attendance[student.student_profile_id] === 'absent' ? 'bg-error/10 text-error' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    <X size={18} /> غائب
                  </button>
                  <button onClick={() => handleStatusChange(student.student_profile_id, 'late')} className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${attendance[student.student_profile_id] === 'late' ? 'bg-warning/10 text-warning' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    <Clock size={18} /> متأخر
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-8 text-left">
          <button 
            onClick={handleSubmit} 
            disabled={isRecording}
            className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors shadow-lg disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isRecording ? <Loader2 className="animate-spin mr-2" size={20} /> : 'حفظ سجل الحضور'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default RecordAttendance;
