import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>GruCloud </h1>
      <h3>Episode 3</h3>
      <h5>Modules, with HTTPS</h5>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
