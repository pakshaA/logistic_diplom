export interface DeliveryPayload {
    sender: {
      city: string;
      address: string;
      phone: string;
    };
    receiver: {
      city: string;
      address: string;
      phone: string;
    };
    packageInfo: {
      package: {
        width: string;
        height: string;
        length: string;
        weight: string;
        id: string;
      };
      isGoods: boolean;
      typeOfGoods: string;
    };
  }
  
  export const createDelivery = async (data: DeliveryPayload) => {

    const response = await fetch('https://serverdelivery.onrender.com/api/create-delivery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка при создании доставки: ${errorText}`);
    }
  
    const result = await response.json();
    return result;
  };
  