import React from 'react';
import { MainPage } from './main-page/main-page';

type AppProps = {
  placesCount: number;
};

export function App({ placesCount }: AppProps): JSX.Element {
  return <MainPage placesCount={placesCount} />;
}
