

/* eslint-disable no-unused-vars */
//Routes
export const loginRoute = "/";

export const mainRoute = "/home";
export const student = "/student";

export const teachers = "/teachers";

export const addTeachersRoute = `${teachers}/addTeachers`;


export const addStudentRoute = `${student}/addStudent`;
export const studentDetailsRoute = `${student}/:id`;

export const updateStudent = `${student}/edit/:id`;

export const updateTeacher = `${teachers}/edit/:id`;

export const teacherDetailsRoute = `${teachers}/:id`;


export const classRoom = "/classRoom";

export const assignTeacher = `${classRoom}/assign-teachers/:id`;

export const classType ="classType";

export const subject = "/subjects";

export const subjectDetails = "/subjects/:id";

export const addSubject = "/subjects/add";
export const editSubject = "/subjects/edit/:id";
export const teacherSchedule = "teacherSchedule";
export const attendance = "attendance";
export const attendanceRecord = "/attendance/record/:classroomId";
