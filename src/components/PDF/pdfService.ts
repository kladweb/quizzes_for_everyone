import React from 'react';

let fontsRegistered = false;

export const generatePDF = async (documentElement: React.ReactElement): Promise<Blob> => {
  const {pdf} = await import('@react-pdf/renderer');

  if (!fontsRegistered) {
    const [RobotoRegular, RobotoBold, RobotoItalic] = await Promise.all([
      import('./fonts/Roboto-Regular.ttf'),
      import('./fonts/Roboto-Bold.ttf'),
      import('./fonts/Roboto-Italic.ttf'),
    ]);

    const {Font} = await import('@react-pdf/renderer');

    Font.register({
      family: 'Roboto',
      fonts: [
        {src: RobotoRegular.default, fontWeight: 'normal'},
        {src: RobotoBold.default, fontWeight: 'bold'},
        {src: RobotoItalic.default, fontStyle: 'italic', fontWeight: 'normal'},
      ],
    });

    fontsRegistered = true;
  }

  return pdf(documentElement as React.ReactElement<any>).toBlob();
};
