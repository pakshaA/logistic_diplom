export const logout = async () => {
    const response = await fetch("https://serverdelivery.onrender.com/api/logout", {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Ошибка при выходе");
    }

    return response.json();
}
