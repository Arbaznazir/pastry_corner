import type { Product } from '../types';

const IMAGES = {
  biscuits: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80",
  puff: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&q=80",
  teacake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
  namkeen: "https://images.unsplash.com/photo-1605493725880-993d05282420?w=800&q=80",
  eidCake: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
  cheesecake: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
  dessert: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
  donuts: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
  roll: "https://images.unsplash.com/photo-1559553156-2e97137af16f?w=800&q=80",
};

export const products: Product[] = [
  // --- BISCUITS ---
  { id: 101, name: "Peanut Mix", description: "Classic peanut biscuits, baked to golden perfection.", price: 230, category: "biscuits", image: IMAGES.biscuits, popular: true },
  { id: 102, name: "Choco Walnut", description: "Rich chocolate biscuits loaded with premium walnuts.", price: 280, category: "biscuits", image: IMAGES.biscuits },
  { id: 103, name: "Almond Biscuit", description: "Delicate almond biscuits with a buttery finish.", price: 275, category: "biscuits", image: IMAGES.biscuits },
  { id: 104, name: "Short Bread", description: "Traditional buttery shortbread.", price: 310, category: "biscuits", image: IMAGES.biscuits },
  { id: 105, name: "Almond Biscuitti", description: "Crispy biscotti baked with almonds.", price: 260, category: "biscuits", image: IMAGES.biscuits },
  { id: 106, name: "Oats Resin", description: "Healthy oat biscuits with sweet raisins.", price: 320, category: "biscuits", image: IMAGES.biscuits },
  { id: 107, name: "Choco Chips", description: "Classic chocolate chip cookies.", price: 270, category: "biscuits", image: IMAGES.biscuits },
  { id: 108, name: "Pista", description: "Premium pistachio biscuits.", price: 360, category: "biscuits", image: IMAGES.biscuits },
  { id: 109, name: "Mix Dry Fruit", description: "Loaded with an assortment of dry fruits.", price: 360, category: "biscuits", image: IMAGES.biscuits },
  { id: 110, name: "Nut Crunchy", description: "Extra crunchy biscuits mixed with nuts.", price: 310, category: "biscuits", image: IMAGES.biscuits },
  { id: 111, name: "Naan Khatai", description: "Traditional flaky Indian shortbread.", price: 360, category: "biscuits", image: IMAGES.biscuits, popular: true },
  { id: 112, name: "Cangoli", description: "Signature sweet biscuits.", price: 370, category: "biscuits", image: IMAGES.biscuits },
  { id: 113, name: "Coconut Cookies", description: "Crisp cookies baked with desiccated coconut.", price: 370, category: "biscuits", image: IMAGES.biscuits },
  { id: 114, name: "Coconut (Pack of 5)", description: "Convenient pack of 5 coconut cookies.", price: 115, unit: "pack of 5", category: "biscuits", image: IMAGES.biscuits },
  { id: 115, name: "Mithi Kulcha", description: "Sweet, traditional baked kulcha.", price: 10, unit: "piece", category: "biscuits", image: IMAGES.biscuits },
  { id: 116, name: "Kandi Kulcha (Small)", description: "Small traditional kandi kulcha.", price: 30, category: "biscuits", image: IMAGES.biscuits },
  { id: 117, name: "Kandi Kulcha (Large)", description: "Large traditional kandi kulcha.", price: 60, category: "biscuits", image: IMAGES.biscuits },

  // --- COOKIES ---
  { id: 201, name: "Milk Choco Chips", description: "Milk chocolate chips folded into a buttery cookie dough.", price: 235, category: "biscuits", image: IMAGES.biscuits },
  { id: 202, name: "Little Heart", description: "Sweet, heart-shaped sugar cookies.", price: 250, category: "biscuits", image: IMAGES.biscuits, popular: true },
  { id: 203, name: "Milk Coconut", description: "Milk cookies with a twist of coconut.", price: 245, category: "biscuits", image: IMAGES.biscuits },
  { id: 204, name: "Mx Milk Biscuit", description: "Mixed milk biscuits.", price: 345, category: "biscuits", image: IMAGES.biscuits },
  { id: 205, name: "Choco Rocks", description: "Irresistible rocky chocolate cookies.", price: 245, category: "biscuits", image: IMAGES.biscuits },

  // --- PUFF ---
  { id: 301, name: "Jammu Puff", description: "Flaky savory puff pastry.", price: 10, unit: "piece", category: "savory", image: IMAGES.puff },
  { id: 302, name: "Kachoori", description: "Traditional stuffed puff kachori.", price: 10, unit: "piece", category: "savory", image: IMAGES.puff, popular: true },
  { id: 303, name: "Chicken Puff", description: "Golden puff pastry filled with spiced chicken.", price: 40, unit: "piece", category: "savory", image: IMAGES.puff },
  { id: 304, name: "Mutton Puff", description: "Puff pastry stuffed with rich, spiced minced mutton.", price: 50, unit: "piece", category: "savory", image: IMAGES.puff },
  { id: 305, name: "French Hearts", description: "Sweet, flaky, caramelized heart-shaped puff pastry.", price: 270, category: "biscuits", image: IMAGES.puff },
  { id: 306, name: "Butter Puff", description: "Classic, intensely buttery puff layers.", price: 600, unit: "per kg", category: "savory", image: IMAGES.puff },

  // --- SALTED ---
  { id: 401, name: "Assorted Butter Salt", description: "Mixed savory butter biscuits.", price: 285, category: "savory", image: IMAGES.namkeen },
  { id: 402, name: "Summer Kulcha", description: "Savory baked kulcha.", price: 290, category: "savory", image: IMAGES.puff },
  { id: 403, name: "Dry Fruit Kulcha", description: "Rich savory kulcha studded with dry fruits.", price: 340, category: "savory", image: IMAGES.puff, popular: true },
  { id: 404, name: "Special Kulcha", description: "A special traditional baked savory.", price: 20, unit: "piece", category: "savory", image: IMAGES.puff },
  { id: 405, name: "Finni", description: "Traditional sweet/savory strings.", price: 200, unit: "per kg", category: "savory", image: IMAGES.namkeen },
  { id: 406, name: "Katlam", description: "Signature flaky layered pastry.", price: 200, unit: "per kg", category: "savory", image: IMAGES.puff },
  { id: 407, name: "Mattre", description: "Crispy savory bites.", price: 120, category: "savory", image: IMAGES.namkeen },
  { id: 408, name: "Muthi (Pack of 10)", description: "Crispy savory snacks, pack of 10.", price: 110, unit: "pack of 10", category: "savory", image: IMAGES.namkeen },

  // --- TEA CAKES ---
  { id: 501, name: "Plain Cake", description: "Classic plain sponge cake.", price: 60, category: "cakes", image: IMAGES.teacake },
  { id: 502, name: "Butter Cake", description: "Rich, dense buttery cake slice.", price: 120, category: "cakes", image: IMAGES.teacake },
  { id: 503, name: "Walnut Cake", description: "Soft cake loaded with fresh walnuts.", price: 160, category: "cakes", image: IMAGES.teacake, popular: true },
  { id: 504, name: "Almond Cake", description: "Elegant almond-infused cake slice.", price: 160, category: "cakes", image: IMAGES.teacake },
  { id: 505, name: "Chocolate Cake", description: "Decadent chocolate tea cake.", price: 150, category: "cakes", image: IMAGES.teacake },
  { id: 506, name: "Plum Cake", description: "Traditional spiced plum cake.", price: 130, category: "cakes", image: IMAGES.teacake },
  { id: 507, name: "Square Walnut Cake", description: "Large square walnut tea cake.", price: 180, category: "cakes", image: IMAGES.teacake },

  // --- NAMKEEN ---
  { id: 601, name: "Mong Dal (50g)", description: "Crispy moong dal namkeen.", price: 50, unit: "50g", category: "namkeen", image: IMAGES.namkeen },
  { id: 602, name: "Mong Dal (100g)", description: "Crispy moong dal namkeen.", price: 100, unit: "100g", category: "namkeen", image: IMAGES.namkeen },
  { id: 603, name: "Peanut Mixture (50g)", description: "Spiced peanut namkeen mix.", price: 50, unit: "50g", category: "namkeen", image: IMAGES.namkeen },
  { id: 604, name: "Peanut Mixture (100g)", description: "Spiced peanut namkeen mix.", price: 100, unit: "100g", category: "namkeen", image: IMAGES.namkeen },
  { id: 605, name: "Paneer Bhujia (50g)", description: "Signature crispy paneer bhujia.", price: 50, unit: "50g", category: "namkeen", image: IMAGES.namkeen },
  { id: 606, name: "Paneer Bhujia (100g)", description: "Signature crispy paneer bhujia.", price: 100, unit: "100g", category: "namkeen", image: IMAGES.namkeen, popular: true },
  { id: 607, name: "Gatiya (50g)", description: "Traditional crunchy gatiya.", price: 50, unit: "50g", category: "namkeen", image: IMAGES.namkeen },
  { id: 608, name: "Gatiya (100g)", description: "Traditional crunchy gatiya.", price: 100, unit: "100g", category: "namkeen", image: IMAGES.namkeen },
  { id: 609, name: "Kabul Chana", description: "Spiced roasted chickpeas.", price: 50, category: "namkeen", image: IMAGES.namkeen },
  { id: 610, name: "Namak Para", description: "Classic crisp savory diamonds.", price: 150, category: "namkeen", image: IMAGES.namkeen },
  { id: 611, name: "Kaju", description: "Premium roasted cashew nuts.", price: 150, category: "namkeen", image: IMAGES.namkeen },

  // --- EID MENU: CAKES ---
  { id: 701, name: "Fresh Fruit Cake", description: "Light sponge topped with abundant fresh fruits.", price: 750, unit: "pound", category: "eid", image: IMAGES.eidCake, isEidSpecial: true, popular: true },
  { id: 702, name: "Red Velvet Cake", description: "Striking red velvet layers with cream cheese frosting.", price: 700, unit: "pound", category: "eid", image: IMAGES.eidCake, isEidSpecial: true },
  { id: 703, name: "Chocolate Mousse Cake (1 lb)", description: "Luxurious airy chocolate mousse over a tender crumb.", price: 650, unit: "pound", category: "eid", image: IMAGES.eidCake, isEidSpecial: true },
  { id: 704, name: "Chocolate Mousse Cake (2 lb)", description: "Luxurious airy chocolate mousse over a tender crumb.", price: 1500, unit: "2 pounds", category: "eid", image: IMAGES.eidCake, isEidSpecial: true },
  { id: 705, name: "Blueberry Cake (2 lb)", description: "Premium cake infused and topped with fresh blueberries.", price: 1500, unit: "2 pounds", category: "eid", image: IMAGES.eidCake, isEidSpecial: true },
  
  // --- EID MENU: CHEESE PASTRY ---
  { id: 711, name: "Biscoff Cheese Pastry", description: "Creamy cheesecake topped with Biscoff spread and crumble.", price: 180, category: "eid", image: IMAGES.cheesecake, isEidSpecial: true, popular: true },
  { id: 712, name: "Blueberry Cheese Pastry", description: "Rich cheesecake swirled with blueberry compote.", price: 180, category: "eid", image: IMAGES.cheesecake, isEidSpecial: true },
  { id: 713, name: "Strawberry Cheese Pastry", description: "Classic cheesecake featuring fresh strawberry glacé.", price: 180, category: "eid", image: IMAGES.cheesecake, isEidSpecial: true },
  { id: 714, name: "Mango Cheese Pastry", description: "Tropical mango infused creamy cheesecake.", price: 180, category: "eid", image: IMAGES.cheesecake, isEidSpecial: true },

  // --- EID MENU: SWISS ROLL ---
  { id: 721, name: "Strawberry Swiss Roll", description: "Delicate sponge rolled with fresh cream and strawberry jam.", price: 180, category: "eid", image: IMAGES.roll, isEidSpecial: true },

  // --- EID MENU: DESSERTS ---
  { id: 731, name: "Walnut Fudge", description: "Dense, intensely chocolaty fudge with walnuts.", price: 100, category: "eid", image: IMAGES.dessert, isEidSpecial: true },
  { id: 732, name: "Walnut Brownie", description: "Fudgy, gooey brownie studded with roasted walnuts.", price: 110, category: "eid", image: IMAGES.dessert, isEidSpecial: true, popular: true },
  { id: 733, name: "Red Velvet Jar", description: "Layered red velvet cake and cream in a beautiful glass jar.", price: 150, category: "eid", image: IMAGES.dessert, isEidSpecial: true },
  { id: 734, name: "Choco Mousse Jar", description: "Airy chocolate mousse layered in a convenient jar.", price: 150, category: "eid", image: IMAGES.dessert, isEidSpecial: true },
  { id: 735, name: "Red Velvet Cup Cake", description: "Classic red velvet miniature cake.", price: 90, category: "eid", image: IMAGES.dessert, isEidSpecial: true },
  { id: 736, name: "Chocolate Cup Cake", description: "Rich chocolate miniature cake.", price: 90, category: "eid", image: IMAGES.dessert, isEidSpecial: true },

  // --- EID MENU: PASTRY ---
  { id: 741, name: "Fresh Fruit Pastry", description: "Elegant pastry slice topped with seasonal fruits.", price: 130, category: "eid", image: IMAGES.dessert, isEidSpecial: true },
  { id: 742, name: "Red Velvet Pastry", description: "Lush red velvet pastry slice.", price: 120, category: "eid", image: IMAGES.dessert, isEidSpecial: true },
  { id: 743, name: "Choco Mousse Pastry", description: "Decadent chocolate mousse layered pastry.", price: 110, category: "eid", image: IMAGES.dessert, isEidSpecial: true },
  { id: 744, name: "Blueberry Pastry", description: "Fresh blueberry infused soft pastry.", price: 150, category: "eid", image: IMAGES.dessert, isEidSpecial: true },
  { id: 745, name: "Butterscotch Pastry", description: "Caramelized butterscotch pastry with a crunch.", price: 150, category: "eid", image: IMAGES.dessert, isEidSpecial: true },

  // --- EID MENU: CREAM ROLLS ---
  { id: 751, name: "Chocolate Cream Roll", description: "Flaky horn pastry filled with rich chocolate whipped cream.", price: 50, category: "eid", image: IMAGES.roll, isEidSpecial: true },
  { id: 752, name: "Vanilla Cream Roll", description: "Flaky horn pastry filled with classic vanilla sweet cream.", price: 30, category: "eid", image: IMAGES.roll, isEidSpecial: true },

  // --- EID MENU: DONUTS ---
  { id: 761, name: "Chocolate Donut", description: "Soft, pillowy donut glazed in rich chocolate.", price: 80, category: "eid", image: IMAGES.donuts, isEidSpecial: true, popular: true },
  { id: 762, name: "Vanilla Donut", description: "Classic donut with a sweet vanilla glaze.", price: 80, category: "eid", image: IMAGES.donuts, isEidSpecial: true },
];