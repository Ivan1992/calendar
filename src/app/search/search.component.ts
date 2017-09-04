import { Component, OnInit } from '@angular/core';
import { DayService } from "../day.service";
import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  items;
  days;
  searchQuery;
  myQuery;
  o_font;
  o_size;
  currentYear;

  constructor(private dayService: DayService,
              private _cookieService:CookieService,
              private router: Router) { }

  ngOnInit() {
    this.days = this.dayService.getDaysArray().map(item => {return {month : item.month, day : item.day, saints : this.convertToRus(item.saints)}});
    this.o_font = this._cookieService.get('o_font')? this._cookieService.get('o_font') : "Turaevo";
    this.o_size = this._cookieService.get('o_size')? this._cookieService.get('o_size') : "1.4";
    this.currentYear = new Date().getFullYear();
  }

  search(value) {
    this.items = [];
    this.myQuery = value;
    this.days.forEach(item => {
      if (new RegExp(value,"i").test(this.convertToRus(item.saints))) {
        this.items.push({month: item.month, day: item.day, saints: this.convertToRus(item.saints)});
      }
    });
  }

  convertToRus(text : string) {
		let mapping = {"С™":"Свят","с™":"свят","є3пкcп":"епископ","хrтA":"Христа","Прпdбн":"Преподобн","прпdбн":"преподобн","пrт":"пресвят","прbр":"прор","пррb":"прор", "nц7A":"отца","ржcт":"рожест","влdчц":"владычец",
		"ґпcл":"апостол", "Ржcтв":"Рожеств", "пrнw":"присно","дв7ы":"Девы","мRjи":"Марии","бGо":"бого","nц7ъ":"отец","б9іz":"Божия","цRцы":"царицы","кн7з":"княз","цRS":"царя","бцdы":"Богородицы","сщ7":"свящ",
		"Бlж":"Блаж","бlж":"блаж","чcт":"чест", "пртdч":"предотеч", "кrтл":"крестител","гDн":"Господн", "бlг":"благ", "цrт":"царст", "м™":"мате", "u3ч™":"учит", "м§":"муч", "млd":"младе", "воскrн":"воскресен",
	"бGа":"Бога", "бGъ":"Бог", "бц7ы":"Богородицы", "кrт":"Крест", "цRк":"церк", "цRе":"царе", "архиепcкп": "архиепископов",
		"a":"а","e":"е","0":"о","H":"о","h":"ы","Ђ":"и","y":"у","ё":"е","j":"и","ј":"и","џ":"о","ќ":"у","ћ":"я","ѓ":"а","t~":"от","s":"я","ґ":"а","ї":"и","њ":"о","э":"е", "N":"О", "€":"з",
		"ў":"у","Ў":"У","k":"я","љ":"я","n":"о","Ґ":"А","K":"Я","Ѓ":"А","Ћ":"Я","w":"о","і":"и","x":"кс", "t":"от","\\|":"я","±":"я","E":"е","J":"и","Y":"у","Ё":"е", "v":"в",
		"A":"а","S":"я","z":"я","є":"е","u":"у","É":"з","f":"ф"};
		text = text.replace(/(<([^>]+)>)/ig, "");
		Object.keys(mapping).forEach(key => {text = text.replace(new RegExp(key,"g"), mapping[key])} );
		text = text.replace(/\d+|\$|ӳ|Ӳ|#|Ӱ|_/g,'');
		text = text.replace(/ъ\s/g,' ');
		text = text.replace(/ъ\,/g,',');
		text = text.replace(/ъ\./g,'.');
		return text;
  }
  
  navigate(month, day) {
    let old = new Date(new Date().getFullYear(), month-1, day);
		let newStyle = new Date(old);
    newStyle.setDate(newStyle.getDate() + 13);
    this.router.navigateByUrl('/'+newStyle.getFullYear() + '/' + (newStyle.getMonth()+1) + '/' + newStyle.getDate());
  }

}
