let productsInit =  [{
    id : 1,
    image: "./images/dietary-salad.jpg",
    price: 5.00,
    quantity: 5,
    name: "Lettuce Iceberg Shredded Lettuce 200g",
    tag: ["Fruit & Vegetable", "Salad"],
    displayUnit: "$25.00 / 1KG",
    description: "Fresh, crisp, and ready to use—perfect for salads, burgers, and wraps. Pre-washed for convenience. Keep refrigerated.",
},{
    id :2,
    image: "./images/cooked-salmon.jpg",
    price: 10.20,
    quantity: 3,
    name: "Cooked Seafood Salmon Skin On 250g",
    tag: ["Meat & Seafood", "Seafood"],
    displayUnit: "$40.80 / 1KG",
    description: "Tender, flaky cooked salmon with skin on. Ready to eat or heat, perfect for salads, pastas, or quick meals. Keep refrigerated.",
}
,{
    id : 3,
    image: "./images/baby-spinach.jpg",
    price: 2.80,
    quantity: 8,
    name: "Baby Spinach & Rocket 120g",
    tag: ["Fruit & Vegetable", "Salad"],
    displayUnit: "$25.00 / 1KG",
    description: "A fresh, leafy mix of baby spinach and rocket. Washed and ready to eat—great for salads, wraps, or smoothies. Keep refrigerated.",
},{
    id :4,
    image: "./images/champagne-leg-ham.jpg",
    price: 21.00,
    quantity: 0,
    name: "Champagne Leg Ham Shaved From The Deli",
    tag: ["Meat & Seafood", "Meat"],
    displayUnit: "$52.50 / 1KG",
    description: "Delicately shaved Champagne leg ham, tender and full of flavour. Ideal for sandwiches, platters, or salads. Keep refrigerated.",
},{
    id :5,
    image: "./images/thin-bbq-sausage.jpg",
    price: 11.50,
    quantity: 5,
    name: "Market Value 26 Thin BBQ Sausages 1.8kg",
    tag: ["Meat & Seafood", "Meat"],
    displayUnit: "$6.39 / 1KG",
    description: "These 26 thin BBQ sausages are perfect for grilling, frying, or baking. Great for family meals or gatherings. Keep refrigerated.",
},{
    id :6,
    image: "./images/yakult-probiotic.png",
    price: 7.70,
    quantity: 10,
    name: "Yakult Probiotic Drink 10x65ml",
    tag: ["Dairy & Egg", "Milk"],
    displayUnit: "$11.80 / 1L",
    description: "A refreshing daily probiotic drink containing beneficial bacteria that help support digestive and gut health. Made with Yakult’s unique strain of Lactobacillus casei Shirota, it’s a tasty way to care for your wellbeing.  Enjoy one bottle a day as part of a balanced lifestyle. Keep refrigerated.",
},{
    id :7,
    image: "./images/parmesan-cheese.jpg",
    price: 2.00,
    quantity: 12,
    name: "Essentials Parmesan Cheese 100g",
    tag: ["Dairy & Egg", "Milk"],
    displayUnit: "$20.00 / 1KG",
    description: "Finely grated Parmesan cheese, perfect for pasta, salads, and cooking. Rich, savory flavour. Keep refrigerated.",
},{
    id :8,
    image: "./images/steak-butter.jpg",
    price: 16.00,
    quantity: 12,
    name: "Beef Porterhouse Steak & Butter 400g",
    tag: ["Meat & Seafood", "Meat"],
    displayUnit: "$52.50 / 1KG",
    description: "Tender porterhouse steak paired with seasoned butter for extra flavour. Ready to cook—perfect for a hearty meal.",
},{
    id :9,
    image: "./images/tiger-prawns.jpg",
    price: 25.60,
    quantity: 10,
    name: "Thawed Extra Large Cooked Tiger Prawns",
    tag: ["Meat & Seafood", "Seafood"],
    displayUnit: "$40.80 / 1KG",
    description: "Juicy and succulent, these extra large tiger prawns are cooked and ready to enjoy. Ideal for salads or seafood dishes."
},{
    id :10,
    image: "./images/peeled-deveined-raw-prawns.jpg",
    price: 27.00,
    quantity: 8,
    name: "Just Caught Peeled & Deveined Raw Prawns",
    tag: ["Meat & Seafood", "Seafood"],
    displayUnit: "$40.80 / 1KG",
    description: "Fresh and ready to cook, these peeled and deveined raw prawns are perfect for stir-fries, pastas, or grills.",
},{
    id :11,
    image: "./images/mayonnaise-whole-egg.jpg",
    price: 7.00,
    quantity: 12,
    name: "Mayonnaise Whole Egg 440g",
    tag: ["Dairy & Egg", "Egg"],
    displayUnit: "$7.00 / 1EA",
    description: "Rich and creamy whole egg mayonnaise, perfect for sandwiches, salads, and dressings. Smooth texture and full flavour.",
},{
    id :12,
    image: "./images/free-range-egg.png",
    price: 8.80,
    quantity: 11,
    name: "Sunny Queen 12 Extra Large Free Range Eggs 700g",
    tag: ["Dairy & Egg", "Egg"],
    displayUnit: "$0.73 / 1EA",
    description: "Farm-fresh extra large free range eggs with rich flavour and quality you can trust. Ideal for all your cooking.",
},{
    id : 13,
    image: "./images/white-seedless-grapes.jpg",
    price: 3.60,
    quantity: 8,
    name: "White Seedless Grapes Bag Approx. 900g each",
    tag: ["Fruit & Vegetable", "Fruit"],
    displayUnit: "$4.00 / 1KG",
    description: "Sweet, crisp, and juicy white seedless grapes. Perfect for snacking, lunchboxes, or fruit platters.",
},{
    id : 14,
    image: "./images/fresh-apples-punnet.jpg",
    price: 5.50,
    quantity: 10,
    name: "Fresh Apples Punnet 1kg",
    tag: ["Fruit & Vegetable", "Fruit"],
    displayUnit: "$5.50 / 1KG",
    description: "Crisp, juicy apples packed for convenience. Great for snacking, baking, or lunchboxes. Store in a cool place.",
},{
    id : 15,
    image: "./images/cherry-tomatoes-punnet.jpg",
    price: 3.20,
    quantity: 10,
    name: "Cherry Tomatoes Punnet 250g",
    tag: ["Fruit & Vegetable", "Salad"],
    displayUnit: "$25.00 / 1KG",
    description: "Sweet and juicy cherry tomatoes, perfect for salads, snacking, or roasting. Washed and ready to enjoy.",
},{
    id : 16,
    image: "./images/potato-chips.jpg",
    price: 3.00,
    quantity: 20,
    name: "Potato Chips Honey Soy Chicken 165g",
    tag: ["Snack & Drink", "Snack"],
    displayUnit: "$3.00 / 1EA",
    description: "Crispy chips with a sweet and savoury honey soy chicken flavour. Perfect for snacking or sharing.",
},{
    id : 17,
    image: "./images/gluten-free-popcorn.jpg",
    price: 2.70,
    quantity: 16,
    name: "Gluten Free Popcorn 10 Pack",
    tag: ["Snack & Drink", "Snack"],
    displayUnit: "$0.27 / 1EA",
    description: "Light, crunchy, and gluten free—perfect for lunchboxes, or movie nights. Convenient 10-pack for on-the-go enjoyment.",
},{
    id : 18,
    image: "./images/coca-cola.jpg",
    price: 2.00,
    quantity: 10,
    name: "Coca-Cola Classic Soft Drink Bottle 1.25l",
    tag: ["Snack & Drink", "Drink"],
    displayUnit: "$1.60 / 1L",
    description: "The original, refreshing cola taste you love. Perfect for sharing or enjoying anytime. Serve chilled.",
},{
    id : 19,
    image: "./images/protein-snack-bar.jpg",
    price: 12.00,
    quantity: 5,
    name: "Protein Snack Bar Cookies & Cream 6 packs",
    tag: ["Health & Wellness", "Wellness"],
    displayUnit: "$2.00 / 1EA",
    description: "Delicious cookies & cream flavour protein bars—great for on-the-go energy, or a tasty snack.",
},{
    id : 20,
    image: "./images/traditional-raspberry-drink.jpg",
    price: 3.00,
    quantity: 10,
    name: "Traditional Raspberry Soft Drink Bottle 1.1l",
    tag: ["Snack & Drink", "Drink"],
    displayUnit: "$1.60 / 1L",
    description: "Sweet and fizzy raspberry-flavoured soft drink. A classic treat for any occasion. Serve chilled.",
},{
    id : 21,
    image: "./images/breakfast-cereal.jpg",
    price: 4.60,
    quantity: 5,
    name: "Gluten Free Breakfast Cereal 375g",
    tag: ["Health & Wellness", "Wellness"],
    displayUnit: "$4.60 / 1EA",
    description: "A crunchy and wholesome gluten free cereal, perfect for a nourishing start to your day. Enjoy with milk or yogurt.",
},{
    id : 22,
    image: "./images/medical-pills.jpg",
    price: 4.50,
    quantity: 0,
    name: "Mini Caps For Pain Relief Paracetamol 500mg 16 pack",
    tag: ["Health & Wellness", "Health"],
    displayUnit: "$4.50 / 1EA",
    description: "Effective relief from headaches, muscle pain, and fever. Easy-to-swallow mini capsules.",
}
]
// const categoryMap = {
//     'Fruit & Vegetable': ['Fruit', 'Salad'],
//     'Meat & Seafood': ['Meat', 'Seafood'],
//     'Dairy & Egg': ['Milk', 'Egg'],
//     'Snack & Drink': ['Snack', 'Drink'],
//     'Health & Wellness': ['Health', 'Wellness'],
//   };

// let products  = productsInit; 
// todo : san phan lay tu localstorage neu khong co thi lay tu productInit;
let products = productsInit;


function getProductChose(){

    return producChose
    .filter((product) => product.quantity > 0)
    .map(({ id, quantity }) => ({ id, quantity }));

}
