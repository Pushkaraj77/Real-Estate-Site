import React from "react";
import { useRouterContext, useLink, useRouterType } from "@refinedev/core";
import { Button, Link as MuiLink, SvgIcon, Typography } from "@mui/material";
import type { RefineLayoutThemedTitleProps } from "@refinedev/mui";

import { logo, yariga } from 'assets';

export const CustomTitle: React.FC<RefineLayoutThemedTitleProps> = ({
  collapsed,
}) => {
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  return (
    <Button fullWidth variant="text" disableRipple>
      <Link to="/"> 
        {collapsed ? (
          <img src={logo} alt="Yariga" width='28px' />
          ) : (
            <img src={yariga} alt="Refine" width='100px' />
          )}
      </Link>

    </Button>
  );
};
