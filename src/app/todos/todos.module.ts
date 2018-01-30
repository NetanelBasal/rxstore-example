import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoComponent } from './todo/todo.component';
import { TodosComponent } from './todos/todos.component';
import { todosProviders } from './config/todos.providers';
import { ReactiveFormsModule } from '@angular/forms';
import { filterProviders } from './filter/filter.providers';
import { TodosFiltersComponent } from './todos-filters/todos-filters.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  providers: [todosProviders, filterProviders],
  exports: [TodosComponent, TodosFiltersComponent],
  declarations: [TodoComponent, TodosComponent, TodosFiltersComponent]
})
export class TodosModule {}
