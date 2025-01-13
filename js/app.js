if (!localStorage.getItem("user")) {
    window.location.href = "./login.html";
}

const ownAvatar = document.getElementById("ownAvatar");
const circleAvatar = document.getElementById("circleAvatar");
const chatUserAvatar = document.getElementById("chatUserAvatar");
const chatUserName = document.getElementById("chatUserName");
const centerUserName = document.getElementById("centerUserName");
const userInfoName = document.getElementById("userInfoName");
const userInfoBottomName = document.getElementById("userInfoBottomName");
const userTel = document.getElementById("userTel");
const logoutBtn = document.getElementById("logoutBtn");

const loggedInUser = JSON.parse(localStorage.getItem("user"));
const userId = loggedInUser.id;

// Foydalanuvchi ma'lumotlarini yuklash
fetch(`https://6784a0ac1ec630ca33a4f300.mockapi.io/users/${userId}`)
    .then((res) => res.json())
    .then((user) => {
        if (user.avatar) {
            ownAvatar.src = user.avatar;
            userInfoName.textContent = user.username;
            userInfoBottomName.innerHTML = `@${user?.username}`;
            userTel.textContent = user.phoneNum;
        }
    })
    .catch((err) => {
        console.error(err);
    });

// Boshqa foydalanuvchilar ma'lumotlarini yuklash
fetch("https://6784a0ac1ec630ca33a4f300.mockapi.io/users")
    .then((res) => res.json())
    .then((users) => {
        users.forEach((user) => {
            if (user.id !== userId) {
                circleAvatar.src =
                    user.avatar ||
                    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
                chatUserAvatar.src =
                    user.avatar ||
                    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
                chatUserName.textContent = user?.username;
                centerUserName.textContent = user?.username;
            }
        });
    })
    .catch((err) => console.error(err));

// Logout
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    location.reload();
});

const messageForm = document.getElementById("messageForm");
const messageText = document.getElementById("messageText");
const messageBox = document.getElementById("messageBox");

function showMessages() {
    fetch("https://6784a0ac1ec630ca33a4f300.mockapi.io/message")
        .then((res) => res.json())
        .then((messages) => {
            messages.forEach((message) => {
                const messageTime = new Date(message.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h23",
                });

                if (message.userId == userId) {
                    const mess = document.createElement("p");
                    mess.classList.add("ownMessage");
                    mess.innerHTML = `
                        ${message.message}
                        <span class="ownMessageTime">${messageTime}</span>
                    `;
                    messageBox.append(mess);
                } else {
                    const messFriend = document.createElement("p");
                    messFriend.classList.add("otherMessage");
                    messFriend.innerHTML = `
                        ${message.message}
                        <span class="otherMessageTime">${messageTime}</span>
                    `;
                    messageBox.append(messFriend);
                }
            });
        })
        .catch((err) => console.error(err));
};

showMessages();

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const messageValue = messageText.value.trim();

    const userData = {
        userId: userId,
        message: messageValue,
        time: new Date(),
    };

    fetch("https://6784a0ac1ec630ca33a4f300.mockapi.io/message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
        .then((res) => res.json())
        .then((newMessage) => {
            const messageTime = new Date(newMessage.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h23",
            });

            const mess = document.createElement("p");
            mess.classList.add("ownMessage");
            mess.innerHTML = `
                ${newMessage.message}
                <span class="ownMessageTime">${messageTime}</span>
            `;
            messageBox.append(mess);

            messageText.value = "";
        })
        .catch((err) => console.log(err));
});
