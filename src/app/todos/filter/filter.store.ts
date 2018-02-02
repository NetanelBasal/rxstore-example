import { Store } from '../../core/cuscus-store';
import { VISIBILITY_FILTER, Filter } from './filter.model';

export interface State {
  active: VISIBILITY_FILTER;
}

const initialState: State = {
  active: VISIBILITY_FILTER.SHOW_ALL
};

export class VisibilityFilterStore extends Store<State, Filter> {
  constructor() {
    super(initialState);
  }
}
