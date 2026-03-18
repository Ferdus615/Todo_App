const fs = require('fs');
const path = require('path');

const applyMock = (filePath, serviceName, requiresDb = true, requiresAuth = false) => {
  const absolutePath = path.resolve(__dirname, filePath);
  let content = fs.readFileSync(absolutePath, 'utf8');

  if (requiresDb && !content.includes('DbService')) {
    content = `import { DbService } from 'src/database/database.service';\n` + content;
    content = content.replace(/providers:\s*\[([^\]]+)\]/, 'providers: [$1, { provide: DbService, useValue: {} }]');
  }

  if (requiresAuth && !content.includes('UsersService')) {
    if (serviceName === 'AuthService') {
      content = `import { UsersService } from 'src/users/users.service';\nimport { JwtService } from '@nestjs/jwt';\n` + content;
      content = content.replace(/providers:\s*\[([^\]]+)\]/, 'providers: [$1, { provide: UsersService, useValue: {} }, { provide: JwtService, useValue: {} }]');
    } else if (serviceName === 'AuthController') {
      content = `import { AuthService } from './auth.service';\n` + content;
      content = content.replace(/providers:\s*\[([^\]]+)\]/, 'providers: [$1, { provide: AuthService, useValue: {} }]');
    }
  }

  if (filePath === 'src/app.controller.spec.ts') {
    content = content.replace(/'Hello World!'/g, `"Hello, Welcome To Ferdus's Todo App!"`);
  }

  fs.writeFileSync(absolutePath, content);
  console.log('Fixed', filePath);
};

applyMock('src/todos/todos.service.spec.ts', 'TodosService');
applyMock('src/todos/todos.controller.spec.ts', 'TodosController');
applyMock('src/users/users.service.spec.ts', 'UsersService');
applyMock('src/users/users.controller.spec.ts', 'UsersController');
applyMock('src/post_reaction/post_reaction.service.spec.ts', 'PostReactionService');
applyMock('src/post_reaction/post_reaction.controller.spec.ts', 'PostReactionController');

applyMock('src/auth/auth.service.spec.ts', 'AuthService', false, true);
applyMock('src/auth/auth.controller.spec.ts', 'AuthController', false, true);

applyMock('src/app.controller.spec.ts', 'AppController', false, false);

console.log('Done!');
