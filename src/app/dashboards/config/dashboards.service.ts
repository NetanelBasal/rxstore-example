// import {Injectable} from "@angular/core";
// import {DashboardsDataService} from "./dashboards-data.service";
// import {Dashboard} from "./dashboard.model";
// import {Observable} from "rxjs/Observable";
// import {Page} from "../../pages/page/page.model";
// import {DashboardsQuery} from "./dashboards.query";
// import {DashboardsStore} from "./dashboards.store";
//
// @Injectable()
// export class DashboardsService {
//
//   constructor(private dashboardsQuery: DashboardsQuery,
//               private dashboardStore: DashboardsStore,
//               private dashboardsDataService: DashboardsDataService) {
//   }
//
//   /**
//    *
//    * @returns {Observable<Dashboard[]>}
//    */
//   selectDashboards(): Observable<Dashboard[]> {
//     return this.dashboardStore.asArray();
//   }
//
//   /**
//    *
//    * @returns {Observable<Page[]>}
//    */
//   selectPages(): Observable<Page[]> {
//     return this.dashboardsQuery.selectPages();
//   }
//
//   /**
//    * Get dashboards from the server and saved them in the store
//    * @returns {Observable<Object>}
//    */
//   getDashboards() {
//     return this.dashboardsDataService.get().do(dashboards => {
//       const mapped = dashboards.map(dashboard => new Dashboard(dashboard));
//       this.dashboardStore.set(mapped);
//     });
//   }
//
//   /**
//    * Set the active dashboard
//    * @param {number} dashboardId
//    */
//   setActive(dashboardId: number) {
//     this.dashboardStore.setActive(dashboardId);
//   }
//
//
// }
