import { readFileSync, existsSync, readdirSync } from 'fs';
import solc from 'solc';

export const compileContract = () => {
  const contractsDir = './contracts/';
  
  // Validasi folder contracts
  if (!existsSync(contractsDir)) throw new Error('Folder contracts tidak ada');
  
  // Cari file .sol pertama
  const contractFiles = readdirSync(contractsDir).filter(f => f.endsWith('.sol'));
  if (contractFiles.length === 0) throw new Error('Tidak ada file .sol di folder contracts');
  
  const contractPath = `${contractsDir}${contractFiles[0]}`;
  const contractName = contractFiles[0].replace('.sol', '');
  
  // Baca dan kompilasi kontrak
  const source = readFileSync(contractPath, 'utf-8');
  const input = {
    language: 'Solidity',
    sources: { [contractFiles[0]]: { content: source } },
    settings: { 
      outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } },
      optimizer: { 
        enabled: true,
        runs: 200
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
  // Handle error kompilasi
  if (output.errors) {
    const criticalErrors = output.errors.filter(e => e.severity === 'error');
    if (criticalErrors.length > 0) {
      throw new Error(`Kompilasi gagal:\n${criticalErrors.map(e => e.formattedMessage).join('\n')}`);
    }
  }
  
  // Ambil data kontrak
  const contractData = output.contracts[contractFiles[0]];
  const contractKey = Object.keys(contractData)[0];
  
  return {
    abi: contractData[contractKey].abi,
    bytecode: contractData[contractKey].evm.bytecode.object,
    contractName: contractKey
  };
};