export function getDepartment() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          label: "部门1",
          children: [
            {
              id: 2,
              label: "部门2"
            }
          ]
        },
        {
          id: 3,
          label: "部门3"
        }
      ]);
    }, 1000);
  });
}

export function getPersonList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          userId: 4,
          label: "人员1"
        },
        {
          userId: 5,
          label: "人员2"
        }
      ]);
    }, 1000);
  });
}
