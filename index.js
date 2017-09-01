var formView = {
    url: '',
    status: '',
    response: '',
    fio: null,
    email: null,
    phone: null,
    form: null,

    valid: function (name, status) {
        if (null !== this[name]) {
            var field = this[name];
            if (!status) {
                field.className = "error";
                field.value = '';
            } else {
                field.className = "";
            }
        }
    },

    // validate: function () {
    //     fields = [];
    //     for (var field in this.form) {
    //         var bValid = !window["moderate" + field.charAt(0).toUpperCase() + field.substr(1)](this.form[field]);
    //         if (bValid) {
    //             fields.push(field);
    //         }
    //         console.log(field);
    //     }
    //     return {"isValid": fields.length == 0, "errorFields": fields};
    // },

    send: function (e) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        var form =  e.target.closest("form");
        formView.url = form.getAttribute("action");

        var status = true;
        var fields = [];
        ["fio", "email", "phone"].forEach(function (name) {
            formView[name] = form.querySelector("input[name=" + name + "]");
            var nameMethod = "moderate" + name.charAt(0).toUpperCase() + name.substr(1);
            var value =  formView[name].value;
            var bValid = window[nameMethod](value);
            console.log(value);
            console.log(bValid);
            if (bValid) {
                fields.push(name);
            }
            status = status && bValid;
            formView.valid(name, bValid);
        });

        if (status) {
            e.target.disabled = true;
            formView.request(formView.url);
            formView.showResult();
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
                        formView.request();
                        formView.showResult();
                    }, timer);
                }
                return true;
                break;
        }

        return false;
    }
};

document.getElementById('submitButton').onclick = formView.send;

// formView.request("error.json");
// setTimeout(2000);
// console.log(formView.status);
// console.log('error' == formView.status);
//
// formView.request("success.json");
// setTimeout(2000);
// console.log('success' == formView.status);
//
// formView.request("progress.json");
// setTimeout(2000);
// console.log('progress' == formView.status);
//
// setTimeout(3000);
// console.log('success' == formView.status);
var MyForm = {
    view: formView,
    form: {
        fio: "",
        email: "",
        phone: ""
    },
    validate: function () {
        fields = [];
        for (var field in this.form) {
            var bValid = !window["moderate" + field.charAt(0).toUpperCase() + field.substr(1)](this.form[field]);
            if (bValid) {
                fields.push(field);
            }
            console.log(field);
            this.view.valid(field, false);
        }
        return {"isValid": fields.length == 0, "errorFields": fields};
    },
    getData: function () {
        return this.form;
    },
    setData: function (data) {
        this.form = data;
    },
    submit: function () {
        // MyForm.validate();
    }
};

MyForm.validate();
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

console.log(moderateFio("i i i"));
console.log(moderateFio(" i i i "));
console.log(moderateFio("Штльц Евгений Сергеевич"));
console.log(!moderateFio(""));
console.log(!moderateFio("i i i i"));
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

console.log('MAIL');
console.log(moderateEmail("ESSch@yandex.ru"));
console.log(moderateEmail("ESSch@sub.yandex.ru"));
console.log(moderateEmail("ё@yandex.ru"));
console.log(!moderateEmail("mail.ya"));
console.log(!moderateEmail(""));
console.log(!moderateEmail("yandex.ru"));

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
console.log("phone");
console.log(moderatePhone("+7(111)111-11-11"));
console.log(!moderatePhone("+7(111)111-11-111"));
console.log(!moderatePhone("+7(333)334-22-33"));
console.log(!moderatePhone("+7(11a)334-22-33"));