function haversineDistance(coord1: [number, number], coord2: [number, number]): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
  
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
  
    const R = 6371; // Радиус Земли в километрах
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c;
  }
  
  async function getDistanceByAir(from: string, to: string): Promise<number> {
    const fromCoord = await getCoordinates(from);
    const toCoord = await getCoordinates(to);
  
    return haversineDistance(fromCoord, toCoord);
  }
  
  async function getCoordinates(cityName: string): Promise<[number, number]> {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`);
    const data = await response.json();
    if (data.length === 0) throw new Error(`Город "${cityName}" не найден`);
    return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
  }
  
  export default getDistanceByAir;
  

  interface PackageState {
    package: {
      width: string;
      height: string;
      length: string;
      weight: string;
      id: string
    };
    isGoods: boolean;
    typeOfGoods: string;
  }

export const getPrice = async (distance: number, packageInfo: PackageState) => {
    const p = packageInfo
    const d = distance
    const PRICE_PER_KM = 0.4
    const PRICE_PER_KM_GOODS = 0.6
    const prices: Record<string, number> = {
      'envelope': 100,
      'box_xs': 200,
      'box_s': 300,
      'box_m': 400,
      'box_l': 500,
      'box_xl': 600,
      'suitcase': 700,
      'pallet': 800,
      'custom': 900
    }
    const PRICES: Record<string, number> = {
      'perishable': 1500,
      'frozen': 400,
      'non_perishable': 300,
      'fresh': 500,
      'bakery': 2000
    };
    
    if (!p.isGoods) {
        return d * PRICE_PER_KM + prices[p.package.id];
    }

    return d * PRICE_PER_KM_GOODS + PRICES[p.typeOfGoods]
}

export const price = async (selectedCityFrom: string, selectedCityTo: string, packageInfo: PackageState) => {
    const distance = await getDistanceByAir(selectedCityFrom, selectedCityTo)
    const price = await getPrice(distance, packageInfo)
    
    return Math.floor(price) as number
}