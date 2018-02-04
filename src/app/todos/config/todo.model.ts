import { Entity } from '../../core/akita-entity';

export class Todo extends Entity<Todo> {
  constructor(public id: number, public title: string, public completed: boolean = false) {
    super();
    this.id = id;
    this.title = title;
    this.completed = completed;
  }
}
