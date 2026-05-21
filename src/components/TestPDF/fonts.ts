//components/TestPDF/fonts.ts
import { Font } from '@react-pdf/renderer';

import RobotoRegular from './fonts/Roboto-Regular.ttf';
import RobotoBold from './fonts/Roboto-Bold.ttf';

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
    ],
  });

  console.log('Fonts registered:', Font.getRegisteredFontFamilies()); // для проверки
};
