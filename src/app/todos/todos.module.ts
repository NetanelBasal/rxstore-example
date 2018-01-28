import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TodoComponent} from "./todo/todo.component";
import {TodosComponent} from "./todos/todos.component";
import {FilterComponent} from "./filter/filter.component";
import {todosProviders} from "./config/todos.providers";
import {ReactiveFormsModule} from "@angular/forms";
import {filterProviders} from "./filter/filter.providers";
import { TodosFiltersComponent } from './todos-filters/todos-filters.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [todosProviders, filterProviders],
  exports: [TodosComponent, FilterComponent, TodosFiltersComponent],
  declarations: [TodoComponent, TodosComponent, FilterComponent, TodosFiltersComponent]
})
export class TodosModule {
}
