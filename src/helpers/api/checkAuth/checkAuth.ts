export const checkAuth = async () => {
    const response = await fetch("https://serverdelivery.onrender.com/api/check-auth", {
        credentials: "include"
    });
    if (response.ok) {
        const data = await response.json();
        console.log("Вы авторизованы:", data);
        return true
    } else {
        console.log("Пользователь не авторизован");
        return false
    }
}
