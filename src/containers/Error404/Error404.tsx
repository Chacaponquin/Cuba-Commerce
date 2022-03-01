import "./error404.css";

const Error404 = (): JSX.Element => {
  return (
    <div className="error404-container">
      <img src="./svg/error404.svg" alt="error404" />

      <h1>Not Found</h1>

      <a href="/">Back to Home</a>
    </div>
  );
};

export default Error404;
