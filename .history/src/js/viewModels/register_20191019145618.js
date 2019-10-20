define([
    "knockout",
    "./api",
    "jquery",
    "ojs/ojarraydataprovider",
    "ojs/ojcore",
    "ojs/ojrouter",
    "ojs/ojformlayout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox"
], function(ko, api, $, ArrayDataProvider) {
    function RegisterViewModel() {
        var self = this;
        var router = oj.Router.rootInstance;

        var tracksURL = `${api}/api/track`;

        let stacks = [
         { value: "UI/UX", label: "UI/UX" },
         { value: "Backend", label: "Backend" },
         { value: "Digital Marketing", label: "Digital Marketing" },
         { value: "DevOps", label: "DevOps" },
         { value: "FrontEnd", label: "FrontEnd" }
       ];


        //  Fetch all tracks
        self.fetchTracks = () => {
          return new Promise((resolve, reject) => {
            fetch(`${tracksURL}/all`).then(res => {
              return res.json()
            }).then(({ data }) => {
              resolve(data.data)
            }).catch(err => {
              reject(err)
            });
          })
        };
        
        self.fetchTracks().then(data => {
          console.log(data)
        self.devstack = new ArrayDataProvider(stacks);
          self.devstack = ko.observableArray([]);
          self.devstack = new ArrayDataProvider(data.map(dat => ({ label: dat.track_name, value: dat.id })));
        })

        self.firstname = ko.observable("");
        self.lastname = ko.observable("");
        self.stack = ko.observableArray([]);
        self.location = ko.observable("");

        //account info
        self.username = ko.observable("");
        self.email = ko.observable("");
        self.pass = ko.observable("");
        self.rpass = ko.observable("");

        self.login = function() {
            router.go("login");
        };

        self.connected = function() {
            // Implement if needed
            function validate() {
                var sect = $("#fbk");
                var feedback = function(text, color = "danger") {
                    return `<div class=" mt-3 alert alert-${color} h6 show fb_alert" role="alert">
            <small>${text}</small>
          </div>`;
                };

                var progressbar = function() {
                    return `<div class="progress position-relative mt-3">
          <div class="position-absolute h-100 w-100 progress-bar progress-bar-striped progress-bar-animated bg-info"
            role="progressbar">
            <span class="oj-text-sm font-weight-bold">Processing registration</span>
          </div>
        </div>`;
                };

                let firstname = self.firstname();
                let lastname = self.lastname();
                let email = self.email();
                let username = self.username();
                let password = self.pass();
                let confirm_password = self.rpass();
                let tracks = self.stack().map(function(stack) {
                    return stack.value;
                });

                let location = self.location();

                if (
                    (firstname &&
                        lastname &&
                        email &&
                        username &&
                        // tracks &&
                        location &&
                        password &&
                        confirm_password) !== undefined
                ) {
                    if (!(email.match(/([@])/) && email.match(/([.])/))) {
                        validated = false;
                        sect.html(feedback("Please enter a valid email"));
                    }
                    if (password.length < 4 || confirm_password.length < 4) {
                        validated = false;
                        sect.html(feedback("Password should be minimum 4 characters"));
                    } else {
                        if (password !== confirm_password) {
                            sect.html(feedback("Passwords does not match"));
                            validated = false;
                        }
                    }

                    const data = JSON.stringify({
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        username: username,
                        password: password,
                        confirm_password: confirm_password,
                        tracks: tracks,
                        location: location
                    });

                    console.log(data);
                    sect.html(progressbar());
                    $.post(`https://api.start.ng/api/register`, {
                            firstname,
                            lastname,
                            email,
                            username,
                            password,
                            confirm_password,
                            tracks,
                            location
                        })
                        .done(({ status }) => {
                            if (status == true) {
                                sect.html(
                                    feedback(
                                        "Account created, redirecting to login page...",
                                        "success"
                                    )
                                );
                                setTimeout(function() {
                                    router.go("login");
                                }, 2000);
                            }
                        })
                        .fail(() => {
                            sect.html(
                                feedback(
                                    "Sorry, your registration could not be completed. Your username or email is already registered to an account"
                                )
                            );
                        });
                } else {
                    console.log("wrong");
                    sect.html(feedback("All fields are required"));
                }
            }

            $("#next").click(function() {
                $("#profileinfo").hide();
                $("#accinfo").show();
            });
            $("#prev").click(function() {
                $("#profileinfo").show();
                $("#accinfo").hide();
            });

            self.signup = function() {
                validate();
            };
        };

        // self.connected = function() {
        //   self.fetchTracks();
        // };

        self.disconnected = function() {
            // Implement if needed
        };

        self.transitionCompleted = function() {
            // Implement if needed
        };
    }

    return new RegisterViewModel();
});