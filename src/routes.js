//importing layouts....
import Admin from 'layouts/Admin';
import UnAuth from 'layouts/Auth';

import Dashboard from "views/Dashboard.js";
import Login from "./views/Login/Login";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers,faUser, faLanguage, faEnvelope, faDharmachakra, faGlobe, faQuestion, faAddressBook, faIdCard, faBug, faCertificate, faBraille, faUserPlus, faChartPie, faGaugeSimple, faAtom, faUserCheck, faDice, faFolderPlus, faComment, faCommentMedical, faIdBadge, faFile, faHouseUser, faBars, faNewspaper, faFileInvoice, faIndustry, faCreditCard, faFileExport, faList, faAlignRight, faWrench, faListOl, faListUl } from '@fortawesome/free-solid-svg-icons'
import Students from "./views/Students/Students";
import Interviewers from "./views/Interviewers/Interviewers";
import Semesters from "./views/Semesters/Semesters";
import Profile from 'views/Profile/profile'
import Unauth from 'layouts/Auth';
import ForgotPassword from 'views/ForgotPassword/ForgotPassword';
import ResetPassword from 'views/ResetPassword/ResetPassword';
import SetPassword from 'views/SetPassword/SetPassword';
import Permissions from 'views/AdminStaff/permissions/permissionsListingComponent'
import Staff from 'views/AdminStaff/staff/staffListingComponent'
import UserEmailTemplates from 'views/UserEmailTemplates/UserEmailTemplate';
import AddUserEmailTemplate from 'views/UserEmailTemplates/AddUserEmailTemplate';
import EditUserEmailTemplate from 'views/UserEmailTemplates/EditUserEmailTemplate';
import EmailTypes from 'views/EmailTypes/EmailType';
import AddEmailType from 'views/EmailTypes/AddEmailType';
import EditEmailType from 'views/EmailTypes/EditEmailType';
import SiteSettings from 'views/Settings/SiteSettings';
import VerifyEmail from 'views/VerifyEmail/VerifyEmail';
import LoanApplications from 'views/LoanApplications/LoanApplications';


var routes = [
  {
    path: "/dashboard",
    layout: Admin,
    name: "Dashboard",
    icon: faAtom,
    access: true,
    exact: true,
    component: Dashboard,
    showInSideBar: true
  },
  {
    collapse: true,
    name: "Admin Staff",
    state: "openAdminStaff",
    icon: faUserPlus,
    showInSideBar: true,
    submenus: [
      {
        path: "/admin-staff",
        layout: Admin,
        name: "Admin Staff",
        icon: faUserCheck,
        access: true, exact: true,
        component: Staff,
        showInSideBar: true,
      },
      {
        path: "/roles",
        layout: Admin,
        name: "Roles",
        icon: faDice,
        access: true, exact: true,
        component: Permissions,
        showInSideBar: true,
      }
    ],
  },
  {
    path: "/students",
    layout: Admin,
    name: "Students",
    icon: faUsers,
    access: true, exact: true,
    component: Students,
    showInSideBar: true,
  },
  {
    path: "/interviewers",
    layout: Admin,
    name: "Interviewers",
    icon: faUser,
    access: true, exact: true,
    component: Interviewers,
    showInSideBar: true,
  },
  {
    path: "/semesters",
    layout: Admin,
    name: "Semesters",
    icon: faUsers,
    access: true, exact: true,
    component: Semesters,
    showInSideBar: true,
  },
  {
    path: "/loan-applications",
    layout: Admin,
    name: "Loan Application",
    icon: faUsers,
    access: true, exact: true,
    component: LoanApplications,
    showInSideBar: true,
  },
  {
    path: "/",
    layout: Unauth,
    name: "Login",
    icon: "nc-icon nc-chart-pie-35",
    access: true,
    exact: true,
    component: Login
  },
  {
    path: "/profile",
    layout: Admin,
    name: "Profile",
    icon: "nc-icon nc-circle-09",
    access: true, exact: true,
    component: Profile,
    showInSideBar: false,
  },
  {
    collapse: true,
    name: "Email",
    state: "openEmails",
    icon: faEnvelope,
    showInSideBar: true,
    submenus: [
      {
        path: "/email-types",
        layout: Admin,
        name: "Email Types",
        icon: faComment,
        access: true, exact: true,
        component: EmailTypes,
        showInSideBar: true,
      },
      {
        path: "/user-email-templates",
        layout: Admin,
        name: "Email Templates",
        icon: faCommentMedical,
        access: true, exact: true,
        component: UserEmailTemplates,
        showInSideBar: true,
      }
    ]
  },


  {
    path: "/site-settings",
    layout: Admin,
    name: "Site Settings",
    icon: faDharmachakra,
    access: true, exact: true,
    component: SiteSettings,
    showInSideBar: true,
  },

  {
    path: "/add-user-email-templates",
    layout: Admin,
    name: "Add User Email Templates",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: AddUserEmailTemplate,
  },
  {
    path: "/edit-user-email-templates/:emailTemplateId",
    layout: Admin,
    name: "Edit User Email Templates",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: EditUserEmailTemplate,
  },
  {
    path: "/add-email-type",
    layout: Admin,
    name: "Add Email Type",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: AddEmailType,
  },
  {
    path: "/edit-email-type/:emailTypeId",
    layout: Admin,
    name: "Edit Email Type",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: EditEmailType,
  },
  {
    path: "/login",
    layout: UnAuth,
    name: "Login",
    mini: "LP",
    component: Login,
  },
  {
    path: "/forgot-password",
    layout: UnAuth,
    name: "Forgot Passowrd",
    mini: "FP",
    component: ForgotPassword,
  },
  {
    path: "/reset-password",
    layout: UnAuth,
    name: "Reset Passowrd",
    mini: "RP",
    component: ResetPassword,
  },
  {
    path: "/set-password",
    layout: UnAuth,
    name: "Set Passowrd",
    mini: "SP",
    component: SetPassword,
  },
  {
    path: "/verify-email/:id",
    layout: UnAuth,
    name: "Verify Email",
    mini: "SP",
    component: VerifyEmail,
  }
];

export default routes;
