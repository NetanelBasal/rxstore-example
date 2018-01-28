import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Host, Input, OnInit, Output} from "@angular/core";
import {VISIBILITY_FILTER} from "./filter.model";
import {TodosFiltersComponent} from "../todos-filters/todos-filters.component";

@Component({
  selector: "app-filter",
  template: `

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit {
  ngOnInit(): void {
  }

}
