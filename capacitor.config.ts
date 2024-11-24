import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'SmartStore',
  webDir: 'www',
  server: {
    cleartext: true,
    androidScheme: 'http'

  
  }
};

export default config;
