import "isomorphic-fetch";
import {computeParcels} from "./route";

describe("/api/parcel", () => {
    it("compute parcels for one order", async () => {
        const {parcels} = await computeParcels([
            {
                id: "5bb61dfd3741808151aa413b",
                date: "Wed Aug 15 2018 13:57:04 GMT+0000 (UTC)",
                items: [
                    {
                        item_id: "5bb619e49593e5d3cbaa0b52", // weight 1.5
                        quantity: 4,
                    },
                    {
                        item_id: "5bb619e49593e5d3cbaa0b52", // weight 1.5
                        quantity: 1,
                    },
                    {
                        item_id: "5bb619e49593e5d3cbaa0b52", // weight 1.5
                        quantity: 2,
                    },
                    {
                        item_id: "5bb619e40fee29e3aaf09759", // weight 18.4
                        quantity: 4,
                    },
                    {
                        item_id: "5bb619e4ebdccb9218aa9dcb", // weight 8.4
                        quantity: 1,
                    },
                    {
                        item_id: "5bb619e4504f248e1be543d3", // weight 5.9
                        quantity: 3,
                    },
                ],
            },
        ]);

        const totalWeight =
            Math.round(
                parcels.reduce((memo, parcel) => {
                    return memo + parcel.weight;
                }, 0) * 10,
            ) / 10; // 1.5 * 7 + 18.4 * 4 + 8.4 + 5.9 * 3 = 110.2

        expect(parcels).toHaveLength(5);
        expect(totalWeight).toBe(110.2);
    });

    it("compute parcels for multiple order", async () => {
        const {parcels} = await computeParcels([
            {
                id: "5bb61dfd3741808151aa413b",
                date: "Wed Aug 15 2018 13:57:04 GMT+0000 (UTC)",
                items: [
                    {
                        item_id: "5bb619e49593e5d3cbaa0b52", // weight 1.5
                        quantity: 4,
                    },
                    {
                        item_id: "5bb619e49593e5d3cbaa0b52", // weight 1.5
                        quantity: 1,
                    },
                    {
                        item_id: "5bb619e49593e5d3cbaa0b52", // weight 1.5
                        quantity: 2,
                    },
                    {
                        item_id: "5bb619e40fee29e3aaf09759", // weight 18.4
                        quantity: 4,
                    },
                    {
                        item_id: "5bb619e4ebdccb9218aa9dcb", // weight 8.4
                        quantity: 1,
                    },
                    {
                        item_id: "5bb619e4504f248e1be543d3", // weight 5.9
                        quantity: 3,
                    },
                ],
            },
            {
                id: "5bb61dfd1c520e317a9b6377",
                date: "Mon Sep 17 2018 04:16:20 GMT+0000 (UTC)",
                items: [
                    {
                        item_id: "5bb619e4504f248e1be543d3", // weight 5.9
                        quantity: 3,
                    },
                    {
                        item_id: "5bb619e40fee29e3aaf09759", // weight 18.4
                        quantity: 3,
                    },
                    {
                        item_id: "5bb619e439d3e99e2e25848d", // weight 22.7
                        quantity: 2,
                    },
                    {
                        item_id: "5bb619e49593e5d3cbaa0b52", // weight 1.5
                        quantity: 1,
                    },
                    {
                        item_id: "5bb619e44251009d72e458b9", // weight 17.9
                        quantity: 2,
                    },
                    {
                        item_id: "5bb619e4911037797edae511", // weight 20.8
                        quantity: 3,
                    },
                    {
                        item_id: "5bb619e40fee29e3aaf09759", // weight 18.4
                        quantity: 3,
                    },
                ],
            },
        ]);

        const totalWeight =
            Math.round(
                parcels.reduce((memo, parcel) => {
                    return memo + parcel.weight;
                }, 0) * 10,
            ) / 10; // 5.9 * 3 + 18.4 * 6 + 1.5 * 1 + 22.7 * 2 + 17.9 * 2 + 20.8 * 3 = 273.2

        expect(parcels).toHaveLength(19);
        expect(parcels[14].palette_number).toBe(1);
        expect(parcels[15].palette_number).toBe(2);
        expect(totalWeight).toBe(110.2 + 273.2);
    });

    it("compute parcel revenue", async () => {
        const order = {
            id: "5bb61dfd3741808151aa413b",
            date: "Wed Aug 15 2018 13:57:04 GMT+0000 (UTC)",
            items: [],
        };
        const item = {
            item_id: "5bb619e49593e5d3cbaa0b52", // weight 1.5
            quantity: 1,
        };
        let {parcels} = await computeParcels([{...order, items: [{...item, quantity: 1}]}]);

        expect(parcels[0].weight).toBe(1.5);
        expect(parcels[0].revenue).toBe(2);

        ({parcels} = await computeParcels([{...order, items: [{...item, quantity: 5}]}]));

        expect(parcels[0].weight).toBe(7.5);
        expect(parcels[0].revenue).toBe(3);

        ({parcels} = await computeParcels([{...order, items: [{...item, quantity: 8}]}]));

        expect(parcels[0].weight).toBe(12);
        expect(parcels[0].revenue).toBe(5);

        ({parcels} = await computeParcels([{...order, items: [{...item, quantity: 19}]}]));

        expect(parcels[0].weight).toBe(28.5);
        expect(parcels[0].revenue).toBe(10);

        ({parcels} = await computeParcels([{...order, items: [{...item, quantity: 21}]}]));

        expect(parcels[0].weight).toBe(30);
        expect(parcels[0].revenue).toBe(10);
        expect(parcels[1].weight).toBe(1.5);
        expect(parcels[1].revenue).toBe(2);
    });
});
