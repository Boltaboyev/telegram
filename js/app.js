if (!localStorage.getItem("user")) {
    window.location.href = "./login.html"
}

const ownAvatar = document.getElementById("ownAvatar")
const circleAvatar = document.getElementById("circleAvatar")
const chatUserAvatar = document.getElementById("chatUserAvatar")
const chatUserName = document.getElementById("chatUserName")
const centerUserName = document.getElementById("centerUserName")
const userInfoName = document.getElementById("userInfoName")
const userInfoBottomName = document.getElementById("userInfoBottomName")
const userTel = document.getElementById("userTel")
const logoutBtn = document.getElementById("logoutBtn")

const loggedInUser = JSON.parse(localStorage.getItem("user"))
const userId = loggedInUser.id

// Info section
fetch(`https://6784a0ac1ec630ca33a4f300.mockapi.io/users/${userId}`)
    .then((res) => res.json())
    .then((user) => {
        if (user.avatar) {
            ownAvatar.src = user.avatar
            userInfoName.textContent = user.username
            userInfoBottomName.innerHTML = `@${user?.username}`
            userTel.textContent = user.phoneNum
        }
    })
    .catch((err) => {
        console.error(err)
    })

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user")
    location.reload()
})

// edit profile info

const editForm = document.getElementById("editForm")
const editAvatarImg = document.getElementById("editAvatarImg")
const editAvatarCurrentImg = document.getElementById("editAvatarCurrentImg")
const editName = document.getElementById("editName")
const editPhone = document.getElementById("editPhone")
const editPassword = document.getElementById("editPassword")

const editPencil = document.getElementById("editBtn")
const editFormDisplay = document.getElementById("editFormDisplay")
const closeEditForm = document.querySelectorAll(".closeEditBtn")

editPencil.addEventListener("click", () => {
    editFormDisplay.style.display = "flex"

    fetch(`https://6784a0ac1ec630ca33a4f300.mockapi.io/users/${userId}`)
        .then((res) => res.json())
        .then((res) => {
            editAvatarCurrentImg.src = res.avatar
            editName.value = res.username
            editPhone.value = res.phoneNum
            editPassword.value = res.password
        })
        .catch((err) => console.log(err))
})

// change src immediately
editAvatarImg.addEventListener("change", () => {
    const file = editAvatarImg.files[0]
    const reader = new FileReader()
    reader.onload = function (event) {
        editAvatarCurrentImg.src = event.target.result
    }
    reader.readAsDataURL(file)
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const file = editAvatarImg.files[0]
    let avatarUrl = editAvatarCurrentImg.src

    if (file) {
        const reader = new FileReader()
        reader.onload = function (event) {
            avatarUrl = event.target.result
            updateUser(avatarUrl)
        }
        reader.readAsDataURL(file)
    } else {
        updateUser(avatarUrl)
    }
})

function updateUser(avatar) {
    fetch(`https://6784a0ac1ec630ca33a4f300.mockapi.io/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            avatar: avatar,
            username: editName.value.trim(),
            password: editPassword.value.trim(),
            phoneNum: editPhone.value.trim(),
        }),
    })
        .then((res) => res.json())
        .then(() => {
            editAvatarCurrentImg.src = avatar
            location.reload()
        })
        .catch((err) => console.log(err))
}

closeEditForm.forEach((el) => {
    el.addEventListener("click", () => {
        editFormDisplay.style.display = "none"
    })
})

// delete avatar img
const showAvatarImg = document.getElementById("showAvatarImg")
const currentAvatarImg = document.getElementById("currentAvatarImg")
const avatarImgDiv = document.getElementById("avatarImgDiv")
const closeAvatarImgDiv = document.getElementById("closeAvatarImgDiv")
const deleteAvatarImgBtn = document.getElementById("deleteAvatarImgBtn")

showAvatarImg.addEventListener("click", () => {
    avatarImgDiv.style.display = "flex"
    fetch(`https://6784a0ac1ec630ca33a4f300.mockapi.io/users/${userId}`)
        .then((res) => res.json())
        .then((res) => {
            currentAvatarImg.src = res.avatar
        })
        .catch((err) => console.log(err))
})

closeAvatarImgDiv.addEventListener("click", () => {
    avatarImgDiv.style.display = "none"
})

deleteAvatarImgBtn.addEventListener("click", () => {
    const defaultAvatarUrl =
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"

    fetch(`https://6784a0ac1ec630ca33a4f300.mockapi.io/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            avatar: defaultAvatarUrl,
        }),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.avatar === defaultAvatarUrl) {
                alert("Avatar successfully deleted")
                currentAvatarImg.src = defaultAvatarUrl
                location.reload()
            }
        })
        .catch((err) => console.log(err))
})

// Add contact

const addContactModal = document.getElementById("addContactModal")
const addContactForm = document.getElementById("addContactForm")
const formContainer = document.getElementById("formContainer")
const addContactModalOpenBtn = document.getElementById("addContactModalOpenBtn")
const searchSkeleton = document.getElementById("searchSkeleton")
const searchResultBox = document.getElementById("searchResultBox")
const searchByPhone = document.getElementById("searchByPhone")

// regex phone num
searchByPhone.addEventListener("input", () => {
    let input = searchByPhone.value.replace(/\D/g, "")

    if (!input.startsWith("998")) {
        input = "998" + input
    }
    input = input.slice(0, 12)

    let formatted = "+998"
    if (input.length > 3) formatted += `(${input.slice(3, 5)}`
    if (input.length > 5) formatted += `)-${input.slice(5, 8)}`
    if (input.length > 8) formatted += `-${input.slice(8, 10)}`
    if (input.length > 10) formatted += `-${input.slice(10, 12)}`

    searchByPhone.value = formatted
})

addContactModalOpenBtn.addEventListener("click", () => {
    addContactModal.style.display = "flex"
})

addContactModal.addEventListener("click", (e) => {
    if (!formContainer.contains(e.target)) {
        addContactModal.style.display = "none"
        addContactForm.reset()
        searchResultBox.innerHTML = ""
    }
})

// search contact fetch
addContactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let searchNumValue = addContactForm.searchByPhone.value.trim()

    fetch("https://6784a0ac1ec630ca33a4f300.mockapi.io/users")
        .then((res) => res.json())
        .then((users) => {
            let filteredUsers = users.find(
                (user) => user.phoneNum === searchNumValue
            )
            if (filteredUsers) {
                if (filteredUsers.phoneNum === loggedInUser.phoneNum) {
                    searchByPhone.value = ""
                    return alert("you can't add yourself !")
                }
                addContactForm.searchByPhone.placeholder = "phone number"
                addContactForm.searchByPhone.style.borderColor = ""
                let numResultDiv = document.createElement("div")
                searchResultBox.id = filteredUsers.id
                numResultDiv.classList.add("newContactUser")
                numResultDiv.innerHTML = `
                    <div class="flex justify-between items-center w-full bg-[#2b5278] p-[10px] rounded-md cursor-pointer">
                        <img src="${filteredUsers.avatar}" alt="" class="h-[60px] w-[60px] rounded-full object-cover border">
                        <div class="flex flex-col justify-center items-end font-[500] text-white">
                            <p>${filteredUsers?.username}</p>
                            <p>${filteredUsers?.phoneNum}</p>
                        </div>
                    </div>
                `
                searchSkeleton.style.display = "flex"

                setTimeout(() => {
                    searchResultBox.innerHTML = ""
                    searchSkeleton.style.display = "none"
                    searchResultBox.append(numResultDiv)
                }, 2000)
            } else {
                addContactForm.searchByPhone.style.borderColor = "red"
                addContactForm.searchByPhone.value = ""
                addContactForm.searchByPhone.placeholder = "user not found"
                searchResultBox.innerHTML = ""
            }

            searchResultBox.addEventListener("click", (e) => {
                localStorage.setItem("foundUser", JSON.stringify(filteredUsers))
                const foundUser = JSON.parse(localStorage.getItem("foundUser"))

                fetch(
                    `https://6784a0ac1ec630ca33a4f300.mockapi.io/users/${userId}`
                )
                    .then((res) => res.json())
                    .then((loggedInUser) => {
                        const updatedContacts = Array.isArray(
                            loggedInUser.contacts
                        )
                            ? loggedInUser.contacts
                            : []

                        updatedContacts.push(foundUser)

                        return fetch(
                            `https://6784a0ac1ec630ca33a4f300.mockapi.io/users/${userId}`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    contacts: updatedContacts,
                                }),
                            }
                        )
                    })
                    .then(() => {
                        updateSidebarUsers()
                    })
                    .catch((err) => console.log(err))
            })
        })

        .catch((err) => console.log(err))
})

// sidebar users
function updateSidebarUsers() {
    const sidebarUsers = document.getElementById("sidebarUsers")

    fetch(`https://6784a0ac1ec630ca33a4f300.mockapi.io/users/${userId}`)
        .then((res) => res.json())
        .then((loggedInUser) => {
            sidebarUsers.innerHTML = ""

            const contacts = loggedInUser.contacts || []

            contacts.forEach((contact) => {
                const leftUserDiv = document.createElement("div")
                leftUserDiv.classList.add("leftUserDiv")
                leftUserDiv.id = contact.id
                leftUserDiv.innerHTML = `
                    <div class="flex flex-no-wrap items-center pr-3 rounded-lg cursor-pointer mt-200 bg-[#172e46] py-65 hover:bg-[#2b5278]"
                        style="padding-top: 0.65rem; padding-bottom: 0.65rem">
                        <div class="flex justify-between w-full">
                            <div class="relative flex items-center justify-center w-12 h-12 ml-2 mr-3 rounded-full">
                                <img class="object-cover w-12 h-12 rounded-full" src="${contact.avatar}" alt=""/>
                                <div class="absolute bottom-0 right-0 flex items-center justify-center bg-white rounded-full"
                                    style="width: 0.80rem; height: 0.80rem">
                                    <div class="bg-green-500 rounded-full w-[0.6rem] h-[0.6rem]"></div>
                                </div>
                            </div>
                            <div class="items-center flex justify-between flex-1">
                                <div class="flex flex-col gap-0">
                                    <div class="flex justify-between items-center mb-1">
                                        <h2 class="text-sm font-semibold text-white" id="chatUserName">${contact.username}</h2>
                                    </div>
                                    <div class="flex text-[#cfcfcf] justify-between text-sm leading-none truncate">
                                        <span>Send message</span>
                                    </div>
                                </div>
                                <div class="flex justify-center items-center gap-[10px]">
                                    <i class='bx bx-check-double text-[20px] text-white'></i>
                                    <button class="deleteContactBtn text-red-500"><i class="bx bx-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                `
                sidebarUsers.append(leftUserDiv)

                const deleteContactBtn =
                    leftUserDiv.querySelector(".deleteContactBtn")
                deleteContactBtn.addEventListener("click", (e) => {
                    showPopup(contact.id)
                })
            })

            function showPopup(contactId) {
                const popup = document.createElement("div")
                popup.classList.add("deleteContactPopup")
                popup.innerHTML = `
                    <div class="popupContent flex flex-col gap-[15px] bg-[#2b5278] p-[20px] rounded-lg">
                        <p class="text-white font-medium text-[17px]">Are you sure to delete this contact?</p>
                        <div class="grid grid-cols-2 gap-[20px]">
                            <button id="confirmDelete" class="popupBtn text-red-500 bg-white p-[5px] rounded-md font-medium">Yes</button>
                            <button id="cancelDelete" class="popupBtn text-green-500 bg-white p-[5px] rounded-md font-medium">No</button>
                        </div> 
                    </div>
                `

                document.body.append(popup)

                document
                    .getElementById("cancelDelete")
                    .addEventListener("click", () => {
                        document.body.removeChild(popup)
                    })

                document
                    .getElementById("confirmDelete")
                    .addEventListener("click", () => {
                        deleteContact(contactId)
                        document.body.removeChild(popup)
                    })
            }

            function deleteContact(contactId) {
                fetch(
                    `https://6784a0ac1ec630ca33a4f300.mockapi.io/users/${userId}`,
                    {
                        method: "GET",
                    }
                )
                    .then((res) => res.json())
                    .then((userData) => {
                        const updatedContacts = userData.contacts.filter(
                            (contact) => contact.id !== contactId
                        )

                        fetch(
                            `https://6784a0ac1ec630ca33a4f300.mockapi.io/users/${userId}`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    contacts: updatedContacts,
                                }),
                            }
                        )
                            .then(() => {
                                updateSidebarUsers()
                            })
                            .catch((err) =>
                                console.log("Error updating contacts:", err)
                            )
                    })
                    .catch((err) =>
                        console.log("Error fetching user data:", err)
                    )
            }

            const leftUserBox = document.querySelectorAll(".leftUserDiv")
            leftUserBox.forEach((userDiv) => {
                userDiv.addEventListener("click", (e) => {
                    const clickedUserId = e.currentTarget.id
                    const clickedUser = loggedInUser.contacts.find(
                        (user) => user.id === clickedUserId
                    )

                    const chatBox = document.getElementById("chatBox")

                    let newChatDiv = document.createElement("div")
                    newChatDiv.classList.add("newChatDiv")
                    newChatDiv.innerHTML = `
                        <div id="deleteBtnDiv" class="z-[999999] w-auto h-[64px] fixed top-[-100%] right-0 bg-[#17212b] flex justify-start items-center p-[20px]">
                            <button id="deleteBtn" class="deleteBtn text-[#fff] bg-[#2b5278] flex justify-center items-center gap-[4px] p-[8px_17px] rounded-md font-[600] ">
                                Delete <i class="bx bx-trash"></i>
                            </button>
                        </div>
                        <div class="z-20 relative flex justify-between items-center w-full p-3 bg-[#17212b] border-b border-[#00000065]">
                            <div class="flex justify-start items-center gap-[10px]">
                                <div class="w-[40px] h-[40px] overflow-hidden rounded-full cursor-pointer">
                                    <img id="circleAvatar" src="${clickedUser.avatar}" alt=""/>
                                </div>
                                <div class="flex flex-col justify-center flex-1 overflow-hidden cursor-pointer">
                                    <h1 class="overflow-hidden text-base font-medium leading-tight text-white whitespace-no-wrap">${clickedUser.username}</h1>
                                    <p id="typing" class="text-[12px] leading-tight text-green-500">online</p>
                                </div>
                            </div>
                            <div class="flex justify-center items-center gap-[20px]">
                                <i class="bx bx-search text-[20px] text-white cursor-pointer"></i>
                                <i class='bx bx-dots-vertical-rounded text-[20px] text-white cursor-pointer'></i>
                            </div>
                        </div>
                        <div id="messageBox" class="bg-[#0e1621] h-full flex relative flex-col overflow-x-hidden overflow-y-scroll pb-[100px]"></div>
                        <form id="messageForm" class="absolute bg-[#17212b] bottom-0 bg-gray-200x flex items-center w-full p-2">
                            <input id="messageText" type="text" required class="w-full py-2 px-[10px] pr-[50px] text-sm bg-transparent placeholder-gray-500 text-white" style="border-radius: 25px" placeholder="Write a message...">
                            <span class="absolute inset-y-0 right-0 flex items-center pr-6">
                                <button type="submit" class="text-[#2b5278] hover:text-[#3463aa]">
                                    <i class='bx bxs-send text-[25px]'></i>
                                </button>
                            </span>
                        </form>
                    `
                    chatBox.innerHTML = ""
                    chatBox.append(newChatDiv)

                    const messageForm = document.getElementById("messageForm")
                    const messageText = document.getElementById("messageText")
                    const typing = document.getElementById("typing")

                    let typingTimeout
                    messageText.addEventListener("keyup", () => {
                        typing.textContent = "typing..."
                        clearTimeout(typingTimeout)
                        typingTimeout = setTimeout(() => {
                            typing.textContent = "online"
                        }, 1000)
                    })

                    messageForm.addEventListener("submit", (e) => {
                        e.preventDefault()
                        const currentTime = new Date()
                        const newMessage = {
                            message: messageText.value.trim(),
                            senderId: userId,
                            receiverId: clickedUserId,
                            time: currentTime.toISOString(),
                        }

                        fetch(
                            `https://6784a0ac1ec630ca33a4f300.mockapi.io/message`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(newMessage),
                            }
                        )
                            .then((res) => res.json())
                            .then(() => {
                                messageText.value = ""
                                showMessages()
                            })
                    })

                    function showMessages() {
                        messageBox.innerHTML = ""
                        fetch(
                            "https://6784a0ac1ec630ca33a4f300.mockapi.io/message"
                        )
                            .then((res) => res.json())
                            .then((messages) => {
                                const filteredMessages = messages.filter(
                                    (e) =>
                                        (e.senderId == userId &&
                                            e.receiverId == clickedUserId) ||
                                        (e.senderId == clickedUserId &&
                                            e.receiverId == userId)
                                )

                                filteredMessages.forEach((message) => {
                                    const messageTimeFormat = new Date(
                                        message.time
                                    ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hourCycle: "h23",
                                    })

                                    const messageP = document.createElement("p")
                                    messageP.classList.add(
                                        message.senderId == clickedUserId
                                            ? "otherMessage"
                                            : "ownMessage"
                                    )
                                    messageP.id = message.id

                                    messageP.innerHTML = `
                    ${message.message}
                    <span class="${
                        message.senderId == clickedUserId
                            ? "ownMessageTime"
                            : "otherMessageTime"
                    }">${messageTimeFormat}</span>
                `
                                    messageBox.append(messageP)
                                    let deleteBtnDiv =
                                        document.getElementById("deleteBtnDiv")
                                    messageP.addEventListener(
                                        "dblclick",
                                        () => {
                                            messageP.classList.toggle(
                                                "deleteMessageBg"
                                            )
                                            deleteBtnDiv.classList.add(
                                                "showBtn"
                                            )

                                            const selectedMessages =
                                                document.querySelectorAll(
                                                    ".deleteMessageBg"
                                                )

                                            deleteBtnDiv.addEventListener(
                                                "click",
                                                () => {
                                                    selectedMessages.forEach(
                                                        (selectedMessage) => {
                                                            const messageId =
                                                                selectedMessage.id

                                                            fetch(
                                                                `https://6784a0ac1ec630ca33a4f300.mockapi.io/message/${messageId}`,
                                                                {
                                                                    method: "DELETE",
                                                                }
                                                            )
                                                                .then(() =>
                                                                    selectedMessage.remove()
                                                                )
                                                                .catch((err) =>
                                                                    console.log(
                                                                        "Error deleting message:",
                                                                        err
                                                                    )
                                                                )
                                                        }
                                                    )

                                                    deleteBtnDiv.classList.remove(
                                                        "showBtn"
                                                    )
                                                }
                                            )
                                        }
                                    )
                                })
                            })
                            .catch((err) =>
                                console.log("Error fetching messages:", err)
                            )
                    }

                    showMessages()
                })
            })
        })
        .catch((err) => console.log(err))
}

updateSidebarUsers()
