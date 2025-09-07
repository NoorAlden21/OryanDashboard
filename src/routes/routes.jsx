

import ComplaintsIndex from "../Componants/ComplaintsIndex";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../Componants/Layout";
import Home from "../Componants/Home";
import Article from "../Componants/Article";
import Login from "../Componants/Login";
import ErrorPage from "../error/ErrorPage";
import AddStudentForm from "../Componants/AddStudentForm";
import StudentDetails from "../Componants/StudentDetails";
import ExamTermsIndex from "../Componants/ExamTermsIndex";
import ExamsIndex from "../Componants/ExamsIndex";
import ExamGradesEntry from "../Componants/ExamGradesEntry";
import ExamBulkUpsert from "../Componants/ExamBulkUpsert";
import {
  mainRoute,
  loginRoute,
  addStudentRoute,
  studentDetailsRoute,
  student,
  teachers,
  classRoom,
  assignTeacher,
  addTeachersRoute ,
  updateStudent,
  classType,
  teacherDetailsRoute,
  updateTeacher,
  subject,
  subjectDetails,
  addSubject,
  editSubject,
  teacherSchedule,
  attendanceRecord,
  attendance
} from "../data/data";

import { TeachersProvider } from "../Componants/TeachersState";
import { StudentsProvider } from "../Componants/StudentsState";
import { ClassRoomProvider } from "../Componants/ClassRoomsContext";
import ClassroomDashboard from "../Componants/ClassroomDashboard";
import AssignTeachersPage from "../Componants/AssignTeachersPage";
import AddTeacherForm from "../Componants/AddTeacherForm";
import EditStudentForm from "../Componants/EditStudentForm";
import ClassTypesList from "../Componants/ClassTypesList";
import TeacherDetails from "../Componants/TeacherDetails";
import EditTeacherForm from "../Componants/EditTeacherForm";
import SubjectsList from "../Componants/SubjectsList";
import SubjectDetails from "../Componants/SubjectDetails";
import AddSubjectForm from "../Componants/AddSubjectForm";
import EditSubjectForm from "../Componants/EditSubjectForm";
import SchedulesDashboard from "../Componants/SchedulesDashboard";
import TeacherScheduleViewer from "../Componants/TeacherScheduleViewer";
import AttendanceDashboard from "../Componants/AttendanceDashboard";
import RecordAttendance from "../Componants/RecordAttendance";

const router = createBrowserRouter([
  {
    path: loginRoute,
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: mainRoute,
        element: (
          <>
            <SchedulesDashboard />
          </>
        ),
      },
      {
        path: student,
        element: (
          <StudentsProvider>
            <Article />
          </StudentsProvider>
        ),
      },
    
      {
        path: addStudentRoute,
        element: <AddStudentForm />,
      },
      {
        path: studentDetailsRoute,
        element: <StudentDetails />,
      },

       {
        path: teachers,
        element: (
          <TeachersProvider>
            <Home />
          </TeachersProvider>
      
        ),
      },

      {
        path: classRoom,
        element: (
         <ClassRoomProvider>
            <ClassroomDashboard />
          </ClassRoomProvider>
      
        ),
      },

        {
        path: assignTeacher,
        element: (
            <AssignTeachersPage />
      
        ),
      },

      {
        path: addTeachersRoute,
        element: <AddTeacherForm />,
      },

       {
        path: updateStudent,
        element: <EditStudentForm />,
      },

       {
        path: classType,
        element: <ClassTypesList />,
      },

      {
        path: teacherDetailsRoute,
        element: <TeacherDetails />,
      },


       {
        path: updateTeacher,
        element: <EditTeacherForm />,
      },


      
       {
        path: subject,
        element: <SubjectsList />,
      },

      {
        path: subjectDetails,
        element: <SubjectDetails />,
      },

       {
        path: addSubject,
        element: <AddSubjectForm />,
      },

       {
        path: editSubject,
        element: <EditSubjectForm />,
      },

       {
        path: teacherSchedule,
        element: <TeacherScheduleViewer />,
      },

       {
        path: attendance,
        element: <AttendanceDashboard />,
      },

       {
        path: attendanceRecord,
        element: <RecordAttendance />,
      },
      { 
        path: "/complaints",
        element: <ComplaintsIndex /> 
      },
      { path: "/exam-terms", element: <ExamTermsIndex /> },
      { path: "/exams", element: <ExamsIndex /> },
      { path: "/exams/:examId/grades", element: <ExamGradesEntry /> },
      { path: "/exam-terms/:termId/exams/bulk", element: <ExamBulkUpsert /> },


    ],
  },
]);

export default router;
