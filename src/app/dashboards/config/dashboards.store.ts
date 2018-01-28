import {Activable, Entityable, Store} from "../../core/store";
import {Dashboard} from "./dashboard.model";

interface State extends Entityable, Activable {
}

const initialState: State = {
  entities: {},
  ids: [],
  activeId: null
};

export class DashboardsStore extends Store<State, Dashboard> {
  
  constructor() {
    super(initialState);
  }
  
}