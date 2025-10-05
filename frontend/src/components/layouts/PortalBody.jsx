import Aside from "../ui/Aside";

function PortalBody({ children }) {
  return (
    <div className="flex">
      <Aside />
      <div className="flex-1 bg-city-900 min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default PortalBody;
