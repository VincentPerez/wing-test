# Wing technical test

This is a [Next.js](https://nextjs.org/) project

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can upload the orders.json file of your choice and see the result.

## Dig deeper

The project doesn't use any typing, database or ORM tool to cut to the essential. We could have used Typescript, MongoDB and Prisma.

This technical test is a way to start working on bin packing problems. In this version I implemented an easy [First-fit-decreasing](https://en.wikipedia.org/wiki/First-fit-decreasing_bin_packing) algorithm. We obtain 691 parcels (5363 € of revenue), without any sorting or optimization we obtain less parcel - 685 (5269 € of revenue).

It would be interesting to know what we want to maximize or minimize. If we want to maximize the revenue, optimizing the parcel number might not be the best thing to do. On the other hand if we want to optimize the parcel count, we should try to implement a better algorithm - refined algorithms tend to have better results at the cost of a bigger computing cost, schematically they keep multiple parcels open and try to optimize the packing in a smarter way than single-class algorithm.

## Deployed on Vercel

You can find it [deployed here](https://wing-test-pi.vercel.app/)
