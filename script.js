// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, get, ref } from "firebase/database";
const firebaseConfig = {
    apiKey: "AIzaSyB9g4lTKg_M0PrEwJCY7PRNrCs8w1S_mDY",
    authDomain: "mindspark23-results-dashboard.firebaseapp.com",
    databaseURL:
        "https://mindspark23-results-dashboard-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mindspark23-results-dashboard",
    storageBucket: "mindspark23-results-dashboard.appspot.com",
    messagingSenderId: "640466735442",
    appId: "1:640466735442:web:55de46095465b9a38bea8b",
    measurementId: "G-EG67F6D5NF",
};
const fb = initializeApp(firebaseConfig);
const analytics = getAnalytics(fb);
analytics.app.automaticDataCollectionEnabled = true;
const db = getDatabase(fb);

get(ref(db, "/result"))
    .then((snapshot) => {
        if (snapshot.exists()) {
            let arr = [];
            snapshot.val().forEach((m) => {
                m.result.forEach((e) => {
                    let obj = {};
                    obj.name = m.mname + " - " + e.ename;
                    obj.result = e.winners;
                    arr.push(obj);
                });
            });

            var app = {
                data: arr,
                html: {
                    searchbar: document.querySelector(".search input"),
                    display: document.querySelector(".display"),
                },
                init: function () {
                    app.render();
                    app.html.searchbar.addEventListener("keyup", function () {
                        app.search(this.value);
                    });
                },
                render: function () {
                    app.html.display.innerHTML = "";
                    app.data.forEach((item) => {
                        app.html.display.innerHTML += `
                         <div class="event">
                            <div class="title" style="color:white;">${item.name}</div> 
                         </div>
                      `;
                    });
                    app.html.items = document.querySelectorAll(".event");
                },
                search: function (term) {
                    app.data.forEach(function (item, index) {
                        var html = app.html.items[index];
                        html.classList.remove("show");
                        if (
                            item.name
                                .toLowerCase()
                                .indexOf(term.toLowerCase()) == -1
                        ) {
                            html.classList.add("hide");
                        } else {
                            if (html.classList.contains("hide")) {
                                html.classList.remove("hide");
                                html.classList.add("show");
                            }
                        }
                    });
                },
            };
            app.init();

            let q = app.html.display.querySelectorAll(".title");
            q.forEach((e) => {
                e.addEventListener("click", function (ev) {
                    let event = ev.target.innerHTML;
                    const item = app.data.find((item) => item.name === event);
                    let modalBody = document.createElement("div");
                    console.log(item);
                    item.result.forEach((e) => {
                        let result = document.createElement("p");
                        result.innerHTML = e;
                        modalBody.appendChild(result);
                    });
                    let modal = document.createElement("div");
                    modal.classList.add("modal");
                    modal.setAttribute("tabindex", "-1");
                    modal.innerHTML = `
                  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title fs-2">${event}</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      ${modalBody.outerHTML}
                    </div>
                  </div>
                </div>
              `;
                    document.body.appendChild(modal);
                    modal.style.display = "block";
                    modal.style.backdropFilter = "blur(4px)";
                    modal.querySelector(".modal-content").style.background =
                        "#b6b7ff";
                    modal
                        .querySelector(".btn-close")
                        .addEventListener("click", function () {
                            document.body.removeChild(modal);
                        });
                });
            });
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });
