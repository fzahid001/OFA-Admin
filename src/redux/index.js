import { combineReducers } from 'redux'
import adminReducer from '../views/Admin/Admin.reducer'
import rolesReducer from '../views/AdminStaff/permissions/permissions.reducer'
import studentReducer from 'views/Students/Student.reducer'
import interviewerReducer from 'views/Interviewers/Interviewer.reducer'
import semesterReducer from 'views/Semesters/Semester.reducer'
import errorReducer from './shared/error/error.reducer'
import emailReducer from '../views/EmailTemplates/EmailTemplates.reducer'
import settingsReducer from '.././views/Settings/settings.reducer'
import DashboardReducer from 'views/Dashboard.reducer'
import UserEmailTemplateReducer from 'views/UserEmailTemplates/UserEmailTemplate.reducer'
import EmailTypeReducer from 'views/EmailTypes/EmailType.reducer'
import LoanApplicationReducer from 'views/LoanApplications/LoanApplication.reducer'

export default combineReducers({
    admin: adminReducer,
    role: rolesReducer,
    student: studentReducer,
    interviewer: interviewerReducer,
    semester: semesterReducer,
    error: errorReducer,
    email: emailReducer,
    settings: settingsReducer,
    dashboard: DashboardReducer,
    UserEmailTemplate: UserEmailTemplateReducer,
    EmailType: EmailTypeReducer,
    application: LoanApplicationReducer,
})