import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Todo} from "../config/todo.model";
import {FormControl} from "@angular/forms";

@Component({
  selector: "app-todo",
  template: `
    {{todo.title}}
    <input type="checkbox" [formControl]="control">
    <button class="btn btn-danger" (click)="delete.emit(todo.id)">Delete</button>
    {{detectChanges}}
  `,
  styles: [`:host {
    display: block
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent implements OnInit {
  @Input() todo: Todo;
  @Output() complete = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<number>();

  control: FormControl;

  get detectChanges() {
    // console.log("detectChanges", this.todo.title);
    return "";
  }

  constructor() {
  }

  ngOnInit() {
    this.control = new FormControl(this.todo.completed);

    this.control.valueChanges.subscribe(completed => {
      this.complete.emit({...this.todo, completed});
    });

  }

}
