import * as fs from 'fs';
import * as path from 'path';

const INDEX_FILE_NAME = 'index.ts';

const makeIndex = async (directory: string) => {
  const dirPath = path.join(__dirname, '..', directory);
  console.log(`Making index file in ${directory}`);

  const files = fs.readdirSync(dirPath).filter((file) => file !== INDEX_FILE_NAME);
  console.log(`Found ${files.length} ${files.length > 1 ? 'files' : 'file'}`);

  if (!files.length) return;

  const indexFileContent = files.map((file) => `export * from './${file.replace(/\.ts$/g, '')}';`).join('\n');
  const indexPath = path.join(__dirname, '..', directory, INDEX_FILE_NAME);
  console.log(`Writing to file ${directory}/index.ts`);

  fs.writeFileSync(indexPath, indexFileContent.concat('\n'), { flag: 'w' });
};

const paths = [
  'src/lib/decorators',
  'src/lib/interceptors',
  'src/lib/pipes',
  'src/lib/validation',
  'src/lib/validators',
  'src/services/rdb/entities',
  'src/services/rdb/repositories',
  'src/services/users/dto',
  'src/services/auth',
  'src/services/auth/constants',
  'src/services/auth/decorators',
  'src/services/auth/dto',
  'src/services/auth/guards',
  'src/services/auth/strategies',
  'src/services/creator-profiles',
  'src/services/creator-profiles/dto',
  'src/services/fan-profiles/dto',
  'src/services/fan-profiles',
  'src/services/posts',
  'src/services/posts/dto',
  'src/services/post-comments',
  'src/services/post-comments/dto',
  'src/services/uploads',
  'src/services/users',
  'src/services/users/dto',
  'src/services/assets',
  'src/services/assets/dto',
  'src/services/messages',
  'src/services/message-channel-participants',
  'src/services/message-channel-participants/dto',
];

(async () => {
  for (const path of paths) await makeIndex(path);
})();
