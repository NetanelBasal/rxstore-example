import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TodosModule } from './todos/todos.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppStores } from './app-stores.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ReactiveFormsModule, AppRoutingModule, TodosModule],
  providers: [AppStores],
  bootstrap: [AppComponent]
})
export class AppModule {}
