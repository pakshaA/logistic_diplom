export const getDeliveriesById = async (id: string) => {
    const response = await fetch(`https://serverdelivery.onrender.com/api/get-delivery-by-id/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    })
    if (response.ok) {
        const data = await response.json()
        return data
    }
    throw new Error("Не удалось получить доставку")
}