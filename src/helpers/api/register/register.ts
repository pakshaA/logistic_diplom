export const register = async (user: { email: string; password: string; id: string }) => {
    try {
        const response = await fetch('https://serverdelivery.onrender.com/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(user),
        });

        const status = response.status;

        if (!response.ok) {
            const errorText = await response.text();
            throw { status, message: errorText };
        }

        const data = await response.json();
        return { data, status };

    } catch (err: any) {
        throw {
            status: err?.status || 500,
            message: err?.message || 'Неизвестная ошибка',
        };
    }
};
