export const printTree = (parent: string, children: string[]) => {
  console.log(parent);

  children.forEach((child, index) => {
    const isLast = index === children.length - 1;
    const prefix = isLast ? "└── " : "├── ";
    console.log(`${prefix}${child}`);
  });
};
