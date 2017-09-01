var MyForm = {
    url: '',
    status: '',
    response: '',
    fio: null,
    email: null,
    phone: null,
    form: null,

    valid: function (name, status) {
        if (null !== MyForm[name]) {
            var field = MyForm[name];
            if (!status) {
                field.className = "error";
                field.value = '';
            } else {
                field.className = "";
            }
        }
    },

    validate: function () {
        // var status = true;
        var fields = [];
        ["fio", "email", "phone"].forEach(function (name) {
            MyForm[name] = document.getElementById('myForm').querySelector("input[name=" + name + "]");
            var nameMethod = "moderate" + name.charAt(0).toUpperCase() + name.substr(1);
            var value =  MyForm[name].value;
            if (!window[nameMethod](value)) {
                fields.push(name);
            }
        });

        return {"isValid": fields.length == 0, "errorFields": fields};
    },

    submit: function () {
        // this.getData();
        // this.setData({"fio": 10});

       var form = document.getElementById('myForm');
        MyForm.url = form.getAttribute("action");
        var validate = MyForm.validate();

        ["fio", "email", "phone"].forEach(function (name) {
            MyForm.valid(name, true);
        });
        validate.errorFields.forEach(function (name) {
            MyForm.valid(name, false);
        });

        if (validate.isValid) {
            e.target.disabled = true;
            MyForm.request(MyForm.url);
            MyForm.showResult();
        }

        return false;
    },

    request: function (url) {
        if (undefined !== url) {
            this.url = url;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.url, false);
        xhr.send();

        this.status = 'error';
        if ((undefined !== xhr.status) && (xhr.status == 200)) {
            if ("string" == typeof(xhr.response)) {
                this.response = JSON.parse(xhr.response);
                this.status = this.response.status;

                return this.status;
            }
        }

        return this.status;
    },

    showResult: function () {
        if (typeof(this.response) != "object") {
            return false;
        }

        var container = document.getElementById("resultContainer");
        container.className = this.response.status;

        switch (this.response.status) {
            case "success":
                container.innerHTML = "Success";
                return true;
                break;
            case "error":
                container.innerHTML = this.response.reason;
                return true;
                break;
            case "progress":
                container.innerHTML = "Форма не обработана, ожидайте...";
                var timer = +this.response.timeout;
                if (timer) {
                    setTimeout(function () {
                        container.innerHTML = "Форма отравляется...";
                        MyForm.request();
                        MyForm.showResult();
                    }, timer);
                }
                return true;
                break;
        }

        return false;
    },

    data: {
        fio: "",
        email: "",
        phone: ""
    },

    init: function () {
        if (!this.isInit) {
            var form = document.getElementById('myForm');
            for (var name in this.data) {
                this.data[name] = form.querySelector("input[name=" + name + "]");
            }
        }
        this.isInit;
    },

    getData: function () {
        this.init();
        var data = this.data;
        for (var name in this.data) {
            data[name] = this.data[name].value;
        }
        return data;
    },

    setData: function (data) {
        this.init();
        for (var name in this.data) {
            if (undefined !== data[name]) {
                this.data[name].value = data[name];
            }
        }
    }
};

document.getElementById('submitButton').onclick = function (event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    MyForm.submit();
    return false;
};

// MyForm.request("error.json");
// setTimeout(2000);
// console.log(MyForm.status);
// console.log('error' == MyForm.status);
//
// MyForm.request("success.json");
// setTimeout(2000);
// console.log('success' == MyForm.status);
//
// MyForm.request("progress.json");
// setTimeout(2000);
// console.log('progress' == MyForm.status);
//
// setTimeout(3000);
// console.log('success' == MyForm.status);

/*
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

 function


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
*/
function moderateFio(name) {
    if (undefined == name) {
        return false;
    }
    return null !== name.match(/^\s*(\S+\s+){2}\S+\s*$/);
}

// console.log(moderateFio("i i i"));
// console.log(moderateFio(" i i i "));
// console.log(moderateFio("Штльц Евгений Сергеевич"));
// console.log(!moderateFio(""));
// console.log(!moderateFio("i i i i"));
//console.log(!moderateName("i i i"));

function moderateEmail(mail) {
    if (undefined == mail) {
        return false;
    }
    if (null === mail.match(/.+\@/)) {
        return false;
    }

    if (null === mail.match(/(ya\.ru|yandex\.(ru|ua|by|kz|com))$/)) {
        return false;
    }

    return true;
}

// console.log('MAIL');
// console.log(moderateEmail("ESSch@yandex.ru"));
// console.log(moderateEmail("ESSch@sub.yandex.ru"));
// console.log(moderateEmail("ё@yandex.ru"));
// console.log(!moderateEmail("mail.ya"));
// console.log(!moderateEmail(""));
// console.log(!moderateEmail("yandex.ru"));

function moderatePhone(phone) {
    if (undefined == phone) {
        return false;
    }

    if (null === phone.match(/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/)) {
        return false;
    }

    var digits = phone.match(/\d/g);

    if (null === digits) {
        return false;
    }

    var sum = digits.reduce(function (sum, digit) {
        return +sum + +digit;
    }, 0);

    if (sum > 30) {
        return false;
    }

    return true;
}
// console.log("phone");
// console.log(moderatePhone("+7(111)111-11-11"));
// console.log(!moderatePhone("+7(111)111-11-111"));
// console.log(!moderatePhone("+7(333)334-22-33"));
// console.log(!moderatePhone("+7(11a)334-22-33"));