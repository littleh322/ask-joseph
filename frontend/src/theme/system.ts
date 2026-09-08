import { createSystem, defaultConfig } from '@chakra-ui/react';
import { fonts } from './fonts';

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: fonts.heading },
        body: { value: fonts.body },
      },
    },
  },
});
