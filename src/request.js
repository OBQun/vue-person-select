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
              label: "部门2",
            },
          ],
        },
        {
          id: 3,
          label: "部门3",
        },
      ]);
    }, 1000);
  });
}

export function getPersonList({ departmentId = 3 } = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          userId: departmentId * 5,
          nickName: "人员" + departmentId * 5,
        },
        {
          userId: departmentId * 7,
          nickName: "人员" + departmentId * 7,
        },
      ]);
    }, 1000);
  });
}
