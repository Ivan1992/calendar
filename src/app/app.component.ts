import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	day: number;
	month: number;
	year: number;
	
	today = new Date();
	constructor(private route: ActivatedRoute){}

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			if (!(+params['day']) || !(+params['month']) || !(+params['year'])) {
				this.day = this.today.getDate();
				this.month = this.today.getDate();
				this.year = this.today.getDate();
			} else {
				this.day = +params['day'];
				this.month = +params['month'];
				this.year = +params['year'];
			}
		});
	}
}
