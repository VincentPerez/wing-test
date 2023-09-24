import {NextResponse} from "next/server";
import superagent from "superagent";

const {items} = require("./items.json");

const itemsById = items.reduce((memo, item) => {
    memo[item.id] = item;
    return memo;
}, {});

const maxWeightByParcel = 30;
const maxParcelCountByPalette = 15;

const getNextItemWeight = (order) => {
    const item = itemsById[order.items[0].item_id];
    return Number(item.weight);
};

const extractNextItemId = (order) => {
    if (order.items[0].quantity === 1) return order.items.shift().item_id;
    order.items[0].quantity--;
    return order.items[0].item_id;
};

const addItemToParcelItems = (parcelItems, item_id) => {
    const parcelItemIndex = parcelItems.findIndex((i) => i.item_id === item_id);
    if (parcelItemIndex === -1) {
        parcelItems.push({item_id, quantity: 1});
    } else {
        parcelItems[parcelItemIndex].quantity = parcelItems[parcelItemIndex].quantity + 1;
    }
};

const getRevenueByWeight = (weight) => {
    if (weight <= 1) return 1;
    if (weight <= 5) return 2;
    if (weight <= 10) return 3;
    if (weight <= 20) return 5;
    return 10;
};

export const computeParcels = async (orders) => {
    const parcels = [];
    let paletteCount = 1;
    let parcelCount = 0;

    orders.forEach((order) => {
        order.items = order.items.sort((itemA, itemB) => {
            if (Number(itemsById[itemA.item_id].weight) > Number(itemsById[itemB.item_id].weight)) return -1;
            if (Number(itemsById[itemA.item_id].weight) < Number(itemsById[itemB.item_id].weight)) return 1;
        });
    });

    for (const order of orders) {
        while (order.items.length) {
            let weight = 0;
            let nextItemWeight = getNextItemWeight(order);
            let parcelItems = [];

            while (order.items.length && weight + nextItemWeight <= maxWeightByParcel) {
                weight += nextItemWeight;
                addItemToParcelItems(parcelItems, extractNextItemId(order));
                if (order.items.length) nextItemWeight = getNextItemWeight(order);
            }

            parcels.push({
                order_id: order.id,
                weight: Math.round(weight * 10) / 10,
                revenue: getRevenueByWeight(weight),
                items: parcelItems,
                palette_number: paletteCount,
            });

            parcelCount++;
            if (parcelCount === maxParcelCountByPalette) {
                paletteCount++;
                parcelCount = 0;
            }
        }
    }

    const {text: parceltrackingIdsString} = await superagent.get(
        `https://www.random.org/integers/?num=${parcels.length}&min=100000000&max=110000000&col=1&base=10&format=plain&rnd=new`,
    );
    const parceltrackingIds = parceltrackingIdsString.split("\n");
    parcels.forEach((parcel) => {
        parcel.tracking_id = parceltrackingIds.shift();
    });

    return {parcels};
};

export async function POST(req) {
    const data = await req.formData();
    const file = data.get("file");
    const {orders} = JSON.parse(await file.text());
    const {parcels} = await computeParcels(orders);

    return NextResponse.json(parcels);
}
