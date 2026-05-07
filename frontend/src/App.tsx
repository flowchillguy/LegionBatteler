import { useState } from "react";

function App() {
  // Khai báo state 'gold' khởi đầu là 0
  const [gold, setGold] = useState(0);

  const handleFarm = () => {
    // Mỗi lần click, tăng gold lên 10
    setGold(gold + 10);
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Legion Battler - Tài sản</h1>
      <p className="text-xl my-4 text-yellow-500">Vàng hiện có: {gold} 💰</p>
      
      <button 
        onClick={handleFarm}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Đi farm vàng
      </button>
    </div>
  );
}

export default App;