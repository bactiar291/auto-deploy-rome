import { deployLoop } from './libs/deployer.js';

deployLoop(60000).catch(console.error);
