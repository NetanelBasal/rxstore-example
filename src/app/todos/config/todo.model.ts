import {Entity} from "../../core/entity";

@Entity()
export class Todo {

  id: number;
  title: string;
  completed: boolean;

  constructor(id, title, completed = false) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }
}
