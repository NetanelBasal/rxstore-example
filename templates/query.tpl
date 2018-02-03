import { Injectable } from '@angular/core';
import { Query } from '../../core/cuscus-query';
import { {{pascalCase name}}Store } from './{{dashCase name}}.store';
import { {{pascalCase name}} } from './{{dashCase name}}.model';
import { State } from './{{dashCase name}}.store';

@Injectable()
export class {{pascalCase name}}Query extends Query<State, {{pascalCase name}}> {

  constructor(protected store: {{pascalCase name}}Store) {
    super(store);
  }

}
