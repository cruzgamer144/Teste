import { PrismaClient, SourceType } from "@prisma/client";
import { addDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  const brands = ["Nike", "Adidas", "New Balance"];
  const categories = ["ténis", "roupa"];
  const stores = ["LojaA", "LojaB"];

  await prisma.user.upsert({
    where: { email: "admin@launchpulse.app" },
    update: {},
    create: {
      email: "admin@launchpulse.app",
      name: "Admin",
      adminProfile: {
        create: {
          email: "admin@launchpulse.app",
          role: "ADMIN",
        },
      },
    },
  });

  await prisma.source.createMany({
    data: [
      {
        name: "Demo RSS",
        type: SourceType.RSS,
        url: "https://www.nike.com/pt/launch.rss",
        enabled: true,
      },
      {
        name: "Demo API",
        type: SourceType.API,
        url: "https://mock.launchpulse.app/api/releases",
        enabled: true,
      },
    ],
    skipDuplicates: true,
  });

  const products = [
    {
      slug: "nike-air-zoom-demo",
      name: "Nike Air Zoom Demo",
      brand: brands[0],
      category: categories[0],
      price: 189.99,
      currency: "EUR",
      color: "White/Volt",
      sizeRange: "EU 39-46",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      productUrl: "https://lojaa.example.com/nike-air-zoom-demo",
      store: stores[0],
      releaseDate: addDays(new Date(), -1),
      visible: true,
    },
    {
      slug: "adidas-ultraboost-demo",
      name: "Adidas Ultraboost Demo",
      brand: brands[1],
      category: categories[0],
      price: 199.99,
      currency: "EUR",
      color: "Core Black",
      sizeRange: "EU 38-45",
      imageUrl: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80",
      productUrl: "https://lojaa.example.com/adidas-ultraboost-demo",
      store: stores[0],
      releaseDate: addDays(new Date(), -3),
      visible: true,
    },
    {
      slug: "new-balance-574-demo",
      name: "New Balance 574 Demo",
      brand: brands[2],
      category: categories[0],
      price: 129.99,
      currency: "EUR",
      color: "Grey",
      sizeRange: "EU 40-45",
      imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
      productUrl: "https://lojab.example.com/new-balance-574-demo",
      store: stores[1],
      releaseDate: addDays(new Date(), -10),
      visible: true,
    },
    {
      slug: "loja-tech-airpods-demo",
      name: "AirPods Pro 2",
      brand: "Apple",
      category: "tech",
      price: 299.99,
      currency: "EUR",
      color: "Branco",
      sizeRange: "",
      imageUrl: "https://images.unsplash.com/photo-1573920011462-eb3003086611?auto=format&fit=crop&w=800&q=80",
      productUrl: "https://lojab.example.com/airpods-pro-2",
      store: stores[1],
      releaseDate: new Date(),
      visible: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log("Seed concluída");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
