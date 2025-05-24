export const login = async (credentials: { email: string; password: string }) => {
    const response = await fetch("https://serverdelivery.onrender.com/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
    });

    const data = await response.json();
    const status = response.status;

    if (!response.ok) {
        throw { status, message: data.message || "Ошибка при входе" };
    }

    return { status, data };
};
