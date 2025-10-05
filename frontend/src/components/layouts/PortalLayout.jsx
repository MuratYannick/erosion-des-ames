import React from "react";

import { Outlet } from "react-router-dom";

import PortalHeader from "./PortalHeader"
import PortalBody from "./PortalBody"
import PortalFooter from "./PortalFooter"

function PortalLayout() {
  return (
    <div>
      <PortalHeader />
      <PortalBody>
        <main>
          <Outlet />
        </main>
      </PortalBody>
      <PortalFooter />
    </div>
  );
}

export default PortalLayout;