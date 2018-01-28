// import {DashboardsStore} from "./dashboards.store";
// import {Dashboard} from "./dashboard.model";
// import {combineLatest} from "rxjs/observable/combineLatest";
// import {PagesQuery} from "../../pages/config/pages.query";
// import {Injectable} from "@angular/core";
// import {ID} from "../../core/store";
//
// @Injectable()
// export class DashboardsQuery {
//
//   /** Select the active dashboard id */
//   selectActive$ = this.dashboardsStore.active();
//
//   constructor(private pagesQuery: PagesQuery,
//               private dashboardsStore: DashboardsStore) {
//
//   }
//
//   /**
//    * Select dashboard by id
//    * @param {ID} id
//    * @returns {Dashboard}
//    */
//   selectDashboard(id: ID) {
//     return this.dashboardsStore.entity(id);
//   }
//
//   /**
//    * Select the pages of the active dashboard
//    * @returns {Observable<any>}
//    */
//   selectPages() {
//     return this.selectActive$.withLatestFrom(this.pagesQuery.selectPages$, (activeDashboard, pages) => {
//       if (activeDashboard) {
//         return this.selectDashboard(activeDashboard).pages.map(id => pages[id]);
//       }
//       return [];
//     });
//   }
// }
