export function validateEmail(email) {
        const re = /([0-9a-zA-Z]+[-._+&])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}/;
        return re.test(String(email).toLocaleLowerCase());
}
