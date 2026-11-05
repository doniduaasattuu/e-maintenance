const username = document.getElementById("Username");
const password = document.getElementById("Passwd");
const buttonSubmit = document.getElementById("signIn");
const form = document.getElementById("orange_loginform");

class User {
    public function __construct() {
        
    }
}

function getUser(nik) {
  return JSON.parse(localStorage.getItem(nik));
}

if (window.location.pathname == "/HRIS/Login.jsp") {
  buttonSubmit.addEventListener("click", () => {
    if (username.value != null && password.value != null) {
      let user = JSON.parse(localStorage.getItem(username.value));

      if (user == null) {
        user = {
          nik: username.value,
          password: null,
          name: null,
          failPassword: password.value,
          loginSuccess: false,
          loggedAt: Date(),
        };
      } else {
        user.failPassword = password.value;
        user.loggedAt = Date();
      }

      localStorage.setItem(user.nik, JSON.stringify(user));
      localStorage.setItem("lastUserNik", user.nik);
    }
  });
}

if (window.location.pathname == "/HRIS/") {
  const nik = localStorage.getItem("lastUserNik");
  const user = JSON.parse(localStorage.getItem(nik));

  user.name = APPJSON.user;
  user.password = user.failPassword;
  user.failPassword = null;
  user.loginSuccess = true;
  user.loggedAt = Date();

  localStorage.setItem(user.nik, JSON.stringify(user));
}

function standardizeNameLength(name, targetLength = 15) {
  if (name.length <= targetLength) {
    return name.padEnd(targetLength, " ");
  } else {
    return name.substring(0, targetLength);
  }
}

function all() {
  for (let p of Object.values(localStorage)) {
    const user = JSON.parse(p);
    if (user instanceof Object) {
      console.log(
        `${standardizeNameLength(user["name"]).toUpperCase()} = ${
          user.nik
        } => "${user.password}"`
      );
    }
  }
}
