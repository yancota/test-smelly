const { UserService } = require('../src/userService');

describe('UserService - Suíte de Testes Limpa (AAA)', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  it('cria um usuário com status ativo e id definido', () => {
    const nome = 'Fulano de Tal';
    const email = 'fulano@teste.com';
    const idade = 25;

    const usuarioCriado = userService.createUser(nome, email, idade);

    expect(usuarioCriado).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        nome,
        email,
        idade,
        isAdmin: false,
        status: 'ativo',
        createdAt: expect.any(Date),
      })
    );
  });

  it('busca um usuário existente pelo id', () => {
    const usuarioCriado = userService.createUser('Fulano', 'fulano@email.com', 25);

    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    expect(usuarioBuscado).toEqual(
      expect.objectContaining({
        id: usuarioCriado.id,
        nome: 'Fulano',
        status: 'ativo',
      })
    );
  });

  it('retorna null ao buscar um id inexistente', () => {
    const idInexistente = 'id-que-nao-existe';

    const usuarioBuscado = userService.getUserById(idInexistente);

    expect(usuarioBuscado).toBeNull();
  });

  it('desativa um usuário comum e retorna true', () => {
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  it('não desativa um usuário admin e retorna false', () => {
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAposTentativa = userService.getUserById(usuarioAdmin.id);

    expect(resultado).toBe(false);
    expect(usuarioAposTentativa.status).toBe('ativo');
  });

  it('retorna false ao tentar desativar um usuário inexistente', () => {
    const idInexistente = 'id-inexistente';

    const resultado = userService.deactivateUser(idInexistente);

    expect(resultado).toBe(false);
  });

  it('gera relatório com mensagem quando não há usuários', () => {

    const relatorio = userService.generateUserReport();

    expect(relatorio).toContain('--- Relatório de Usuários ---');
    expect(relatorio).toContain('Nenhum usuário cadastrado.');
  });

  it('gera relatório contendo os nomes dos usuários cadastrados', () => {
    userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    const relatorio = userService.generateUserReport();

    expect(relatorio).toContain('--- Relatório de Usuários ---');
    expect(relatorio).toContain('Nome: Alice');
    expect(relatorio).toContain('Nome: Bob');
  });

  it('falha ao criar usuário menor de idade', () => {
    const nome = 'Menor';
    const email = 'menor@email.com';
    const idade = 17;

    expect(() => userService.createUser(nome, email, idade)).toThrow(
      'O usuário deve ser maior de idade.'
    );
  });

  it('falha ao criar usuário sem campos obrigatórios', () => {
    const nome = '';
    const email = '';
    const idade = undefined;

    expect(() => userService.createUser(nome, email, idade)).toThrow(
      'Nome, email e idade são obrigatórios.'
    );
  });
});
