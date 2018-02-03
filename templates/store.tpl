import { HashMap, Store } from "../../store";
import { {{pascalCase name}} } from "./{{dashCase name}}.model";
import { Injectable } from "@angular/core";

export interface State extends EntityState<{{pascalCase name}}> {}

const initialState: State = {
  ...getInitialState()
};

@Injectable()
export class {{pascalCase name}}Store extends Store<State, {{pascalCase name}}> {
  constructor() {
    super(initialState);
  }
}

