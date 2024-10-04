export const msalConfig = {
    auth: {
        clientId: "client ID",  // Replace with your Azure AD App's client ID
        authority: "https://login.microsoftonline.com/redirect URI",  // Replace with your tenant ID
        redirectUri: "http://localhost:3000/", // Replace with your redirect URI
    },
    cache: {
        cacheLocation: "localStorage", // This is important for handling sessions
    },
};

export const loginRequest = {
    scopes: ["User.Read", "OnlineMeetings.ReadWrite", "Calendars.ReadWrite"],
};