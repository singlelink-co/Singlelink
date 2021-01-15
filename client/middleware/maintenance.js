export default function (context) {

    /*
      Maintenance window redirect
    */

    // If currently on maintenance page
    if(context.store.$router.history.current.path.includes('/maintenance-underway')) {
      // Fetch current date
      const current_date = new Date();
      // If migration is not currently occuring, redirect home
      if(current_date < new Date(process.env.migration_date)) return context.redirect('/');
      // Else, continue to maintenance page and do nothing
      return;
      
    }

    // Current date
    const current_date = new Date();
    // If current date is later than migration date, redirect to maintenace page 
    if(current_date > new Date(process.env.migration_date)) return context.redirect('/maintenance-underway');

    /*
      End maintenace window redirect
    */
}