import { Injectable } from '@angular/core';


@Injectable()
export class DateService {
	
	
		
	isFastDay(d: Date): boolean {
		if (this.isPrazdnik(d,0) || this.isPrazdnik(d,1)) {
			return false;
		}
		
		//ПЕТРОВСКИЙ (АПОСТОЛЬСКИЙ) Пост
		let p: Date = this.pasha(d);
		let start: Date = new Date(p);
		start.setDate(start.getDate()+57);
		let end: Date = new Date(d.getFullYear(), 6, 12);
		if (start <= d && end >= d) {
			return true;
		}
		
		//УСПЕНСКИЙ Пост
		start = new Date(d.getFullYear(), 7, 14);
		end = new Date(d.getFullYear(), 7, 27);
		if (start <= d && end >= d) {
			return true;
		}
		
		//РОЖДЕСТВЕНСКИЙ Пост
		start = new Date(d.getFullYear(), 10, 28);
		end = new Date(d.getFullYear(), 0, 6);
		if (start <= d || end >= d) {
			return true;
		}
		
		//ВЕЛИКИЙ Пост
		start = new Date(p);
		start.setDate(start.getDate()-48);
		end = new Date(p);
		if (start <= d && end >= d) {
			return true;
		}
		
		//СПЛОШНАЯ Седмица по РОЖДЕСТВЕ ХРИСТОВОМ
		start = new Date(d.getFullYear(), 0, 7);
		end = new Date(d.getFullYear(), 0, 17);
		if (start <= d && end >= d) {
			return false;
		}
		
		//СПЛОШНАЯ Седмица по ПЯТИДЕСЯТНИЦЕ
		start = new Date(p);
		start.setDate(start.getDate()+50);
		end = new Date(p);
		end.setDate(start.getDate()+57);
		if (start <= d && end >= d) {
			return false;
		}
		
		//ВОЗДВИЖЕНИЕ ЧЕСТНАГО КРЕСТА - Пост
		start = new Date(d.getFullYear(), 8, 27);
		if (start.getMonth() == d.getMonth() && start.getDate() == d.getDate()) {
			return true;
		}
		
		//УСЕКНОВЕНИЕ ГЛАВЫ СВ. ИОАННА ПРЕДОТЕЧИ - Пост
		start = new Date(d.getFullYear(), 8, 11);
		if (start.getMonth() == d.getMonth() && start.getDate() == d.getDate()) {
			return true;
		}
		
		//СРЕДА, ПЯТНИЦА
		if (d.getDay() == 3 || d.getDay() == 5) {
			return true;
		}
	}
	
	isPrazdnik(d : Date, type: number): boolean {
		let b : boolean = PRAZDNIKI.filter((x) => x.month == d.getMonth() && x.day == d.getDate() && x.type == type).length > 0;
		if (b) return b;
		
		if (type == 0) {
			//Пасха - неделя
			let start : Date = this.pasha(d);
			let end : Date = new Date(start);
			end.setDate(end.getDate()+6);
			if (start <= d && end >= d) {
				return true;
			}
			
			start.setDate(start.getDate()-7);
			if (start.getMonth() == d.getMonth() && start.getDate() == d.getDate()) {
				return true;
			}
		}
	}
	
	private pasha(date : Date) : Date {
		let god = date.getFullYear();
		let a = god % 19;
		let b = god % 4;
		let c = god % 7;
		let d = (19*a + 15) % 30;
		let e = (2*b + 4*c + 6*d + 6) % 7;
		let f = d+e;
		let noviyStil, easter;
		if (f<=9) {
			easter = 22+f;
			noviyStil = new Date(god, 2, easter);
		}else{
			easter = f-9;
			noviyStil = new Date(god, 3, easter);
		}
		noviyStil.setDate(noviyStil.getDate() + 13);
		return noviyStil;
	}
}

const PRAZDNIKI = [
{month: 8, day: 21, type: 0, name: "Рождество Пресвятой Богородицы"},
{month: 8, day: 27, type: 0, name: "Воздвижение Креста Господня"},
{month: 11, day: 4, type: 0, name: "Введение во храм Пресвятой Богородицы"},
{month: 0, day: 7, type: 0, name: "Рождество Христово"},
{month: 0, day: 19, type: 0, name: "Крещение Господне (Богоявление)"},
{month: 1, day: 15, type: 0, name: "Сретение Господне"},
{month: 3, day: 7, type: 0, name: "Благовещение Пресвятой Богородицы"},
{month: 7, day: 19, type: 0, name: "Преображение Господне"},
{month: 7, day: 28, type: 0, name: "Успение Богородицы"},
{month: 0, day: 14, type: 1, name: "Обрезание Господне"},
{month: 6, day: 7, type: 1, name: "Рожество Иоанна Предотечи"},
{month: 6, day: 12, type: 1, name: "День святых первоверховных апостолов Петра и Павла"},
{month: 8, day: 11, type: 1, name: "Усекновение главы Иоанна Предотечи"},
{month: 9, day: 14, type: 1, name: "Покров Пресвятой Богородицы"},
{month: 6, day: 9, type: 2, name: "Празднование явления иконы Пресвятыя Богородицы Тихвинския"},
{month: 8, day: 14, type: 2, name: "Начало Индикту, еже есть новому лету"},
{month: 1, day: 12, type: 2, name: "Tрех святителей: Василия Великаго, Григория Богослова и Иоанна Златоустаго"},
{month: 2, day: 22, type: 2, name: "Сорок мучеников Севастийских"},
{month: 4, day: 6, type: 2, name: "Память влмч. Георгия Победоносца"},
{month: 5, day: 3, type: 2, name: "Празднование сретению иконы Пресвятыя Богородицы Владимирския"},
{month: 6, day: 9, type: 2, name: "Празднование явления иконы Пресвятыя Богородицы Тихвинския"},
{month: 6, day: 15, type: 2, name: "Положение ризы Богородицы в Лахерне"},
{month: 6, day: 21, type: 2, name: "Празднование явлению иконы Богородицы во граде Казани"},
{month: 6, day: 22, type: 2, name: "Явление иконы Богородицы во граде Можайске"},
{month: 6, day: 15, type: 2, name: "Положение ризы Богородицы в Лахерне"},
{month: 6, day: 23, type: 2, name: "Положение ризы Господа Бога и Спаса нашего Исуса Христа во граде Москве"},
{month: 7, day: 10, type: 2, name: "Празднование явлению иконы Богородицы Смоленския, именуемой Одигитрия"},
{month: 7, day: 14, type: 2, name: "Происхождение Креста Господня. Всемилостивого Спаса"},
{month: 10, day: 4, type: 2, name: "Празднование явлению иконы Пресвятыя Богородицы во граде Казани"},
{month: 10, day: 8, type: 2, name: "Св.влмч. Димитрия Солунскаго"},
{month: 10, day: 11, type: 2, name: "Свт. Амвросия, митрополита Белокриницкаго"},
{month: 10, day: 21, type: 2, name: "Собор св. архистратига Михаила и прочих сил безплотных"},
{month: 11, day: 10, type: 2, name: "Знамение от иконы Пресвятыя Богородицы в Великом Новеграде"},
{month: 11, day: 19, type: 2, name: "Иже во святых отца нашего Николы, архиеп. Мир Ликийских, чудотворца"}
];
