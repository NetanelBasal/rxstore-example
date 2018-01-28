import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DashboardsDataService {

  constructor(private http: HttpClient) {
  }

  get(brandId: number = 7561) {
    return this.http.get<any[]>(`https://ci.datorama.com/services/admin/dashboard/findByBrand/${brandId}`);
  }
}
