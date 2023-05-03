import React from "react";
import { useGetIdentity, useActiveAuthProvider } from "@refinedev/core";
import { HamburgerMenu } from "./hamburgerMenu";
import { AppBar, Stack, Toolbar, Typography, Avatar } from "@mui/material";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";

export const CustomHeader: React.FC<RefineThemedLayoutV2HeaderProps> = () => {
  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  return (
    <AppBar position="sticky"
      color="default" elevation={0} sx={{
        background: '#fcfcf'
      }}>
      <Toolbar>
        <HamburgerMenu />
        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Stack
            direction="row"
            gap="16px"
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              sx={{
                display: { xs: "none", md: "block" },
              }}
              variant="subtitle2"
            >
              {user?.name}
            </Typography>
            <Avatar src={user?.avatar} alt={user?.name} />
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
