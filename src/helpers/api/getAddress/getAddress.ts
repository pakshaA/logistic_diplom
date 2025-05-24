export const getAddress = async (value: string, city: string) => {
    const response = await fetch(`https://serverdelivery.onrender.com/api/address?query=${encodeURIComponent(value)}&city=${encodeURIComponent(city)}`);
    
    if (!response.ok) {
        throw new Error('Ошибка при запросе к серверу');
    }

    const data = await response.json();
    return data;
};
