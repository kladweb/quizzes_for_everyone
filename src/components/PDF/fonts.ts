//components/DocsPDF/fonts.ts
import { Font } from '@react-pdf/renderer';

import RobotoRegular from './fonts/Roboto-Regular.ttf';
import RobotoBold from './fonts/Roboto-Bold.ttf';
import RobotoItalic from './fonts/Roboto-Italic.ttf';

export const registerFonts = () => {
  Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: RobotoRegular,
        fontStyle: 'normal',
        fontWeight: 'normal'
      },
      {
        src: RobotoBold,
        fontStyle: 'normal',
        fontWeight: 'bold'
      },
      {
        src: RobotoItalic,
        fontStyle: 'italic',
        fontWeight: 'normal'
      },
    ],
  });

  // console.log('Fonts registered:', Font.getRegisteredFontFamilies());
};
