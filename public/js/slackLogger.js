function setCookie(cname, cvalue, exdays) {
    sessionStorage.setItem(`${cname}`, `${cvalue}`);
}

function getCookie(cname) {
    if (sessionStorage.getItem(`${cname}`)) {
        return sessionStorage.getItem(`${cname}`);
    } else {
        return false;
    }
}

function pushNotification(loggedUser, loggedEmail, loggedStoreUrl) {

    if (getCookie("loggedIn") && getCookie("loggedIn") != '') {
        // Already logged in user so no need to notify on slack

        let newUser = false;

        if (getCookie("userIn") != loggedUser) {
            newUser = true;
        }

        if (getCookie("emailIn") != loggedEmail) {
            newUser = true;
        }

        if (getCookie("storeIn") != loggedStoreUrl) {
            newUser = true;
        }

        if (newUser) {
            setCookie("userIn", loggedUser, 0.0125);
            setCookie("emailIn", loggedEmail, 0.0125);
            setCookie("storeIn", loggedStoreUrl, 0.0125);
            let SlackData = {
                user: loggedUser,
                email: loggedEmail,
                store: loggedStoreUrl,
                msg: 'User accessed Local Delivery App'
            }

            axios.post('/api/notify/user-online', SlackData).then(function (response) {
                // console.log(response);
            }).catch(function (error) {
                console.log(error);
            });
        }

    } else {

        // Create cookie and send the notification to the slack
        setCookie("loggedIn", 'true', 0.0125);
        setCookie("userIn", loggedUser, 0.0125);
        setCookie("emailIn", loggedEmail, 0.0125);
        setCookie("storeIn", loggedStoreUrl, 0.0125);


        let SlackData = {
            user: '',
            email: '',
            store: '',
            msg: 'User accessed Local Delivery App'
        }

        if (loggedUser) {
            SlackData.user = loggedUser;
        }

        if (loggedEmail) {
            SlackData.email = loggedEmail;
            SlackData.msg = "Someone logged in with email";
        }

        if (loggedStoreUrl) {
            SlackData.store = loggedStoreUrl;
        }


        axios.post('/api/notify/user-online', SlackData).then(function (response) {
            // console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    }
}
