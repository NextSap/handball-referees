import ky from "ky";

export const bigcaptain = ky.extend({
    hooks: {
        beforeRequest: [
            request => {
                request.headers.set("Authorization", `WP_Access eyJpdiI6Ikdoa0VQMkpMdkFQRUFpU0VkRXlTXC9BPT0iLCJ2YWx1ZSI6IktEMG9KRTMxRjMxMlJnKys2RSszV0FQbGxBU0pjZ2l4YnFlWGF4U00wQzRxbVFEcTJyTkVsaFwvcmxDZkVEYWZKIiwibWFjIjoiODg1YjgzMjY4ZmU2MDdhNGFlNmRmNGU4NWQxNTQwMDY2YmU2ZjU2MjY2YzRjZTA1MWRlNTU5NDIwZDQxYmNmMyJ9`);
            }]
    }, timeout: false,
});

export const shl = (token: string) => ky.extend({
    hooks: {
        beforeRequest: [
            request => {
                request.headers.set("Authorization", `Bearer ${token}`);
                request.headers.set("User-Agent", "sportlink-app-nhv/6.21.0-13955 ios iPhone/apple/18.1.1 9c5751067aa28f141f4bbd5e866bc123eaa06f8271fed95796de01ee9cb8b448 (6.21.0)")
            }]
    }, timeout: false,
});