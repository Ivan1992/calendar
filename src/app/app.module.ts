import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { CookieService, CookieOptions } from 'angular2-cookie/core';

import { AppComponent } from './app.component';
import { DayComponent } from './day/day.component';
import { DayService } from './day.service';
import { GospelService } from './gospel.service';
import { Safe } from './safe.pipe';
import { DateService } from './date.service';
import { SearchComponent } from './search/search.component';

import { NgFuseModule } from 'ng2-fuse';
import { LimitResultsPipe } from './limit-results.pipe';


@NgModule({
  declarations: [
    AppComponent,
	DayComponent,
	Safe,
	SearchComponent,
	LimitResultsPipe
  ],
  imports: [
	NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    NgFuseModule,
	  Angular2FontawesomeModule,
    RouterModule.forRoot([
      {path: ':year/:month/:day', component: DayComponent},
      {path: '', component: DayComponent},
      {path: 'search', component: SearchComponent},
      {path: '**', component: DayComponent}
    ])
  ],
  providers: [DayService, GospelService, CookieService, { provide: CookieOptions, useValue: {} }, DateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
