import { Component, Input, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Cday } from './cday';
import { DayService } from './day.service';
import { Gospel } from './gospel';
import { GospelService } from './gospel.service';
import { Gospelday } from './gospelday';
import { Location } from '@angular/common';
import { NgbModal, ModalDismissReasons, NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'angular2-cookie/core';
import { DateService } from './date.service';

const I18N_VALUES = {
  ru: {
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
	months_full: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  },
  cs: {
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
	months_full: ["Сентsбрь", "Nктsбрь", "Ноsбрь", "Декaбрь","Генвaрь", "Феврaль", "Мaртъ", "Ґпрeль", "Мaй", "Їю1нь", "Їю1ль", "Ѓвгустъ"],
  }
};

@Injectable()
export class I18n {
  language = 'ru';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months_full[month - 1];
  }
  getMonthFullName(month: number): string {
    return I18N_VALUES[this._i18n.language].months_full[month - 1];
  }
}


@Component({
  selector: 'day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})

export class DayComponent implements OnInit {
	oldStyle = new Date();
	newStyle = new Date();
	/*day: number;
	month: number;
	year: number;*/
	days: Cday[];
	saints = "";
	tropar = "";
	weekDay = "";
	monthText = "";
	dayNumberText = "";
	gospelday = new Gospelday();
	private sub: any;
	closeResult: string;
	o_font = "Turaevo";
	o_size = "1.6";
	language = "сs";
	datePicker : NgbDateStruct;
		
	constructor(private dayService: DayService,
				private gospelService: GospelService,
				private route: ActivatedRoute,
				private location: Location,
				private modalService: NgbModal,
				private _cookieService:CookieService,
				private _i18n: I18n,
				private dateService: DateService) {}
				
	onDayChange() {
		this.newStyle = new Date(this.datePicker.year, this.datePicker.month-1, this.datePicker.day);
		this.oldStyle = new Date(this.newStyle);
		this.oldStyle.setDate(this.oldStyle.getDate() - 13);
		this.setTexts()
	}
				
	isWeekend(date: NgbDateStruct) {
		const d = new Date(date.year, date.month - 1, date.day);
		return d.getDay() === 0 || d.getDay() === 6;
	}
	
	isFastDay(date: NgbDateStruct) {
		const d = new Date(date.year, date.month - 1, date.day);
		return this.dateService.isFastDay(d);
	}
	
	isPrazdnik(date: NgbDateStruct, type: number) {
		const d = new Date(date.year, date.month - 1, date.day);
		return this.dateService.isPrazdnik(d,type);
	}
	
	isDisabled(date: NgbDateStruct, current: {month: number}) {
		return date.month !== current.month;
	}
				
	getWeekDayText(today : Date): string {
		let d = (today.getDay()+6)%7;
		if (d == 0) {return "недeлz";}
		else if (d == 1) {return "понедёлникъ";}
		else if (d == 2) {return "вт0рникъ";}
		else if (d == 3) {return "средA";}
		else if (d == 4) {return "четверт0къ";}
		else if (d == 5) {return "пzт0къ";}
		else if (d == 6) {return "суб0та";}
	}
	
	getDayNumberText(today : number): string {
		let arr = ["№","в7","G","д7","е7","ѕ7","з7","и7","f7","‹","№i","в7i","Gi","д7i","е7i","ѕ7i","з7i","и7i","f7i","к7","к7а","к7в","к7г","к7д","к7е","к7ѕ","к7з","к7и","к7f","l7","l7а"];
		return arr[today];
	}
	
	getMonthText(today : Date): string {
		let d = (today.getMonth());
		let arr = ["генварS", "fевралS", "мaрта", "ґпрeлz", "мaz", "їю1нz", "їю1лz",
			"ѓвгуста", "сентzбрS", "nктzбрS", "ноzбрS", "декабрS"];
		return arr[d];
	}
	
	getGospel(): void {
		this.gospelService.getCurrentDayText(this.oldStyle).then((gospelday) => {
			this.gospelday = gospelday;
			if (gospelday.zachalo == undefined) {
				this.gospelday.zachalo = -1;
				this.gospelday.text = "<span style='color: red;'>Зачaла на сjй дeнь не и4мамы</span>";
			}
		});
	}
	
	getDays(): void {
		this.dayService.getDays().then((days) => {
			this.days = days;
			let d = this.days.filter(e => e.day == this.oldStyle.getDate() && e.month == (this.oldStyle.getMonth()+1))[0];
			this.saints = d["saints"];
			this.tropar = d["tropar"];
			this.weekDay = this.getWeekDayText(this.oldStyle);
			this.monthText = this.getMonthText(this.oldStyle);
			this.dayNumberText = this.getDayNumberText(this.oldStyle.getDate()-1);
		});
	}
	
	setTexts() : void {
		let d = this.days.filter(e => e.day == this.oldStyle.getDate() && e.month == (this.oldStyle.getMonth()+1))[0];
		this.saints = d["saints"];
		this.tropar = d["tropar"];
		this.getGospel();
		this.datePicker = {
			year : this.newStyle.getFullYear(),
			month : this.newStyle.getMonth()+1,
			day: this.newStyle.getDate()
		};
		this.weekDay = this.getWeekDayText(this.oldStyle);
		this.monthText = this.getMonthText(this.oldStyle);
		this.dayNumberText = this.getDayNumberText(this.oldStyle.getDate()-1);
		this.location.go( "/"+this.newStyle.getFullYear()+"/"+
			("0"+(this.newStyle.getMonth()+1)).slice(-2)+"/"+
			("0"+this.newStyle.getDate()).slice(-2));
	}
	
	getBackDayText(): void {
		this.oldStyle.setDate(this.oldStyle.getDate() - 1);
		this.newStyle.setDate(this.newStyle.getDate() - 1);
		this.setTexts();
	}
	
	getNextDayText(): void {
		this.oldStyle.setDate(this.oldStyle.getDate() + 1);
		this.newStyle.setDate(this.newStyle.getDate() + 1);
		this.setTexts();
	}
	
	ngOnInit(): void {
		this.oldStyle = new Date();
		this.newStyle = new Date();
		this.oldStyle.setDate(this.oldStyle.getDate() - 13);
		this.sub = this.route
		.params
		.subscribe(params => {
			if (+params['day']) {
				let paramDate = new Date(+params['year'], +params['month']-1, +params['day']);
				
				this.newStyle = new Date(paramDate);
				paramDate.setDate(paramDate.getDate() - 13);
				this.oldStyle = new Date(paramDate);
			}
			this.datePicker = {year : this.newStyle.getFullYear(), month : this.newStyle.getMonth()+1, day: this.newStyle.getDate()};
			//this.datePicker.day = this.newStyle.getDate();
			//this.date.month = this.newStyle.getMonth();
			//this.date.year = this.newStyle.getFullYear();
		});
		this.getDays();
		this.getGospel();
		this.o_font = this.getCookie('o_font')? this.getCookie('o_font') : "Turaevo";
		this.o_size = this.getCookie('o_size')? this.getCookie('o_size') : "1.4";
	}
	
	getCookie(key: string){
		return this._cookieService.get(key);
	}
	
	putCookie(key: string, value: string){
		return this._cookieService.put(key, value);
	}
	
	open(content) {
		this.modalService.open(content, { size: 'lg' }).result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
		  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}
	
	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
		  return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
		  return 'by clicking on a backdrop';
		} else {
		  return  `with: ${reason}`;
		}
	}
}
