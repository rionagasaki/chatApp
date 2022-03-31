 // 実際にはテストファイルに関数を記述することはない。
const double = (arg) => arg ** 2;

describe("double関数", () => {
  it("引数に2を渡したら4が返る", () => {
   const result = double(2);

   // resultの中身が4と等しいか
   expect(result).toBe(4);
  });
})
  