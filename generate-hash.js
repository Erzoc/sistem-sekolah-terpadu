const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Test@123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('\n=== GENERATED HASH ===');
  console.log('Password: Test@123');
  console.log('Hash:', hash);
  console.log('Length:', hash.length);
  console.log('======================\n');
  
  // Test the hash immediately
  const isValid = await bcrypt.compare(password, hash);
  console.log('Self-test:', isValid ? '✅ VALID' : '❌ INVALID');
  
  if (isValid) {
    console.log('\n📋 Copy this hash to update database:');
    console.log(hash);
  }
  
  return hash;
}

generateHash().then(hash => {
  require('fs').writeFileSync('new_hash.txt', hash, 'utf8');
  console.log('\n✅ Hash saved to: new_hash.txt');
});
