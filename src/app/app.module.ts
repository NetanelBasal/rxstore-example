import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppRoutingModule} from "./app-routing.module";

import {AppComponent} from "./app.component";
import {TodosModule} from "./todos/todos.module";
import {ReactiveFormsModule} from "@angular/forms";
import {PhotonDirective} from "./photon.directive";


@NgModule({
  declarations: [
    AppComponent,
    PhotonDirective
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    TodosModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
