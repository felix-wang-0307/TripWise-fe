import HomePage from "./pages/homepage/homepage";

function App() {
  const isDev = import.meta.env.ENVIORMENT === "development";
  return (
    <>
      {isDev ?
        <div className="d-flex flex-column align-items-center justify-content-start vh-100">
          <h1>Debug Mode</h1>
          <h1><a href="/index">HomePage</a></h1>
          <h1><a href="/login">Login</a></h1>
          <h1><a href="/travel">Travel</a></h1>
          <h1><a href="/bill/123">Bill</a></h1>
        </div>
      : <HomePage />}
    </>
  )
}

export default App
