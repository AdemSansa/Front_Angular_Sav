import { Route } from "@angular/router";
import { NotificationsComponent } from "./notifications.component";




export default [
    {
        path: "",
        component:NotificationsComponent,
        data: {
            breadcrumb: "Notifications",
        },
    
        

    }
] as Route[];