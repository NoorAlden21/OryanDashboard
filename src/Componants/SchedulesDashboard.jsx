


// import React, { useState, useMemo, Fragment, useEffect } from 'react';
// import { Plus, ChevronDown, AlertTriangle, Loader2, X } from 'lucide-react';
// import { Dialog, Transition } from '@headlessui/react';
// import { toast } from 'react-toastify';

// import { 
//   useGetAllSchedulesQuery, 
//   useGetSchedulesByClassroomQuery,
//   useGetClassSubjectTeachersQuery, 
//   useAddScheduleMutation 
// } from '../Slice/SchedulesSlice';

// import { useGetAllClassRoomMutation } from '../Slice/ClassRoomSlice';


// const ScheduleCard = ({ schedule }) => {
//     if (!schedule.class_subject_teacher || !schedule.class_subject_teacher.subject || !schedule.class_subject_teacher.teacher) {
//         return (<div className="p-3 rounded-lg h-full flex flex-col justify-center bg-gray-100 text-gray-500 border border-gray-300 shadow-sm"><p className="font-bold text-sm">حصة فارغة</p><p className="text-xs opacity-80">لا توجد مادة محددة</p></div>);
//     }
//     const getSubjectColor = (subjectName) => {
//         const colors = ['bg-primary/10 text-primary', 'bg-accent/10 text-accent', 'bg-success/10 text-success', 'bg-error/10 text-error', 'bg-blue-500/10 text-blue-500', 'bg-pink-500/10 text-pink-500', 'bg-purple-500/10 text-purple-500'];
//         const hash = subjectName.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
//         return colors[hash % colors.length];
//     };
//     const colorClass = getSubjectColor(schedule.class_subject_teacher.subject.name);
//     return (<div className={`p-3 rounded-lg h-full flex flex-col justify-center ${colorClass} border border-current/20 shadow-sm`}><p className="font-bold text-sm capitalize">{schedule.class_subject_teacher.subject.name}</p><p className="text-xs opacity-80">{schedule.class_subject_teacher.teacher.name}</p></div>);
// };
// const DayHeader = ({ day }) => (<div className="bg-white p-3 rounded-t-lg text-center font-bold text-textMain sticky top-0 z-10 shadow-sm border-b">{day}</div>);
// const TimeSlot = ({ period, time }) => (<div className="p-3 text-center bg-white rounded-l-lg sticky left-0 z-10 shadow-sm border-r"><p className="font-bold text-sm text-primary">{`الحصة ${period}`}</p><p className="text-xs text-slate-500">{time}</p></div>);
// const AddScheduleDialog = ({ isOpen, onClose }) => {
//     const { data: cstData, isLoading: isLoadingCST } = useGetClassSubjectTeachersQuery(undefined, { skip: !isOpen });
//     const [addSchedule, { isLoading: isAdding }] = useAddScheduleMutation();
//     const [formData, setFormData] = useState({ day: 'saturday', period: '1', start_time: '08:00:00', end_time: '08:45:00', class_subject_teacher_id: '' });
//     const [validationErrors, setValidationErrors] = useState({});
//     const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); if (validationErrors[e.target.name]) { setValidationErrors(prev => ({ ...prev, [e.target.name]: undefined })); } };
//     const handleClose = () => { setValidationErrors({}); onClose(); };
//     const handleSubmit = async (e) => { e.preventDefault(); setValidationErrors({}); if (!formData.class_subject_teacher_id) { toast.warn("يرجى اختيار الصف والمادة والمعلم."); return; } try { await addSchedule(formData).unwrap(); toast.success("تمت إضافة الحصة بنجاح!"); handleClose(); } catch (error) { if (error.data && error.data.errors) { setValidationErrors(error.data.errors); toast.error(error.data.message || "يرجى إصلاح الأخطاء والمحاولة مرة أخرى."); } else { toast.error(error.data?.message || "فشل في إضافة الحصة."); } } };
//     const FieldError = ({ error }) => error ? <p className="text-error text-xs mt-1">{error[0]}</p> : null;
//     return (<Transition appear show={isOpen} as={Fragment}><Dialog as="div" className="relative z-50" onClose={handleClose} dir="rtl"><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" /></Transition.Child><div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4 text-center"><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"><Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"><div className="flex justify-between items-center pb-4 border-b border-neutral"><Dialog.Title as="h3" className="text-xl font-bold leading-6 text-textMain">إضافة حصة دراسية</Dialog.Title><button type="button" className="p-2 rounded-full text-slate-400 hover:bg-neutral" onClick={handleClose}><X size={20} /></button></div><form onSubmit={handleSubmit} className="mt-6 space-y-4"><div><label htmlFor="cst_id" className="block text-sm font-medium text-slate-700 mb-1">الصف والمادة والمعلم</label><select id="cst_id" name="class_subject_teacher_id" value={formData.class_subject_teacher_id} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.class_subject_teacher_id ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required><option value="">-- اختر --</option>{isLoadingCST ? <option>جاري التحميل...</option> : cstData?.data?.map(cst => (<option key={cst.id} value={cst.id}>{`${cst.classroom.name} - ${cst.subject.name} - ${cst.teacher.name}`}</option>))}</select><FieldError error={validationErrors.class_subject_teacher_id} /></div><div className="grid grid-cols-2 gap-4"><div><label htmlFor="day" className="block text-sm font-medium text-slate-700 mb-1">اليوم</label><select id="day" name="day" value={formData.day} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.day ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required><option value="saturday">السبت</option><option value="sunday">الأحد</option><option value="monday">الاثنين</option><option value="tuesday">الثلاثاء</option><option value="wednesday">الأربعاء</option><option value="thursday">الخميس</option><option value="friday">الجمعة</option></select><FieldError error={validationErrors.day} /></div><div><label htmlFor="period" className="block text-sm font-medium text-slate-700 mb-1">الحصة</label><input type="number" id="period" name="period" value={formData.period} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.period ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required /><FieldError error={validationErrors.period} /></div><div><label htmlFor="start_time" className="block text-sm font-medium text-slate-700 mb-1">وقت البدء</label><input type="time" step="1" id="start_time" name="start_time" value={formData.start_time} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.start_time ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required /><FieldError error={validationErrors.start_time} /></div><div><label htmlFor="end_time" className="block text-sm font-medium text-slate-700 mb-1">وقت الانتهاء</label><input type="time" step="1" id="end_time" name="end_time" value={formData.end_time} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.end_time ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required /><FieldError error={validationErrors.end_time} /></div></div><div className="flex justify-end gap-3 pt-4"><button type="button" onClick={handleClose} className="px-4 py-2 bg-neutral text-textMain rounded-lg hover:bg-slate-200">إلغاء</button><button type="submit" disabled={isAdding} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center disabled:bg-primary/50">{isAdding ? <Loader2 className="animate-spin mr-2" size={20} /> : 'حفظ الحصة'}</button></div></form></Dialog.Panel></Transition.Child></div></div></Dialog></Transition>);
// };


// const SchedulesDashboard = () => {
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [selectedClassroom, setSelectedClassroom] = useState('');

//   const { 
//     data: allSchedulesData, 
//     isLoading: isLoadingAll, 
//     isError: isErrorAll 
//   } = useGetAllSchedulesQuery(undefined, {
//     skip: !!selectedClassroom,
//   });

//   const { 
//     data: classroomSchedulesData, 
//     isLoading: isLoadingClassroom, 
//     isError: isErrorClassroom 
//   } = useGetSchedulesByClassroomQuery(selectedClassroom, {
//     skip: !selectedClassroom,
//   });
  
//   const [getAllClassrooms, { data: classroomsData, isLoading: isLoadingClassrooms }] = useGetAllClassRoomMutation();

//   useEffect(() => {
//     getAllClassrooms();
//   }, [getAllClassrooms]);

//   const schedulesData = selectedClassroom ? classroomSchedulesData : allSchedulesData;
//   const isLoading = selectedClassroom ? isLoadingClassroom : isLoadingAll;
//   const isError = selectedClassroom ? isErrorClassroom : isErrorAll;
//   const isSuccess = !isLoading && !isError && schedulesData;

//   const { periods } = useMemo(() => {
//     if (!schedulesData?.data) return { periods: [] };
    
//     const periodSet = new Map();
//     Object.values(schedulesData.data).flat().forEach(schedule => {
//       if (schedule.period && schedule.start_time && schedule.end_time) {
//         periodSet.set(schedule.period, { 
//           start: schedule.start_time, 
//           end: schedule.end_time 
//         });
//       }
//     });

//     const sortedPeriods = Array.from(periodSet.entries())
//       .sort(([a], [b]) => a - b)
//       .map(([period, times]) => ({ 
//         period, 
//         time: `${times.start.substring(0, 5)} - ${times.end.substring(0, 5)}` 
//       }));
    
//     return { periods: sortedPeriods };
//   }, [schedulesData]);

//   const findSchedule = (day, period) => {
//     if (!schedulesData?.data) return null;
//     const dayKey = day.toLowerCase();
//     if (!schedulesData.data[dayKey]) return null;
//     return schedulesData.data[dayKey].find(s => s.period === period);
//   };

//   const daysOfWeek = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

//   return (
//     <>
//       <AddScheduleDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
//       <div className="p-8 bg-neutral min-h-screen" dir="rtl">
//         <div className="max-w-7xl mx-auto">
//           <header className="mb-8">
//             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//               <div>
//                 <h1 className="text-4xl font-extrabold text-textMain tracking-tight">الجدول الدراسي الأسبوعي</h1>
//                 <p className="mt-2 text-lg text-slate-500">عرض وإدارة الجداول الدراسية لجميع الصفوف.</p>
//               </div>
//               <div className="flex items-center gap-4 w-full md:w-auto">
//                 <div className="relative w-full md:w-64">
//                   <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//                   <select 
//                     value={selectedClassroom} 
//                     onChange={(e) => setSelectedClassroom(e.target.value)} 
//                     className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-right appearance-none"
//                     disabled={isLoadingClassrooms}
//                   >
//                     <option value="">عرض كل الصفوف</option>
//                     {classroomsData?.classrooms?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                   </select>
//                 </div>
//                 <button onClick={() => setIsAddDialogOpen(true)} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg flex items-center transition-colors shadow-sm">
//                   <Plus size={20} className="mr-2" />
//                   إضافة حصة
//                 </button>
//               </div>
//             </div>
//           </header>

//           {isLoading && <div className="flex justify-center p-10"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}
//           {isError && <div className="bg-white p-8 rounded-xl shadow-md text-center"><AlertTriangle className="h-12 w-12 text-error mx-auto" /><h3 className="mt-4 text-xl font-bold text-error">حدث خطأ</h3><p className="mt-2 text-slate-500">لم نتمكن من تحميل بيانات الجدول الدراسي.</p></div>}
          
//           {isSuccess && (
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
//               <div className="grid grid-cols-[auto_repeat(7,minmax(150px,1fr))] gap-1 p-2">
//                 <div className="sticky top-0 left-0 z-20 bg-white"></div>
//                 {daysOfWeek.map(day => <DayHeader key={day} day={day} />)}
//                 {periods.map(({ period, time }) => (
//                   <React.Fragment key={period}>
//                     <TimeSlot period={period} time={time} />
//                     {daysOfWeek.map(day => {
//                       const schedule = findSchedule(day, period);
//                       return (
//                         <div key={`${day}-${period}`} className="p-1 min-h-[80px]">
//                           {schedule ? <ScheduleCard schedule={schedule} /> : null}
//                         </div>
//                       );
//                     })}
//                   </React.Fragment>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SchedulesDashboard;





// import React, { useState, useMemo, Fragment, useEffect } from 'react';
// import { Plus, ChevronDown, AlertTriangle, Loader2, X } from 'lucide-react';
// import { Dialog, Transition } from '@headlessui/react';
// import { toast } from 'react-toastify';

// import { 
//   useGetAllSchedulesQuery, 
//   useGetSchedulesByClassroomQuery,
//   useGetClassSubjectTeachersQuery, 
//   useAddScheduleMutation 
// } from '../Slice/SchedulesSlice';

// import { useGetAllClassRoomMutation } from '../Slice/ClassRoomSlice';


// const ScheduleCard = ({ schedule }) => {
//     if (!schedule.class_subject_teacher || !schedule.class_subject_teacher.subject || !schedule.class_subject_teacher.teacher) {
//         return (<div className="p-3 rounded-lg h-full flex flex-col justify-center bg-gray-100 text-gray-500 border border-gray-300 shadow-sm"><p className="font-bold text-sm">حصة فارغة</p><p className="text-xs opacity-80">لا توجد مادة محددة</p></div>);
//     }
//     const getSubjectColor = (subjectName) => {
//         const colors = ['bg-primary/10 text-primary', 'bg-accent/10 text-accent', 'bg-success/10 text-success', 'bg-error/10 text-error', 'bg-blue-500/10 text-blue-500', 'bg-pink-500/10 text-pink-500', 'bg-purple-500/10 text-purple-500'];
//         const hash = subjectName.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
//         return colors[hash % colors.length];
//     };
//     const colorClass = getSubjectColor(schedule.class_subject_teacher.subject.name);
//     return (<div className={`p-3 rounded-lg h-full flex flex-col justify-center ${colorClass} border border-current/20 shadow-sm`}><p className="font-bold text-sm capitalize">{schedule.class_subject_teacher.subject.name}</p><p className="text-xs opacity-80">{schedule.class_subject_teacher.teacher.name}</p></div>);
// };
// const DayHeader = ({ day }) => (<div className="bg-white p-3 rounded-t-lg text-center font-bold text-textMain sticky top-0 z-10 shadow-sm border-b">{day}</div>);
// const TimeSlot = ({ period, time }) => (<div className="p-3 text-center bg-white rounded-l-lg sticky left-0 z-10 shadow-sm border-r"><p className="font-bold text-sm text-primary">{`الحصة ${period}`}</p><p className="text-xs text-slate-500">{time}</p></div>);
// const AddScheduleDialog = ({ isOpen, onClose }) => {
//     const { data: cstData, isLoading: isLoadingCST } = useGetClassSubjectTeachersQuery(undefined, { skip: !isOpen });
//     const [addSchedule, { isLoading: isAdding }] = useAddScheduleMutation();
//     const [formData, setFormData] = useState({ day: 'saturday', period: '1', start_time: '08:00:00', end_time: '08:45:00', class_subject_teacher_id: '' });
//     const [validationErrors, setValidationErrors] = useState({});
//     const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); if (validationErrors[e.target.name]) { setValidationErrors(prev => ({ ...prev, [e.target.name]: undefined })); } };
//     const handleClose = () => { setValidationErrors({}); onClose(); };
//     const handleSubmit = async (e) => { e.preventDefault(); setValidationErrors({}); if (!formData.class_subject_teacher_id) { toast.warn("يرجى اختيار الصف والمادة والمعلم."); return; } try { await addSchedule(formData).unwrap(); toast.success("تمت إضافة الحصة بنجاح!"); handleClose(); } catch (error) { if (error.data && error.data.errors) { setValidationErrors(error.data.errors); toast.error(error.data.message || "يرجى إصلاح الأخطاء والمحاولة مرة أخرى."); } else { toast.error(error.data?.message || "فشل في إضافة الحصة."); } } };
//     const FieldError = ({ error }) => error ? <p className="text-error text-xs mt-1">{error[0]}</p> : null;
//     return (<Transition appear show={isOpen} as={Fragment}><Dialog as="div" className="relative z-50" onClose={handleClose} dir="rtl"><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" /></Transition.Child><div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4 text-center"><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"><Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"><div className="flex justify-between items-center pb-4 border-b border-neutral"><Dialog.Title as="h3" className="text-xl font-bold leading-6 text-textMain">إضافة حصة دراسية</Dialog.Title><button type="button" className="p-2 rounded-full text-slate-400 hover:bg-neutral" onClick={handleClose}><X size={20} /></button></div><form onSubmit={handleSubmit} className="mt-6 space-y-4"><div><label htmlFor="cst_id" className="block text-sm font-medium text-slate-700 mb-1">الصف والمادة والمعلم</label><select id="cst_id" name="class_subject_teacher_id" value={formData.class_subject_teacher_id} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.class_subject_teacher_id ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required><option value="">-- اختر --</option>{isLoadingCST ? <option>جاري التحميل...</option> : cstData?.data?.map(cst => (<option key={cst.id} value={cst.id}>{`${cst.classroom.name} - ${cst.subject.name} - ${cst.teacher.name}`}</option>))}</select><FieldError error={validationErrors.class_subject_teacher_id} /></div><div className="grid grid-cols-2 gap-4"><div><label htmlFor="day" className="block text-sm font-medium text-slate-700 mb-1">اليوم</label><select id="day" name="day" value={formData.day} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.day ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required><option value="saturday">السبت</option><option value="sunday">الأحد</option><option value="monday">الاثنين</option><option value="tuesday">الثلاثاء</option><option value="wednesday">الأربعاء</option><option value="thursday">الخميس</option><option value="friday">الجمعة</option></select><FieldError error={validationErrors.day} /></div><div><label htmlFor="period" className="block text-sm font-medium text-slate-700 mb-1">الحصة</label><input type="number" id="period" name="period" value={formData.period} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.period ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required /><FieldError error={validationErrors.period} /></div><div><label htmlFor="start_time" className="block text-sm font-medium text-slate-700 mb-1">وقت البدء</label><input type="time" step="1" id="start_time" name="start_time" value={formData.start_time} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.start_time ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required /><FieldError error={validationErrors.start_time} /></div><div><label htmlFor="end_time" className="block text-sm font-medium text-slate-700 mb-1">وقت الانتهاء</label><input type="time" step="1" id="end_time" name="end_time" value={formData.end_time} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.end_time ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required /><FieldError error={validationErrors.end_time} /></div></div><div className="flex justify-end gap-3 pt-4"><button type="button" onClick={handleClose} className="px-4 py-2 bg-neutral text-textMain rounded-lg hover:bg-slate-200">إلغاء</button><button type="submit" disabled={isAdding} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center disabled:bg-primary/50">{isAdding ? <Loader2 className="animate-spin mr-2" size={20} /> : 'حفظ الحصة'}</button></div></form></Dialog.Panel></Transition.Child></div></div></Dialog></Transition>);
// };


// const SchedulesDashboard = () => {
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [selectedClassroom, setSelectedClassroom] = useState('');

//   const { 
//     data: allSchedulesData, 
//     isLoading: isLoadingAll, 
//     isError: isErrorAll 
//   } = useGetAllSchedulesQuery(undefined, {
//     skip: !!selectedClassroom,
//   });

//   const { 
//     data: classroomSchedulesData, 
//     isLoading: isLoadingClassroom, 
//     isError: isErrorClassroom 
//   } = useGetSchedulesByClassroomQuery(selectedClassroom, {
//     skip: !selectedClassroom,
//   });
  
//   const [getAllClassrooms, { data: classroomsData, isLoading: isLoadingClassrooms }] = useGetAllClassRoomMutation();

//   useEffect(() => {
//     getAllClassrooms();
//   }, [getAllClassrooms]);

//   const schedulesData = selectedClassroom ? classroomSchedulesData : allSchedulesData;
//   const isLoading = selectedClassroom ? isLoadingClassroom : isLoadingAll;
//   const isError = selectedClassroom ? isErrorClassroom : isErrorAll;
//   const isSuccess = !isLoading && !isError && schedulesData;

//   const { periods } = useMemo(() => {
//     if (!schedulesData?.data) return { periods: [] };
    
//     const periodSet = new Map();
//     Object.values(schedulesData.data).flat().forEach(schedule => {
//       if (schedule.period && schedule.start_time && schedule.end_time) {
//         periodSet.set(schedule.period, { 
//           start: schedule.start_time, 
//           end: schedule.end_time 
//         });
//       }
//     });

//     const sortedPeriods = Array.from(periodSet.entries())
//       .sort(([a], [b]) => a - b)
//       .map(([period, times]) => ({ 
//         period, 
//         time: `${times.start.substring(0, 5)} - ${times.end.substring(0, 5)}` 
//       }));
    
//     return { periods: sortedPeriods };
//   }, [schedulesData]);

//   const findSchedule = (day, period) => {
//     if (!schedulesData?.data) return null;
//     const dayKey = day.toLowerCase();
//     if (!schedulesData.data[dayKey]) return null;
//     return schedulesData.data[dayKey].find(s => s.period === period);
//   };

//   const daysOfWeek = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

//   return (
//     <>
//       <AddScheduleDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
//       <div className="p-8 bg-neutral min-h-screen" dir="rtl">
//         <div className="max-w-7xl mx-auto">
//           <header className="mb-8">
//             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//               <div>
//                 <h1 className="text-4xl font-extrabold text-textMain tracking-tight">الجدول الدراسي الأسبوعي</h1>
//                 <p className="mt-2 text-lg text-slate-500">عرض وإدارة الجداول الدراسية لجميع الصفوف.</p>
//               </div>
//               <div className="flex items-center gap-4 w-full md:w-auto">
//                 <div className="relative w-full md:w-64">
//                   <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//                   <select 
//                     value={selectedClassroom} 
//                     onChange={(e) => setSelectedClassroom(e.target.value)} 
//                     className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-right appearance-none"
//                     disabled={isLoadingClassrooms}
//                   >
//                     <option value="">عرض كل الصفوف</option>
//                     {classroomsData?.classrooms?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                   </select>
//                 </div>
//                 <button onClick={() => setIsAddDialogOpen(true)} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg flex items-center transition-colors shadow-sm">
//                   <Plus size={20} className="mr-2" />
//                   إضافة حصة
//                 </button>
//               </div>
//             </div>
//           </header>

//           {isLoading && <div className="flex justify-center p-10"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}
//           {isError && <div className="bg-white p-8 rounded-xl shadow-md text-center"><AlertTriangle className="h-12 w-12 text-error mx-auto" /><h3 className="mt-4 text-xl font-bold text-error">حدث خطأ</h3><p className="mt-2 text-slate-500">لم نتمكن من تحميل بيانات الجدول الدراسي.</p></div>}
          
//           {isSuccess && (
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
//               <div className="grid grid-cols-[auto_repeat(7,minmax(150px,1fr))] gap-1 p-2">
//                 <div className="sticky top-0 left-0 z-20 bg-white"></div>
//                 {daysOfWeek.map(day => <DayHeader key={day} day={day} />)}
//                 {periods.map(({ period, time }) => (
//                   <React.Fragment key={period}>
//                     <TimeSlot period={period} time={time} />
//                     {daysOfWeek.map(day => {
//                       const schedule = findSchedule(day, period);
//                       return (
//                         <div key={`${day}-${period}`} className="p-1 min-h-[80px]">
//                           {schedule ? <ScheduleCard schedule={schedule} /> : null}
//                         </div>
//                       );
//                     })}
//                   </React.Fragment>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SchedulesDashboard;


import React, { useState, useMemo, Fragment, useEffect } from 'react';
import { Plus, ChevronDown, AlertTriangle, Loader2, X, Trash2 } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';

import { 
  useGetAllSchedulesQuery, 
  useGetSchedulesByClassroomQuery,
  useGetClassSubjectTeachersQuery, 
  useAddScheduleMutation,
  useDeleteScheduleMutation 
} from '../Slice/SchedulesSlice';

import { useGetAllClassRoomMutation } from '../Slice/ClassRoomSlice';
import DeleteConfirmationDialog from './DeleteConfirmationDialog'; // تأكد من المسار الصحيح

const ScheduleCard = ({ schedule, onDelete }) => {
    if (!schedule.class_subject_teacher || !schedule.class_subject_teacher.subject || !schedule.class_subject_teacher.teacher) {
        return (
            <div className="p-3 rounded-lg h-full flex flex-col justify-center bg-gray-100 text-gray-500 border border-gray-300 shadow-sm relative">
                <p className="font-bold text-sm">حصة فارغة</p>
                <p className="text-xs opacity-80">لا توجد مادة محددة</p>
            </div>
        );
    }
    
    const getSubjectColor = (subjectName) => {
        const colors = ['bg-primary/10 text-primary', 'bg-accent/10 text-accent', 'bg-success/10 text-success', 'bg-error/10 text-error', 'bg-blue-500/10 text-blue-500', 'bg-pink-500/10 text-pink-500', 'bg-purple-500/10 text-purple-500'];
        const hash = subjectName.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        return colors[hash % colors.length];
    };
    
    const colorClass = getSubjectColor(schedule.class_subject_teacher.subject.name);
    
    return (
        <div className={`p-3 rounded-lg h-full flex flex-col justify-center ${colorClass} border border-current/20 shadow-sm relative group`}>
            <p className="font-bold text-sm capitalize">{schedule.class_subject_teacher.subject.name}</p>
            <p className="text-xs opacity-80">{schedule.class_subject_teacher.teacher.name}</p>
            
            {/* زر الحذف */}
            {onDelete && (
                <button 
                    onClick={() => onDelete(schedule)}
                    className="absolute top-1 left-1 p-1 rounded-full bg-white/80 text-error opacity-0 group-hover:opacity-100 transition-opacity"
                    title="حذف الحصة"
                >
                    <Trash2 size={14} />
                </button>
            )}
        </div>
    );
};

const DayHeader = ({ day }) => (<div className="bg-white p-3 rounded-t-lg text-center font-bold text-textMain sticky top-0 z-10 shadow-sm border-b">{day}</div>);
const TimeSlot = ({ period, time }) => (<div className="p-3 text-center bg-white rounded-l-lg sticky left-0 z-10 shadow-sm border-r"><p className="font-bold text-sm text-primary">{`الحصة ${period}`}</p><p className="text-xs text-slate-500">{time}</p></div>);

const AddScheduleDialog = ({ isOpen, onClose }) => {
    const { data: cstData, isLoading: isLoadingCST } = useGetClassSubjectTeachersQuery(undefined, { skip: !isOpen });
    const [addSchedule, { isLoading: isAdding }] = useAddScheduleMutation();
    const [formData, setFormData] = useState({ day: 'saturday', period: '1', start_time: '08:00:00', end_time: '08:45:00', class_subject_teacher_id: '' });
    const [validationErrors, setValidationErrors] = useState({});
    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); if (validationErrors[e.target.name]) { setValidationErrors(prev => ({ ...prev, [e.target.name]: undefined })); } };
    const handleClose = () => { setValidationErrors({}); onClose(); };
    const handleSubmit = async (e) => { e.preventDefault(); setValidationErrors({}); if (!formData.class_subject_teacher_id) { toast.warn("يرجى اختيار الصف والمادة والمعلم."); return; } try { await addSchedule(formData).unwrap(); toast.success("تمت إضافة الحصة بنجاح!"); handleClose(); } catch (error) { if (error.data && error.data.errors) { setValidationErrors(error.data.errors); toast.error(error.data.message || "يرجى إصلاح الأخطاء والمحاولة مرة أخرى."); } else { toast.error(error.data?.message || "فشل في إضافة الحصة."); } } };
    const FieldError = ({ error }) => error ? <p className="text-error text-xs mt-1">{error[0]}</p> : null;
    return (<Transition appear show={isOpen} as={Fragment}><Dialog as="div" className="relative z-50" onClose={handleClose} dir="rtl"><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" /></Transition.Child><div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4 text-center"><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"><Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"><div className="flex justify-between items-center pb-4 border-b border-neutral"><Dialog.Title as="h3" className="text-xl font-bold leading-6 text-textMain">إضافة حصة دراسية</Dialog.Title><button type="button" className="p-2 rounded-full text-slate-400 hover:bg-neutral" onClick={handleClose}><X size={20} /></button></div><form onSubmit={handleSubmit} className="mt-6 space-y-4"><div><label htmlFor="cst_id" className="block text-sm font-medium text-slate-700 mb-1">الصف والمادة والمعلم</label><select id="cst_id" name="class_subject_teacher_id" value={formData.class_subject_teacher_id} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.class_subject_teacher_id ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required><option value="">-- اختر --</option>{isLoadingCST ? <option>جاري التحميل...</option> : cstData?.data?.map(cst => (<option key={cst.id} value={cst.id}>{`${cst.classroom.name} - ${cst.subject.name} - ${cst.teacher.name}`}</option>))}</select><FieldError error={validationErrors.class_subject_teacher_id} /></div><div className="grid grid-cols-2 gap-4"><div><label htmlFor="day" className="block text-sm font-medium text-slate-700 mb-1">اليوم</label><select id="day" name="day" value={formData.day} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.day ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required><option value="saturday">السبت</option><option value="sunday">الأحد</option><option value="monday">الاثنين</option><option value="tuesday">الثلاثاء</option><option value="wednesday">الأربعاء</option><option value="thursday">الخميس</option><option value="friday">الجمعة</option></select><FieldError error={validationErrors.day} /></div><div><label htmlFor="period" className="block text-sm font-medium text-slate-700 mb-1">الحصة</label><input type="number" id="period" name="period" value={formData.period} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.period ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required /><FieldError error={validationErrors.period} /></div><div><label htmlFor="start_time" className="block text-sm font-medium text-slate-700 mb-1">وقت البدء</label><input type="time" step="1" id="start_time" name="start_time" value={formData.start_time} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.start_time ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required /><FieldError error={validationErrors.start_time} /></div><div><label htmlFor="end_time" className="block text-sm font-medium text-slate-700 mb-1">وقت الانتهاء</label><input type="time" step="1" id="end_time" name="end_time" value={formData.end_time} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.end_time ? 'border-error focus:ring-error' : 'border-slate-300 focus:ring-primary'}`} required /><FieldError error={validationErrors.end_time} /></div></div><div className="flex justify-end gap-3 pt-4"><button type="button" onClick={handleClose} className="px-4 py-2 bg-neutral text-textMain rounded-lg hover:bg-slate-200">إلغاء</button><button type="submit" disabled={isAdding} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center disabled:bg-primary/50">{isAdding ? <Loader2 className="animate-spin mr-2" size={20} /> : 'حفظ الحصة'}</button></div></form></Dialog.Panel></Transition.Child></div></div></Dialog></Transition>);
};

const SchedulesDashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { 
    data: allSchedulesData, 
    isLoading: isLoadingAll, 
    isError: isErrorAll,
    refetch: refetchAllSchedules
  } = useGetAllSchedulesQuery(undefined, {
    skip: !!selectedClassroom,
  });

  const { 
    data: classroomSchedulesData, 
    isLoading: isLoadingClassroom, 
    isError: isErrorClassroom,
    refetch: refetchClassroomSchedules
  } = useGetSchedulesByClassroomQuery(selectedClassroom, {
    skip: !selectedClassroom,
  });
  
  const [getAllClassrooms, { data: classroomsData, isLoading: isLoadingClassrooms }] = useGetAllClassRoomMutation();
  const [deleteSchedule, { isLoading: isDeleting }] = useDeleteScheduleMutation();

  useEffect(() => {
    getAllClassrooms();
  }, [getAllClassrooms]);

  const schedulesData = selectedClassroom ? classroomSchedulesData : allSchedulesData;
  const isLoading = selectedClassroom ? isLoadingClassroom : isLoadingAll;
  const isError = selectedClassroom ? isErrorClassroom : isErrorAll;
  const isSuccess = !isLoading && !isError && schedulesData;

  // دالة لإعادة تحميل البيانات
  const refetchData = () => {
    if (selectedClassroom) {
      refetchClassroomSchedules();
    } else {
      refetchAllSchedules();
    }
  };

  // معالجة حذف الحصة
  const handleDeleteSchedule = async () => {
    if (!scheduleToDelete) return;
    
    try {
      await deleteSchedule(scheduleToDelete.id).unwrap();
      toast.success("تم حذف الحصة بنجاح");
      refetchData(); // إعادة تحميل البيانات بعد الحذف
    } catch (error) {
      toast.error(error.data?.message || "فشل في حذف الحصة");
    } finally {
      setScheduleToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // فتح حوار تأكيد الحذف
  const openDeleteDialog = (schedule) => {
    setScheduleToDelete(schedule);
    setIsDeleteDialogOpen(true);
  };

  const { periods } = useMemo(() => {
    if (!schedulesData?.data) return { periods: [] };
    
    const periodSet = new Map();
    Object.values(schedulesData.data).flat().forEach(schedule => {
      if (schedule.period && schedule.start_time && schedule.end_time) {
        periodSet.set(schedule.period, { 
          start: schedule.start_time, 
          end: schedule.end_time 
        });
      }
    });

    const sortedPeriods = Array.from(periodSet.entries())
      .sort(([a], [b]) => a - b)
      .map(([period, times]) => ({ 
        period, 
        time: `${times.start.substring(0, 5)} - ${times.end.substring(0, 5)}` 
      }));
    
    return { periods: sortedPeriods };
  }, [schedulesData]);

  const findSchedule = (day, period) => {
    if (!schedulesData?.data) return null;
    const dayKey = day.toLowerCase();
    if (!schedulesData.data[dayKey]) return null;
    return schedulesData.data[dayKey].find(s => s.period === period);
  };

  const daysOfWeek = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <>
      <AddScheduleDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
      
      {/* حوار تأكيد الحذف */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteSchedule}
        isLoading={isDeleting}
        itemName={scheduleToDelete ? `${scheduleToDelete.class_subject_teacher?.subject?.name} - ${scheduleToDelete.class_subject_teacher?.teacher?.name}` : ''}
        title="حذف الحصة"
        message="هل أنت متأكد من رغبتك في حذف هذه الحصة؟ لا يمكن التراجع عن هذا الإجراء."
      />
      
      <div className="p-8 bg-neutral min-h-screen" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-4xl font-extrabold text-textMain tracking-tight">الجدول الدراسي الأسبوعي</h1>
                <p className="mt-2 text-lg text-slate-500">عرض وإدارة الجداول الدراسية لجميع الصفوف.</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <select 
                    value={selectedClassroom} 
                    onChange={(e) => setSelectedClassroom(e.target.value)} 
                    className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-right appearance-none"
                    disabled={isLoadingClassrooms}
                  >
                    <option value="">عرض كل الصفوف</option>
                    {classroomsData?.classrooms?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <button onClick={() => setIsAddDialogOpen(true)} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg flex items-center transition-colors shadow-sm">
                  <Plus size={20} className="mr-2" />
                  إضافة حصة
                </button>
              </div>
            </div>
          </header>

          {isLoading && <div className="flex justify-center p-10"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}
          {isError && <div className="bg-white p-8 rounded-xl shadow-md text-center"><AlertTriangle className="h-12 w-12 text-error mx-auto" /><h3 className="mt-4 text-xl font-bold text-error">حدث خطأ</h3><p className="mt-2 text-slate-500">لم نتمكن من تحميل بيانات الجدول الدراسي.</p></div>}
          
          {isSuccess && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
              <div className="grid grid-cols-[auto_repeat(7,minmax(150px,1fr))] gap-1 p-2">
                <div className="sticky top-0 left-0 z-20 bg-white"></div>
                {daysOfWeek.map(day => <DayHeader key={day} day={day} />)}
                {periods.map(({ period, time }) => (
                  <React.Fragment key={period}>
                    <TimeSlot period={period} time={time} />
                    {daysOfWeek.map(day => {
                      const schedule = findSchedule(day, period);
                      return (
                        <div key={`${day}-${period}`} className="p-1 min-h-[80px]">
                          {schedule ? <ScheduleCard schedule={schedule} onDelete={openDeleteDialog} /> : null}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SchedulesDashboard;