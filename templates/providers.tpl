import { {{pascalCase name}}Store } from "./{{dashCase name}}.store";
import { {{pascalCase name}}Service } from "./{{dashCase name}}.service";
import { {{pascalCase name}}DataService } from "./{{dashCase name}}-data.service";
import { {{pascalCase name}}Query } from "./{{dashCase name}}.query";

export const {{camelCase name}}Providers = [
  {{pascalCase name}}Store,
  {{pascalCase name}}Service,
  {{pascalCase name}}DataService,
  {{pascalCase name}}Query,
  {
    provide: STORES,
    useExisting: {{pascalCase name}}Store,
    multi: true
  }
];
