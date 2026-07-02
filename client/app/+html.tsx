import { ScrollViewStyleReset } from 'expo-router/html';
import type { ReactNode } from 'react';

import { colors } from '@/utils/colors';

const responsiveBackground = `
body {
  background-color: ${colors.background.DEFAULT};
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: ${colors.background.dark};
  }
}`;

const Root = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
};

export default Root;
