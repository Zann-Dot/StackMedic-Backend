const testData = [
  {
    project: "6ab69486bbef6a6215d71151",
    loggedByClerkId: "user_a",
    title: "Context Binding",
    errorCategory: "Type Error",
    rawTrace: "function calculateTotal(tax, shipping) {return this.price + tax + shipping;} const item = { price: 100 };calculateTotal.call(item, 10, 5)",
    remediation: "function calculateTotal(tax, shipping) {\n  return this.price + tax + shipping;\n}\n\nconst item = {\n  price: 100\n};\n\nconst total = calculateTotal.call(item, 10, 5);\nconsole.log(total);",
    errorHash: "72d2dcdd16caf7ab1e7237fabf5fd5c25c461fc194ac9e18c0cb29b939f0899d",
    status: "unresolved",
  },
  {
    project: "6ab69486bbef6a6215d71151",
    loggedByClerkId: "user_b",
    title: "Context Binding",
    errorCategory: "Type Error",
    rawTrace: "function calculateTotal(tax, shipping) {return this.price + tax + shipping;} const item = { price: 100 };calculateTotal.call(item, 10, 5)",
    remediation: "function calculateTotal(tax, shipping) {\n  return this.price + tax + shipping;\n}\n\nconst item = {\n  price: 100\n};\n\nconst total = calculateTotal.call(item, 10, 5);\nconsole.log(total);",
    errorHash: "72d2dcdd16caf7ab1e7237fabf5fd5c25c461fc194ac9e18c0cb29b939f0899d",
    status: "resolved",
  },
  {
    project: "6ab69486bbef6a6215d71151",
    loggedByClerkId: "user_c",
    title: "Context Binding",
    errorCategory: "Type Error",
    rawTrace: "function calculateTotal(tax, shipping) {return this.price + tax + shipping;} const item = { price: 100 };calculateTotal.call(item, 10, 5)",
    remediation: "function calculateTotal(tax, shipping) {\n  return this.price + tax + shipping;\n}\n\nconst item = {\n  price: 100\n};\n\nconst total = calculateTotal.call(item, 10, 5);\nconsole.log(total);",
    errorHash: "72d2dcdd16caf7ab1e7237fabf5fd5c25c461fc194ac9e18c0cb29b939f0899d",
    status: "unresolved",
  },
  {
    project: "6ab69486bbef6a6215d71151",
    loggedByClerkId: "user_b",
    title: "Context Binding",
    errorCategory: "Type Error",
    rawTrace: "function calculateTotal(tax, shipping) {return this.price + tax + shipping;} const item = { price: 100 };calculateTotal.call(item, 10, 5)",
    remediation: "function calculateTotal(tax, shipping) {\n  return this.price + tax + shipping;\n}\n\nconst item = {\n  price: 100\n};\n\nconst total = calculateTotal.call(item, 10, 5);\nconsole.log(total);",
    errorHash: "72d2dcdd16caf7ab1e7237fabf5fd5c25c461fc194ac9e18c0cb29b939f0899d",
    status: "unresolved",
  }
];

