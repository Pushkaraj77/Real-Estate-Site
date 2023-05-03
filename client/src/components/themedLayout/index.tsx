import React from "react";
import { ThemedLayoutContextProvider } from "@refinedev/mui";
import { CustomHeader as DefaultHeader } from "./header";
import { CustomSider as DefaultSider } from "./sider";
import { Box } from "@mui/material";
import type { RefineThemedLayoutV2Props } from "@refinedev/mui";

export const ThemedLayoutV2: React.FC<RefineThemedLayoutV2Props> = ({
  Sider,
  Header,
  Title,
  Footer,
  OffLayoutArea,
  children,
}) => {
  const SiderToRender = Sider ?? DefaultSider;
  const HeaderToRender = Header ?? DefaultHeader;

  return (
    <ThemedLayoutContextProvider>
      <Box display="flex" flexDirection="row">
        <SiderToRender Title={Title} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: "100vh",
          }}
        >
          <HeaderToRender />
          <Box
            component="main"
            sx={{
              p: { xs: 1, md: 2, lg: 3 },
              flexGrow: 1,
              bgcolor: (theme) => theme.palette.background.default,
            }}
          >
            {children}
          </Box>
          {Footer && <Footer />}
        </Box>
        {OffLayoutArea && <OffLayoutArea />}
      </Box>
    </ThemedLayoutContextProvider>
  );
};
