import React, { useState, useMemo } from 'react';
import { ChevronDown, AlertTriangle, Loader2, User, BookOpen } from 'lucide-react';

import { useGetTeachersQuery, useGetScheduleByTeacherIdQuery } from '../Slice/TeachersSlice';


const ScheduleCard = ({ schedule }) => {
  return (
    <div className="p-3 rounded-lg h-full flex flex-col justify-center bg-primary/10 text-primary border border-primary/20 shadow-sm">
      <p className="font-bold text-sm capitalize">{schedule.class_subject_teacher.subject.name}</p>
      <p className="text-xs opacity-80">{schedule.class_subject_teacher.classroom.name}</p>
    </div>
  );
};

const DayHeader = ({ day }) => (
  <div className="bg-white p-3 rounded-t-lg text-center font-bold text-textMain sticky top-0 z-10 shadow-sm border-b">
    {day}
  </div>
);

const TimeSlot = ({ period, time }) => (
  <div className="p-3 text-center bg-white rounded-l-lg sticky left-0 z-10 shadow-sm border-r">
    <p className="font-bold text-sm text-primary">{`الحصة ${period}`}</p>
    <p className="text-xs text-slate-500">{time}</p>
  </div>
);


const TeacherScheduleViewer = () => {
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const { data: teachersData, isLoading: isLoadingTeachers } = useGetTeachersQuery();
  const {
    data: scheduleData,
    isLoading: isLoadingSchedule,
    isError: isScheduleError,
    isFetching: isFetchingSchedule,
  } = useGetScheduleByTeacherIdQuery(selectedTeacherId, {
    skip: !selectedTeacherId,
  });

  const periods = useMemo(() => {
    const dataObject = scheduleData?.data || scheduleData;
    if (!dataObject || typeof dataObject !== 'object') return [];

    const periodSet = new Map();
    Object.values(dataObject).flat().forEach(schedule => {
      if (!periodSet.has(schedule.period)) {
        periodSet.set(schedule.period, { start: schedule.start_time, end: schedule.end_time });
      }
    });
    return Array.from(periodSet.entries()).sort(([a], [b]) => a - b).map(([period, times]) => ({ period, time: `${times.start} - ${times.end}` }));
  }, [scheduleData]);

  const findSchedule = (day, period) => {
    const dataObject = scheduleData?.data || scheduleData;
    return dataObject?.[day.toLowerCase()]?.find(s => s.period === period);
  };

  const daysOfWeek = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="p-8 bg-neutral min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-textMain tracking-tight">جدول المعلمين</h1>
              <p className="mt-2 text-lg text-slate-500">اختر معلمًا لعرض جدوله الدراسي الأسبوعي.</p>
            </div>
            <div className="relative w-full md:w-72">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                disabled={isLoadingTeachers}
                className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-right appearance-none"
              >
                <option value="">-- اختر معلمًا --</option>
                {isLoadingTeachers ? (
                  <option>جاري تحميل المعلمين...</option>
                ) : (
                  teachersData?.teachers?.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto min-h-[400px] flex items-center justify-center">
          {isFetchingSchedule && ( <div className="flex flex-col items-center text-slate-500"> <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" /> <p>جاري تحميل جدول المعلم...</p> </div> )}
          {isScheduleError && !isFetchingSchedule && ( <div className="flex flex-col items-center text-error"> <AlertTriangle className="h-10 w-10 mb-3" /> <p>عفوًا، حدث خطأ أثناء جلب الجدول.</p> </div> )}
          {!selectedTeacherId && !isFetchingSchedule && ( <div className="flex flex-col items-center text-slate-500"> <BookOpen className="h-10 w-10 mb-3" /> <p>يرجى اختيار معلم من القائمة أعلاه لعرض جدوله.</p> </div> )}
          
          {scheduleData && !isFetchingSchedule && !isScheduleError && (
            <div className="grid grid-cols-[auto_repeat(7,minmax(150px,1fr))] gap-1 p-2 w-full">
              <div className="sticky top-0 left-0 z-20 bg-white"></div>
              {daysOfWeek.map(day => <DayHeader key={day} day={day} />)}
              {periods.map(({ period, time }) => (
                <React.Fragment key={period}>
                  <TimeSlot period={period} time={time} />
                  {daysOfWeek.map(day => {
                    const schedule = findSchedule(day, period);
                    return <div key={`${day}-${period}`} className="p-1 min-h-[80px]">{schedule ? <ScheduleCard schedule={schedule} /> : null}</div>;
                  })}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherScheduleViewer;
