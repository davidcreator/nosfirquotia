<section class="mb-3 d-flex justify-content-between align-items-center">
    <div>
        <h1 class="h3 mb-1">Usuarios Admin e Permissoes</h1>
        <p class="text-muted mb-0">Controle de niveis de acesso do painel administrativo.</p>
    </div>
    <span class="badge text-bg-primary">Somente Administrador Geral</span>
</section>

<section class="row g-3 mb-4">
    <div class="col-lg-6">
        <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
                <h2 class="h5 mb-3">Novo usuario administrativo</h2>
                <form method="post" action="<?= e(url('/admin/usuarios')) ?>" class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Nome</label>
                        <input class="form-control" name="name" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" name="email" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Senha inicial</label>
                        <input type="password" class="form-control" name="password" minlength="6" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Nivel de acesso</label>
                        <input class="form-control" name="access_level" value="Operacional" required>
                    </div>
                    <div class="col-12">
                        <label class="form-label d-block mb-2">Permissoes</label>
                        <div class="row g-2">
                            <?php foreach ($permissionCatalog as $permissionKey => $permissionLabel): ?>
                                <div class="col-md-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="newPerm_<?= e($permissionKey) ?>" name="permissions[]" value="<?= e($permissionKey) ?>">
                                        <label class="form-check-label" for="newPerm_<?= e($permissionKey) ?>"><?= e($permissionLabel) ?></label>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="newIsActive" name="is_active" value="1" checked>
                            <label class="form-check-label" for="newIsActive">Conta ativa</label>
                        </div>
                    </div>
                    <div class="col-12 d-flex justify-content-end">
                        <button class="btn btn-primary" type="submit">Criar usuario admin</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="col-lg-6">
        <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
                <h2 class="h5 mb-3">Regras de seguranca</h2>
                <ul class="mb-0">
                    <li>Administrador Geral tem acesso total ao sistema.</li>
                    <li>Somente Administrador Geral pode alterar permissoes de outros admins.</li>
                    <li>Contas inativas nao conseguem efetuar login.</li>
                    <li>Ajuste o nivel de acesso por modulo conforme a funcao de cada usuario.</li>
                    <li>Evite compartilhar contas, mantenha um usuario por pessoa.</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<section class="card border-0 shadow-sm">
    <div class="card-body">
        <h2 class="h5 mb-3">Usuarios existentes</h2>
        <?php if ($users === []): ?>
            <div class="alert alert-info mb-0">Nenhum usuario administrativo cadastrado.</div>
        <?php else: ?>
            <div class="vstack gap-3">
                <?php foreach ($users as $user): ?>
                    <?php
                    $userId = (int) $user['id'];
                    $isGeneral = !empty($user['is_general_admin']);
                    $isActive = !empty($user['is_active']);
                    $userPermissions = is_array($user['permissions'] ?? null) ? $user['permissions'] : [];
                    ?>
                    <article class="border rounded-3 p-3">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <strong><?= e((string) $user['name']) ?></strong>
                                <span class="text-muted">#<?= $userId ?> - <?= e((string) $user['email']) ?></span>
                            </div>
                            <div class="d-flex gap-2">
                                <?php if ($isGeneral): ?>
                                    <span class="badge text-bg-primary">Administrador Geral</span>
                                <?php else: ?>
                                    <span class="badge text-bg-secondary"><?= e((string) ($user['access_level'] ?? 'Administrador')) ?></span>
                                <?php endif; ?>
                                <?php if ($isActive): ?>
                                    <span class="badge text-bg-success">Ativo</span>
                                <?php else: ?>
                                    <span class="badge text-bg-danger">Inativo</span>
                                <?php endif; ?>
                            </div>
                        </div>

                        <form method="post" action="<?= e(url('/admin/usuarios/' . $userId)) ?>" class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Nome</label>
                                <input class="form-control" name="name" value="<?= e((string) $user['name']) ?>" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" name="email" value="<?= e((string) $user['email']) ?>" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Nivel de acesso</label>
                                <input class="form-control" name="access_level" value="<?= e((string) ($user['access_level'] ?? 'Administrador')) ?>" <?= $isGeneral ? 'readonly' : '' ?> required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Nova senha (opcional)</label>
                                <input type="password" class="form-control" name="new_password" minlength="6" placeholder="Deixe em branco para manter a senha atual">
                            </div>
                            <div class="col-md-6 d-flex align-items-end">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="isActive_<?= $userId ?>" name="is_active" value="1" <?= $isActive ? 'checked' : '' ?> <?= $isGeneral ? 'disabled' : '' ?>>
                                    <label class="form-check-label" for="isActive_<?= $userId ?>">Conta ativa</label>
                                </div>
                            </div>
                            <?php if ($isGeneral): ?>
                                <div class="col-12">
                                    <div class="alert alert-light border mb-0">
                                        Este usuario foi definido como Administrador Geral (instalador) e possui acesso total fixo.
                                    </div>
                                </div>
                            <?php else: ?>
                                <div class="col-12">
                                    <label class="form-label d-block mb-2">Permissoes</label>
                                    <div class="row g-2">
                                        <?php foreach ($permissionCatalog as $permissionKey => $permissionLabel): ?>
                                            <div class="col-md-6">
                                                <div class="form-check">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        id="perm_<?= $userId ?>_<?= e($permissionKey) ?>"
                                                        name="permissions[]"
                                                        value="<?= e($permissionKey) ?>"
                                                        <?= in_array($permissionKey, $userPermissions, true) ? 'checked' : '' ?>
                                                    >
                                                    <label class="form-check-label" for="perm_<?= $userId ?>_<?= e($permissionKey) ?>">
                                                        <?= e($permissionLabel) ?>
                                                    </label>
                                                </div>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <div class="col-12 d-flex justify-content-end">
                                <button class="btn btn-outline-primary btn-sm" type="submit">Salvar configuracoes</button>
                            </div>
                        </form>
                    </article>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>
