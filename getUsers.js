'use strict';
const whitelistedUsers = [
    '338075554937044994', //6vz
    '493119070032363541', //kac
    '395266229436153868', //mat
];
window.onload = () => {
    const lanyardSocket = new WebSocket('wss://tcla.aspy.dev/socket');
    lanyardSocket.onopen = () => {
        lanyardSocket.send(
            JSON.stringify({
                op: 2,
                d: { subscribe_to_ids: whitelistedUsers },
            }),
        );
    };
    lanyardSocket.onmessage = async (message) => {
        const { d } = await JSON.parse(message.data);
        for (const rawUserData of Object.values(d)) {
            const userData = rawUserData?.discord_user;
            if (!userData) continue;
            const UserObject = {
                username: `${userData.username}\n#${userData.discriminator}`,
                status: rawUserData.discord_status,
            };
            lanyardSocket.close();
            if (userData.avatar?.startsWith('a_')) {
                UserObject.avatar = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.gif`;
            } else if (userData.avatar == null) {
                UserObject.avatar = './images/defaultAvatar.webp';
            } else {
                UserObject.avatar = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
            }
            //MAIN USER ELEMENT, SUB ELEMENT OF LIST ELEMENT
            const userElement = document.createElement('div');
            userElement.classList.add('userElement');
            document.getElementById('userList').appendChild(userElement);
            //PFP ELEMENT, SUB-ELEMENT OF USER ELEMENT
            const PFPElement = document.createElement('img');
            PFPElement.classList.add('PFPElement', UserObject.status);
            PFPElement.src = UserObject.avatar;
            userElement.appendChild(PFPElement);
            //USERNAME ELEMENT, SUB-ELEMENT OF USER ELEMENT
            const usernameElement = document.createElement('div');
            usernameElement.classList.add('usernameElement');
            usernameElement.innerText = UserObject.username;
            userElement.appendChild(usernameElement);
        }
    };
};
