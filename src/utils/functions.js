export const permissionsForComponents = [
  /**  system permissions **/

        // dashboard
        {role : 'viewDashboard' , component: 'Dashboard'},
        {role : 'viewAdmin' , component: 'Admin Staff'},
        {role : 'viewStaff' , component: 'View Staff'},
        {role : 'viewRole' , component: 'Permissions'},
        {role : 'viewRole' , component: 'Roles'},
        {role : 'viewEmailTemplates' , component: 'Email Templates'},
        {role : 'viewEmailType' , component: 'Email Types'},
        {role : 'viewSetting' , component: 'Site Settings'},
        {role : 'viewStudent' , component: 'Students'},
        {role : 'viewSemester' , component: 'Semesters'},
        {role : 'viewLoanApplication' , component: 'Loan Application'},
      
               
]

export const currencyFormat = (amount, currencyCode="EUR", currencySymbol="€") => {
  // return currencyCode+" "+parseFloat(amount).toFixed(2)+" "+currencySymbol
  return currencySymbol+" "+parseFloat(amount).toFixed(2)+" "+currencyCode
}