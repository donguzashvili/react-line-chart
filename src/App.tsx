import LineChart from "./LineChart";

const App = () => {
  const chartData = [30000, 33000, 42000, 43000, 52000, 53000, 55000];
  const chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  return (
    <div>
      <h1>My Line Chart</h1>
      <LineChart data={chartData} labels={chartLabels} />
    </div>
  );
};

export default App;
