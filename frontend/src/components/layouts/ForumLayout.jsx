import { Outlet } from "react-router-dom";
import ForumHeader from "./ForumHeader";
import ForumBody from "./ForumBody";
import ForumFooter from "./ForumFooter";

function ForumLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-ochre-400">
      <ForumHeader />
      <ForumBody>
        <Outlet />
      </ForumBody>
      <ForumFooter />
    </div>
  );
}

export default ForumLayout;
