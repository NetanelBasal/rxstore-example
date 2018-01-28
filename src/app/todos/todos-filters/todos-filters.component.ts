import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {VISIBILITY_FILTER} from "../filter/filter.model";
import {FormControl} from "@angular/forms";

@Component({
  selector: "app-todos-filters",
  template: `
    <select [formControl]="control" class="form-control">
      <option *ngFor="let filter of filters; trackBy: trackBy" [ngValue]="filter.value"
              [attr.active]="isActive(filter.value)">{{filter.label}}
      </option>
    </select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosFiltersComponent implements OnInit {
  private _active: VISIBILITY_FILTER;

  @Input() set active(filter: VISIBILITY_FILTER) {
    this._active = filter;
  }

  isActive(filter) {
    return this._active === filter;
  }

  @Input() filters: { label: string, value: VISIBILITY_FILTER }[];

  @Output() filter = new EventEmitter<VISIBILITY_FILTER>();
  control: FormControl;

  constructor() {
  }

  ngOnInit() {
    this.control = new FormControl(this._active);
    this.control.valueChanges.subscribe(c => {
      this.filter.emit(c);
    });
  }

  trackBy(filter, index) {
    return index;
  }

}
