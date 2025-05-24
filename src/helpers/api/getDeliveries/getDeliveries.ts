export const getDeliveries = async () => {
    const response = await fetch("https://serverdelivery.onrender.com/api/get-deliveries", {
        credentials: "include"
    })
    if (response.ok) {
        const data = await response.json()
        return data
    }
    throw new Error("Не удалось получить доставки")
}