import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.example.snapourlove',
    appName: 'Snapourlove',
    webDir: 'out',
    server: {
        // Replace with your development computer's local network IP (e.g. 192.168.1.x:3000)
        // or your production deployment URL (e.g. https://your-mvp.vercel.app)
        url: 'http://10.0.2.2:3000', // Default Android emulator localhost alias
        cleartext: true
    }
};

export default config;