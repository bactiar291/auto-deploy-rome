import { ethers } from 'ethers';
import { loadRPC, loadPrivateKey, loadConstructorArgs } from './config.js';
import { compileContract } from './compiler.js';
import { writeFile } from 'fs/promises';

export const deployLoop = async (interval = 5000) => {
  let attempt = 1;
  
  while(true) {
    try {
      // 1. Load konfigurasi
      const rpcUrl = loadRPC();
      const privateKey = loadPrivateKey();
      const constructorArgs = loadConstructorArgs();
      
      // 2. Kompilasi kontrak
      const { abi, bytecode, contractName } = compileContract();
      
      // 3. Setup provider dan wallet
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const wallet = new ethers.Wallet(privateKey, provider);
      
      console.log(`\n📦 Attempt #${attempt} - ${new Date().toLocaleTimeString()}`);
      console.log(`🔧 Kontrak: ${contractName}`);
      console.log(`🌐 Network: ${rpcUrl.split('/')[2]}`);
      console.log(`👛 Wallet: ${wallet.address}`);
      console.log(`⚙️ Constructor args: ${constructorArgs.join(', ')}`);
      
      // 4. Deploy kontrak
      const factory = new ethers.ContractFactory(abi, bytecode, wallet);
      const contract = await factory.deploy(...constructorArgs);
      
      // 5. Simpan informasi
      const deployInfo = {
        address: contract.address,
        abi: abi,
        contractName: contractName,
        deployer: wallet.address,
        txHash: contract.deploymentTransaction().hash,
        timestamp: new Date().toISOString()
      };
      
      await writeFile('deployment.json', JSON.stringify(deployInfo, null, 2));
      await writeFile('abi.json', JSON.stringify(abi, null, 2));
      
      console.log('\n✅ Deployment Berhasil!');
      console.log(`📌 Address: ${contract.address}`);
      console.log(`🔗 TX Hash: ${deployInfo.txHash}`);
      console.log(`⏱️ Waktu: ${deployInfo.timestamp}`);
      console.log(`🔄 Interval berikutnya dalam ${interval/1000} detik...`);
      
    } catch (error) {
      console.error('\n❌ Gagal Deploy:', error.message);
      console.log(`🔄 Mencoba lagi dalam ${interval/1000} detik...`);
    }
    
    attempt++;
    await new Promise(resolve => setTimeout(resolve, interval));
  }
};