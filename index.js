let MyForm = {
	form: {
		fio: "", // to name
		email: "", 
		phone: ""
	},
	validate: function () {
		fields = [];
		for (field in this.form) {
			if(!window["moderate" + field.charAt(0).toUpperCase() + field.substr(1)](this.form[field])) {
				fields.push(field);
			}		}
		return {"isValid": fields.length == 0, "errorFields": fields};
	},
	getData: function () {
		return this.form;
	},
	setData: function (data) {
		this.form = data;
	},
	submit: function () {
	}			
};

function eqObj(obj1, obj2) {
	b = (obj1.isValid == obj2.isValid);
	b = b && ((obj1.errorFields + " ") == (obj2.errorFields + " "));
	console.log(b);
}

MyForm.setData({fio: "", email: "", phone: ""});
eqObj({"isValid": false, "errorFields": ["fio", "email", "phone"]}, MyForm.validate());

MyForm.setData({fio: "", email: "", phone: "+7(111)111-11-11"});
eqObj({"isValid": false, "errorFields": ["fio", "email"]}, MyForm.validate());

MyForm.setData({fio: "", email: "ESSch@yandex.ru", phone: ""});
eqObj({"isValid": false, "errorFields": ["fio", "phone"]}, MyForm.validate());

MyForm.setData({fio: "a b c", email: "", phone: ""});
eqObj({"isValid": false, "errorFields": ["email", "phone"]}, MyForm.validate());

MyForm.setData({fio: "a b c", email: "ESSch@yandex.ru", phone: "+7(111)111-11-11"});
eqObj({"isValid": true, "errorFields": []}, MyForm.validate());


console.log("VALIDATE");



		document.getElementById("submitButton").onclick = function (e) {
			["name", "email", "phone"].forEach(function (name) {
				console.log("moderate" + name.charAt(0).toUpperCase() + name.substr(1));
				if(!window["moderate" + name.charAt(0).toUpperCase() + name.substr(1)](phone.value)) {
					field.className += " error";
				}
			});
			document.getElementById("submitButton").disabled = true;
			e.preventDefault();
		};

		function moderateFio(name)
		{
			return null !== name.match(/^\s*(\S+\s+){2}\S+\s*$/);
		}

		console.log(moderateFio("i i i"));
		console.log(moderateFio(" i i i "));
		console.log(moderateFio("Штльц Евгений Сергеевич"));
		console.log(!moderateFio(""));
		console.log(!moderateFio("i i i i"));
		//console.log(!moderateName("i i i"));

		function moderateEmail(mail) 
		{
			if(null === mail.match(/.+\@/)) { // replace mailregex.ru
				return false;
			}

			if (null === mail.match(/(ya\.ru|yandex\.(ru|ua|by|kz|com))$/)) {
				return false;
			}

			return true;
		}

		console.log('MAIL');
		console.log(moderateEmail("ESSch@yandex.ru"));
		console.log(moderateEmail("ESSch@sub.yandex.ru"));
		console.log(moderateEmail("ё@yandex.ru"));
		console.log(!moderateEmail("mail.ya"));
		console.log(!moderateEmail(""));
		console.log(!moderateEmail("yandex.ru"));

		function moderatePhone(phone) 
		{
			if(null === phone.match(/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/)) {
				return false;
			}

			let digits = phone.match(/\d/g);
			
			if (null === digits) {
				return false;
			}

			let sum = digits.reduce(function (sum, digit) {
				return +sum + +digit;  
			}, 0);

			if (sum > 30) {
				return false;
			}

			return true;
		}
		console.log("phone");
		console.log(moderatePhone("+7(111)111-11-11"));
		console.log(!moderatePhone("+7(111)111-11-111"));
		console.log(!moderatePhone("+7(333)334-22-33"));
		console.log(!moderatePhone("+7(11a)334-22-33"));